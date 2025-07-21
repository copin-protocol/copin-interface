import { Trans } from '@lingui/macro'
import { useEffect, useRef } from 'react'

import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import NoDataFound from 'components/@ui/NoDataFound'
import { HlOrderData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data?: HlOrderData[]
  scrollDep: any
  sx?: any
}

export default function HLOpenOrderListView({ data, isLoading, scrollDep }: Props) {
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
      {data?.map((item) => {
        const symbol = getSymbolFromPair(item.pair)
        return (
          <Box sx={{ p: [2, 3] }} key={item.timestamp + item.orderId}>
            <Flex sx={{ alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Type.Caption flex={1} color="neutral3">
                <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
              </Type.Caption>
              <Box flex={1}>
                <Type.Caption
                  mr={2}
                  color={item.isLong ? (item.reduceOnly ? 'red2' : 'green1') : item.reduceOnly ? 'green1' : 'red2'}
                >
                  {item.reduceOnly ? 'Close ' : ''}
                  {item.isLong ? 'Long' : 'Short'}
                </Type.Caption>
                <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
              </Box>
            </Flex>
            <Box>
              <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between', mt: 1 }}>
                <Flex flex={1} sx={{ alignItems: 'center', gap: '1ch' }}>
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    Type:
                  </Type.Caption>
                  <Type.Caption color="neutral1">
                    <Type.Caption color="neutral1">{item.orderType ?? '--'}</Type.Caption>
                  </Type.Caption>
                </Flex>
                <Flex flex={1} alignItems="center">
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Value:
                    </Box>
                    ${compactNumber(item.sizeNumber)}
                  </Type.Caption>
                </Flex>
              </Flex>
              <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between', mt: 1 }}>
                <Flex flex={1} alignItems="center">
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Size:
                    </Box>
                    {formatNumber(item.sizeInTokenNumber)}
                  </Type.Caption>
                </Flex>
                <Flex flex={1} alignItems="center">
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Price:
                    </Box>
                    {item.priceNumber && !item.isPositionTpsl
                      ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 })
                      : 'Market'}
                  </Type.Caption>
                </Flex>
              </Flex>
            </Box>
          </Box>
        )
      })}
    </Flex>
  )
}
