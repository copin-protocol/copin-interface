import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

import { ShortDuration } from 'components/@position/configs/traderPositionRenderProps'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Market from 'components/@ui/MarketGroup/Market'
import NoDataFound from 'components/@ui/NoDataFound'
import TraderAddress from 'components/@ui/TraderAddress'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { TIME_FORMAT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { compactNumber, formatLeverage, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data?: PositionData[]
  scrollDep: any
  onClickItem?: (data: PositionData) => void
}

export default function DailyPositionListView({ data, isLoading, scrollDep, onClickItem }: Props) {
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
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No position found</Trans>} />}
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
        const isOpen = position.status === PositionStatusEnum.OPEN
        return (
          <Box role="button" sx={{ p: [2, 3] }} key={position.id} onClick={() => onClickItem?.(position)}>
            <Flex sx={{ alignItems: 'center', gap: 1, width: '100%', justifyContent: 'space-between' }}>
              <Type.Caption color="neutral3" sx={{ width: '92px', flexShrink: 0 }}>
                <LocalTimeText date={position.openBlockTime} format={TIME_FORMAT} />
              </Type.Caption>
              <Box flex="1">
                <TraderAddress address={position.account} protocol={position.protocol} />
              </Box>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                {!isOpen && <ShortDuration durationInSecond={position.durationInSecond} />}
                <Type.Caption
                  color={isOpen ? 'green1' : 'neutral2'}
                  sx={{ borderRadius: '4px', bg: 'neutral5', px: 1, flexShrink: 0 }}
                >
                  {isOpen ? 'Open' : 'Close'}
                </Type.Caption>
              </Flex>
            </Flex>
            <Flex mt={3} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ gap: 2 }}>
                <Flex sx={{ alignItems: 'center', gap: 2, width: '92px', flexShrink: 0 }}>
                  <Market symbol={getSymbolFromPair(position.pair)} hasName symbolNameSx={{ fontSize: '12px' }} />
                </Flex>
                <Type.Caption color="neutral1">
                  <Box as="span" color={position.isLong ? 'green1' : 'red2'}>
                    {position.isLong ? 'L' : 'S'}
                  </Box>
                  <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                    |
                  </Box>
                  ${position.size >= 100000 ? compactNumber(position.size, 1) : formatNumber(position.size, 0, 0)}
                  <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                    |
                  </Box>
                  {formatLeverage(position.marginMode, position.leverage)}
                </Type.Caption>
                <Flex sx={{ alignItems: 'center', gap: '1ch' }}>
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    PnL:
                  </Type.Caption>

                  <Type.Caption>
                    <SignedText value={position.pnl} minDigit={1} maxDigit={1} fontInherit isCompactNumber />
                  </Type.Caption>
                </Flex>
              </Flex>
              <IconBox icon={<CaretRight size={16} />} color="neutral3" />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
