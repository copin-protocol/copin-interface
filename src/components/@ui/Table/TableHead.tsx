import { v4 as uuidv4 } from 'uuid'

import { TableSelectHandler } from 'hooks/helpers/useTableSelect'
import Checkbox from 'theme/Checkbox'
import SortAscIcon from 'theme/Icons/SortAscIcon'
import SortDefaultIcon from 'theme/Icons/SortDefaultIcon'
import SortDescIcon from 'theme/Icons/SortDescIcon'
import { Box, Flex, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'

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
    const theSecondSort = columnSortType === SortTypeEnum.DESC ? SortTypeEnum.ASC : SortTypeEnum.DESC
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
          return (
            <Box as="th" key={key.toString()} sx={column.style} data-table-key={column.key}>
              <Box
                role={column?.sortBy && changeCurrentSort ? 'button' : 'none'}
                onClick={() => {
                  handleChangeSort(column?.sortBy, column?.sortType)
                }}
                sx={{
                  color: column?.sortBy && isCurrentSort ? 'neutral1' : 'inherit',
                  '&:hover': {
                    color: column?.sortBy ? 'neutral2' : 'inherit',
                  },
                }}
              >
                {column.sortBy && changeCurrentSort ? (
                  <Type.Caption fontWeight={isCurrentSort ? 'bold' : 'normal'}>
                    <Flex alignItems="center">
                      {column.title}
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
                  <Type.Caption>{column.title}</Type.Caption>
                )}
              </Box>
            </Box>
          )
        })}
      </tr>
    </thead>
  )
}
