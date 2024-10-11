import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import { VariableSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'

import { ApiMeta } from 'apis/api'
import NoDataFound from 'components/@ui/NoDataFound'
import SortAscIcon from 'theme/Icons/SortAscIcon'
import SortDefaultIcon from 'theme/Icons/SortDefaultIcon'
import SortDescIcon from 'theme/Icons/SortDescIcon'
import Loading from 'theme/Loading'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SortTypeEnum } from 'utils/config/enums'

const VirtualList = memo<any>(function VirtualListMemo<T = any>({
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
}: {
  data: T[] | undefined
  dataMeta: ApiMeta | undefined
  isLoading: boolean
  fetchNextPage: () => void
  hasNextPage: boolean | undefined
  columns: ColumnData<T>[]
  currentSort: TableSortProps<T> | undefined
  changeCurrentSort: ((sort: TableSortProps<T> | undefined) => void) | undefined
  handleSelectItem: (data: T) => void
  rowSx?: any
  rowBgFactory?: (index: number) => string | undefined
  headerSx?: any
  resizeDeps?: any[]
}) {
  const Row = useCallback(
    ({ data, index, style }: { data: T[]; index: number; style: any }) => {
      const cellData = data[index] as any
      return (
        <Flex
          role="button"
          key={index}
          style={style}
          width="100%"
          sx={{
            height: 50,
            alignItems: 'center',
            '&:hover': { background: themeColors.neutral5 },
            pl: 2,
            bg: rowBgFactory?.(index),
            ...(rowSx ?? {}),
          }}
          onClick={() => handleSelectItem(cellData)}
        >
          {columns.map((cellSetting, _index) =>
            cellData ? (
              <Type.Caption key={_index} sx={cellSetting.style}>
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
  const Header = useCallback(() => {
    return (
      <Flex
        width="100%"
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
          const isCurrentSort = currentSort?.sortBy === cellSetting.sortBy
          return (
            <Fragment key={_index}>
              {cellSetting.sortBy && changeCurrentSort ? (
                <Type.Caption fontWeight={isCurrentSort ? 'bold' : 'normal'} sx={cellSetting.style}>
                  <Flex alignItems="center" as="span" sx={{ justifyContent: cellSetting.style?.textAlign }}>
                    {cellSetting.title}
                    {isCurrentSort ? (
                      currentSort?.sortType === SortTypeEnum.DESC ? (
                        <SortDescIcon />
                      ) : (
                        <SortAscIcon />
                      )
                    ) : (
                      <SortDefaultIcon />
                    )}
                  </Flex>
                </Type.Caption>
              ) : (
                <Type.Caption sx={cellSetting.style}>{cellSetting.title}</Type.Caption>
              )}
            </Fragment>
          )
        })}
      </Flex>
    )
  }, [headerSx, columns, currentSort?.sortBy, currentSort?.sortType, changeCurrentSort])

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
  const isEndOfList = itemCount - totalItem === 0

  return (
    <Flex sx={{ flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Header />
      <Box flex="1 0 0" ref={wrapperRef} sx={{ position: 'relative', overflow: 'hidden' }}>
        {isLoading && !data?.length && <Loading />}
        {!isLoading && !data?.length && <NoDataFound />}
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

export default VirtualList
