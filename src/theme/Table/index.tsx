import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import NoDataFound from 'components/@ui/NoDataFound'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'

import CustomizeColumn from './CustomizeColumn'
import TableBody from './TableBody'
import TableHead from './TableHead'
import { TableProps } from './types'

export default function Table<T, K>({
  data,
  columns,
  isLoading,
  footer,
  wrapperSx = {},
  onClickRow,
  renderRowBackground,
  currentSort,
  changeCurrentSort,
  externalSource,
  visibleColumns,
  handleToggleVisibleColumn,
  isSelectedAll,
  handleSelectAll,
  checkIsSelected,
  handleSelect,
  restrictHeight,
  containerSx = {},
  loadingSx,
  rowSx = {},
  scrollRef,
  isInfiniteLoad = false,
  tableHeadSx,
  tableBodySx,
  tableBodyWrapperSx,
  dataMeta,
  // topIndex,
  checkIsTop,
  scrollToTopDependencies,
  noDataMessage,
  footerData,
  footerRowSx = {},
  noDataComponent,
  noDataWrapperSx = {},
  getRowChildrenData,
  getChildRowKey,
  hasHoverBg = true,
}: // title,
// subTitle,
TableProps<T, K>) {
  const visibleKeys = visibleColumns?.map((key) => `[data-table-key="${key.toString()}"]`).join(',')

  const bodyRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sourceRef = isInfiniteLoad ? scrollRef : bodyRef
    const handleScrollHorizontal = () => {
      if (!sourceRef?.current || !headRef.current) return
      const scrollLeft = sourceRef.current?.scrollLeft
      headRef.current.scrollLeft = scrollLeft
    }
    sourceRef?.current?.addEventListener('scroll', handleScrollHorizontal)
    return () => sourceRef?.current?.removeEventListener('scroll', handleScrollHorizontal)
  }, [isInfiniteLoad, isLoading, scrollRef, data])
  const scrollDeps =
    scrollToTopDependencies == null && typeof scrollToTopDependencies === 'object'
      ? undefined
      : scrollToTopDependencies ?? data
  useEffect(() => {
    if (!data || isInfiniteLoad) return
    bodyRef?.current?.scrollTo(0, 0)
  }, [scrollDeps])
  const footerRowContainerSx = { ...tableBodySx, ...footerRowSx }
  return (
    <Flex
      className="table_container"
      flex="auto"
      sx={{ width: '100%', height: '100%', position: 'relative', ...containerSx }}
    >
      <TableWrapper
        className="table_wrapper"
        sx={{
          flex: 1,
          ...(!!visibleColumns?.length && visibleKeys
            ? {
                '& [data-table-key]': {
                  display: 'none',
                },
                [visibleKeys]: {
                  display: 'table-cell !important',
                },
              }
            : {}),
          ...wrapperSx,
        }}
      >
        <Box sx={{ width: '100%', overflow: 'hidden', flexShrink: 0 }} ref={headRef}>
          <TableContainer sx={tableHeadSx}>
            <TableHead
              columns={columns}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              isSelectedAll={isSelectedAll}
              handleSelectedAll={handleSelectAll}
              externalSource={externalSource}
            />
          </TableContainer>
        </Box>
        {!!data?.length && (
          <Box
            flex="1 0 0"
            sx={{ overflow: restrictHeight ? 'auto' : 'unset', ...(tableBodyWrapperSx ?? {}) }}
            ref={isInfiniteLoad ? scrollRef : bodyRef}
          >
            <TableContainer sx={tableBodySx} hasHoverBg={hasHoverBg && !checkIsTop}>
              <TableBody
                data={data}
                columns={columns}
                sx={rowSx}
                onClickRow={onClickRow}
                renderRowBackground={renderRowBackground}
                externalSource={externalSource}
                handleSelect={handleSelect}
                checkIsSelected={checkIsSelected}
                checkIsTop={checkIsTop}
                getRowChildrenData={getRowChildrenData}
                getChildRowKey={getChildRowKey}
                // title={title}
                // subTitle={subTitle}
              />
            </TableContainer>

            {isInfiniteLoad && !isLoading && (dataMeta?.total ?? 0) === (data?.length ?? 0) && (
              <Flex
                sx={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  bg: 'neutral6',
                  height: 40,
                }}
              >
                <Type.Caption color="neutral3">
                  End of list ({data.length}/{dataMeta?.total ?? 0})
                </Type.Caption>
              </Flex>
            )}
          </Box>
        )}
        {footerData && (
          <TableContainer sx={footerRowContainerSx} hasHoverBg={hasHoverBg && !checkIsTop}>
            <TableBody
              data={footerData}
              columns={columns}
              sx={rowSx}
              onClickRow={onClickRow}
              renderRowBackground={renderRowBackground}
              externalSource={externalSource}
              handleSelect={handleSelect}
              checkIsSelected={checkIsSelected}
              checkIsTop={checkIsTop}
              // title={title}
              // subTitle={subTitle}
            />
          </TableContainer>
        )}

        {!isInfiniteLoad && isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(2px)',
              bg: 'modalBG',
            }}
          >
            <Loading />
          </Box>
        )}

        {!isLoading &&
          !!data &&
          data.length === 0 &&
          (noDataComponent ? (
            noDataComponent
          ) : (
            <Box mb={24} sx={{ borderRadius: 'sm', ...noDataWrapperSx }}>
              <NoDataFound message={noDataMessage} />
            </Box>
          ))}

        {isInfiniteLoad && isLoading && (
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              backdropFilter: 'blur(5px)',
              bg: 'modalBG',
              height: 40,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              ...loadingSx,
            }}
          >
            <Box>
              <Loading size={20} />
            </Box>
            {dataMeta && data && (
              <Type.Caption color="neutral2">
                {data.length} / {dataMeta.total}
              </Type.Caption>
            )}
          </Flex>
        )}

        {!!footer ? <Box sx={{ position: 'sticky', left: 0 }}>{footer}</Box> : null}
      </TableWrapper>

      {handleToggleVisibleColumn && visibleColumns && (
        <Box sx={{ pt: 1, flexShrink: 0, px: 1, pr: 3, mr: '-12px', zIndex: 1, bg: 'neutral5' }}>
          <CustomizeColumn
            defaultColumns={columns}
            currentColumnKeys={visibleColumns}
            handleToggleColumn={handleToggleVisibleColumn}
            keys={(item) => item.key}
          />
        </Box>
      )}
    </Flex>
  )
}

/**
 * use this for individual component, not render parent component
 */
export function getVisibleColumnStyle({ visibleColumns }: { visibleColumns: string[] }): any {
  const visibleKeys = visibleColumns?.map((key) => `[data-table-key="${key.toString()}"]`).join(',')
  return !!visibleColumns?.length && visibleKeys
    ? {
        '& + * [data-table-key]': {
          display: 'none',
        },
        '& + *': {
          [visibleKeys]: {
            display: 'table-cell !important',
          },
        },
      }
    : {}
}

export function TableContainer({
  sx = {},
  children,
  hasHoverBg = true,
}: {
  children: ReactNode
  sx?: any
  hasHoverBg?: boolean
}) {
  return (
    <Box
      as="table"
      textAlign="left"
      sx={{
        width: '100%',
        borderCollapse: 'separate',
        '& tbody tr': {
          '&:hover': {
            background: hasHoverBg ? '#292d40!important' : undefined,
          },
        },
        '& th:first-child, td:first-child': {
          pl: 2,
        },
        '& tbody td': { py: '7px', verticalAlign: 'middle' },
        '& th': { py: '6px', borderBottom: 'small', borderColor: 'neutral4' },
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

const TableWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.neutral3};
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
`
