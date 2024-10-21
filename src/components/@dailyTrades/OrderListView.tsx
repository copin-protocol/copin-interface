import { Trans } from '@lingui/macro'
import { useEffect, useRef } from 'react'

import { renderOrderLeverage, renderOrderPrice } from 'components/@position/TraderPositionDetails/ListOrderTable'
import { ORDER_TYPES } from 'components/@position/configs/order'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Market from 'components/@ui/MarketGroup/Market'
import NoDataFound from 'components/@ui/NoDataFound'
import TraderAddress from 'components/@ui/TraderAddress'
import { OrderData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { TIME_FORMAT } from 'utils/config/constants'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data: OrderData[] | undefined
  scrollDep: any
}

export default function DailyOrderListView({ data, isLoading, scrollDep }: Props) {
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
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No order found</Trans>} />}
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
      {data?.map((order) => {
        return (
          <Box sx={{ p: [2, 3] }} key={order.id}>
            <Flex sx={{ alignItems: 'center', gap: 1, width: '100%' }}>
              <Type.Caption color="neutral3" sx={{ '& *': { color: 'neutral3' }, width: '92px', flexShrink: 0 }}>
                <LocalTimeText date={order.blockTime} format={TIME_FORMAT} />
              </Type.Caption>
              <Box flex="1">
                <TraderAddress address={order.account} protocol={order.protocol} />
              </Box>

              <Type.Caption
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {ORDER_TYPES[order.type].icon}{' '}
                <Box as="span" color={order.isLong ? 'green1' : 'red2'}>
                  {ORDER_TYPES[order.type].text}
                </Box>
                {/* {order.isLong ? 'Long' : 'Short'} */}
              </Type.Caption>
            </Flex>
            <Flex mt={2} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Flex sx={{ alignItems: 'center', gap: 2, width: '92px', flexShrink: 0 }}>
                  <Market symbol={getSymbolFromPair(order.pair)} hasName symbolNameSx={{ fontSize: '13px' }} />
                </Flex>

                <Type.Caption color="neutral1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box as="span" sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Box as="span">$</Box>
                    {formatNumber(order.sizeDeltaNumber)}
                  </Box>
                  <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                    |
                  </Box>
                  <Box as="span">{renderOrderLeverage(order)}</Box>
                  <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                    |
                  </Box>
                  <Box as="span">{renderOrderPrice(order)}</Box>
                </Type.Caption>
              </Flex>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
