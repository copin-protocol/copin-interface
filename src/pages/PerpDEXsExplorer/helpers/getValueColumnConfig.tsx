import { ReactNode } from 'react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import TableFilterIcon from 'pages/PerpDEXsExplorer/components/TableFilterIcon'
import { renderTableText, renderTableTitleWithTooltip } from 'pages/PerpDEXsExplorer/helpers/renderHelper'
import { ExternalResource } from 'pages/PerpDEXsExplorer/types'
import { getColumnSearchText } from 'pages/PerpDEXsExplorer/utils'
import { ColumnData } from 'theme/Table/types'
import { Flex } from 'theme/base'

import { RENDER_COLUMN_DATA_MAPPING } from '../configs'

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
        <Flex sx={{ width: '100%', justifyContent: style?.textAlign ?? 'right' }}>
          {RENDER_COLUMN_DATA_MAPPING[valueKey]?.({ data, externalResource, index })}
        </Flex>
      )
    },
  }
  return columnData
}
