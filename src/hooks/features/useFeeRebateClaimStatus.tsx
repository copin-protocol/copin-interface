import { useQuery } from 'react-query'

import { useFeeRebateContract } from 'hooks/web3/useContract'
import { QUERY_KEYS } from 'utils/config/keys'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'

const useFeeRebateClaimStatus = ({
  account,
  epochId,
  enabled = true,
}: {
  account?: string
  epochId?: number
  enabled?: boolean
}): number | undefined => {
  const feeRebateContract = useFeeRebateContract(ARBITRUM_CHAIN)

  const { data } = useQuery(
    [QUERY_KEYS.GET_FEE_RATE_TRADER_STATUS, feeRebateContract?.address, epochId],
    () => {
      if (!feeRebateContract) return
      return feeRebateContract.getClaimStatus(account, epochId)
    },
    {
      enabled: enabled && !!feeRebateContract && !!account && !!epochId,
    }
  )
  return data
}

export default useFeeRebateClaimStatus
