import { Trans } from '@lingui/macro'
import { MouseEvent, useEffect, useRef } from 'react'

import { renderOrderLeverage, renderOrderPrice } from 'components/@position/TraderPositionDetails/ListOrderTable'
import { ORDER_TYPES } from 'components/@position/configs/order'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Market from 'components/@ui/MarketGroup/Market'
import NoDataFound from 'components/@ui/NoDataFound'
import TraderAddress from 'components/@ui/TraderAddress'
import { OrderData } from 'entities/trader'
import useBenefitModalStore from 'hooks/features/subscription/useBenefitModalStore'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { TIME_FORMAT } from 'utils/config/constants'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

type Props = {
  isLoading: boolean
  data: OrderData[] | undefined
  scrollDep: any
  availableColumns: (keyof OrderData)[] | undefined
  onClickItem: ((data: OrderData) => void) | undefined
}

export default function DailyOrderListView({ data, isLoading, scrollDep, availableColumns, onClickItem }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [scrollDep])
  const availableColumnsMapping = availableColumns
    ? availableColumns.reduce((result, current) => {
        return { ...result, [current]: current }
      }, {} as Record<string, string>)
    : {}

  const { setConfig } = useBenefitModalStore()

  const handleClickNonPermissionItem = (e: MouseEvent) => {
    e.stopPropagation()
    setConfig(SubscriptionFeatureEnum.LIVE_TRADES)
  }

  const PermissionOverlay = ({ dataKey }: { dataKey: keyof OrderData }) => {
    if (availableColumns == null || availableColumnsMapping[dataKey]) return null
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          cursor: 'pointer',
        }}
        onClick={handleClickNonPermissionItem}
      />
    )
  }
  const getItemWrapperSx = (dataKey: keyof OrderData): any => ({
    position: 'relative',
    filter: availableColumns == null || availableColumnsMapping[dataKey] ? 'none' : 'blur(6px)',
  })

  return (
    <Flex
      ref={wrapperRef}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4' },
        '& > *:last-child': { borderBottom: 'none' },
        '& *': { fontSize: '12px !important' },
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
          <Box sx={{ p: [2, 3] }} key={order.id} onClick={() => onClickItem?.(order)}>
            <Flex sx={{ alignItems: 'center', gap: 1, width: '100%' }}>
              <Type.Caption
                data-value-key={'blockTime'}
                color="neutral3"
                sx={{ '& *': { color: 'neutral3' }, width: '92px', flexShrink: 0, ...getItemWrapperSx('blockTime') }}
              >
                <PermissionOverlay dataKey="blockTime" />
                <LocalTimeText date={order.blockTime} format={TIME_FORMAT} />
              </Type.Caption>
              <Box flex="1" sx={getItemWrapperSx('account')}>
                <PermissionOverlay dataKey="account" />
                <TraderAddress address={order.account} protocol={order.protocol} />
              </Box>

              <Type.Caption
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  ...getItemWrapperSx('type'),
                }}
              >
                <PermissionOverlay dataKey="type" />
                {ORDER_TYPES[order.type].icon}{' '}
                <Box as="span" color={'neutral1'}>
                  {ORDER_TYPES[order.type].text}
                </Box>
                {/* {order.isLong ? 'Long' : 'Short'} */}
              </Type.Caption>
            </Flex>
            <Flex mt={2} sx={{ alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center', gap: 1 }}>
                <Flex sx={{ alignItems: 'center', gap: 2, width: '92px', flexShrink: 0, ...getItemWrapperSx('pair') }}>
                  <PermissionOverlay dataKey="pair" />
                  <Market symbol={getSymbolFromPair(order.pair)} hasName symbolNameSx={{ fontSize: '12px' }} />
                </Flex>

                <Type.Caption color="neutral1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    as="span"
                    sx={{ display: 'flex', alignItems: 'center', gap: '2px', ...getItemWrapperSx('sizeDeltaNumber') }}
                  >
                    <PermissionOverlay dataKey="sizeDeltaNumber" />
                    <Box as="span">$</Box>
                    {order.sizeDeltaNumber > 10000
                      ? compactNumber(order.sizeDeltaNumber, 1)
                      : formatNumber(order.sizeDeltaNumber, 0, 0)}
                  </Box>
                  <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                    |
                  </Box>
                  <Box as="span" sx={getItemWrapperSx('leverage')}>
                    <PermissionOverlay dataKey="leverage" />
                    {renderOrderLeverage(order)}
                  </Box>
                  <Box as="span" color="neutral3" sx={{ mx: '1ch' }}>
                    |
                  </Box>
                  <Box as="span" sx={getItemWrapperSx('priceNumber')}>
                    <PermissionOverlay dataKey="priceNumber" />
                    {renderOrderPrice(order)}
                  </Box>
                </Type.Caption>
              </Flex>
              <Type.Caption
                color={order.isLong ? 'green1' : 'red2'}
                sx={{ flexShrink: 0, ...getItemWrapperSx('isLong') }}
              >
                <PermissionOverlay dataKey="isLong" />
                {order.isLong ? 'Long' : 'Short'}
              </Type.Caption>
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
