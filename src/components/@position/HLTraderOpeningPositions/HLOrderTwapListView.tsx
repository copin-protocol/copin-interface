import { Trans } from '@lingui/macro'
import { useEffect, useRef } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import NoDataFound from 'components/@ui/NoDataFound'
import { HlTwapOrderData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data?: HlTwapOrderData[]
  scrollDep: any
  sx?: any
}

export default function HLOrderTwapListView({ data, isLoading, scrollDep }: Props) {
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
          <Box
            sx={{ p: [2, 3] }}
            key={index + symbol + item.orderId + item.twapOrderId + item.twapFillId + item.timestamp}
          >
            <Flex sx={{ alignItems: 'center', gap: '1ch', flexWrap: 'wrap' }}>
              <Type.Caption flex={3} color="neutral3">
                <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
              </Type.Caption>
              <Flex flex={5} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Flex flex={2} sx={{ alignItems: 'center', gap: '1ch' }}>
                  <Type.Caption color={item.isLong ? 'green1' : 'red2'}>{item.direction}</Type.Caption>
                  <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
                </Flex>
                <Type.Caption flex={1} color="neutral3" textAlign="right">
                  {!!item.twapOrderId ? `#${item.twapOrderId}` : '--'}
                </Type.Caption>
              </Flex>
            </Flex>
            <Flex mt={1} sx={{ width: '100%', alignItems: 'center', gap: '1ch' }}>
              <Flex flex={3} alignItems="center">
                <Type.Caption color="neutral1">
                  <Box as="span" color="neutral3" mr="1ch">
                    Size:
                  </Box>
                  {formatNumber(item.sizeInTokenNumber)}
                </Type.Caption>
              </Flex>
              <Flex flex={5} alignItems="center">
                <Type.Caption color="neutral1">
                  <Box as="span" color="neutral3" mr="1ch">
                    Value:
                  </Box>
                  ${compactNumber(item.sizeNumber, 2)}
                </Type.Caption>
              </Flex>
            </Flex>
            <Flex mt={1} sx={{ width: '100%', alignItems: 'center', gap: '1ch', justifyContent: 'space-between' }}>
              <Flex flex={3} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Fees:
                </Type.Caption>
                <Type.Caption color="neutral3">
                  {!!item.fee ? <SignedText value={item.fee * -1} maxDigit={2} minDigit={2} prefix="$" /> : '--'}
                </Type.Caption>
              </Flex>

              <Flex flex={5} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Price:
                </Type.Caption>
                <Type.Caption color="neutral1">
                  {item.priceNumber ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 }) : 'N/A'}
                </Type.Caption>
              </Flex>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
