import debounce from 'lodash/debounce'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import PickTradersButton from 'components/@backtest/BacktestPickTradersButton'
import { AccountCell } from 'components/@trader/TraderExplorerTableView/AccountCell'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest.d'
import { TraderData } from 'entities/trader'
import { useBacktestCustomizeColumn } from 'hooks/store/useBacktestCustomizeColumns'
import useMyProfile from 'hooks/store/useMyProfile'
import { TestInstanceData, useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import CopyButton from 'theme/Buttons/CopyButton'
import ArrowUpRightIcon from 'theme/Icons/ArrowUpRightIcon'
import { PaginationWithSelect } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DEFAULT_LIMIT, DEFAULT_PROTOCOL } from 'utils/config/constants'
import { CopyTradeOrderTypeEnum, SortTypeEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { getPaginationDataFromList } from 'utils/helpers/transform'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { stringifyRequestData } from '../helpers'

export type TableResultData = BackTestResultData & {
  balance: number
  totalTrade: number
  // rawData: BackTestResultData
  traderData: TraderData | undefined
}

type MultipleBackTestResultTableProps = {
  tradersMapping: Record<string, TraderData>
  instanceData: TestInstanceData
  results: BackTestResultData[]
  settings: RequestBackTestData | null
  tableSettings?: ColumnData<TableResultData, RequestBackTestData>[]
  currentSort: TableSortProps<TableResultData> | undefined
  setCurrentSort: Dispatch<SetStateAction<TableSortProps<TableResultData> | undefined>>
}

export default function BacktestMultipleResultTable({
  instanceData,
  results,
  settings,
  tradersMapping,
  tableSettings = multipleBacktestResultColumns,
  currentSort,
  setCurrentSort,
}: MultipleBackTestResultTableProps) {
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
        traderData: tradersMapping?.[result.account ?? ''],
      }
    })

  return (
    <>
      {/* <TableLabel my={3} sx={{ fontSize: '24px', lineHeight: '24px' }}>
        Result
      </TableLabel> */}
      <ResultTable
        key={instanceData.id}
        result={tableData}
        settings={settings}
        instanceId={instanceData.id}
        homeId={instanceData.homeId}
        tableSettings={tableSettings}
        currentSort={currentSort}
        setCurrentSort={setCurrentSort}
      />
    </>
  )
}

function ResultTable({
  result,
  instanceId,
  homeId,
  settings,
  tableSettings,
  currentSort,
  setCurrentSort,
}: {
  result: TableResultData[]
  instanceId: string
  homeId: string
  settings: RequestBackTestData | null
  tableSettings: ColumnData<TableResultData, RequestBackTestData>[]
  currentSort: MultipleBackTestResultTableProps['currentSort']
  setCurrentSort: MultipleBackTestResultTableProps['setCurrentSort']
}) {
  const { myProfile } = useMyProfile()
  const [selectedTraders, setSelectedTraders] = useState<TraderData['account'][]>([])
  const { addInstance } = useSelectBacktestTraders()
  const checkIsSelected = (data: TableResultData) => selectedTraders.includes(data.account)
  const handleSelect = useCallback(
    debounce(({ isSelected, data }: { isSelected: boolean; data: TableResultData }) => {
      const { account = '' } = data
      if (isSelected) {
        setSelectedTraders((prev) => prev.filter((trader) => trader !== account))
        return
      }
      setSelectedTraders((prev) => [...prev, account])
    }, 100),
    []
  )

  const [currentPage, setCurrentPage] = useState(1)
  const changeCurrentSort = (sort: TableSortProps<TableResultData> | undefined) => {
    setCurrentSort(sort)
    setCurrentPage(1)
  }
  let sortedData: typeof result | undefined = undefined
  if (result) {
    sortedData = structuredClone(result) as typeof result
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
  const handleContinueBacktest = useCallback(
    debounce(() => {
      const id = uuidv4()
      addInstance({
        id,
        parentId: instanceId,
        listTrader: selectedTraders,
        settings: null,
        stage: 'setting',
        isVisible: true,
        homeId,
        childIds: [],
        backtestResult: [],
      })

      logEvent({
        label: getUserForTracking(myProfile?.username),
        category: EventCategory.BACK_TEST,
        action: EVENT_ACTIONS[EventCategory.BACK_TEST].CONTINUE_MULTIPLE,
      })
    }, 100),
    [selectedTraders, homeId]
  )

  const paginationAddresses = paginationData.data.map((data) => data.account)
  const isSelectedAll = paginationAddresses.every((address) => selectedTraders.includes(address))
  const handleSelectAll = () => {
    if (isSelectedAll) {
      setSelectedTraders((prev) => prev.filter((address) => !paginationAddresses.includes(address)))
    } else {
      setSelectedTraders((prev) => [...prev, ...paginationAddresses])
    }
  }

  const { visibleColumns, toggleVisibleColumn } = useBacktestCustomizeColumn(
    tableSettings.filter((columnData) => !!columnData.key).map((columnData) => columnData.key as keyof TableResultData)
  )
  if (!settings) return null
  return (
    <Flex
      pb={[2, 0]}
      pt={2}
      sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}
      className="backtest_result_container"
    >
      <Box flex="1 1 0" sx={{ overflow: 'hidden' }} className="result_table">
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
            isSelectedAll={isSelectedAll}
            handleSelectAll={handleSelectAll}
            checkIsSelected={checkIsSelected}
            handleSelect={handleSelect}
            visibleColumns={visibleColumns}
            handleToggleVisibleColumn={toggleVisibleColumn}
          />
        </Box>
      </Box>

      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ width: ['100%', '100%', 228], height: 40, flexShrink: 0 }}>
          <PickTradersButton listAddress={selectedTraders} handleClick={handleContinueBacktest} type="backtest" />
        </Box>
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

      <Tooltip id="backtest-result-new-tab" place="top" type="dark" effect="solid">
        <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
          Open backtest result detail in new tab
        </Type.Caption>
      </Tooltip>
    </Flex>
  )
}

