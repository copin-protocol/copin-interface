import { TableMultiSelectFilterIcon } from 'components/@widgets/TableFilter/TableMultiSelectFilter'
import { TableFilterConfig } from 'components/@widgets/TableFilter/types'
import useSearchParams from 'hooks/router/useSearchParams'

export default function FilterMultiSelectIcon({ config }: { config: TableFilterConfig }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const { urlParamKey, multiSelectOptions } = config
  if (!urlParamKey || !multiSelectOptions?.length) return null
  const currentFilter = (searchParams[urlParamKey] as string)?.split('_') ?? multiSelectOptions.map((v) => v.value)
  const onApply = (filter: string[] | undefined) => setSearchParams({ [urlParamKey]: filter?.join('_') })
  const onReset = () => setSearchParams({ [urlParamKey]: undefined })
  return (
    <TableMultiSelectFilterIcon
      options={multiSelectOptions}
      currentFilter={currentFilter}
      onApply={onApply}
      onReset={onReset}
    />
  )
}
