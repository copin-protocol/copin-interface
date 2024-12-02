import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { TableSelectHandler } from 'hooks/helpers/useTableSelect'
import Checkbox from 'theme/Checkbox'
import SortAscIcon from 'theme/Icons/SortAscIcon'
import SortDefaultIcon from 'theme/Icons/SortDefaultIcon'
import SortDescIcon from 'theme/Icons/SortDescIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
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
  const handleChangeSort = (
    columnSortBy: TableSortProps<T>['sortBy'] | undefined,
    columnSortType?: TableSortProps<T>['sortType'] | undefined
  ) => {
    if (!changeCurrentSort) return
    const isCurrentSort = !!currentSort && currentSort?.sortBy === columnSortBy
    if (!columnSortBy) return
    const theFirstSort = columnSortType ?? SortTypeEnum.DESC
    const theSecondSort = theFirstSort === SortTypeEnum.DESC ? SortTypeEnum.ASC : SortTypeEnum.DESC
    if (!isCurrentSort) {
      changeCurrentSort({
        sortBy: columnSortBy,
        sortType: theFirstSort,
      })
    }
    if (isCurrentSort && currentSort.sortType === theFirstSort) {
      changeCurrentSort({
        sortBy: columnSortBy,
        sortType: theSecondSort,
      })
    }
    if (isCurrentSort && currentSort.sortType === theSecondSort) {
      changeCurrentSort(undefined)
    }
  }

  return (
    <thead style={{ position: 'relative', width: '100%' }}>
      <tr>
        {handleSelectedAll && (
          <th
            style={{
              paddingTop: 4,
              width: '48px',
              verticalAlign: 'middle',
            }}
          >
            <Type.Caption>
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
          const isCurrentSort = currentSort?.sortBy === column.sortBy
          const handleClick = () => {
            handleChangeSort(column?.sortBy, column?.sortType)
          }
          const tooltipId = `tt_table_sort_${key.toString()}`
          return (
            <Box as="th" key={key.toString()} sx={column.style} data-table-key={column.key}>
              <Box width="100%">
                {column.sortBy && changeCurrentSort ? (
                  <Type.Caption fontWeight={isCurrentSort ? 'bold' : 'normal'} sx={{ width: '100%' }}>
                    <Flex alignItems="center" as="span" sx={{ justifyContent: column.style?.textAlign }}>
                      <Box
                        as="span"
                        mr={'4px'}
                        role="button"
                        onClick={handleClick}
                        sx={{
                          color: column?.sortBy && isCurrentSort ? 'neutral1' : 'inherit',
                          '& + * path:last-child': {
                            fill:
                              isCurrentSort && currentSort?.sortType === SortTypeEnum.DESC ? 'primary1' : 'neutral3',
                          },
                          '& + * path:first-child': {
                            fill: isCurrentSort && currentSort?.sortType === SortTypeEnum.ASC ? 'primary1' : 'neutral3',
                          },
                          '&:hover': {
                            color: column?.sortBy ? 'neutral2' : 'inherit',
                            '& + * path': {
                              fill: 'neutral2',
                            },
                          },
                          '& + *': {
                            '&:hover path': {
                              fill: 'neutral2',
                            },
                          },
                        }}
                      >
                        {column.title}
                      </Box>
                      {column.sortBy && (
                        <Flex alignItems="center" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
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
                  </Type.Caption>
                ) : (
                  <Type.Caption
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: column.style?.textAlign,
                    }}
                  >
                    <Box as="span" mr={1}>
                      {column.title}
                    </Box>
                    {column.filterComponent}
                  </Type.Caption>
                )}
              </Box>
              {column.sortBy && changeCurrentSort && (
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
            </Box>
          )
        })}
      </tr>
    </thead>
  )
}
