import { Trans } from '@lingui/macro'
import { useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'

import { convertHlOrderStatus } from 'components/@position/helpers/hyperliquid'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import NoDataFound from 'components/@ui/NoDataFound'
import { HlHistoricalOrderData } from 'entities/hyperliquid'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, IGNORED_REASON_HL_ORDER_STATUS } from 'utils/config/constants'
import { HlOrderStatusEnum } from 'utils/config/enums'
import { HYPERLIQUID_ORDER_STATUS_TRANS } from 'utils/config/translations'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data?: HlHistoricalOrderData[]
  scrollDep: any
  sx?: any
}

export default function HLHistoricalOrderListView({ data, isLoading, scrollDep }: Props) {
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
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No order was found</Trans>} />}
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
        const status = item.status ? HYPERLIQUID_ORDER_STATUS_TRANS[item.status] : '--'
        const hasTooltip = !IGNORED_REASON_HL_ORDER_STATUS.includes(item.status)
        const tooltipId = uuid()
        return (
          <Box sx={{ p: [2, 3] }} key={tooltipId}>
            <Flex sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Flex flex={1} sx={{ alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <Type.Caption color="neutral3">
                  <LocalTimeText date={item.timestamp} format={DAYJS_FULL_DATE_FORMAT} hasTooltip />
                </Type.Caption>
              </Flex>
              <Flex flex={1} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Type.Caption
                  color={item.isLong ? (item.reduceOnly ? 'red2' : 'green1') : item.reduceOnly ? 'green1' : 'red2'}
                >
                  {item.reduceOnly ? 'Close ' : ''}
                  {item.isLong ? 'Long' : 'Short'}
                </Type.Caption>
                <Type.Caption color="neutral1">{symbol ?? '--'}</Type.Caption>
              </Flex>
              <Flex flex={1} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Status:
                </Type.Caption>
                <Box color="neutral1">
                  {hasTooltip ? (
                    <LabelWithTooltip
                      id={tooltipId}
                      tooltip={
                        <Type.Caption color="neutral2" sx={{ maxWidth: 350 }}>
                          {convertHlOrderStatus(item.status)}
                        </Type.Caption>
                      }
                      dashed
                    >
                      {status}
                    </LabelWithTooltip>
                  ) : (
                    <Type.Caption>{status}</Type.Caption>
                  )}
                </Box>
              </Flex>
            </Flex>
            <Flex mt={1} sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
              <Flex flex={1} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Type:
                </Type.Caption>
                <Type.Caption color="neutral1">{item.orderType ?? '--'}</Type.Caption>
              </Flex>
              <Flex flex={2} alignItems="center">
                <Type.Caption color="neutral1">
                  <Box as="span" color="neutral3" mr="1ch">
                    Value:
                  </Box>
                  {!!item.sizeNumber ? `$${compactNumber(item.sizeNumber, 2)}` : '--'}
                </Type.Caption>
              </Flex>
            </Flex>
            <Flex mt={1} sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
              <Flex flex={1} alignItems="center">
                <Type.Caption color="neutral1">
                  <Box as="span" color="neutral3" mr="1ch">
                    Size:
                  </Box>
                  {formatNumber(
                    item.status === HlOrderStatusEnum.FILLED ? item.originalSizeInTokenNumber : item.sizeInTokenNumber
                  )}
                </Type.Caption>
              </Flex>
              <Flex flex={2} sx={{ alignItems: 'center', gap: '1ch' }}>
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Price:
                </Type.Caption>
                <Type.Caption color="neutral1">
                  {item.priceNumber && !item.isPositionTpsl
                    ? PriceTokenText({ value: item.priceNumber, maxDigit: 2, minDigit: 2 })
                    : 'Market'}
                </Type.Caption>
              </Flex>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
