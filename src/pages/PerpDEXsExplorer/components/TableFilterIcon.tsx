import TableRangeFilterIcon from 'components/@widgets/TableFilter/TableRangeFilterIcon'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import FilterMultiSelectIcon from 'pages/PerpDEXsExplorer/components/FilterMultiSelectIcon'
import FilterPairIcon from 'pages/PerpDEXsExplorer/components/FilterPairIcon'
import FilterSelectIcon from 'pages/PerpDEXsExplorer/components/FilterSelectIcon'
import { TABLE_RANGE_FILTER_CONFIGS } from 'pages/PerpDEXsExplorer/configs'

function TableFilterIcon({ valueKey }: { valueKey: keyof PerpDEXSourceResponse }) {
  const filterConfig = TABLE_RANGE_FILTER_CONFIGS[valueKey]
  if (!filterConfig) return null
  if (filterConfig.type === 'number' || filterConfig.type === 'duration') {
    return <TableRangeFilterIcon config={filterConfig} sx={{ ml: 1 }} />
  }
  if (filterConfig.type === 'select') {
    return <FilterSelectIcon config={filterConfig} />
  }
  if (filterConfig.type === 'multiSelect') {
    return <FilterMultiSelectIcon config={filterConfig} />
  }
  if (filterConfig.type === 'pairs') {
    return <FilterPairIcon />
  }
  return null
}

export default TableFilterIcon
