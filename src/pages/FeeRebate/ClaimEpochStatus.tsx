import React from 'react'

import { EpochHistoryData } from 'entities/feeRebate'
import useFeeRebateClaimStatus from 'hooks/features/useFeeRebateClaimStatus'
import { Type } from 'theme/base'

export default function ClaimEpochStatus({
  epochHistory,
  epochStatus,
  epochId,
  account,
}: {
  epochHistory?: EpochHistoryData
  epochStatus?: number
  epochId?: number
  account?: string
}) {
  const status = useFeeRebateClaimStatus({ account, epochId })

  if (!epochHistory || !account || !epochId) return <Type.Caption color="neutral1">--</Type.Caption>

  const traderReward = epochHistory.rebateData.find((e) => e.trader?.toLowerCase() === account?.toLowerCase())
  if (!traderReward || !traderReward.fee) return <Type.Caption color="neutral1">--</Type.Caption>

  return <Status status={status} epochStatus={epochStatus} />
}

function Status({ status, epochStatus }: { status?: number; epochStatus?: number }) {
  switch (status) {
    case 0:
      return <Type.Caption color="neutral2">Claimed</Type.Caption>
    case 1:
      return <Type.Caption color="green1">Available to claim</Type.Caption>
    case 2:
      return epochStatus === 2 ? (
        <Type.Caption color="orange1">Waiting to claim</Type.Caption>
      ) : (
        <Type.Caption color="neutral1">--</Type.Caption>
      )
    default:
      return <Type.Caption color="neutral1">--</Type.Caption>
  }
}
