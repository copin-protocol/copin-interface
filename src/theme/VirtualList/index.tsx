import { ArrowLineUp } from '@phosphor-icons/react'
import debounce from 'lodash/debounce'
import React, { Key, ReactNode, cloneElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VariableSizeList as List, ListOnScrollProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { v4 as uuidv4 } from 'uuid'

import { ApiMeta } from 'apis/api'
import NoDataFound from 'components/@ui/NoDataFound'
import Loading from 'theme/Loading'
import { TableHeadItem } from 'theme/Table/TableHead'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SortTypeEnum } from 'utils/config/enums'

type Props<T> = {
  data: T[] | undefined
  isLoading: boolean
  columns: ColumnData<T>[]
  columnTooltipIdFn?: (column: ColumnData<T>) => string
  dataMeta?: ApiMeta
  fetchNextPage?: () => void
  hasNextPage?: boolean | undefined
  currentSort?: TableSortProps<T> | undefined
  changeCurrentSort?: ((sort: TableSortProps<T> | undefined) => void) | undefined
  handleSelectItem?: (data: T) => void
  rowSx?: any
  rowBgFactory?: (index: number) => string | undefined
  headerSx?: any
  resizeDeps?: any[]
  hiddenFooter?: boolean
  isLoadingFooter?: boolean
  onScroll?: (props: { scrollOffset: number }) => void
  hiddenScrollToTopButton?: boolean
  scrollWhenDataChange?: boolean
  footerBg?: string
  footerWidget?: ReactNode
  availableColumns?: string[]
  renderHeaderAdditionIcon?: (column: ColumnData<T>) => ReactNode
  scrollWrapperRef?: React.RefObject<HTMLDivElement>
}

