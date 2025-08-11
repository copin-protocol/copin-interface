import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { drawerOrderColumns, fullOrderColumns, orderColumns } from 'components/@position/configs/hlOrderRenderProps'
import Divider from 'components/@ui/Divider'
import { HlOrderData } from 'entities/hyperliquid'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { getPaginationDataFromList, getPairFromSymbol } from 'utils/helpers/transform'

import HLOpenOrderListView from './HLOpenOrderListView'
import NoOrderWrapper from './NoOrderWrapper'
import { OpenOrderProvider, useOpenOrderContext } from './useOpenOrderContext'

type Props = {
  data: HlOrderData[] | undefined
  isLoading: boolean
  isExpanded: boolean
  isDrawer: boolean
  toggleExpand: (() => void) | undefined
  onPageChange: (page: number) => void
}

export default function OpenOrdersView(props: Props) {
  return (
    <OpenOrderProvider>
      <OpenOrdersWrapper {...props} />
    </OpenOrderProvider>
  )
}

const OpenOrdersWrapper = ({ data, isLoading, isExpanded, toggleExpand, isDrawer, onPageChange }: Props) => {
  const { pairs, excludedPairs, changePairs } = useOpenOrderContext()
  useEffect(() => {
    changePairs([], [])
  }, [isExpanded])
  const { hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const filteredData = useMemo(
    () =>
      data?.filter((v) => {
        if (hasExcludingPairs) {
          return !excludedPairs.map((v) => getPairFromSymbol(v)).includes(v.pair)
        }
        if (pairs?.length) {
          return pairs.map((v) => getPairFromSymbol(v)).includes(v.pair)
        }
        return true
      }),
    [data, excludedPairs, hasExcludingPairs, pairs]
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)
  const [currentSort, setCurrentSort] = useState<TableSortProps<HlOrderData> | undefined>({
    sortBy: 'timestamp',
    sortType: SortTypeEnum.DESC,
  })

  const changeCurrentSort = (sort: TableSortProps<HlOrderData> | undefined) => {
    setCurrentSort(sort)
    setCurrentPage(1)
  }

  const sortedData: HlOrderData[] | undefined = useMemo(() => {
    if (filteredData?.length) {
      const _sortedData = [...filteredData]
      if (_sortedData && _sortedData.length > 0 && !!currentSort) {
        _sortedData.sort((a, b) => {
          const x = a?.[currentSort.sortBy] as any
          const y = b?.[currentSort.sortBy] as any
          if (currentSort.sortType === SortTypeEnum.ASC) {
            return x < y ? -1 : x > y ? 1 : 0
          } else {
            return x < y ? 1 : x > y ? -1 : 0
          }
        })
        return _sortedData
      }
    }
    return filteredData
  }, [currentSort, filteredData])

  const paginatedData = getPaginationDataFromList({ currentPage, limit: currentLimit, data: sortedData })
  // const dataRef = useRef(sortedData)
  // useEffect(() => {
  //   if (dataRef.current !== sortedData) {
  //     setCurrentPage(1)
  //     onPageChange(1)
  //     dataRef.current = sortedData
  //   }
  // }, [sortedData, onPageChange])

  const handleChangePage = useCallback(
    (page: number) => {
      setCurrentPage(page)
      onPageChange(page)
    },
    [onPageChange]
  )
  const totalDataLength = data?.length ?? 0
  const dataLength = filteredData?.length ?? 0

  const scrollDeps = useMemo(() => [currentPage, currentLimit], [currentLimit, currentPage])
  const { lg, xl, sm, md } = useResponsive()

  const [width, setWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.getBoundingClientRect().width
      setWidth(width)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  let tableSettings: ColumnData<HlOrderData>[]
  if (isDrawer) {
    tableSettings = drawerOrderColumns
  } else if (xl && isExpanded) {
    tableSettings = fullOrderColumns
  } else if (width >= 832) {
    tableSettings = drawerOrderColumns
  } else {
    tableSettings = orderColumns
  }

  return (
    <>
      {isLoading && <Loading />}
      {!totalDataLength && !isLoading ? (
        <NoOrderWrapper isDrawer={isDrawer}>
          <Trans>
            <Type.CaptionBold display="block">This trader&apos;s opening orders is empty</Type.CaptionBold>
            <Type.Caption mt={1} color="neutral3" textAlign="center" display="block">
              Once the trader starts a new open order, you&apos;ll see it listed here
            </Type.Caption>
          </Trans>
        </NoOrderWrapper>
      ) : null}
      {totalDataLength > 0 && (
        <>
          {lg ? (
            <>
              <Box ref={containerRef} flex="1 0 0" overflowX="auto" overflowY="hidden">
                <Table
                  restrictHeight={(!isDrawer && lg) || (isDrawer && isDrawer && dataLength > 10)}
                  wrapperSx={{
                    minWidth: 500,
                    minHeight: isDrawer && dataLength > 10 ? 368 : undefined,
                  }}
                  tableBodySx={{
                    '& td:last-child': { pr: 2 },
                  }}
                  data={paginatedData?.data}
                  columns={tableSettings}
                  isLoading={isLoading}
                  // renderRowBackground={() => (isDrawer ? 'transparent' : 'rgb(31, 34, 50)')}
                  scrollToTopDependencies={scrollDeps}
                  externalSource={{ isExpanded }}
                  noDataComponent={
                    !dataLength && !isLoading ? (
                      <NoOrderWrapper isDrawer>
                        <Type.CaptionBold display="block">
                          <Trans>No opening orders are matched this filter</Trans>
                        </Type.CaptionBold>
                      </NoOrderWrapper>
                    ) : undefined
                  }
                  currentSort={currentSort}
                  changeCurrentSort={changeCurrentSort}
                />
              </Box>
              {!isDrawer && (
                <Box sx={{ px: 2 }}>
                  <Divider />
                </Box>
              )}
              {paginatedData.meta?.totalPages > 1 ? (
                <>
                  {!isExpanded && !isDrawer ? (
                    <Flex sx={{ alignItems: 'center', py: 1, px: 3, justifyContent: 'end' }}>
                      <Button variant="text" sx={{ p: 0 }} onClick={toggleExpand}>
                        <Type.Caption>
                          <Trans>View All</Trans>
                        </Type.Caption>
                      </Button>
                    </Flex>
                  ) : (
                    <PaginationWithLimit
                      currentPage={currentPage}
                      currentLimit={currentLimit}
                      onPageChange={handleChangePage}
                      onLimitChange={setCurrentLimit}
                      apiMeta={paginatedData.meta}
                    />
                  )}
                </>
              ) : null}
            </>
          ) : (
            <Flex flexDirection="column" height="100%" flex="1 0 0" overflow="hidden">
              {!!paginatedData?.data?.length && (
                <HLOpenOrderListView data={paginatedData?.data} isLoading={isLoading} scrollDep={scrollDeps} />
              )}
              <PaginationWithLimit
                currentPage={currentPage}
                currentLimit={currentLimit}
                onPageChange={setCurrentPage}
                onLimitChange={setCurrentLimit}
                apiMeta={paginatedData.meta}
              />
            </Flex>
          )}
        </>
      )}
    </>
  )
}
