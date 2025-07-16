import { Trans } from '@lingui/macro'
import { useEffect, useRef } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import NoDataFound from 'components/@ui/NoDataFound'
import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import { GroupedFillsData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data?: GroupedFillsData[]
  scrollDep: any
  sx?: any
}

export default function HLOrderFilledListView({ data, isLoading, scrollDep }: Props) {
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
      {data?.map((item, index) => {
        const symbol = getSymbolFromPair(item.pair)
        return (
          <Box sx={{ p: [2, 3] }} key={index + symbol + item.orderId + item.txHash + item.timestamp}>
            <Flex sx={{ alignItems: 'center', gap: '1ch', flexWrap: 'wrap' }}>
              <Type.Caption color="neutral3" flex={4}>
                <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
              </Type.Caption>

              <Box flex={7}>
                <Type.Caption color={item.isLong ? 'green1' : 'red2'} mr={2}>
                  {item.direction}
                </Type.Caption>
                <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
              </Box>
            </Flex>
            <Flex mt={2} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ width: '100%', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                <Flex flex={4} alignItems="center">
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Size:
                    </Box>
                    {formatNumber(item.totalSizeInToken)}
                  </Type.Caption>
                </Flex>
                <Flex flex={7} alignItems="center" sx={{ gap: 3 }}>
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Price:
                    </Box>
                    {item.avgPrice ? PriceTokenText({ value: item.avgPrice, maxDigit: 2, minDigit: 2 }) : 'N/A'}
                  </Type.Caption>
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Value:
                    </Box>
                    ${compactNumber(item.totalSize, 2)}
                  </Type.Caption>
                </Flex>
              </Flex>
            </Flex>
            <Flex mt={2} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ width: '100%', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                <Flex flex={4} sx={{ alignItems: 'center', gap: '1ch' }}>
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    Fees:
                  </Type.Caption>
                  <Type.Caption color="neutral3">
                    {!!item.totalFee ? (
                      <SignedText value={item.totalFee * -1} maxDigit={2} minDigit={2} prefix="$" />
                    ) : (
                      '--'
                    )}
                  </Type.Caption>
                </Flex>
                <Flex flex={7} sx={{ alignItems: 'center', gap: '1ch' }}>
                  <PnlTitle type="lower" character=":" color="neutral3" />
                  <Type.Caption color="neutral3">
                    {!!item.totalPnl ? <SignedText value={item.totalPnl} maxDigit={2} minDigit={2} prefix="$" /> : '--'}
                  </Type.Caption>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
