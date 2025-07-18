import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { drawerTwapColumns, fullTwapColumns, twapColumns } from 'components/@position/configs/hlTwapRenderProps'
import Divider from 'components/@ui/Divider'
import { HlTwapOrderData } from 'entities/hyperliquid'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { getPaginationDataFromList, getPairFromSymbol } from 'utils/helpers/transform'

import HLOrderTwapListView from './HLOrderTwapListView'
import NoOrderWrapper from './NoOrderWrapper'
import { useOrderTwapContext } from './useOrderTwapContext'

type Props = {
  isExpanded: boolean
  toggleExpand: () => void
  isDrawer: boolean
  isLoading: boolean
  data: HlTwapOrderData[] | undefined
  onPageChange: (page: number) => void
}

export default function OrderTwapWrapper({ isLoading, toggleExpand, data, isExpanded, isDrawer, onPageChange }: Props) {
  const { direction, pairs, excludedPairs, changePairs, sizeRange, sizeInToken, price, fees } = useOrderTwapContext()

  useEffect(() => {
    changePairs([], [])
  }, [isExpanded, changePairs])

  const { hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const { lg, xl, sm } = useResponsive()
  const isInRange = (value: number, range?: { min?: number; max?: number }) => {
    if (range?.min !== undefined && value < range.min) return false
    if (range?.max !== undefined && value > range.max) return false
    return true
  }

  const filteredData = useMemo(() => {
    return data?.filter((v) => {
      if (!isInRange(v.sizeNumber, sizeRange)) return false
      if (!isInRange(v.sizeInTokenNumber, sizeInToken)) return false
      if (!isInRange(v.priceNumber, price)) return false
      if (!isInRange(v.fee, fees)) return false
      if (direction && v.direction !== direction) return false

      if (hasExcludingPairs) {
        return !excludedPairs.map((v) => getPairFromSymbol(v)).includes(v.pair)
      }
      if (pairs?.length) {
        return pairs.map((v) => getPairFromSymbol(v)).includes(v.pair)
      }
      return true
    })
  }, [data, sizeRange, sizeInToken, price, fees, direction, pairs, excludedPairs, hasExcludingPairs])

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

  let tableSettings: ColumnData<HlTwapOrderData>[]
  if (isDrawer) {
    tableSettings = drawerTwapColumns
  } else if (xl && isExpanded) {
    tableSettings = fullTwapColumns
  } else if (width >= 832) {
    tableSettings = drawerTwapColumns
  } else {
    tableSettings = twapColumns
  }

  return (
    <>
      {isLoading && <Loading />}
      {!totalDataLength && !isLoading && (
        <NoOrderWrapper isDrawer={isDrawer}>
          <Type.CaptionBold display="block">
            <Trans>This trader&apos;s TWAP orders is empty</Trans>
          </Type.CaptionBold>
          <Type.Caption height={24} />
        </NoOrderWrapper>
      )}
      {totalDataLength > 0 && (
        <>
          {sm ? (
            <>
              <Box ref={containerRef} flex="1 0 0" overflow="hidden">
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
                  columns={tableSettings}
                  externalSource={{ isExpanded }}
                  isLoading={isLoading}
                  scrollToTopDependencies={scrollDeps}
                  noDataComponent={
                    !dataLength && !isLoading ? (
                      <NoOrderWrapper isDrawer>
                        <Type.CaptionBold display="block">
                          <Trans>No TWAP orders are matched this filter</Trans>
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
                <HLOrderTwapListView data={paginatedData.data} isLoading={isLoading} scrollDep={scrollDeps} />
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
