import { TableSelectFilterIcon } from 'components/@widgets/TableFilter/TableSelectFilter'
import { TableFilterConfig } from 'components/@widgets/TableFilter/types'
import useSearchParams from 'hooks/router/useSearchParams'

function FilterSelectIcon({ config }: { config: TableFilterConfig }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const { urlParamKey, options } = config
  if (!urlParamKey || !options?.length) return null
  const currentFilter = searchParams[urlParamKey] as string
  const changeFilter = (filter: string | undefined) => setSearchParams({ [urlParamKey]: filter })
  return <TableSelectFilterIcon currentFilter={currentFilter} changeFilter={changeFilter} options={options} />
}

export default FilterSelectIcon
