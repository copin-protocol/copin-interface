import React, { useState } from 'react'

import { TraderTokenStatistic } from 'entities/trader'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SortTypeEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair, parseMarketImage } from 'utils/helpers/transform'

type MarketListProps = {
  data: TraderTokenStatistic[] | undefined
  isExpanded: boolean
  currentPair: string | undefined
  changePair: (symbol: string) => void
}

const tableColumns: ColumnData<TraderTokenStatistic, { maxVolume: number }>[] = [
  {
    title: 'Market',
    dataIndex: 'indexToken',
    key: 'indexToken',
    style: { minWidth: '120px', width: '120px' },
    render: (item) => {
      if (!item.pair) return <></>
      const symbol = getSymbolFromPair(item.pair, true)
      const icon = parseMarketImage(symbol)

      return (
        <Flex
          role="button"
          sx={{
            alignItems: 'center',
            gap: 2,
            '& > *': { flexShrink: 0 },
          }}
        >
          <Image src={icon} sx={{ width: 24, height: 24, borderRadius: '50%' }} alt={symbol} />
          <Type.Caption color="neutral1">{symbol}</Type.Caption>
        </Flex>
      )
    },
  },
  {
    title: 'Volume',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    sortBy: 'totalVolume',
    style: { minWidth: '100px', textAlign: 'left' },
    render: (item, _, { maxVolume }: any) => {
      return (
        <Box width="100%" sx={{ position: 'relative' }} p={2}>
          <Box
            width={`${(item.totalVolume / maxVolume) * 100}%`}
            bg={`${themeColors.primary2}20`}
            sx={{ position: 'absolute', top: 0, left: 0, bottom: 0 }}
          />
          <Type.Caption color="primary1">
            {item.totalVolume ? `$${formatNumber(item.totalVolume, 0, 0)}` : '--'}
          </Type.Caption>
        </Box>
      )
    },
  },
  {
    title: 'Trades',
    dataIndex: 'totalTrade',
    key: 'totalTrade',
    sortBy: 'totalTrade',
    style: { minWidth: '50px', textAlign: 'right' },
    render: (item) => {
      return <Type.Caption color="neutral1">{formatNumber(item.totalTrade, 0)}</Type.Caption>
    },
  },
]

const MarketDistribution = ({ data, currentPair, isExpanded, changePair }: MarketListProps) => {
  const [currentSort, setCurrentSort] = useState<TableSortProps<TraderTokenStatistic> | undefined>(() => {
    const initSortBy = 'totalVolume'
    const initSortType = SortTypeEnum.DESC
    return {
      sortBy: initSortBy as TableSortProps<TraderTokenStatistic>['sortBy'],
      sortType: initSortType as SortTypeEnum,
    }
  })
  const displayedData = [...(data || [])].sort((a, b) => {
    //@ts-ignore
    const valueA = a[currentSort?.sortBy || '']
    //@ts-ignore
    const valueB = b[currentSort?.sortBy || '']
    if (typeof valueA !== 'number' || typeof valueB !== 'number') return 0
    return (valueA - valueB) * (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
  })

  if (!data?.length) return <></>
  return (
    <Table
      wrapperSx={{
        pr: 0,
        table: {
          '& th:first-child, td:first-child': {
            pl: 2,
          },
          '& th:last-child, td:last-child': {
            pr: 2,
          },
          '& td': {
            py: 1,
          },
        },
      }}
      data={displayedData}
      columns={tableColumns}
      isLoading={false}
      renderRowBackground={(data) =>
        currentPair && data.pair === currentPair && isExpanded ? themeColors.neutral5 : 'transparent'
      }
      restrictHeight
      onClickRow={(data) => changePair(data.pair)}
      currentSort={currentSort}
      changeCurrentSort={setCurrentSort}
      externalSource={{ maxVolume: displayedData.reduce((acc, item) => Math.max(acc, item.totalVolume), 0) }}
    />
  )
}

export default MarketDistribution
