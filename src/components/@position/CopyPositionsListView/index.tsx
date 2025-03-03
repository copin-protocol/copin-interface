import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import Divider from 'components/@ui/Divider'
import LabelEPnL from 'components/@ui/LabelEPnL'
import NoDataFound from 'components/@ui/NoDataFound'
import ReverseTag from 'components/@ui/ReverseTag'
import { CopyPositionData } from 'entities/copyTrade.d'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'

import MismatchPosition from '../CopyOpeningPositions/MismatchPosition'
import CopyPositionsContainer from '../CopyPositionsContainer'
import {
  renderCloseTime,
  renderCloseType,
  renderCollateral,
  renderCopyTitle,
  renderCopyWallet,
  renderEntry,
  renderOpenTime,
  renderPnL,
  renderSLTP,
  renderSizeMobile,
  renderSource,
  renderStatus,
  renderTrader,
  renderValueWithColor,
} from '../configs/copyPositionRenderProps'
import { ExternalSourceCopyPositions, LayoutType } from '../types'

export default function CopyPositionsListView({
  data,
  isLoading,
  onClosePositionSuccess,
  noDataMessage,
  noDataComponent,
  isOpening = false,
  layoutType,
}: {
  data: CopyPositionData[] | undefined
  isLoading: boolean
  onClosePositionSuccess: () => void
  noDataMessage?: ReactNode
  noDataComponent?: ReactNode
  isOpening?: boolean
  layoutType?: LayoutType
}) {
  if (isLoading) return <Loading />
  if (!isLoading && !data?.length)
    return noDataComponent ? <>{noDataComponent}</> : <NoDataFound message={noDataMessage} />
  return (
    <CopyPositionsContainer onClosePositionSuccess={onClosePositionSuccess}>
      {isOpening ? <OpeningPositionListForm data={data} layoutType={layoutType} /> : <ListForm data={data} />}
    </CopyPositionsContainer>
  )
}

export function ListForm({
  data,
  externalSource,
  layoutType = 'normal',
}: {
  data: CopyPositionData[] | undefined
  externalSource?: ExternalSourceCopyPositions
  layoutType?: 'normal' | 'lite'
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
              {layoutType === 'normal' && (
                <ListHistoryRow
                  label={<Trans>Copy Wallet</Trans>}
                  value={renderCopyWallet(positionData, undefined, externalSource)}
                />
              )}
              <ListHistoryRow
                label={<Trans>Source Position</Trans>}
                value={<Flex>{renderSource(positionData, undefined, externalSource, true)}</Flex>}
              />
              <ListHistoryRow label={<Trans>Entry</Trans>} value={renderEntry(positionData)} />
              <ListHistoryRow label={<Trans>Size</Trans>} value={renderSizeMobile(positionData)} />
              {positionData.status === PositionStatusEnum.OPEN ? (
                <ListHistoryRow label={<LabelEPnL />} value={renderPnL(positionData)} />
              ) : (
                <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                  <ListHistoryRow label={<Trans>PnL w. Fees</Trans>} value={renderValueWithColor(positionData.pnl)} />
                  <ListHistoryRow
                    label={<Trans>Realized PnL</Trans>}
                    value={renderValueWithColor(positionData.realisedPnl)}
                  />
                  <ListHistoryRow label={<Trans>Fees</Trans>} value={renderValueWithColor(positionData.fee)} />
                  {!!positionData.funding && (
                    <ListHistoryRow label={<Trans>Funding</Trans>} value={renderValueWithColor(positionData.funding)} />
                  )}
                </Flex>
              )}
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

export function OpeningPositionListForm({
  data,
  externalSource,
  layoutType,
}: {
  data: CopyPositionData[] | undefined
  layoutType?: LayoutType
  externalSource?: ExternalSourceCopyPositions
}) {
  return (
    <Flex py={2} sx={{ width: '100%', height: '100%', overflow: 'hidden auto', flexDirection: 'column', gap: 2 }}>
      {data?.map((positionData) => {
        const isHLPosition = positionData.openingPositionType === 'onlyLiveHyper'
        return (
          <Box
            key={positionData.id}
            sx={{ px: 3, py: 2, bg: 'neutral6', position: 'relative', cursor: 'pointer' }}
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
              {positionData.openingPositionType === 'onlyLiveApp' ? (
                <MismatchPosition data={positionData} externalSource={externalSource} />
              ) : (
                <Button
                  variant="ghostPrimary"
                  sx={{ fontWeight: 'normal', p: 0 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    externalSource?.handleCloseCopyItem?.(positionData)
                  }}
                >
                  <Trans>Close Position</Trans>
                </Button>
              )}
            </Flex>
            <Divider my={2} color="neutral5" />
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              {!isHLPosition && (
                <ListHistoryRow
                  label={<Trans>Trader</Trans>}
                  value={renderTrader(positionData.copyAccount, positionData.protocol)}
                />
              )}
              {layoutType !== 'lite' && (
                <ListHistoryRow
                  label={<Trans>Copy Wallet</Trans>}
                  value={renderCopyWallet(positionData, undefined, externalSource)}
                />
              )}
              {/* {isHLPosition && (
                <ListHistoryRow
                  label={<Trans>Source Position</Trans>}
                  value={renderSource(positionData, undefined, externalSource, true)}
                />
              )} */}
              <ListHistoryRow label={<Trans>Entry</Trans>} value={renderEntry(positionData)} />
              <ListHistoryRow label={<Trans>Size</Trans>} value={renderSizeMobile(positionData)} />
              <ListHistoryRow label={<Trans>Collateral</Trans>} value={renderCollateral(positionData)} />
              {!isHLPosition && <ListHistoryRow label={<Trans>SL/TP</Trans>} value={renderSLTP(positionData)} />}
              <ListHistoryRow label={<LabelEPnL />} value={renderPnL(positionData)} />
              {!isHLPosition && <ListHistoryRow label={<Trans>Open</Trans>} value={renderOpenTime(positionData)} />}
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
