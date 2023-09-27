// import { BigNumber } from '@ethersproject/bignumber'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, formatUnits } from '@ethersproject/units'
import { useEffect } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import useMyProfile from 'hooks/store/useMyProfile'
import useActiveWeb3React from 'hooks/web3/useActiveWeb3React'
import { useERC20Contract } from 'hooks/web3/useContract'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { pollEvery } from 'utils/helpers/pollEvery'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

interface Balances {
  [key: string]: number | undefined
}
interface BalancesState {
  balances: Balances
  setBalance: (asset: string, amount: number | undefined) => void
}

const useBalancesStore = create<BalancesState>()(
  immer((set) => ({
    balances: { $NATIVE: undefined, [CONTRACT_QUERY_KEYS.ERC20]: undefined },
    setBalance: (asset, amount) =>
      set((state) => {
        state.balances[asset] = amount
      }),
  }))
)

export const usePollingBalance = () => {
  const { setBalance } = useBalancesStore()
  const { myProfile } = useMyProfile()
  const { library } = useActiveWeb3React()
  const erc20Contract = useERC20Contract(CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_QUERY_KEYS.ERC20])

  useEffect(() => {
    if (!myProfile || !myProfile.account) return
    let cancel = false
    const getBalanceNative = async () => {
      if (!myProfile.account) return { asset: '$NATIVE', balance: null }
      const data = await library?.getBalance(myProfile.account)
      return { asset: '$NATIVE', balance: data ? Number(formatEther(data as BigNumber)) : null }
    }
    const getBalanceERC20 = async () => {
      if (!myProfile.account) return { asset: CONTRACT_QUERY_KEYS.ERC20, balance: null }
      const data = await erc20Contract.balanceOf(myProfile.account)
      const decimals = await erc20Contract.decimals()
      return {
        asset: CONTRACT_QUERY_KEYS.ERC20,
        balance: data ? Number(formatUnits(data as BigNumber, decimals)) : null,
      }
    }

    // Poll wallet balance
    const pollBalance = pollEvery((onUpdate: (asset: string, balance: number | null) => void) => {
      return {
        async request() {
          // onUpdate('TOKEN', null)
          // return await getBalanceTOKEN()
          return Promise.all([getBalanceNative(), getBalanceERC20()])
        },
        onResult(results?: [{ asset: string; balance: number | null }]) {
          if (cancel || !results) return

          results?.forEach((result) => {
            if (result == null) return
            onUpdate(result.asset, result.balance)
          })
        },
      }
    }, 30_000)

    // start polling balance every x time
    const stopPollingBalance = pollBalance(setBalance)

    return () => {
      cancel = true
      stopPollingBalance()
    }
  }, [setBalance, erc20Contract, myProfile, library])
}

export default useBalancesStore
