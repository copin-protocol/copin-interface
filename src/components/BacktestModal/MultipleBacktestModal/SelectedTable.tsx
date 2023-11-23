import { useResponsive } from 'ahooks'
import { RefObject, useLayoutEffect, useState } from 'react'

import TableLabel from 'components/@ui/Table/TableLabel'
import PickTradersButton from 'components/BacktestPickTradersButton'
import TraderListTable from 'components/Tables/TraderListTable'
import CustomizeColumn from 'components/Tables/TraderListTable/CustomizeColumn'
import { TraderListSortProps, mobileTableSettings, tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader'
import useMyProfile from 'hooks/store/useMyProfile'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import AddCustomTrader from 'pages/Home/AddCustomTrader'
import { PaginationWithLimit, PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { getPaginationDataFromList } from 'utils/helpers/transform'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function HomeSelectedTable({ scrollRef }: { scrollRef: RefObject<HTMLDivElement | null> }) {
  const { myProfile } = useMyProfile()
  const { sm, md, lg } = useResponsive()
  const settings = sm ? tableSettings : mobileTableSettings
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)
  const [currentSort, setCurrentSort] = useState<TraderListSortProps<TraderData> | undefined>({
    sortBy: 'profit',
    sortType: SortTypeEnum.ASC,
  })
  const { getCommonData, isFocusBacktest, currentHomeInstanceId, addRootBacktestInstance } = useSelectBacktestTraders()
  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  const homeListTraderAddress = currentHomeInstance?.tradersByIds ?? []
  const homeListTraderData = currentHomeInstance
    ? homeListTraderAddress.map((address) => {
        return currentHomeInstance.tradersMapping[address]
      })
    : []

  if (!!currentSort) {
    homeListTraderData.sort((a, b) => {
      const sortBy = currentSort.sortBy
      if (sortBy === 'lastTradeAtTs') {
        return (
          (new Date(a.lastTradeAt).valueOf() - new Date(b.lastTradeAt).valueOf()) *
          (currentSort?.sortType === SortTypeEnum.DESC ? 1 : -1)
        )
      }
      return (
        (((a[currentSort.sortBy as keyof TraderData] as number) ?? 0) -
          ((b[currentSort.sortBy as keyof TraderData] as number) ?? 0)) *
        (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
      )
    })
  }
  const paginationData = getPaginationDataFromList({ currentPage, limit: currentLimit, data: homeListTraderData })
  const changeCurrentPage = (page: number) => {
    scrollRef.current?.scrollTo(0, 0)
    setCurrentPage(page)
  }
  const changeCurrentLimit = (limit: number) => {
    scrollRef.current?.scrollTo(0, 0)
    setCurrentLimit(limit)
    setCurrentPage(1)
  }

  const paginationAddresses = paginationData.data.map((data) => data.account)
  const [selectedTraders, setSelectedTraders] = useState(homeListTraderAddress)
  useLayoutEffect(() => {
    if (isFocusBacktest && !!homeListTraderAddress.length) setSelectedTraders(homeListTraderAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusBacktest])
  const checkIsSelected = (data: TraderData) => {
    const isSelected = selectedTraders.includes(data.account)
    return isSelected
  }
  const handleSelect = ({ isSelected, data }: { isSelected: boolean; data: TraderData }) => {
    if (isSelected) {
      setSelectedTraders((prev) => prev.filter((address) => address !== data.account))
    } else {
      setSelectedTraders((prev) => [...prev, data.account])
    }
  }
  const isSelectedAll = paginationAddresses.every((address) => selectedTraders.includes(address))
  const handleSelectAll = () => {
    if (isSelectedAll) {
      setSelectedTraders((prev) => prev.filter((address) => !paginationAddresses.includes(address)))
    } else {
      setSelectedTraders((prev) => Array.from(new Set([...prev, ...paginationAddresses])))
    }
  }

  const handleBacktest = () => {
    addRootBacktestInstance({ listTrader: selectedTraders })

    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.BACK_TEST,
      action: EVENT_ACTIONS[EventCategory.BACK_TEST].SET_STRATEGY_MULTIPLE,
    })
  }
  if (!currentHomeInstance) return <></>
  return (
    <Flex pb={[3, 0]} sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ py: 2, px: 2, bg: 'neutral5' }}>
        <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
          <TableLabel sx={{ fontSize: ['18px', '20px'], lineHeight: ['18px', '20px'] }}>Selected Traders</TableLabel>
          <AddCustomTrader />
        </Flex>
      </Box>

      <Box flex="1 1 0">
        <TraderListTable
          data={paginationData.data}
          isLoading={false}
          currentSort={currentSort}
          changeCurrentSort={(sort) => setCurrentSort(sort)}
          isSelectedAll={isSelectedAll}
          handleSelectAll={handleSelectAll}
          tableSettings={settings}
          checkIsSelected={checkIsSelected}
          handleSelect={handleSelect}
        />
      </Box>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ width: ['100%', '100%', 228], height: 40, flexShrink: 0 }}>
          <PickTradersButton listAddress={selectedTraders} handleClick={handleBacktest} type="backtest" />
        </Box>
        <Flex sx={{ alignItems: 'center', gap: 2, pr: 2 }}>
          {md ? (
            <PaginationWithLimit
              currentPage={currentPage}
              currentLimit={currentLimit}
              onPageChange={changeCurrentPage}
              onLimitChange={changeCurrentLimit}
              apiMeta={paginationData?.meta}
              flexDirection="row"
              sx={{ gap: '8px !important', px: 2 }}
            />
          ) : (
            <PaginationWithSelect
              currentPage={currentPage}
              onPageChange={changeCurrentPage}
              apiMeta={paginationData?.meta}
              sx={{ px: 2 }}
            />
          )}
          <Box sx={{ width: '1px', height: '24px', bg: 'neutral4' }} />
          <CustomizeColumn hasTitle={lg ? true : md ? false : sm ? true : false} menuSx={{ maxHeight: [200, 400] }} />
        </Flex>
      </Flex>
    </Flex>
  )
}
