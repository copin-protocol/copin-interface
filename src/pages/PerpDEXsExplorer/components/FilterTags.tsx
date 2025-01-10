import MarketGroup from 'components/@ui/MarketGroup'
import IconGroup from 'components/@widgets/IconGroup'
import { resetRangeFilter } from 'components/@widgets/TableFilter/helpers'
import useSearchParams from 'hooks/router/useSearchParams'
import { COLLATERAL_ASSETS } from 'pages/PerpDEXsExplorer/constants/perpdex'
import { getFilters } from 'pages/PerpDEXsExplorer/utils'
import TagWrapper from 'theme/Tag/TagWrapper'
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
      {!hasFilter && <Type.Caption color="neutral2">NO FILTER</Type.Caption>}
      {hasFilter && (
        <Type.Caption sx={{ flexShrink: 0 }} color="neutral2">
          FILTERS:
        </Type.Caption>
      )}
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
            text = `> ${prefix}${filter.gte}${suffix}`
          } else if (filter.lte != null) {
            text = `< ${prefix}${filter.lte}${suffix}`
          }
          return (
            <TagWrapper
              key={filter.fieldName}
              onClear={() => resetRangeFilter({ setSearchParams, urlParamKey: filter.urlParamKey })}
            >
              <Type.Caption>{filter.label}</Type.Caption>
              <Type.Caption>{text}</Type.Caption>
            </TagWrapper>
          )
        }
        if (filter.type === 'select') {
          if (!filter.selectedValue) return null
          return (
            <TagWrapper key={filter.fieldName} onClear={() => handleClear(filter.urlParamKey)}>
              <Type.Caption>{filter.label}</Type.Caption>
              <Type.Caption>{filter.selectedValue}</Type.Caption>
            </TagWrapper>
          )
        }
        if (filter.type === 'multiSelect') {
          if (filter.fieldName === 'collateralAssets') {
            const values = filter.listSelectedValue
            if (!values?.length || values.length === COLLATERAL_ASSETS.length) return null
            // return <TagWrapper key={filter.fieldName} label={filter.label} value={'All Assets'} />
            return (
              <TagWrapper key={filter.fieldName} onClear={() => handleClear(filter.urlParamKey)}>
                <Type.Caption>{filter.label}</Type.Caption>
                <Type.Caption>{<IconGroup iconNames={values} iconUriFactory={parseCollateralImage} />}</Type.Caption>
              </TagWrapper>
            )
          }
        }
        if (filter.type === 'pairs') {
          if (!filter.pairs) {
            return null
            // return <TagWrapper key={filter.fieldName} label={filter.label} value={'All'} />
          }
          return (
            <TagWrapper key={filter.fieldName} onClear={() => setSearchParams({ pairs: null, isExcludedPairs: null })}>
              <Type.Caption>{filter.isExcluded ? 'Excluded Pairs' : 'Pairs'}</Type.Caption>
              <Type.Caption>
                <MarketGroup symbols={filter.pairs} />
              </Type.Caption>
            </TagWrapper>
          )
        }
        return null
      })}
    </Flex>
  )
}
