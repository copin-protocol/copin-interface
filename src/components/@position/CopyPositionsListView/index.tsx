import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import Divider from 'components/@ui/Divider'
import LabelEPnL from 'components/@ui/LabelEPnL'
import NoDataFound from 'components/@ui/NoDataFound'
import ReverseTag from 'components/@ui/ReverseTag'
import { CopyPositionData } from 'entities/copyTrade.d'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

import CopyPositionsContainer from '../CopyPositionsContainer'
import {
  renderCloseTime,
  renderCloseType,
  renderCopyTitle,
  renderCopyWallet,
  renderEntry,
  renderOpenTime,
  renderPnL,
  renderSizeMobile,
  renderSource,
  renderStatus,
  renderTrader,
} from '../configs/copyPositionRenderProps'
import { ExternalSourceCopyPositions } from '../types'

export default function CopyPositionsListView({
  data,
  isLoading,
  onClosePositionSuccess,
  noDataMessage,
}: {
  data: CopyPositionData[] | undefined
  isLoading: boolean
  onClosePositionSuccess: () => void
  noDataMessage?: ReactNode
}) {
  if (isLoading) return <Loading />
  if (!isLoading && !data?.length) return <NoDataFound message={noDataMessage} />
  return (
    <CopyPositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      <ListForm data={data} />
    </CopyPositionsContainer>
  )
}

export function ListForm({
  data,
  externalSource,
}: {
  data: CopyPositionData[] | undefined
  externalSource?: ExternalSourceCopyPositions
}) {
  return (
    <Flex py={2} sx={{ width: '100%', height: '100%', overflow: 'hidden auto', flexDirection: 'column', gap: 2 }}>
      {data?.map((positionData) => {
        return (
          <Box
            key={positionData.id}
            sx={{ px: 3, py: 2, bg: 'neutral6', position: 'relative' }}
            onClick={() => externalSource?.handleSelectCopyItem?.(positionData)}
          >
            {positionData.isReverse && (
              <Box sx={{ position: 'absolute', top: 16, left: 8 }}>
                <ReverseTag />
              </Box>
            )}
            <Flex>
              <Box flex="1" sx={{ '& *': { fontWeight: 'bold' }, ...(positionData.isReverse ? { pl: 2 } : {}) }}>
                {renderCopyTitle(positionData)}
              </Box>
              <Box sx={{ flexShrink: 0 }}>{renderStatus(positionData)}</Box>
            </Flex>
            <Divider my={2} color="neutral5" />
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              <ListHistoryRow
                label={<Trans>Trader</Trans>}
                value={renderTrader(positionData.copyAccount, positionData.protocol)}
              />
              <ListHistoryRow
                label={<Trans>Copy Wallet</Trans>}
                value={renderCopyWallet(positionData, undefined, externalSource)}
              />
              <ListHistoryRow
                label={<Trans>Source Position</Trans>}
                value={renderSource(positionData, undefined, externalSource, true)}
              />
              <ListHistoryRow label={<Trans>Entry</Trans>} value={renderEntry(positionData)} />
              <ListHistoryRow label={<Trans>Size</Trans>} value={renderSizeMobile(positionData)} />
              <ListHistoryRow label={<LabelEPnL />} value={renderPnL(positionData, externalSource?.prices)} />
              <ListHistoryRow label={<Trans>Closed Type</Trans>} value={renderCloseType(positionData)} />
              <ListHistoryRow label={<Trans>Open</Trans>} value={renderOpenTime(positionData)} />
              <ListHistoryRow label={<Trans>Close</Trans>} value={renderCloseTime(positionData)} />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

function ListHistoryRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ width: '100%', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
      <Type.Caption color="neutral3">{label}</Type.Caption>
      {value}
    </Flex>
  )
}
