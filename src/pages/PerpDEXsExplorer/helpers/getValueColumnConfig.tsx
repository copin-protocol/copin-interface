import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import TableFilterIcon from 'pages/PerpDEXsExplorer/components/TableFilterIcon'
import {
  renderChangeValue,
  renderLSRatio,
  renderNormalValue,
  renderSignValue,
  renderTableText,
  renderTableTitleWithTooltip,
} from 'pages/PerpDEXsExplorer/helpers/renderHelper'
import { ExternalResource, NormalValueComponentType } from 'pages/PerpDEXsExplorer/types'
import { getColumnSearchText } from 'pages/PerpDEXsExplorer/utils'
import { ColumnData } from 'theme/Table/types'
import { Flex } from 'theme/base'

/**
 * use for column like: $20.2b +100.2%
 */
export function getValueChangeColumnConfig({
  valueKey,
  valuePrefix = '',
  valueSuffix = '',
  changeValuePrefix = '',
  changeValueSuffix = '%',
  width = 170,
  style = {},
  topValueHighlighting = true,
  hasSort = true,
}: {
  valueKey: keyof PerpDEXSourceResponse
  width?: number
  valuePrefix?: string
  valueSuffix?: string
  changeValuePrefix?: string
  changeValueSuffix?: string
  style?: Record<string, any>
  topValueHighlighting?: boolean
  hasSort?: boolean
}) {
  const columnData: ColumnData<PerpDEXSourceResponse, ExternalResource> = {
    //     label: (
    //   <LabelWithTooltip
    //     id="tt_max_drawdown_pnl_label"
    //     tooltip="The maximum dollar value loss experienced from the peak account value"
    //   >
    //     Max Drawdown PnL
    //   </LabelWithTooltip>
    // ),
    dataIndex: valueKey,
    key: valueKey,
    title: renderTableTitleWithTooltip(valueKey),
    text: renderTableText(valueKey),
    searchText: getColumnSearchText(valueKey),
    sortBy: hasSort ? valueKey : undefined,
    filterComponent: <TableFilterIcon valueKey={valueKey} />,
    style: { minWidth: width, width, textAlign: 'right', ...style },
    render(data, index, externalResource) {
      return (
        <Flex sx={{ width: '100%', justifyContent: style?.textAlign ?? 'right' }}>
          {renderChangeValue({
            data,
            valueKey,
            valuePrefix,
            valueSuffix,
            changeValuePrefix,
            changeValueSuffix,
            externalResource,
            topValueHighlighting,
          })}
        </Flex>
      )
    },
  }
  return columnData
}

/**
 * use for column like: +$20.2b
 */
export function getSignValueColumnConfig({
  valueKey,
  valuePrefix = '',
  valueSuffix = '',
  width = 150,
  style = {},
  hasSort = true,
}: {
  valueKey: keyof PerpDEXSourceResponse
  width?: number
  valuePrefix?: string
  valueSuffix?: string
  style?: Record<string, any>
  hasSort?: boolean
}) {
  const columnData: ColumnData<PerpDEXSourceResponse> = {
    dataIndex: valueKey,
    key: valueKey,
    title: renderTableTitleWithTooltip(valueKey),
    text: renderTableText(valueKey),
    searchText: getColumnSearchText(valueKey),
    sortBy: hasSort ? valueKey : undefined,
    style: { minWidth: width, width, textAlign: 'right', ...style },
    filterComponent: <TableFilterIcon valueKey={valueKey} />,
    render(data) {
      return (
        <Flex sx={{ width: '100%', justifyContent: 'right' }}>
          {renderSignValue({ data, valueKey, valuePrefix, valueSuffix })}
        </Flex>
      )
    },
  }
  return columnData
}

/**
 * use for column like: $20.2b with highlight text
 */
export function getNormalValueColumnConfig({
  valueKey,
  valuePrefix = '',
  valueSuffix = '',
  style = {},
  width = 200,
  textAlign = 'right',
  topValueHighlighting = false,
  type = 'number',
  hasSort = true,
}: {
  valueKey: keyof PerpDEXSourceResponse
  valuePrefix?: string
  valueSuffix?: string
  width?: number
  textAlign?: string
  style?: Record<string, any>
  topValueHighlighting?: boolean
  type?: NormalValueComponentType
  hasSort?: boolean
}) {
  const columnData: ColumnData<PerpDEXSourceResponse, ExternalResource> = {
    dataIndex: valueKey,
    key: valueKey,
    title: renderTableTitleWithTooltip(valueKey),
    searchText: getColumnSearchText(valueKey),
    text: renderTableText(valueKey),
    sortBy: hasSort ? valueKey : undefined,
    style: { minWidth: width, maxWidth: width, width, textAlign, ...style },
    filterComponent: <TableFilterIcon valueKey={valueKey} />,
    render(data, index, externalResource) {
      return renderNormalValue({
        data,
        valueKey,
        type,
        prefix: valuePrefix,
        suffix: valueSuffix,
        topValueHighlighting,
        externalResource,
      })
    },
  }
  return columnData
}

export function getLSRatioColumnConfig({
  valueKey,
  style = {},
}: {
  valueKey: keyof PerpDEXSourceResponse
  style?: Record<string, any>
}) {
  const columnData: ColumnData<PerpDEXSourceResponse> = {
    dataIndex: valueKey,
    key: valueKey,
    title: renderTableTitleWithTooltip(valueKey),
    text: renderTableText(valueKey),
    sortBy: valueKey,
    style: { minWidth: 150, width: 150, textAlign: 'right', ...style },
    render(data) {
      return (
        <Flex flexDirection="column" width="100%" alignItems="flex-end">
          {renderLSRatio({ data, valueKey })}
        </Flex>
      )
    },
  }
  return columnData
}
