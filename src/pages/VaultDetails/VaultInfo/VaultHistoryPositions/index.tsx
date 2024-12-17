import { useResponsive } from 'ahooks'
import { memo, useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { ApiMeta } from 'apis/api'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import TraderPositionListView from 'components/@position/TraderPositionsListView'
import NoDataFound from 'components/@ui/NoDataFound'
import { PositionData } from 'entities/trader'
import useInfiniteLoadMore from 'hooks/features/useInfiniteLoadMore'
import useSearchParams from 'hooks/router/useSearchParams'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

export interface HistoryTableProps {
  data: PositionData[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  fetchNextPage?: () => void
  hasNextPage?: boolean | undefined
  tableSettings: ColumnData<PositionData>[]
  currentSort?: TableSortProps<PositionData> | undefined
  changeCurrentSort?: (sort: TableSortProps<PositionData> | undefined) => void
}

export default function VaultHistoryPositions(props: HistoryTableProps) {
  const { data, isLoading } = props
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const history = useHistory()
  const { searchParams } = useSearchParams()
  const nextHoursParam = useMemo(
    () =>
      searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS]
        ? Number(searchParams?.[URL_PARAM_KEYS.WHAT_IF_NEXT_HOURS] as string)
        : undefined,
    [searchParams]
  )

  const handleSelectItem = useCallback(
    (data: PositionData) => {
      setCurrentPosition(data)
      setOpenDrawer(true)
      window.history.replaceState(
        null,
        '',
        generatePositionDetailsRoute({
          protocol: data.protocol,
          txHash: data.txHashes[0],
          account: data.account,
          logId: data.logId,
          nextHours: nextHoursParam,
        })
      )
    },
    [nextHoursParam]
  )

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const { sm } = useResponsive()

  return (
    <Box display={['block', 'block', 'block', 'flex']} flexDirection="column" height={['auto', 'auto', 'auto', '100%']}>
      {!isLoading && !data?.length && !sm && <NoDataFound message="No positions history" />}
      <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
        <PositionsList {...props} handleSelectItem={handleSelectItem} showChart={false} />
      </Box>

      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="close-position-detail"
      />
    </Box>
  )
}

const PositionsList = memo(function PositionsListMemo({
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  tableSettings,
  currentSort,
  changeCurrentSort,
  dataMeta,
  showChart,
  handleSelectItem,
}: HistoryTableProps & { showChart: boolean; handleSelectItem: (data: PositionData) => void }) {
  const { sm, lg } = useResponsive()
  const { scrollRef } = useInfiniteLoadMore({ isDesktop: lg, hasNextPage, fetchNextPage, isLoading })
  return sm ? (
    <Table
      scrollRef={scrollRef}
      wrapperSx={{
        minWidth: 500,
      }}
      isInfiniteLoad
      dataMeta={dataMeta}
      currentSort={currentSort}
      changeCurrentSort={changeCurrentSort}
      restrictHeight={lg}
      data={data}
      columns={tableSettings}
      isLoading={isLoading}
      onClickRow={handleSelectItem}
    />
  ) : (
    <>
      <TraderPositionListView
        data={data}
        isLoading={false}
        scrollDep={data}
        onClickItem={handleSelectItem}
        hasAccountAddress={false}
        isOpening={false}
      />
      {isLoading && <Loading />}
      {data && !isLoading && (dataMeta?.total ?? 0) === data.length && (
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            bg: 'neutral6',
            height: 40,
          }}
        >
          <Type.Caption color="neutral3">End of list</Type.Caption>
        </Flex>
      )}
    </>
  )
})
