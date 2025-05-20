import { useMemo } from 'react'

import Checkbox from 'theme/Checkbox'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'

import { getFreezeLeftPos } from './helpers'
import { ExternalTraderListSource, TableSettings, TableSettingsProps } from './types'

export default function TableBody<T>({
  data,
  isLoading,
  tableSettings,
  visibleColumns,
  checkIsSelected,
  handleSelect,
  availableColumns,
  hiddenSelectBox = false,
  lefts: _lefts = [36, 48],
  columnTooltipIdFn,
}: {
  data: T[] | undefined
  isLoading: boolean
  tableSettings: TableSettingsProps<T>
  visibleColumns: string[]
  availableColumns?: string[]
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
  hiddenSelectBox?: boolean
  lefts?: [number, number]
  columnTooltipIdFn?: (data: TableSettings<T, ExternalTraderListSource>) => string
}) {
  const lefts = useMemo(
    () =>
      _lefts
        ? _lefts
        : tableSettings.map((col, i) => (col.freezeLeft ? getFreezeLeftPos(i, visibleColumns) : undefined)),
    [tableSettings, visibleColumns, _lefts]
  )

  return (
    <tbody>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bg: 'modalBG',
            backdropFilter: 'blur(5px)',
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Loading />
        </Box>
      )}
      {data?.map((data: T, index: number) => {
        const isSelected = !!checkIsSelected && checkIsSelected(data)
        return (
          <tr key={index}>
            {!hiddenSelectBox && handleSelect && (
              <Box
                as="td"
                className="column-freeze"
                sx={{ pl: [12, 3], pr: [0, 2], position: 'sticky', left: 0, width: [36, 48], zIndex: 4 }}
              >
                <Checkbox
                  wrapperSx={{ visibility: hiddenSelectBox ? 'hidden' : 'visible' }}
                  checked={isSelected}
                  defaultChecked={isSelected}
                  onChange={() => handleSelect && handleSelect({ isSelected, data })}
                />
              </Box>
            )}
            {tableSettings.map((column, i) => {
              const isAvailable = availableColumns ? availableColumns?.includes(column.id as string) : true
              const tooltipId = columnTooltipIdFn?.(column) ?? ''
              const className =
                (tooltipId ? `${tooltipId} ` : '') +
                (visibleColumns.includes(column.id as string)
                  ? column.freezeLeft != null
                    ? 'column-freeze'
                    : ''
                  : 'column-hide')
              return (
                <Box
                  as="td"
                  data-table-cell-key={column.id}
                  data-table-cell-row-index={index}
                  key={column.id as string}
                  className={className}
                  sx={{
                    paddingRight: [2, 3],
                    position: column.freezeLeft != null ? 'sticky' : 'static',
                    left: lefts[i],
                    filter: isAvailable ? 'none' : 'blur(6px)',
                    userSelect: isAvailable ? 'inherit' : 'none',
                    cursor: 'default',
                    width: column.freezeLeft,
                    zIndex: column.freezeIndex ?? 1,
                    ...column.style,
                  }}
                >
                  {column?.render && column.render(data, index)}
                </Box>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}
