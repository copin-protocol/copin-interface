import { Funnel } from '@phosphor-icons/react'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import { FilterPairDropdown } from 'pages/PerpDEXsExplorer/components/FilterPairDropdown'
import { IconBox } from 'theme/base'
import { parsePairsFromQueryString, stringifyPairsQuery } from 'utils/helpers/transform'

function FilterPairIcon() {
  const { searchParams, setSearchParams } = useSearchParams()
  const { getListSymbol } = useMarketsConfig()
  const allPairs = getListSymbol?.()

  const currentPairs = parsePairsFromQueryString(searchParams['pairs'] as string)
  const isExcluded = searchParams['isExcludedPairs'] === '1'
  const isCopyAll = !isExcluded && currentPairs.length === allPairs?.length
  const onChangePairs = (pairs: string[], unPairs: string[]) => {
    if (unPairs?.length) {
      setSearchParams({ ['pairs']: stringifyPairsQuery(unPairs), ['isExcludedPairs']: '1' })
    } else {
      if (!pairs?.length || pairs?.length === allPairs?.length) {
        setSearchParams({ ['pairs']: undefined, ['isExcludedPairs']: undefined })
      } else {
        setSearchParams({ ['pairs']: stringifyPairsQuery(pairs), ['isExcludedPairs']: undefined })
      }
    }
  }
  const hasFilter = !isCopyAll && currentPairs.length
  return (
    <FilterPairDropdown currentPairs={currentPairs} onChangePairs={onChangePairs} isExcluded={isExcluded}>
      <IconBox
        icon={<Funnel size={16} weight={hasFilter ? 'fill' : 'regular'} />}
        sx={{
          transform: 'translateY(-1.5px)',
        }}
      />
    </FilterPairDropdown>
  )
}

export default FilterPairIcon
