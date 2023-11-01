import { SystemStyleObject } from '@styled-system/css'
import { ReactNode } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuidv4 } from 'uuid'

import Checkbox from 'theme/Checkbox'
import { Box, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

import { RowWrapper } from './index'
import { ColumnData, ColumnDataParameter, ColumnExternalSourceParameter } from './types'

export default function TableBody<T = ColumnDataParameter, K = ColumnExternalSourceParameter>({
  data,
  columns,
  sx,
  onClickRow,
  renderRowBackground,
  externalSource,
  checkIsSelected,
  handleSelect,
  topIndex,
  title,
  subTitle,
}: {
  data: T[] | undefined
  columns: ColumnData<T, K>[] | undefined
  sx?: SystemStyleObject & GridProps
  onClickRow: ((data: T) => void) | undefined
  renderRowBackground: ((data: T, index: number) => string | undefined) | undefined
  externalSource: K | undefined
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
  topIndex?: number
  title?: ReactNode
  subTitle?: ReactNode
}) {
  return (
    <tbody>
      {data?.map((data: any, index: number) => {
        const bg = renderRowBackground ? renderRowBackground(data, index) : undefined
        return (
          <>
            {topIndex && index === 0 && title}
            {topIndex && index === topIndex && subTitle}
            <Row
              key={index}
              data={data}
              index={index}
              columnsData={columns}
              onClickRow={onClickRow}
              sx={sx}
              bg={bg}
              externalSource={externalSource}
              checkIsSelected={checkIsSelected}
              handleSelect={handleSelect}
              topIndex={topIndex}
            />
          </>
        )
      })}
    </tbody>
  )
}

function Row<T = ColumnDataParameter, K = ColumnExternalSourceParameter>({
  data,
  index,
  columnsData,
  onClickRow,
  bg,
  sx = {},
  externalSource,
  checkIsSelected,
  handleSelect,
  topIndex,
}: {
  data: T | undefined
  index: number | undefined
  columnsData: ColumnData<T, K>[] | undefined
  onClickRow: ((data: T) => void) | undefined
  bg: string | undefined
  sx?: SystemStyleObject & GridProps
  externalSource: K | undefined
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
  topIndex?: number
}) {
  if (!data) return <></>
  const isSelected = !!checkIsSelected && checkIsSelected(data)
  return (
    <RowWrapper
      onClick={onClickRow ? () => onClickRow(data) : undefined}
      style={{
        cursor: !!onClickRow ? 'pointer' : 'default',
        background: bg,
        width: '100%',
      }}
      hasBorder={topIndex && index !== undefined ? index < topIndex : undefined}
    >
      {handleSelect && (
        <td style={{ width: '48px' }}>
          <Checkbox
            checked={isSelected}
            defaultChecked={isSelected}
            onChange={() => handleSelect && handleSelect({ isSelected, data })}
          />
        </td>
      )}
      {columnsData?.map((columnData) => {
        const key = columnData?.key ? columnData.key : uuidv4()
        return (
          <Box
            as="td"
            key={key.toString()}
            data-table-key={columnData.key}
            sx={{
              ...sx,
              ...columnData.style,
            }}
          >
            {columnData.render ? (
              columnData.render(data, index, externalSource)
            ) : (
              <>
                {!!columnData.dataIndex ? (
                  <Type.Caption
                    sx={{ textAlign: (columnData.style?.textAlign as SystemStyleObject) ?? 'inherit', width: '100%' }}
                  >
                    {data[columnData.dataIndex] ? (
                      <>
                        {typeof data[columnData.dataIndex] === 'number'
                          ? formatNumber(data[columnData.dataIndex] as string, columnData.numDigit ?? 2)
                          : null}
                        {typeof data[columnData.dataIndex] === 'string' ? data[columnData.dataIndex] : null}
                      </>
                    ) : (
                      '--'
                    )}
                  </Type.Caption>
                ) : (
                  <div />
                )}
              </>
            )}
          </Box>
        )
      })}
    </RowWrapper>
  )
}
