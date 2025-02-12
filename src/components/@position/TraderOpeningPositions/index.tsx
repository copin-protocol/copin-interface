import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getOpeningPositionsApi } from 'apis/positionApis'
import emptyBg from 'assets/images/opening_empty_bg.png'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import TraderPositionListView from 'components/@position/TraderPositionsListView'
import {
  drawerOpeningColumns,
  fullOpeningColumns,
  openingColumns,
} from 'components/@position/configs/traderPositionRenderProps'
import Divider from 'components/@ui/Divider'
import SectionTitle from 'components/@ui/SectionTitle'
import { PositionData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import Badge from 'theme/Badge'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'

const emptyCss = {
  backgroundImage: `url(${emptyBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}

const emptySmallCss = {
  // backgroundImage: `url(${emptySmallBg})`,
  // backgroundSize: '98%',
  // backgroundPosition: 'center center',
  // backgroundRepeat: 'no-repeat',
  // backgroundOrigin: 'content-box',
}

export default function TraderOpeningPositionsTableView({
  protocol,
  address,
  toggleExpand,
  isExpanded,
  isDrawer,
}: {
  address: string
  protocol: ProtocolEnum
  toggleExpand?: () => void
  isExpanded?: boolean
  isDrawer?: boolean
}) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const { lg, xl, sm } = useResponsive()

  //
  const [currentSortExpanded, setCurrentSortExpanded] = useState<TableSortProps<PositionData> | undefined>({
    sortBy: 'openBlockTime',
    sortType: SortTypeEnum.DESC,
  })
  const currentSort = xl && isExpanded ? currentSortExpanded : undefined
  const changeCurrentSortExpanded = (sort: TableSortProps<PositionData> | undefined) => {
    setCurrentSortExpanded(sort)
  }
  const resetSortOpening = () =>
    setCurrentSortExpanded({
      sortBy: 'openBlockTime',
      sortType: SortTypeEnum.DESC,
    })
  const handleToggleExpand = () => {
    resetSortOpening()
    toggleExpand?.()
  }
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, address, protocol, currentSort],
    () =>
      getOpeningPositionsApi({
        protocol,
        account: address,
        sortBy: currentSort?.sortBy,
        sortType: currentSort?.sortType,
      }),
    {
      enabled: !!address,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
    }
  )
  //

  const tableData = useMemo(() => {
    if (!data) return undefined
    let openingPositions = data
    switch (currentSort?.sortBy) {
      case 'durationInSecond':
        openingPositions = openingPositions.sort((a, b) => {
          return (
            (((a?.[currentSort.sortBy] as number) ?? 0) - ((b?.[currentSort.sortBy] as number) ?? 0)) *
            (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
          )
        })
        break
    }

    return {
      data: openingPositions,
      meta: { limit: openingPositions.length, offset: 0, total: openingPositions.length, totalPages: 1 },
    }
  }, [currentSort, data])

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    if (!!data.txHashes?.length) {
      window.history.pushState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes?.[0] }))
    }
  }

  const handleDismiss = () => {
    window.history.pushState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }
  const scrollToTopDependencies = useMemo(() => {
    return isExpanded ? [currentSort?.sortBy, currentSort?.sortType, address, protocol] : [address, protocol]
  }, [isExpanded, currentSort?.sortBy, currentSort?.sortType, address, protocol])

  const totalOpening = data?.length ?? 0

  return (
    <Box
      className="opening"
      display={['block', 'block', 'block', isDrawer ? 'block' : 'flex']}
      flexDirection="column"
      height="100%"
      sx={{
        backgroundColor: !isDrawer && totalOpening ? 'neutral5' : 'transparent',
        ...(totalOpening || isLoading ? {} : isDrawer ? emptySmallCss : emptyCss),
        pb: [0, 12],
      }}
    >
      <Flex px={2} pt={12} alignItems="center" justifyContent="space-between">
        <SectionTitle
          icon={Pulse}
          title={
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Box as="span">
                <Trans>OPENING POSITIONS</Trans>
              </Box>
              {totalOpening > 0 && <Badge count={totalOpening} />}
            </Flex>
          }
          suffix={
            toggleExpand && (
              <IconBox
                icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
                role="button"
                sx={{
                  width: 32,
                  height: 32,
                  display: ['none', 'none', 'none', 'none', 'flex'],
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 'sm',
                  // border: 'small',
                  // borderColor: 'neutral4',
                  color: 'neutral2',
                  '&:hover': { color: 'neutral1' },
                }}
                onClick={handleToggleExpand}
              />
            )
          }
        />
      </Flex>
      {isLoading && <Loading />}
      {!data?.length && !isLoading && (
        <Flex
          p={3}
          flexDirection="column"
          width="100%"
          height={isDrawer ? 60 : 180}
          justifyContent="center"
          alignItems="center"
        >
          <Type.CaptionBold display="block">This trader’s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" textAlign="center" display="block">
            Once the trader starts a new position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data && data.length > 0 && (
        <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
          {sm ? (
            <Table
              restrictHeight={!isDrawer && lg}
              wrapperSx={{
                minWidth: 500,
              }}
              tableBodySx={{
                '& td:last-child': { pr: 2 },
              }}
              data={tableData?.data}
              columns={isDrawer ? drawerOpeningColumns : xl && isExpanded ? fullOpeningColumns : openingColumns}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSortExpanded}
              isLoading={isLoading}
              onClickRow={handleSelectItem}
              renderRowBackground={() => (isDrawer ? 'transparent' : 'rgb(31, 34, 50)')}
              scrollToTopDependencies={scrollToTopDependencies}
            />
          ) : (
            <TraderPositionListView
              data={tableData?.data}
              isLoading={isLoading}
              scrollDep={tableData?.meta?.offset}
              onClickItem={handleSelectItem}
              hasAccountAddress={false}
            />
          )}
        </Box>
      )}
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={protocol}
        id={currentPosition?.id}
        chartProfitId="opening-position-detail"
      />
    </Box>
  )
}

export type TraderOpeningPositionsListViewProps = {
  address: string
  protocol: ProtocolEnum
  isExpanded?: boolean
  isDrawer?: boolean
  onNoPositionLoaded?: () => void
}
export function TraderOpeningPositionsListView({
  protocol,
  address,
  isDrawer,
  onNoPositionLoaded,
}: TraderOpeningPositionsListViewProps) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const { currentPage, currentLimit, changeCurrentLimit, changeCurrentPage } = usePageChangeWithLimit({
    pageName: 'opening_page',
    limitName: 'opening_limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_POSITIONS_OPEN, address, protocol],
    () =>
      getOpeningPositionsApi({
        protocol,
        account: address,
      }),
    {
      enabled: !!address,
      retry: 0,
      refetchInterval: 15_000,
      keepPreviousData: true,
      onSuccess(data) {
        if (!data?.length) onNoPositionLoaded?.()
      },
    }
  )
  //
  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    if (!!data.txHashes?.length) {
      window.history.pushState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes?.[0] }))
    }
  }

  const handleDismiss = () => {
    window.history.pushState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }
  const scrollToTopDependencies = useMemo(() => {
    return [address, protocol, currentPage, currentLimit]
  }, [address, protocol, currentPage, currentLimit])

  const offset = pageToOffset(currentPage, currentLimit)
  const pagingData = data?.slice(offset, offset + currentLimit)
  const total = data?.length ?? 0
  const totalPages = Math.ceil((data?.length ?? 0) / currentLimit)

  const totalOpening = data?.length ?? 0

  return (
    <Flex
      flexDirection="column"
      height="100%"
      width="100%"
      sx={{
        backgroundColor: !isDrawer && totalOpening ? 'neutral5' : 'neutral7',
        ...(totalOpening || isLoading ? {} : isDrawer ? emptySmallCss : emptyCss),
        pb: [0, 12],
      }}
    >
      {isLoading && <Loading />}
      {!data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">This trader’s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once the trader starts a new position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data && data.length > 0 && (
        <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
          <TraderPositionListView
            data={pagingData}
            isLoading={isLoading}
            scrollDep={scrollToTopDependencies}
            onClickItem={handleSelectItem}
            hasAccountAddress={false}
          />
        </Box>
      )}
      {!isDrawer && <Divider />}
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={changeCurrentPage}
        onLimitChange={changeCurrentLimit}
        apiMeta={{ limit: currentLimit, offset, total, totalPages }}
      />

      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={protocol}
        id={currentPosition?.id}
        chartProfitId="opening-position-detail"
      />
    </Flex>
  )
}
