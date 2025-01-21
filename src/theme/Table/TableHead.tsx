import React, { ComponentType, Key, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { TableSelectHandler } from 'hooks/helpers/useTableSelect'
import Checkbox from 'theme/Checkbox'
import SortAscIcon from 'theme/Icons/SortAscIcon'
import SortDefaultIcon from 'theme/Icons/SortDefaultIcon'
import SortDescIcon from 'theme/Icons/SortDescIcon'
import { Box, Flex, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'

import Tooltip from '../Tooltip'
import { ColumnData, ColumnDataParameter, ColumnExternalSourceParameter, TableSortProps } from './types'

export default function TableHead<T = ColumnDataParameter, K = ColumnExternalSourceParameter>({
  currentSort,
  changeCurrentSort,
  columns,
  isSelectedAll,
  handleSelectedAll,
}: {
  currentSort: TableSortProps<T> | undefined
  changeCurrentSort: ((sort: TableSortProps<T> | undefined) => void) | undefined
  columns: ColumnData<T, K>[] | undefined
  isSelectedAll?: boolean
  handleSelectedAll?: TableSelectHandler<T>['handleSelectAll']
}) {
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

  return (
    <thead style={{ position: 'relative', width: '100%' }}>
      <tr style={{ width: '100%' }}>
        {handleSelectedAll && (
          <th
            style={{
              paddingTop: 4,
              width: '48px',
              verticalAlign: 'middle',
            }}
          >
            <Type.Caption sx={{ textTransform: 'uppercase' }}>
              <Checkbox
                checked={isSelectedAll}
                defaultChecked={isSelectedAll}
                onChange={() => handleSelectedAll(!!isSelectedAll)}
              />
            </Type.Caption>
          </th>
        )}
        {columns?.map((column) => {
          const key = column?.key ? column.key : uuidv4()
          const hasSort = !!column.sortBy && !!changeCurrentSort
          return (
            <TableHeadItem
              key={key as Key}
              as="th"
              column={column}
              currentSort={currentSort}
              hasSort={hasSort}
              changeCurrentSort={handleChangeSort}
            />
          )
        })}
      </tr>
    </thead>
  )
}

export const TableHeadItem = <T, K>({
  as,
  key,
  column,
  currentSort,
  hasSort,
  changeCurrentSort,
}: {
  as: 'th' | ComponentType | undefined
  key: Key
  hasSort: boolean
  column: ColumnData<T, K>
  currentSort?: TableSortProps<T>
  changeCurrentSort?: (
    columnSortBy: TableSortProps<T>['sortBy'] | undefined,
    columnSortType: TableSortProps<T>['sortType'] | undefined,
    currentSortBy: TableSortProps<T>['sortBy'] | undefined,
    currentSortType: TableSortProps<T>['sortType'] | undefined
  ) => void
}) => {
  const isCurrentSort = currentSort?.sortBy === column.sortBy
  const tooltipId = `tt_table_sort_${key?.toString()}`
  const handleClick = () => {
    if (!!column.sortBy && !!changeCurrentSort) {
      changeCurrentSort(column.sortBy, column.sortType, currentSort?.sortBy, currentSort?.sortType)
    }
  }
  return (
    <Box as={as} key={key?.toString()} sx={column.style} data-table-key={column.key}>
      <Box width="100%">
        <Flex alignItems="center" sx={{ justifyContent: column.style?.textAlign, gap: 1 }} width="100%">
          <Type.Caption
            role={isCurrentSort && hasSort ? 'button' : undefined}
            onClick={handleClick}
            color={isCurrentSort && hasSort ? 'neutral1' : 'neutral3'}
            sx={{
              textTransform: 'uppercase',
              '& + *.sort-icons path:last-child': {
                fill: isCurrentSort && currentSort?.sortType === SortTypeEnum.DESC ? 'neutral1' : 'neutral3',
              },
              '& + *.sort-icons path:first-child': {
                fill: isCurrentSort && currentSort?.sortType === SortTypeEnum.ASC ? 'neutral1' : 'neutral3',
              },
              '&:hover': {
                color: column.sortBy ? 'neutral2' : 'inherit',
                '& + *.sort-icons path': {
                  fill: 'neutral2',
                },
              },
              '& + *.sort-icons': {
                '&:hover path': {
                  fill: 'neutral2',
                },
              },
            }}
          >
            {column.title}
          </Type.Caption>
          {hasSort && (
            <Flex className="sort-icons" alignItems="center" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
              {isCurrentSort ? (
                currentSort?.sortType === SortTypeEnum.DESC ? (
                  <SortDescIcon size={16} role="button" onClick={handleClick} />
                ) : (
                  <SortAscIcon size={16} role="button" onClick={handleClick} />
                )
              ) : (
                <SortDefaultIcon size={16} role="button" onClick={handleClick} />
              )}
            </Flex>
          )}
          {column.filterComponent}
        </Flex>
      </Box>
      {hasSort && (
        <Tooltip id={tooltipId}>
          <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
            {isCurrentSort
              ? currentSort?.sortType === SortTypeEnum.DESC
                ? 'Click to sort ascending'
                : 'Click to cancel sorting'
              : 'Click to sort descending'}
          </Type.Caption>
        </Tooltip>
      )}
    </Box>
  )
}
