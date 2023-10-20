import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import ERC20_ABI from 'abis/ERC20.json'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { GOERLI } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

import BridgeETH from './BridgeETH'
import BridgesUSD from './BridgesUSD'
import SwapETHsUSD from './SwapETHsUSD'

const BridgeAndSwap = ({ defaultChainProvider }: { defaultChainProvider: JsonRpcProvider }) => {
  const { isValid, alert } = useRequiredChain({
    chainId: GOERLI,
  })
  const { walletProvider, walletAccount } = useWeb3()
  const signer = useMemo(
    () => walletProvider?.getSigner(walletAccount?.address).connectUnchecked(),
    [walletAccount, walletProvider]
  )
  const goerliProvider = useMemo(() => rpcProvider(GOERLI), [])

  const sUSDGoerliContract = useMemo(
    () => new Contract('0xb1f664162c0269a469a699709d37cc5739379dd1', ERC20_ABI, goerliProvider),
    [goerliProvider]
  )

  const sUSDContract = useMemo(
    () => new Contract('0xeBaEAAD9236615542844adC5c149F86C36aD1136', ERC20_ABI, defaultChainProvider),
    [defaultChainProvider]
  )

  const { data: ethBalanceGoerli, refetch: refetchEthBalanceGoerli } = useQuery(
    ['eth_balance_goerli'],
    () => goerliProvider.getBalance(walletAccount?.address || ''),
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )
  const { data: ethBalance, refetch: refetchEthBalance } = useQuery(
    ['eth_balance'],
    () => defaultChainProvider.getBalance(walletAccount?.address || ''),
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  const { data: sUSDBalanceGoerli, refetch: refetchsUSDBalanceGoerli } = useContractQuery<number>(
    sUSDGoerliContract,
    'balanceOf',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  const { data: sUSDBalance, refetch: refetchsUSDBalance } = useContractQuery<number>(
    sUSDContract,
    'balanceOf',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  return (
    <div>
      {isValid && walletProvider && (
        <>
          <SwapETHsUSD
            signer={signer}
            ethBalance={ethBalanceGoerli}
            sUSDBalance={sUSDBalanceGoerli}
            refetch={() => {
              refetchEthBalanceGoerli()
              refetchsUSDBalanceGoerli()
            }}
          />

          <BridgesUSD
            signer={signer}
            sUSDBalance={sUSDBalance}
            sUSDBalanceGoerli={sUSDBalanceGoerli}
            refetch={() => {
              refetchsUSDBalanceGoerli()
            }}
          />
          <BridgeETH />
        </>
      )}
      {alert}
    </div>
  )
}

export default BridgeAndSwap
