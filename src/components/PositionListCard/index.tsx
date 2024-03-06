import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText, RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import NoDataFound from 'components/@ui/NoDataFound'
import { renderEntry, renderOpeningPnL, renderSizeOpening, renderTrader } from 'components/@ui/Table/renderProps'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

type Props = {
  isLoading: boolean
  data?: PositionData[]
  scrollDep: any
  onClickItem?: (data: PositionData) => void
  hasAccountAddress?: boolean
  isOpening?: boolean
}

export default function PositionListCard({
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
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', '& > *:last-child': { borderBottom: 'none' } },
      }}
    >
      {!isLoading && !data?.length && <NoDataFound message={<Trans>No opening positions</Trans>} />}
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
          <Box role="button" sx={{ p: 3 }} key={position.id} onClick={() => onClickItem?.(position)}>
            <Flex sx={{ alignItems: 'center', gap: '1ch', flexWrap: 'wrap' }}>
              <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                {isOpening ? (
                  <RelativeShortTimeText date={position.openBlockTime} />
                ) : (
                  <LocalTimeText date={position.closeBlockTime} />
                )}
              </Type.Caption>
              {hasAccountAddress && (
                <>
                  <Type.Caption color="neutral3">-</Type.Caption>
                  <Box>{renderTrader(position.account, position.protocol)}</Box>
                </>
              )}
              <Type.Caption color="neutral3">-</Type.Caption>
              <Box flex="1">{renderEntry(position)}</Box>
              <IconBox icon={<CaretRight size={16} />} color="neutral3" />
            </Flex>
            <Flex mt={3} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
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
                    {formatNumber(position.leverage, 1, 1)}x
                  </Type.Caption>
                )}
                <Flex sx={{ alignItems: 'center', gap: '1ch' }}>
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    PnL:
                  </Type.Caption>
                  {isOpening ? (
                    renderOpeningPnL(position)
                  ) : (
                    <Type.Caption>
                      <SignedText value={position.pnl} minDigit={1} maxDigit={1} fontInherit />
                    </Type.Caption>
                  )}
                </Flex>
              </Flex>
              {/* {hasAccountAddress && <IconBox icon={<CaretRight size={16} />} color="neutral3" />} */}
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
