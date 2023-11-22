import { SystemStyleObject } from '@styled-system/css'
// import { ReactNode } from 'react'
import { animated, useSpring } from 'react-spring'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'
import { v4 as uuidv4 } from 'uuid'

import Checkbox from 'theme/Checkbox'
import { Box, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

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
  // title,
  // subTitle,
  checkIsTop,
}: {
  data: T[] | undefined
  columns: ColumnData<T, K>[] | undefined
  sx?: SystemStyleObject & GridProps
  onClickRow: ((data: T) => void) | undefined
  renderRowBackground: ((data: T, index: number) => string | undefined) | undefined
  externalSource: K | undefined
  checkIsSelected?: (data: T) => boolean
  handleSelect?: (args: { isSelected: boolean; data: T }) => void
  // title?: ReactNode
  // subTitle?: ReactNode
  checkIsTop?: (data: T) => boolean
}) {
  return (
    <tbody>
      {data?.map((data: any, index: number) => {
        const bg = renderRowBackground ? renderRowBackground(data, index) : undefined
        return (
          <>
            {/* {topIndex && index === 0 && title}
            {topIndex && index === topIndex && subTitle} */}
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
              checkIsTop={checkIsTop}
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
  checkIsTop,
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
  checkIsTop?: (data: T) => boolean
}) {
  if (!data) return <></>
  const isSelected = !!checkIsSelected && checkIsSelected(data)
  const Wrapper = checkIsTop == null ? NormalRowWrapper : checkIsTop(data) ? AnimatedRowWrapper : RowWrapper
  return (
    <Wrapper
      onClick={onClickRow ? () => onClickRow(data) : undefined}
      style={{
        cursor: !!onClickRow ? 'pointer' : 'default',
        background: bg,
        width: '100%',
      }}
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
    </Wrapper>
  )
}

const NormalRowWrapper = styled.tr``

const AnimatedRowWrapper = ({ style, ...props }: any) => {
  const styles = useSpring({
    from: {
      background: `linear-gradient(#1F2232, #1F2232) padding-box, linear-gradient(90deg, rgba(171, 236, 162, 1), rgba(47, 179, 254, 0.5), rgba(106, 142, 234, 0.3), rgba(161, 133, 244, 0.1)) border-box`,
    },
    to: {
      background: `linear-gradient(#1F2232, #1F2232) padding-box, linear-gradient(-90deg, rgba(47, 179, 254, 0.1), rgba(106, 142, 234, 0.5), rgba(161, 133, 244, 0.3), rgba(171, 236, 162, 0.1)) border-box`,
    },
    config: {
      duration: 5000,
    },
    loop: {
      reverse: true,
    },
  })
  const Animated = animated(RowWrapper)
  return (
    <Animated
      {...props}
      style={{
        ...style,
        ...styles,
      }}
      hasBorder={true}
    />
  )
}

const RowWrapper = styled('tr')<{ hasBorder?: boolean }>`
  background-color: ${({ theme, hasBorder }) => (hasBorder ? theme.colors.neutral5 : undefined)};
  display: inline-table;
  justify-content: center;
  align-items: center;
  // margin-top: ${({ hasBorder }) => (hasBorder ? '16px' : undefined)};
  // margin-left: ${({ hasBorder }) => (hasBorder ? '8px' : undefined)};
  margin-top: ${({ hasBorder }) => (hasBorder ? '16px' : undefined)};
  margin-left: 16px;
  margin-right: 16px;
  max-width: calc(100% - 32px);
  //max-width: ${({ hasBorder }) => (hasBorder ? 'calc(100% - 16px)' : undefined)};
  //max-width: calc(100% - 32px);

  ${({ hasBorder }) =>
    hasBorder &&
    `
    border: 1px solid #0000;
    border-radius: 4px;
    `};
`
