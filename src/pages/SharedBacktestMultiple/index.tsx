import { useState } from 'react'

import SettingTags from 'components/@backtest/BacktestMultipleModal/SettingTags'
import {
  TableResultData,
  multipleBacktestResultColumns,
  tableStyles,
} from 'components/@backtest/BacktestMultipleResultTable'
import { AccountInfo } from 'components/@ui/AccountInfo'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest'
import useGetSharedBacktest from 'hooks/features/backtest/useGetSharedBacktest'
import { useBacktestCustomizeColumn } from 'hooks/store/useBacktestCustomizeColumns'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { getPaginationDataFromList } from 'utils/helpers/transform'

export default function SharedBacktestMultiplePage() {
  const {
    sharedBacktestSetting,
    isLoadingSharedSetting,
    getSharedBacktestSettingError,
    sharedBacktestResult,
    isLoadingSharedResult,
    getSharedBacktestResultError,
    protocol,
  } = useGetSharedBacktest({ key: 'multiple' })

  if (isLoadingSharedSetting || isLoadingSharedResult)
    return (
      <Box p={3} pt={5}>
        <Loading />
      </Box>
    )
  const error = getSharedBacktestSettingError || getSharedBacktestResultError
  if (error)
    return (
      <Box p={3} pt={5}>
        <Type.Body display="block" textAlign="center" fontWeight={700}>
          Something went wrong. Please come back later
        </Type.Body>
      </Box>
    )

  if (!sharedBacktestSetting || !sharedBacktestResult) return <></>

  const settings = sharedBacktestSetting.query.setting
  const sort = sharedBacktestSetting.query.sort

  const tableColumns: typeof multipleBacktestResultColumns = [
    {
      title: 'WALLET ADDRESS',
      dataIndex: 'account',
      key: 'account',
      style: { minWidth: '150px' },
      render: (item) => {
        const { account = '' } = item
        return (
          <Box color="neutral1">
            <AccountInfo isOpenPosition={false} address={account} protocol={protocol} />
          </Box>
        )
      },
    },
    ...multipleBacktestResultColumns.slice(1, multipleBacktestResultColumns.length - 1),
    {
      title: '',
      dataIndex: undefined,
      key: undefined,
      style: { minWidth: '40px' },
    },
  ]

  return (
    <SafeComponentWrapper>
      <CustomPageTitle title={`Backtesting ${settings.accounts.length} traders`} />
      <Box bg="neutral5" width="100%" height="100%">
        <Flex pt={3} height="100%" flexDirection="column" maxWidth={1920} mx="auto">
          <Type.H5 sx={{ px: 3, mb: 3 }}>Multiple Backtesting</Type.H5>
          <Box p={2} px={3}>
            <SettingTags protocol={protocol} settings={settings} wrappedItems />
          </Box>
          <Box flex="1 0 0" overflow="hidden" pr={'6px'}>
            <ResultTable
              results={sharedBacktestResult}
              settings={settings}
              tableSettings={tableColumns}
              defaultSort={sort}
            />
          </Box>
        </Flex>
      </Box>
    </SafeComponentWrapper>
  )
}

function ResultTable({
  results,
  settings,
  tableSettings,
  defaultSort,
}: {
  results: BackTestResultData[]
  settings: RequestBackTestData | null
  tableSettings: ColumnData<TableResultData, RequestBackTestData>[]
  defaultSort: TableSortProps<TableResultData> | undefined
}) {
  const tableData: TableResultData[] = results
    // .filter((result) => {
    //   return !!tradersMapping[result.account ?? '']
    // })
    .map((result) => {
      const { profit = 0 } = result
      const balance = (settings?.balance ?? 0) + profit
      return {
        balance,
        ...result,
        traderData: undefined,
      }
    })
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSort, setCurrentSort] = useState<TableSortProps<TableResultData> | undefined>(defaultSort)
  const changeCurrentSort = (sort: TableSortProps<TableResultData> | undefined) => {
    setCurrentSort(sort)
    setCurrentPage(1)
  }
  let sortedData: typeof tableData | undefined = undefined
  if (tableData) {
    sortedData = structuredClone(tableData) as typeof tableData
    if (!!currentSort) {
      sortedData.sort((a, b) => {
        return (
          (((a?.[currentSort.sortBy] as number) ?? 0) - ((b?.[currentSort.sortBy] as number) ?? 0)) *
          (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
        )
      })
    }
  }
  const paginationData = getPaginationDataFromList({ currentPage, limit: DEFAULT_LIMIT, data: sortedData })

  const { visibleColumns, toggleVisibleColumn } = useBacktestCustomizeColumn(
    tableSettings.filter((columnData) => !!columnData.key).map((columnData) => columnData.key as keyof TableResultData)
  )
  if (!settings) return null
  return (
    <Flex
      pb={[2, 0]}
      pt={2}
      sx={{ width: '100%', height: '100%', flexDirection: 'column' }}
      className="backtest_result_container"
    >
      <Box flex="1 1 0">
        <Box sx={{ width: '100%', height: '100%' }}>
          <Table
            restrictHeight
            data={paginationData.data}
            isLoading={false}
            columns={tableSettings}
            externalSource={settings}
            containerSx={tableStyles.containerSx}
            wrapperSx={tableStyles.wrapperSx}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            visibleColumns={visibleColumns}
            handleToggleVisibleColumn={toggleVisibleColumn}
            tableBodySx={{ pr: 2 }}
          />
        </Box>
      </Box>

      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Flex sx={{ alignItems: 'center', gap: 3, px: [2, 3] }}>
          {paginationData.meta.totalPages > 1 && (
            <PaginationWithSelect
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              apiMeta={paginationData.meta}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
