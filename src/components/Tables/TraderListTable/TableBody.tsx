import { useMemo } from 'react'

import Checkbox from 'theme/Checkbox'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'

import { TableSettingsProps, getFreezeLeftPos } from './dataConfig'

export default function TableBody<T>({
  data,
  isLoading,
  tableSettings,
  visibleColumns,
  checkIsSelected,
  handleSelect,
}: {
  data: T[] | undefined
  isLoading: boolean
  tableSettings: TableSettingsProps<T>
  visibleColumns: string[]
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
}) {
  const lefts = useMemo(
    () => tableSettings.map((col, i) => (col.freezeLeft ? getFreezeLeftPos(i, visibleColumns) : undefined)),
    [tableSettings, visibleColumns]
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
            {handleSelect && (
              <Box
                as="td"
                className="column-freeze"
                sx={{ pl: [12, 3], pr: [0, 2], position: 'sticky', left: 0, width: [36, 48], zIndex: 4 }}
              >
                <Checkbox
                  checked={isSelected}
                  defaultChecked={isSelected}
                  onChange={() => handleSelect && handleSelect({ isSelected, data })}
                />
              </Box>
            )}
            {tableSettings.map((column, i) => (
              <Box
                as="td"
                key={column.id as string}
                className={
                  visibleColumns.includes(column.id as string)
                    ? column.freezeLeft != null
                      ? 'column-freeze'
                      : ''
                    : 'column-hide'
                }
                sx={{
                  paddingRight: [2, 3],
                  position: column.freezeLeft != null ? 'sticky' : 'static',
                  left: lefts[i],
                  width: column.freezeLeft,
                  zIndex: column.freezeIndex ?? 1,
                  ...column.style,
                }}
              >
                {column?.render && column.render(data, index)}
              </Box>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}