export const tableStyles = {
  containerSx: {
    alignItems: 'flex-start',
  },
  wrapperSx: {
    flex: '1 0 0',
    pr: 16,
    mr: -48,
    overflowX: 'scroll',
    height: '100%',
    '& tbody, thead': {
      width: 'auto',
    },
    '& tbody td': {
      py: '0 !important',
      color: 'neutral1',
      '.hiding-btn': { opacity: 0 },
    },
  },
}

export const multipleBacktestResultColumns: ColumnData<TableResultData, RequestBackTestData>[] = [
  {
    title: 'WALLET ADDRESS',
    dataIndex: 'account',
    key: 'account',
    style: { minWidth: '150px' },
    render: (item) => {
      if (!item.traderData) return
      const { account = '', protocol = DEFAULT_PROTOCOL } = item
      return (
        <Box color="neutral1">
          <AccountCell
            data={item.traderData}
            additionalComponent={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <CopyButton
                  type="button"
                  variant="ghost"
                  value={account}
                  size="sm"
                  sx={{ color: 'neutral3', p: 0 }}
                  iconSize={14}
                ></CopyButton>
                <FavoriteButton address={account} protocol={protocol} size={16} />
              </Flex>
            }
          />
        </Box>
      )
    },
  },
  {
    title: 'MY BALANCE',
    dataIndex: 'balance',
    key: 'balance',
    sortBy: 'balance',
    style: { minWidth: '130px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.balance} maxDigit={2} fontInherit suffix="$" />
        </Type.Caption>
      )
    },
  },
  {
    title: 'PNL',
    dataIndex: 'profit',
    key: 'profit',
    sortBy: 'profit',
    style: { minWidth: '120px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.profit} maxDigit={2} suffix="$" fontInherit />
        </Type.Caption>
      )
    },
  },
  {
    title: 'AVG ROI',
    dataIndex: 'roi',
    key: 'roi',
    sortBy: 'roi',
    style: { minWidth: '120px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.roi} maxDigit={2} suffix="%" fontInherit />
        </Type.Caption>
      )
    },
  },
  {
    title: 'MAX ROI',
    dataIndex: 'maxRoi',
    key: 'maxRoi',
    sortBy: 'maxRoi',
    style: { minWidth: '120px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.maxRoi} maxDigit={2} suffix="%" fontInherit />
        </Type.Caption>
      )
    },
  },
  {
    title: 'WIN RATE',
    dataIndex: 'winRate',
    key: 'winRate',
    sortBy: 'winRate',
    style: { minWidth: '110px', textAlign: 'right' },
    render: (item) => {
      return (
        <Flex sx={{ gap: '1ch', width: '100%', justifyContent: 'end', color: 'neutral1' }}>
          <Type.Caption>{item.winRate ? `${formatNumber(item.winRate)}%` : '--'}</Type.Caption>
        </Flex>
      )
    },
  },
  {
    title: 'TOTAL TRADE',
    dataIndex: 'totalTrade',
    key: 'totalTrade',
    sortBy: 'totalTrade',
    style: { minWidth: '130px', textAlign: 'right' },
    render: (item) => {
      return (
        <Flex sx={{ gap: '1ch', width: '100%', justifyContent: 'end', color: 'neutral1' }}>
          <Type.Caption>{item.totalTrade}</Type.Caption>
        </Flex>
      )
    },
  },
  {
    title: 'PROFIT FACTOR',
    dataIndex: 'gainLossRatio',
    key: 'gainLossRatio',
    sortBy: 'gainLossRatio',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.gainLossRatio} maxDigit={2} fontInherit />
        </Type.Caption>
      )
    },
  },
  {
    title: 'PNL RATIO',
    dataIndex: 'profitLossRatio',
    key: 'profitLossRatio',
    sortBy: 'profitLossRatio',
    style: { minWidth: '110px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.profitLossRatio} maxDigit={2} fontInherit />
        </Type.Caption>
      )
    },
  },
  {
    title: 'MAX DRAW DOWN',
    dataIndex: 'maxDrawDown',
    key: 'maxDrawDown',
    sortBy: 'maxDrawDown',
    style: { minWidth: '160px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.maxDrawDown} maxDigit={2} fontInherit suffix="%" />
        </Type.Caption>
      )
    },
  },
  {
    title: 'MAX DRAW UP',
    dataIndex: 'maxDrawUp',
    key: 'maxDrawUp',
    sortBy: 'maxDrawUp',
    style: { minWidth: '140px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.maxDrawUp} maxDigit={2} fontInherit suffix="%" />
        </Type.Caption>
      )
    },
  },
  {
    title: 'MAX VOL MULTIPLIER',
    dataIndex: 'maxVolMultiplier',
    key: 'maxVolMultiplier',
    sortBy: 'maxVolMultiplier',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => {
      return (
        <Flex sx={{ gap: '1ch', width: '100%', justifyContent: 'end', color: 'neutral1' }}>
          <Type.Caption>{formatNumber(item.maxVolMultiplier, 1, 1)}x</Type.Caption>
        </Flex>
      )
    },
  },
  {
    title: 'ROI / MDD',
    dataIndex: 'roiWMaxDrawDownRatio',
    key: 'roiWMaxDrawDownRatio',
    sortBy: 'roiWMaxDrawDownRatio',
    style: { minWidth: '120px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption display="block" textAlign="right">
          <SignedText value={item.roiWMaxDrawDownRatio} maxDigit={2} fontInherit />
        </Type.Caption>
      )
    },
  },
  {
    title: '',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: '60px', textAlign: 'right' },
    render: (item, index, settings) => {
      if (!settings) return <></>
      const backtestQuery = Object.entries(
        stringifyRequestData(
          {
            ...settings,
            accounts: [item.account],
            testingType: CopyTradeOrderTypeEnum.FULL_ORDER,
          },
          item.protocol
        )
      ).reduce((result, [key, value]) => {
        if (!value) return result
        return result + `&${key}=${encodeURIComponent(value)}`
      }, '')
      const link = `${generateTraderMultiExchangeRoute({ protocol: item.protocol, address: item.account })}?${
        URL_PARAM_KEYS.BACKTEST_DATA
      }=1${backtestQuery}&${URL_PARAM_KEYS.OPEN_BACKTEST_MODAL}=1`
      return (
        <Flex as={Link} to={link} target="_blank" sx={{ width: '100%', justifyContent: 'right', pr: 3 }}>
          <IconBox
            color="neutral1"
            icon={<ArrowUpRightIcon size={24} />}
            sx={{ cursor: 'pointer', textAlign: 'right' }}
            data-tooltip-id="backtest-result-new-tab"
          />
        </Flex>
      )
    },
  },
]
