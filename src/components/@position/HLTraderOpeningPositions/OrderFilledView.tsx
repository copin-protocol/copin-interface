import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { drawerFillColumns, fillColumns, fullFillColumns } from 'components/@position/configs/hlFillRenderProps'
import Divider from 'components/@ui/Divider'
import { GroupedFillsData } from 'entities/hyperliquid'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { getPaginationDataFromList, getPairFromSymbol } from 'utils/helpers/transform'

import HLOrderFilledListView from './HLOrderFilledListView'
import NoOrderWrapper from './NoOrderWrapper'
import { OrderFilledProvider, useOrderFilledContext } from './useOrderFilledContext'

export enum HLPositionTab {
  OPEN_POSITIONS = 'open_position',
  OPEN_ORDERS = 'open_order',
  ORDER_FILLED = 'order_filled',
}

type Props = {
  isExpanded: boolean
  toggleExpand: () => void
  isDrawer: boolean
  isLoading: boolean
  data: GroupedFillsData[] | undefined
  onPageChange: (page: number) => void
}

export default function OrderFilledView(props: Props) {
  return (
    <OrderFilledProvider>
      <OrderFilledWrapper {...props} />
    </OrderFilledProvider>
  )
}

const OrderFilledWrapper = ({ isLoading, toggleExpand, data, isExpanded, isDrawer, onPageChange }: Props) => {
  const { pairs, excludedPairs, changePairs } = useOrderFilledContext()
  useEffect(() => {
    changePairs([], [])
  }, [isExpanded])
  const { hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const { lg, xl, sm } = useResponsive()
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
  const paginatedData = getPaginationDataFromList({ currentPage, limit: currentLimit, data: filteredData })
  const dataRef = useRef(filteredData)
  useEffect(() => {
    if (dataRef.current !== filteredData) {
      setCurrentPage(1)
      onPageChange(1)
      dataRef.current = filteredData
    }
  }, [filteredData, onPageChange])

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

  return (
    <>
      {isLoading && <Loading />}
      {!totalDataLength && !isLoading && (
        <NoOrderWrapper isDrawer={isDrawer}>
          <Type.CaptionBold display="block">
            <Trans>This trader&apos;s orders filled is empty</Trans>
          </Type.CaptionBold>
          <Type.Caption height={24} />
        </NoOrderWrapper>
      )}
      {totalDataLength > 0 && (
        <>
          {sm ? (
            <>
              <Box flex="1 0 0" overflow="hidden">
                <Table
                  restrictHeight={(!isDrawer && lg) || (isDrawer && isDrawer && dataLength > 10)}
                  wrapperSx={{
                    minWidth: 500,
                    minHeight: isDrawer && dataLength > 10 ? 368 : undefined,
                  }}
                  tableBodySx={{
                    '& td:last-child': { pr: 2 },
                  }}
                  data={paginatedData.data}
                  columns={isDrawer ? drawerFillColumns : xl && isExpanded ? fullFillColumns : fillColumns}
                  isLoading={isLoading}
                  // renderRowBackground={() => (isDrawer ? 'transparent' : 'rgb(31, 34, 50)')}
                  scrollToTopDependencies={scrollDeps}
                  noDataComponent={
                    !dataLength && !isLoading ? (
                      <NoOrderWrapper isDrawer>
                        <Type.CaptionBold display="block">
                          <Trans>No orders filled are matched this filter</Trans>
                        </Type.CaptionBold>
                      </NoOrderWrapper>
                    ) : undefined
                  }
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
                <HLOrderFilledListView data={paginatedData.data} isLoading={isLoading} scrollDep={scrollDeps} />
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
