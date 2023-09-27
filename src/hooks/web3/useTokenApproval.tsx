import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import ToastBody from 'components/@ui/ToastBody'
import { MIN_PARSE_ETHER } from 'utils/config/constants'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { getContractErrorMessage } from 'utils/helpers/handleError'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

import { useERC20Contract } from './useContract'
import usePollCheckingConfirmations from './usePollCheckingConfirmations'

const useERC20Approval = (account: string, contract?: string) => {
  const accountRef = useRef<string>()
  const [approving, setApproving] = useState(false)
  const [allowance, setAllowance] = useState(BigNumber.from(0))
  const pollCheckingConfirmations = usePollCheckingConfirmations()
  const tokenContract = useERC20Contract(CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_QUERY_KEYS.ERC20], true)

  const load = useCallback(() => {
    if (!tokenContract || !account) return
    const getAllowance = async () => {
      try {
        const amount = await tokenContract.allowance(account, contract)
        setAllowance(amount)
      } catch (err) {
        //
      }
    }
    getAllowance()
  }, [account, contract, tokenContract])

  useEffect(() => {
    if (account && accountRef.current !== account && tokenContract) {
      accountRef.current = account
      load()
    }
  }, [load, account, tokenContract])

  const isTokenAllowanceEnough = useCallback(
    (amount?: number) => {
      if (!amount || amount < MIN_PARSE_ETHER) return true
      return allowance.gte(parseEther(amount.toString()))
    },
    [allowance]
  )

  const handleResult = useCallback(
    async (func: () => Promise<{ hash: string }>) => {
      try {
        const result = await func()
        if (result.hash) {
          await pollCheckingConfirmations(result.hash)
          toast.success(<ToastBody title={<Trans>Success</Trans>} message="The approval has been succeeded" />)
          setApproving(false)
          load()
          return true
        }
        setApproving(false)
      } catch (err) {
        setApproving(false)
        toast.error(<ToastBody title={<Trans>Error</Trans>} message={getContractErrorMessage(err)} />)
        return false
      }
      return false
    },
    [load, pollCheckingConfirmations]
  )

  const approveToken = useCallback(async () => {
    if (!tokenContract || !contract) return
    setApproving(true)
    return handleResult(() => tokenContract.approve(contract, MaxUint256))
  }, [contract, handleResult, tokenContract])
  return { approving, approveToken, allowance, isTokenAllowanceEnough, load }
}

export default useERC20Approval
