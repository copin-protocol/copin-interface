import MarketGroup from 'components/@ui/MarketGroup'
import IconGroup from 'components/@widgets/IconGroup'
import TagWrapper from 'components/@widgets/TableFilter/TagWrapper'
import { resetRangeFilter } from 'components/@widgets/TableFilter/helpers'
import useSearchParams from 'hooks/router/useSearchParams'
import { COLLATERAL_ASSETS } from 'pages/PerpDEXsExplorer/constants/perpdex'
import { getFilters } from 'pages/PerpDEXsExplorer/utils'
import { Flex, Type } from 'theme/base'
import { parseCollateralImage } from 'utils/helpers/transform'

// TODO: improve performance
export default function FilterTags() {
  const { searchParams, setSearchParams } = useSearchParams()
  const filters = getFilters({ searchParams: searchParams as Record<string, string> })
  const handleClear = (urlParamKey: string) => setSearchParams({ [urlParamKey]: null })
  const hasFilter = !!filters?.filter((f) => f.fieldName !== 'pairs' && f.fieldName !== 'collateralAssets')?.length
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      {!hasFilter && <Type.Caption color="neutral2">No filter</Type.Caption>}
      {hasFilter && <Type.Caption sx={{ flexShrink: 0 }}>Filters:</Type.Caption>}
      {filters.map((filter) => {
        if (filter.type === 'number' || filter.type === 'duration') {
          let text = ''
          let prefix = ''
          let suffix = ''
          if (filter.unit === '$') {
            prefix = filter.unit
          } else {
            suffix = filter.unit
          }
          if (filter.gte != null && filter.lte != null) {
            text = `${prefix}${filter.gte}${suffix} to ${prefix}${filter.lte}${suffix}`
          } else if (filter.gte != null) {
            text = `>${prefix}${filter.gte}${suffix}`
          } else if (filter.lte != null) {
            text = `<${prefix}${filter.lte}${suffix}`
          }
          return (
            <TagWrapper
              key={filter.fieldName}
              label={filter.label}
              value={text}
              onClear={() => resetRangeFilter({ setSearchParams, urlParamKey: filter.urlParamKey })}
            />
          )
        }
        if (filter.type === 'select') {
          if (!filter.selectedValue) return null
          return (
            <TagWrapper
              key={filter.fieldName}
              label={filter.label}
              value={filter.selectedValue}
              onClear={() => handleClear(filter.urlParamKey)}
            />
          )
        }
        if (filter.type === 'multiSelect') {
          if (filter.fieldName === 'collateralAssets') {
            const values = filter.listSelectedValue
            if (!values?.length || values.length === COLLATERAL_ASSETS.length) return null
            // return <TagWrapper key={filter.fieldName} label={filter.label} value={'All Assets'} />
            return (
              <TagWrapper
                key={filter.fieldName}
                label={filter.label}
                value={<IconGroup iconNames={values} iconUriFactory={parseCollateralImage} />}
                onClear={() => handleClear(filter.urlParamKey)}
              />
            )
          }
        }
        if (filter.type === 'pairs') {
          if (!filter.pairs) {
            return null
            // return <TagWrapper key={filter.fieldName} label={filter.label} value={'All'} />
          }
          return (
            <TagWrapper
              key={filter.fieldName}
              label={filter.isExcluded ? 'Excluded Pairs' : 'Pairs'}
              value={<MarketGroup symbols={filter.pairs} />}
              onClear={() => setSearchParams({ pairs: null, isExcludedPairs: null })}
            />
          )
        }
        return null
      })}
    </Flex>
  )
}
