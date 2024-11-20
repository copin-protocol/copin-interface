import { ArrowLineUp } from '@phosphor-icons/react'
import debounce from 'lodash/debounce'
import React, { Fragment, cloneElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VariableSizeList as List, ListOnScrollProps } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { v4 as uuidv4 } from 'uuid'

import { ApiMeta } from 'apis/api'
import NoDataFound from 'components/@ui/NoDataFound'
import SortAscIcon from 'theme/Icons/SortAscIcon'
import SortDefaultIcon from 'theme/Icons/SortDefaultIcon'
import SortDescIcon from 'theme/Icons/SortDescIcon'
import Loading from 'theme/Loading'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SortTypeEnum } from 'utils/config/enums'

import Tooltip from '../Tooltip'

type Props<T> = {
  data: T[] | undefined
  isLoading: boolean
  columns: ColumnData<T>[]
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
            height: 50,
            alignItems: 'center',
            '&:hover': { background: themeColors.neutral5 },
            pl: 2,
            background: rowBgFactory?.(index),
            ...(rowSx ?? {}),
          }}
          onClick={() => handleSelectItem?.(cellData)}
        >
          {columns.map((cellSetting, _index) =>
            cellData ? (
              <Type.Caption key={cellData.id + _index} sx={cellSetting.style}>
                {cellSetting.render?.(cellData)}
              </Type.Caption>
            ) : (
              <Box key={_index}></Box>
            )
          )}
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
  const Header = useCallback(() => {
    return (
      <Flex
        width="100%"
        className="row_header_wrapper"
        color="neutral3"
        // pr 6px for offset scrollbar
        sx={{
          alignItems: 'center',
          py: 2,
          pr: '6px',
          pl: 2,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          ...(headerSx ?? {}),
        }}
      >
        {columns.map((cellSetting, _index) => {
          const key = cellSetting?.key ? cellSetting.key : uuidv4()
          const isCurrentSort = currentSort?.sortBy === cellSetting.sortBy
          const onClickSort = () => {
            handleChangeSort(cellSetting?.sortBy, cellSetting?.sortType, currentSort?.sortBy, currentSort?.sortType)
          }
          const hasSort = !!cellSetting.sortBy && !!changeCurrentSort
          const tooltipId = `tt_table_sort_${key.toString()}`
          return (
            <Fragment key={_index}>
              <Type.Caption
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: cellSetting.style?.textAlign,
                  ...(cellSetting.style ?? {}),
                }}
              >
                <Flex
                  alignItems="center"
                  as="span"
                  sx={{ justifyContent: cellSetting.style?.textAlign }}
                  onClick={!!onClickSort && onClickSort}
                  role={hasSort ? 'button' : undefined}
                >
                  {cellSetting.title}
                  {hasSort && (
                    <Flex alignItems="center" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
                      {isCurrentSort ? (
                        currentSort?.sortType === SortTypeEnum.DESC ? (
                          <SortDescIcon onClick={onClickSort} />
                        ) : (
                          <SortAscIcon onClick={onClickSort} />
                        )
                      ) : (
                        <SortDefaultIcon onClick={onClickSort} />
                      )}
                    </Flex>
                  )}
                </Flex>
                {cellSetting.filterComponent}
                {cellSetting?.sortBy && changeCurrentSort && (
                  <Tooltip id={tooltipId} place="top" type="dark" effect="solid">
                    <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                      {isCurrentSort
                        ? currentSort?.sortType === SortTypeEnum.DESC
                          ? 'Click to sort ascending'
                          : 'Click to cancel sorting'
                        : 'Click to sort descending'}
                    </Type.Caption>
                  </Tooltip>
                )}
              </Type.Caption>
            </Fragment>
          )
        })}
      </Flex>
    )
  }, [headerSx, columns, currentSort?.sortBy, currentSort?.sortType, changeCurrentSort, handleChangeSort])

  const wrapperRef = useRef<HTMLDivElement>(null)
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
    }, 200)
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
      <Header />
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
              itemSize={() => 50}
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
          bg: 'neutral5',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          visibility: data?.length ? 'visible' : 'hidden',
        }}
      >
        {/* {isLoading && (
          <Box width="max-content">
            <Loading size={16} m="0 !important" />
          </Box>
        )} */}
        {hiddenFooter ? null : (
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
}: {
  data: T[] | undefined
  dataMeta: ApiMeta | undefined
  isLoading: boolean
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  handleSelectItem: (data: T) => void
  renderRow: (data: T) => any
  resizeDeps?: any[]
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
    if (!wrapperRef.current) return
    setRect({ width: wrapperRef.current.clientWidth, height: wrapperRef.current.clientHeight })
  }, [])
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
