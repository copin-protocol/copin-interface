import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { useCallback } from 'react'

import { MIN_PARSE_ETHER } from 'utils/config/constants'

import { useERC20Contract } from './useContract'
import useContractMutation from './useContractMutation'
import useContractQuery from './useContractQuery'

const useERC20Approval = ({ token, account, spender }: { token: string; account?: string; spender?: string }) => {
  const tokenContract = useERC20Contract(token, true)
  const { data: allowance = BigNumber.from(0), refetch: refetchAllowance } = useContractQuery<BigNumber>(
    tokenContract,
    'allowance',
    [account, spender],
    {
      enabled: !!account && !!spender,
    }
  )
  const { data: decimals } = useContractQuery<number>(tokenContract, 'decimals', [])

  const tokenMutation = useContractMutation(tokenContract)

  const isTokenAllowanceEnough = useCallback(
    (amount?: number) => {
      if (!amount || amount < MIN_PARSE_ETHER) return true
      if (!decimals) return false
      return allowance.gte(parseUnits(amount.toString(), decimals))
    },
    [allowance]
  )

  const approveToken = useCallback(
    async (amount: number) => {
      if (!decimals) return
      const amountBN = parseUnits(amount.toString(), decimals)
      tokenMutation.mutate(
        {
          method: 'approve',
          params: [spender, amountBN],
        },
        {
          onSuccess: () => {
            refetchAllowance()
          },
        }
      )
    },
    [refetchAllowance, spender, tokenMutation]
  )
  return { approving: tokenMutation.isLoading, approveToken, allowance, isTokenAllowanceEnough }
}

export default useERC20Approval
