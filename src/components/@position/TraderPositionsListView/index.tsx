import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

import { ShortDuration } from 'components/@position/configs/traderPositionRenderProps'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import NoDataFound from 'components/@ui/NoDataFound'
import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import { renderEntry, renderOpeningPnL, renderSizeOpening, renderTrader } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { formatLeverage, formatNumber } from 'utils/helpers/format'

type Props = {
  isLoading: boolean
  data?: PositionData[]
  scrollDep: any
  onClickItem?: (data: PositionData) => void
  hasAccountAddress?: boolean
  isOpening?: boolean
  sx?: any
}

export default function TraderPositionListView({
  data,
  isLoading,
  scrollDep,
  onClickItem,
  hasAccountAddress = true,
  isOpening = true,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [scrollDep])
  return (
    <Flex
      ref={wrapperRef}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', '&:last-child': { borderBottom: 'none' } },
      }}
    >
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No position was found</Trans>} />}
      {isLoading && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      {data?.map((position) => {
        return (
          <Box role="button" sx={{ p: [2, 3] }} key={position.id} onClick={() => onClickItem?.(position)}>
            <Flex sx={{ alignItems: 'center', gap: '1ch', flexWrap: 'wrap' }}>
              <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                {isOpening ? (
                  hasAccountAddress ? (
                    <ShortDuration durationInSecond={position.durationInSecond} />
                  ) : (
                    <LocalTimeText date={position.openBlockTime} />
                  )
                ) : (
                  <LocalTimeText date={position.closeBlockTime} />
                )}
              </Type.Caption>
              {hasAccountAddress && (
                <>
                  <Type.Caption color="neutral3">-</Type.Caption>
                  <Box>{renderTrader(position.account, position.protocol, false, true)}</Box>
                </>
              )}
              <Type.Caption color="neutral3">-</Type.Caption>
              <Box flex="1">{renderEntry(position)}</Box>
              {!hasAccountAddress && (
                <>
                  <ShortDuration durationInSecond={position.durationInSecond} />{' '}
                  <IconBox icon={<CaretRight size={16} />} color="neutral3" />
                </>
              )}
            </Flex>
            <Flex mt={3} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
                <Flex flex={1} alignItems="center">
                  {isOpening ? (
                    <>
                      <Box sx={{ width: 200, flexShrink: 0 }}>{renderSizeOpening(position)}</Box>
                      {/* <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                      -
                    </Type.Caption> */}
                    </>
                  ) : (
                    <Type.Caption color="neutral1">
                      <Box as="span" color="neutral3" mr="1ch">
                        Size:
                      </Box>
                      ${formatNumber(position.size, 0, 0)}
                      <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                        |
                      </Box>
                      {formatLeverage(position.marginMode, position.leverage)}
                    </Type.Caption>
                  )}
                </Flex>
                <Flex sx={{ alignItems: 'center', gap: '1ch' }}>
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    <PnlTitle type="lower" />
                  </Type.Caption>
                  {isOpening ? renderOpeningPnL(position) : <PnlValueDisplay position={position} />}
                </Flex>
              </Flex>
              {isOpening && hasAccountAddress && <IconBox icon={<CaretRight size={16} />} color="neutral3" />}
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

const PnlValueDisplay = ({ position }: { position: any }) => {
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const pnl = pnlWithFeeEnabled ? position.pnl : position.realisedPnl
  return (
    <Type.Caption>
      <SignedText prefix="$" value={pnl} maxDigit={0} fontInherit />
    </Type.Caption>
  )
}
