import { ReactNode } from 'react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import TableFilterIcon from 'pages/PerpDEXsExplorer/components/TableFilterIcon'
import { renderTableText, renderTableTitleWithTooltip } from 'pages/PerpDEXsExplorer/helpers/renderHelper'
import { ExternalResource } from 'pages/PerpDEXsExplorer/types'
import { getColumnSearchText } from 'pages/PerpDEXsExplorer/utils'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'

import { RENDER_COLUMN_DATA_MAPPING } from '../configs'
import { DOMINANCE_VALUE_FIELDS } from '../constants/field'
import useSortData from '../hooks/useSortData'

/**
 * use for column like: $20.2b +100.2%
 */
export function getColumnConfig({
  valueKey,
  width = 170,
  style = {},
  hasSort = true,
  title,
}: {
  valueKey: keyof PerpDEXSourceResponse
  width?: number
  style?: Record<string, any>
  hasSort?: boolean
  title?: ReactNode
}) {
  const columnData: ColumnData<PerpDEXSourceResponse, ExternalResource> = {
    dataIndex: valueKey,
    key: valueKey,
    title: renderTableTitleWithTooltip({ valueKey, title }),
    text: renderTableText(valueKey),
    searchText: getColumnSearchText(valueKey),
    sortBy: hasSort ? valueKey : undefined,
    filterComponent: <TableFilterIcon valueKey={valueKey} />,
    style: { minWidth: width, width, textAlign: 'right', ...style },
    render(data, index, externalResource) {
      return (
        <CellContainer data={data} valueKey={valueKey} externalResource={externalResource} style={style}>
          {RENDER_COLUMN_DATA_MAPPING[valueKey]?.({ data, externalResource, index })}
        </CellContainer>
      )
    },
  }
  return columnData
}

function CellContainer({
  children,
  valueKey,
  externalResource,
  data,
  style,
}: {
  data: PerpDEXSourceResponse
  children: ReactNode
  valueKey: keyof PerpDEXSourceResponse
  externalResource: ExternalResource | undefined
  style?: Record<string, any>
}) {
  const {
    currentSort: { sortBy },
  } = useSortData()
  const maxValue = externalResource?.maxValueField?.[valueKey]?.value
  const value = data?.[valueKey]
  if (sortBy === valueKey && DOMINANCE_VALUE_FIELDS.includes(valueKey)) {
    let percent = 0
    if (typeof value === 'number' && typeof maxValue === 'number') {
      percent = (value / maxValue) * 100
    }
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          py: '3px',
          position: 'relative',
          borderLeft: valueKey !== 'volume1d' ? 'small' : 'none',
          borderRight: 'small',
          borderColor: 'neutral4',
          textAlign: 'left',
        }}
      >
        <Type.Caption sx={{ width: `${percent}%`, height: '100%', bg: '#4EAEFD33' }}></Type.Caption>
        <Flex
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            px: 12,
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          {children}
        </Flex>
      </Box>
    )
  }
  return <Flex sx={{ width: '100%', justifyContent: style?.textAlign ?? 'right' }}>{children}</Flex>
}
