import { Funnel } from '@phosphor-icons/react'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import { FilterPairDropdown } from 'pages/PerpDEXsExplorer/components/FilterPairDropdown'
import { IconBox } from 'theme/base'

function FilterPairIcon() {
  const { searchParams, setSearchParams } = useSearchParams()
  const { getListSymbol } = useMarketsConfig()
  const allPairs = getListSymbol()

  const currentPairs = (searchParams['pairs'] as string)?.split('_') ?? [] // pairs
  const isExcluded = searchParams['isExcludedPairs'] === '1'
  const isCopyAll = !isExcluded && currentPairs.length === allPairs?.length
  const onChangePairs = (pairs: string[], unPairs: string[]) => {
    if (unPairs?.length) {
      setSearchParams({ ['pairs']: unPairs.join('_'), ['isExcludedPairs']: '1' })
    } else {
      if (!pairs?.length || pairs?.length === allPairs?.length) {
        setSearchParams({ ['pairs']: undefined, ['isExcludedPairs']: undefined })
      } else {
        setSearchParams({ ['pairs']: pairs.join('_'), ['isExcludedPairs']: undefined })
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
