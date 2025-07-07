import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'

import { ExternalSourceHlPosition } from 'components/@position/configs/hlPositionRenderProps'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { renderEntry, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useIFHyperliquidActions from 'hooks/features/if/useIFHyperliquidActions'
import Table from 'theme/Table'
import { Box, Flex, Type } from 'theme/base'

import { hlOpeningColumns, renderAction } from './configs'

export default function HlOpeningPositions({
  data,
  isLoading,
  currentHlPosition,
  setCurrentHlPosition,
  onClosePositionSuccess,
}: {
  data: PositionData[] | undefined
  isLoading: boolean
  currentHlPosition?: PositionData
  setCurrentHlPosition: (data: PositionData) => void
  onClosePositionSuccess: () => void
}) {
  const { xl } = useResponsive()
  const title = <Trans>Opening Positions</Trans>

  const { handleCloseHlPosition, submittingClose } = useIFHyperliquidActions({ onSuccess: onClosePositionSuccess })

  const externalSource: ExternalSourceHlPosition = {
    handleClosePosition: (data) => {
      setCurrentHlPosition(data)

      handleCloseHlPosition({
        walletAddress: data.account,
        isLong: data.isLong,
        size: data.sizeInToken,
        symbol: data.pair,
      })
    },
    submitting: submittingClose,
    currentId: currentHlPosition?.id,
  }

  return (
    <Flex flexDirection="column" height="100%">
      {!data?.length && !isLoading && <NoOpeningPositionMessage title={title} />}
      {!!data?.length &&
        (xl ? (
          <Table
            restrictHeight
            tableBodySx={{
              '& td:last-child': { pr: 2 },
            }}
            data={data}
            externalSource={externalSource}
            columns={hlOpeningColumns}
            isLoading={isLoading}
            renderRowBackground={() => 'rgb(31, 34, 50)'}
            onClickRow={(data) => setCurrentHlPosition(data)}
          />
        ) : (
          <Flex flexDirection="column" width="100%" height="calc(100% - 40px - 64px)" sx={{ gap: 2, overflow: 'auto' }}>
            {data?.map((position) => {
              return (
                <Box
                  role="button"
                  variant="card"
                  key={position.id}
                  sx={{ py: 2 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    externalSource?.handleSelectPosition?.(position)
                  }}
                >
                  <Flex sx={{ alignItems: 'center', gap: '1ch', justifyContent: 'space-between' }}>
                    <Box flex="1">{renderEntry(position)}</Box>
                    <Flex sx={{ alignItems: 'center', gap: '1ch' }}>
                      <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                        Funding:
                      </Type.Caption>
                      <Type.Caption>
                        <SignedText value={position.funding * -1} minDigit={2} maxDigit={2} fontInherit />
                      </Type.Caption>
                    </Flex>
                  </Flex>
                  <Flex mt={1} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                    <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                      <Flex flex={1} alignItems="center">
                        <Box sx={{ width: 200, flexShrink: 0 }}>{renderSizeOpening(position)}</Box>
                      </Flex>
                      <Flex sx={{ alignItems: 'center', gap: '1ch' }}>
                        <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                          PnL:
                        </Type.Caption>
                        <Type.Caption>
                          <SignedText value={position.pnl} minDigit={1} maxDigit={1} fontInherit />
                        </Type.Caption>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex width="100%" alignItems="center" justifyContent="flex-end">
                    {renderAction(position, externalSource)}
                  </Flex>
                </Box>
              )
            })}
          </Flex>
        ))}
    </Flex>
  )
}

function NoOpeningPositionMessage({ title }: { title: ReactNode }) {
  return (
    <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
      <Type.CaptionBold display="block">
        <Trans>Your {title} Is Empty</Trans>
      </Type.CaptionBold>
      <Type.Caption mt={1} color="neutral3" display="block">
        <Trans>Once you have a position, you’ll see it listed here</Trans>
      </Type.Caption>
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
