import React, { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Checkbox from 'theme/Checkbox'
import SortAscIcon from 'theme/Icons/SortAscIcon'
import SortDefaultIcon from 'theme/Icons/SortDefaultIcon'
import SortDescIcon from 'theme/Icons/SortDescIcon'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'

import { getFreezeLeftPos } from './helpers'
import { TableSettingsProps, TraderListSortProps } from './types'

export default function TableHead<T>({
  hasData,
  currentSort,
  style,
  changeCurrentSort,
  tableSettings,
  visibleColumns,
  isSelectedAll,
  handleSelectedAll,
  hideCustomColumns,
  hiddenSelectBox = false,
  lefts: _lefts = [36, 48],
}: {
  hasData: boolean
  currentSort?: TraderListSortProps<T>
  style?: any
  changeCurrentSort?: (sort: TraderListSortProps<T> | undefined) => void
  hideCustomColumns?: boolean
  tableSettings: TableSettingsProps<T>
  visibleColumns: string[]
  isSelectedAll?: boolean
  handleSelectedAll?: ((isSelectedAll: boolean) => void) | null
  hiddenSelectBox?: boolean
  lefts?: [number, number]
}) {
  const handleChangeSort = (columnSortBy: TraderListSortProps<T>['sortBy'] | undefined) => {
    if (!changeCurrentSort) return
    const isCurrentSort = !!currentSort && currentSort?.sortBy === columnSortBy
    if (!columnSortBy) return
    if (!isCurrentSort) {
      changeCurrentSort({
        sortBy: columnSortBy,
        sortType: SortTypeEnum.DESC,
      })
    }
    if (isCurrentSort && currentSort.sortType === SortTypeEnum.DESC) {
      changeCurrentSort({
        sortBy: columnSortBy,
        sortType: SortTypeEnum.ASC,
      })
    }
    if (isCurrentSort && currentSort.sortType === SortTypeEnum.ASC) {
      changeCurrentSort(undefined)
    }
  }
  const lefts = useMemo(
    () =>
      _lefts
        ? _lefts
        : tableSettings.map((col, i) => (col.freezeLeft ? getFreezeLeftPos(i, visibleColumns) : undefined)),
    [tableSettings, visibleColumns, _lefts]
  )
  return (
    <>
      {/* <colgroup>
        {headingDefault.map((column) => {
          const isVisible = visibleColumns.includes(column.id)
          return <col style={isVisible ? column.style : { display: 'none' }} key={column.id} />
        })}
      </colgroup> */}
      <thead>
        <tr style={style}>
          {!hiddenSelectBox && handleSelectedAll !== undefined && (
            <Box
              as="th"
              className={hasData ? 'column-freeze' : undefined}
              sx={{
                pt: 4,
                pb: 2,
                pl: [12, 3],
                width: ['36px', '48px'],
                pr: [0, 2],
                verticalAlign: 'middle',
                position: 'sticky',
                lineHeight: 0,
                left: 0,
              }}
            >
              {hiddenSelectBox || handleSelectedAll == null ? (
                <Box sx={{ visibility: 'hidden' }}>
                  <Checkbox />
                </Box>
              ) : (
                <Type.Caption>
                  <Checkbox
                    checked={isSelectedAll}
                    defaultChecked={isSelectedAll}
                    onChange={() => handleSelectedAll(!!isSelectedAll)}
                  />
                </Type.Caption>
              )}
            </Box>
          )}
          {tableSettings.map((column, index) => {
            const key = column?.id ? column.id : uuidv4()
            const isCurrentSort = !!currentSort && currentSort?.sortBy === column?.sortBy
            const tooltipId = `tt_table_sort_${key?.toString()}`

            return (
              <Box
                as="th"
                className={
                  visibleColumns.includes(column.id as string)
                    ? column.freezeLeft != null && hasData
                      ? 'column-freeze'
                      : ''
                    : 'column-hide'
                }
                sx={{
                  paddingTop: 32,
                  paddingRight: [2, 3],
                  position: column.freezeLeft != null ? 'sticky' : 'static',
                  left: lefts[index],
                  width: column.freezeLeft,
                  zIndex: 2,
                  ...column.style,
                }}
                key={index}
              >
                <Flex
                  role={column?.sortBy ? 'button' : 'none'}
                  width="100%"
                  alignItems="center"
                  onClick={() => {
                    handleChangeSort(column?.sortBy)
                  }}
                >
                  <Type.Caption
                    color={isCurrentSort ? 'neutral1' : 'inherit'}
                    sx={{
                      '&:hover,&:focus,&:active': {
                        color: 'neutral2',
                      },
                    }}
                    flex="auto"
                    textAlign="right"
                  >
                    {column.label}
                  </Type.Caption>
                  {column.sortBy && (
                    <Flex alignItems="center" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
                      {isCurrentSort && currentSort?.sortType === SortTypeEnum.DESC ? (
                        <SortDescIcon />
                      ) : isCurrentSort && currentSort?.sortType === SortTypeEnum.ASC ? (
                        <SortAscIcon />
                      ) : (
                        <SortDefaultIcon />
                      )}
                    </Flex>
                  )}
                </Flex>
                {column.sortBy && changeCurrentSort && (
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
          })}
        </tr>
      </thead>
    </>
  )
}
