import { useResponsive, useSize } from 'ahooks'
import { useMemo, useState } from 'react'

import HLTraderPositionListView from 'components/@position/HLTraderPositionsListView'
import {
  ExternalSourceHlPosition,
  drawerOpeningColumns,
  fullOpeningColumns,
  openingColumns,
} from 'components/@position/configs/hlPositionRenderProps'
import { HlAccountData, HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useGetTraderPnL from 'hooks/features/trader/useGetTraderPnL'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { PROFILE_BREAKPOINT_XL } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'

import HLPositionDetailsDrawer from '../HLTraderPositionDetails/HLPositionDetailsDrawer'
import { parseHLPositionData } from '../helpers/hyperliquid'

export enum HLPositionTab {
  OPEN_POSITIONS = 'open_position',
  OPEN_ORDERS = 'open_order',
  ORDER_FILLED = 'order_filled',
}

export default function OpeningPositionsView({
  currentSort,
  changeCurrentSort,
  openOrders,
  address,
  data,
  isLoading,
  isExpanded,
  isDrawer,
}: {
  currentSort: TableSortProps<PositionData> | undefined
  changeCurrentSort?: ((sort: TableSortProps<PositionData> | undefined) => void) | undefined
  openOrders: HlOrderData[] | undefined
  address: string
  data: HlAccountData | undefined
  isLoading: boolean
  isExpanded?: boolean
  isDrawer?: boolean
}) {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const { lg, xl, md } = useResponsive()

  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: ProtocolEnum.HYPERLIQUID })

  const tableData = useMemo(() => {
    if (!data?.assetPositions) return undefined
    let openingPositions = parseHLPositionData({ account: address, data: data.assetPositions })
    if (currentSort?.sortBy) {
      openingPositions = openingPositions.sort((a, b) => {
        return (
          (((a?.[currentSort.sortBy] as number) ?? 0) - ((b?.[currentSort.sortBy] as number) ?? 0)) *
          (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
        )
      })
    }

    return {
      data: openingPositions,
      meta: { limit: openingPositions.length, offset: 0, total: openingPositions.length, totalPages: 1 },
    }
  }, [address, currentSort?.sortBy, currentSort?.sortType, data?.assetPositions])

  useGetTraderPnL({ protocol: ProtocolEnum.HYPERLIQUID, positions: tableData?.data })

  const totalPositionValue = useMemo(
    () => data?.assetPositions?.reduce((sum, current) => sum + Number(current.position.positionValue), 0) ?? 0,
    [data]
  )
  const externalSource: ExternalSourceHlPosition = {
    prices,
    totalPositionValue,
    isExpanded,
  }

  // Group the filled orders
  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
  }

  const handleDismiss = () => {
    setOpenDrawer(false)
  }

  const currentOpenOrders = useMemo(
    () => openOrders?.filter((e) => e.pair === currentPosition?.pair),
    [currentPosition?.pair, openOrders]
  )

  const scrollTopDeps = useMemo(() => [currentSort], [currentSort])

  const size = useSize(document.body)

  let tableSettings: ColumnData<PositionData, ExternalSourceHlPosition>[]
  if (isDrawer) {
    tableSettings = drawerOpeningColumns
  } else if (xl && isExpanded) {
    tableSettings = fullOpeningColumns
  } else if (size && size.width >= PROFILE_BREAKPOINT_XL) {
    tableSettings = drawerOpeningColumns
  } else {
    tableSettings = openingColumns
  }

  return (
    <>
      {isLoading && <Loading />}
      {!data?.assetPositions?.length && !isLoading && (
        <Flex
          p={3}
          flexDirection="column"
          width="100%"
          height={isDrawer ? 60 : 180}
          justifyContent="center"
          alignItems="center"
        >
          <Type.CaptionBold display="block">This trader&quot;s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" textAlign="center" display="block">
            Once the trader starts a new position, you&quot;ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data && data?.assetPositions?.length > 0 && (
        <Box flex="1 0 0" overflowX="auto" overflowY="hidden" sx={{ height: isDrawer ? 152 : 'auto' }}>
          {md ? (
            <Table
              restrictHeight={!isDrawer && lg}
              wrapperSx={{
                minWidth: 495,
              }}
              tableBodySx={{
                '& td:last-child': { pr: 2 },
              }}
              data={tableData?.data}
              columns={tableSettings}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              isLoading={isLoading}
              onClickRow={handleSelectItem}
              renderRowBackground={() => (isDrawer ? 'transparent' : 'rgb(31, 34, 50)')}
              scrollToTopDependencies={scrollTopDeps}
              externalSource={externalSource}
            />
          ) : (
            <HLTraderPositionListView
              data={tableData?.data}
              isLoading={isLoading}
              scrollDep={tableData?.meta?.offset}
              onClickItem={handleSelectItem}
              hasAccountAddress={false}
              totalPositionValue={totalPositionValue}
            />
          )}
        </Box>
      )}
      <HLPositionDetailsDrawer
        isOpen={openDrawer}
        data={currentPosition}
        orders={currentOpenOrders ?? []}
        onDismiss={handleDismiss}
      />
    </>
  )
}