const VirtualList = memo<Props<any>>(function VirtualListMemo<T = any>({
  scrollWhenDataChange = false,
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  columns,
  currentSort,
  changeCurrentSort,
  dataMeta,
  handleSelectItem,
  rowSx,
  headerSx,
  rowBgFactory,
  resizeDeps,
  hiddenFooter = false,
  isLoadingFooter,
  onScroll,
  hiddenScrollToTopButton = true,
  footerBg,
  footerWidget,
  availableColumns,
  columnTooltipIdFn,
  renderHeaderAdditionIcon,
  scrollWrapperRef,
}: Props<T>) {
  const Row = useCallback(
    ({ data, index, style }: { data: T[]; index: number; style: any }) => {
      const cellData = data[index] as any
      return (
        <Flex
          className="row_wrapper"
          data-virtual-list-id={cellData?.id}
          key={cellData?.id}
          role={handleSelectItem ? 'button' : 'none'}
          style={style}
          width="100%"
          sx={{
            height: '100%',
            alignItems: 'center',
            '&:hover': { background: themeColors.neutral5 },
            pl: 2,
            background: rowBgFactory?.(index),
            ...(rowSx ?? {}),
          }}
          onClick={() => handleSelectItem?.(cellData)}
        >
          {columns.map((cellSetting, _index) => {
            const isAvailable = availableColumns ? availableColumns?.includes(cellSetting.key as string) : true
            const tooltipId = columnTooltipIdFn?.(cellSetting) ?? ''
            const className = tooltipId
            return cellData ? (
              <Type.Caption
                key={cellData.id + _index}
                sx={{
                  filter: isAvailable ? 'none' : 'blur(6px)',
                  width: '100%',
                  userSelect: isAvailable ? 'inherit' : 'none',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  ...(cellSetting.style ?? {}),
                }}
                data-table-cell-key={cellSetting.key}
                data-table-cell-row-index={index}
              >
                {cellSetting.render?.(cellData)}
                {!isAvailable && (
                  <Box
                    className={className}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                      cursor: 'not-allowed',
                    }}
                    onClick={(e) => !isAvailable && e.stopPropagation()}
                  />
                )}
              </Type.Caption>
            ) : (
              <Box key={_index}></Box>
            )
          })}
        </Flex>
      )
    },
    [columns, handleSelectItem, rowBgFactory, rowSx]
  )

  const handleChangeSort = useCallback(
    (
      columnSortBy: TableSortProps<T>['sortBy'] | undefined,
      columnSortType: TableSortProps<T>['sortType'] | undefined,
      currentSortBy: TableSortProps<T>['sortBy'] | undefined,
      currentSortType: TableSortProps<T>['sortType'] | undefined
    ) => {
      if (!changeCurrentSort) return
      const isCurrentSort = !!currentSortBy && currentSortBy === columnSortBy
      if (!columnSortBy) return
      const theFirstSort = columnSortType ?? SortTypeEnum.DESC
      const theSecondSort = theFirstSort === SortTypeEnum.DESC ? SortTypeEnum.ASC : SortTypeEnum.DESC
      if (!isCurrentSort) {
        changeCurrentSort({
          sortBy: columnSortBy,
          sortType: theFirstSort,
        })
      }
      if (isCurrentSort && currentSortType === theFirstSort) {
        changeCurrentSort({
          sortBy: columnSortBy,
          sortType: theSecondSort,
        })
      }
      if (isCurrentSort && currentSortType === theSecondSort) {
        changeCurrentSort(undefined)
      }
    },
    [changeCurrentSort]
  )
  const header = useMemo(() => {
    return (
      <Flex
        width="100%"
        className="row_header_wrapper"
        color="neutral3"
        // pr 6px for offset scrollbar
        sx={{
          alignItems: 'center',
          py: '6px',
          pr: '6px',
          pl: 2,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          ...(headerSx ?? {}),
        }}
      >
        {columns.map((cellSetting, _index) => {
          const key = cellSetting?.key ? cellSetting.key : uuidv4()
          const hasSort = !!cellSetting.sortBy && !!changeCurrentSort
          return (
            <TableHeadItem
              key={key as Key}
              as={Box}
              column={cellSetting}
              currentSort={currentSort}
              hasSort={hasSort}
              changeCurrentSort={handleChangeSort}
              renderAdditionIcon={renderHeaderAdditionIcon}
            />
          )
        })}
      </Flex>
    )
  }, [
    headerSx,
    columns,
    currentSort?.sortBy,
    currentSort?.sortType,
    changeCurrentSort,
    handleChangeSort,
    renderHeaderAdditionIcon,
  ])

  const innerWrapperRef = useRef<HTMLDivElement>(null)
  const wrapperRef = scrollWrapperRef ?? innerWrapperRef
  const listRef = useRef<InfiniteLoader>(null)
  const hasMountedRef = useRef(false)

  // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
  useEffect(() => {
    if (listRef.current && hasMountedRef.current) {
      listRef.current.resetloadMoreItemsCache()
    }
    hasMountedRef.current = true
  }, [currentSort])

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const loadMoreItems = isLoading ? () => {} : fetchNextPage

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => !hasNextPage || index < (data?.length ?? 0)

  // set width height for virtual list
  const [{ width, height }, setRect] = useState({ width: 0, height: 0 })
  const handleResize = useMemo(() => {
    return debounce(({ width, height }: { width: number; height: number }) => {
      if (!wrapperRef.current) return
      setRect({ width, height })
    }, 50)
  }, [])
  useEffect(() => {
    if (wrapperRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          handleResize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          })
        }
      })
      observer.observe(wrapperRef.current)
      return () => {
        observer.disconnect()
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }, [])

  const itemCount = data?.length ?? 0
  const totalItem = dataMeta?.total ?? 0
  const isEndOfList = itemCount - totalItem === 0

  const [showScrollButton, setShowScrollButton] = useState(false)
  const debounceShowScrollButton = useMemo(() => {
    return debounce((show: boolean) => setShowScrollButton(show))
  }, [])
  const _onScroll = (props: ListOnScrollProps) => {
    if (!hiddenScrollToTopButton) {
      // eslint-disable-next-line react/prop-types
      if (props.scrollOffset > 900) {
        debounceShowScrollButton(true)
      } else {
        debounceShowScrollButton(false)
      }
    }
    onScroll?.(props)
  }
  const innerListRef = useRef<List | null>()
  const handleClickScrollButton = () => {
    innerListRef.current?.scrollTo(0)
  }
  useEffect(() => {
    if (scrollWhenDataChange) {
      innerListRef.current?.scrollTo(0)
    }
  }, [scrollWhenDataChange, data])
  return (
    <Flex sx={{ flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {header}
      <Box flex="1 0 0" ref={wrapperRef} sx={{ position: 'relative', overflow: 'hidden' }}>
        {!isLoading && !data?.length && <NoDataFound />}

        <InfiniteLoader
          ref={listRef}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount + 1} // +1 for load infinite
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          loadMoreItems={loadMoreItems ? loadMoreItems : () => {}}
        >
          {({ onItemsRendered, ref }) => (
            <List
              // outerRef={virtualListScrollRef} // old logic not work
              ref={(_ref) => {
                innerListRef.current = _ref
                ref(_ref)
              }}
              width={width}
              height={height}
              itemCount={data?.length ?? 0}
              itemSize={() => 40}
              itemData={data ?? ([] as T[])}
              overscanCount={20}
              onItemsRendered={onItemsRendered}
              onScroll={_onScroll}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
        {isLoading && (
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              bg: 'modalBG',
            }}
          >
            <Loading />
          </Flex>
        )}
        {!hiddenScrollToTopButton && showScrollButton && (
          <IconBox
            onClick={handleClickScrollButton}
            icon={<ArrowLineUp size={20} />}
            sx={{
              cursor: 'pointer',
              color: 'neutral2',
              '&:hover': { color: 'neutral1' },
              p: 1,
              bg: 'neutral4',
              borderRadius: '50%',
              position: 'absolute',
              bottom: 1,
              right: 3,
            }}
          />
        )}
      </Box>
      <Flex
        sx={{
          bg: footerBg ?? 'neutral6',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          visibility: data?.length ? 'visible' : 'hidden',
          height: 32,
        }}
      >
        {/* {isLoading && (
          <Box width="max-content">
            <Loading size={16} m="0 !important" />
          </Box>
        )} */}
        {hiddenFooter
          ? null
          : footerWidget ?? (
              <Type.Caption color="neutral3" display="block" lineHeight="30px">
                <Box as="span" sx={{ position: 'relative' }}>
                  {itemCount} / {totalItem}
                  <Box
                    as="span"
                    sx={{
                      visibility: isLoadingFooter ? 'visible' : 'hidden',
                      position: 'absolute',
                      top: '50%',
                      right: '-24px',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <Loading size={16} />
                  </Box>
                </Box>
              </Type.Caption>
            )}
      </Flex>
    </Flex>
  )
})

export default VirtualList

export const SimpleVirtualList = memo<any>(function SimpleVirtualListMemo<T = any>({
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  dataMeta,
  handleSelectItem,
  renderRow,
  resizeDeps,
  onResize,
}: {
  data: T[] | undefined
  dataMeta: ApiMeta | undefined
  isLoading: boolean
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  handleSelectItem: (data: T) => void
  renderRow: (data: T) => any
  resizeDeps?: any[]
  onResize?: () => void
}) {
  const Row = useCallback(
    ({ data, index, style }: { data: T[]; index: number; style: any }) => {
      const cellData = data[index] as any
      return cloneElement(renderRow(cellData), { key: index, style, onClick: handleSelectItem(cellData) })
    },
    [handleSelectItem, renderRow]
  )

  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<InfiniteLoader>(null)

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const loadMoreItems = isLoading ? () => {} : fetchNextPage

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => !hasNextPage || index < (data?.length ?? 0)

  // set width height for virtual list
  const [{ width, height }, setRect] = useState({ width: 0, height: 0 })
  const handleResize = useCallback(() => {
    onResize?.()
    if (!wrapperRef.current) return
    setRect({ width: wrapperRef.current.clientWidth, height: wrapperRef.current.clientHeight })
  }, [onResize])
  useEffect(() => {
    handleResize()
  }, [...(resizeDeps ?? [])])
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const itemCount = data?.length ?? 0
  const totalItem = dataMeta?.total ?? 0

  return (
    <Flex sx={{ flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Box flex="1 0 0" ref={wrapperRef} sx={{ position: 'relative', overflow: 'hidden' }}>
        {isLoading && !data?.length && <Loading />}
        {!isLoading && data?.length === 0 && <NoDataFound />}
        <InfiniteLoader
          ref={listRef}
          isItemLoaded={isItemLoaded}
          itemCount={itemCount + 1} // +1 for load infinite
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              // outerRef={virtualListScrollRef} // old logic not work
              ref={ref}
              width={width}
              height={height}
              itemCount={data?.length ?? 0}
              itemSize={() => 50}
              itemData={data ?? ([] as T[])}
              overscanCount={20}
              onItemsRendered={onItemsRendered}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      </Box>
      <Flex
        sx={{
          bg: 'neutral5',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          visibility: data?.length ? 'visible' : 'hidden',
        }}
      >
        {isLoading && (
          <Box width="max-content">
            <Loading size={16} m="0 !important" />
          </Box>
        )}
        <Type.Caption color="neutral3" display="block" textAlign="center" lineHeight="30px">
          {itemCount} / {totalItem}
        </Type.Caption>
      </Flex>
    </Flex>
  )
})
