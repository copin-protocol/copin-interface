import { useMemo } from 'react'

import ContentLoading from 'components/@ui/ContentLoading'
import { TraderData } from 'entities/trader'
import Checkbox from 'theme/Checkbox'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'

import { TableSettingsProps, getFreezeLeftPos } from './dataConfig'

export default function TableBody<T>({
  data,
  isLoading,
  currentLimit,
  tableSettings,
  visibleColumns,
  checkIsSelected,
  handleSelect,
}: {
  data: T[] | undefined
  isLoading: boolean
  currentLimit: number | undefined
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
    <>
      {/* <colgroup>
        {headingDefault.map((column) => {
          const isVisible = visibleColumns.includes(column.id)
          return <col style={isVisible ? column.style : { display: 'none' }} key={column.id} />
        })}
      </colgroup> */}
      <tbody>
        {isLoading ? (
          <>
            <Loading />
            {/* {Array.from({ length: DEFAULT_LIMIT ?? 0 }, (_, v) => v).map((v, i) => {
              return (
                <LoadingRow hasSelection={!!handleSelect} key={i} data={visibleColumns} tableSettings={tableSettings} />
              )
            })} */}
          </>
        ) : (
          <>
            {data?.map((data: T, index: number) => {
              const isSelected = !!checkIsSelected && checkIsSelected(data)
              return (
                <tr key={index}>
                  {handleSelect && (
                    <Box
                      as="td"
                      className="column-freeze"
                      sx={{ pl: [12, 3], pr: [0, 2], position: 'sticky', left: 0, width: [36, 48] }}
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
          </>
        )}
      </tbody>
    </>
  )
}

function LoadingRow<T>({
  data,
  hasSelection,
  tableSettings,
}: {
  data: string[]
  hasSelection?: boolean
  tableSettings: TableSettingsProps<T>
}) {
  return (
    <tr>
      {hasSelection && (
        <td>
          <Box sx={{ pl: 3 }}>
            <ContentLoading height={24} width={24} />
          </Box>
        </td>
      )}
      {tableSettings
        .filter((e) => data.includes(e.id as string))
        .map((columnData) => {
          return (
            <td key={columnData.id as string}>
              <Box sx={{ pl: 3, ...columnData.style }}>
                <ContentLoading height={32} width="100%" />
              </Box>
            </td>
          )
        })}
    </tr>
  )
}
