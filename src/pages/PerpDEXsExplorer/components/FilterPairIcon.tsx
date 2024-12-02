import { Funnel } from '@phosphor-icons/react'

import useSearchParams from 'hooks/router/useSearchParams'
import { FilterPairDropdown } from 'pages/PerpDEXsExplorer/components/FilterPairDropdown'
import { IconBox } from 'theme/base'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { getPairsByProtocols } from 'utils/helpers/graphql'

function FilterPairIcon() {
  const { searchParams, setSearchParams } = useSearchParams()
  const protocolPairs = getPairsByProtocols(RELEASED_PROTOCOLS)

  const currentPairs = (searchParams['pairs'] as string)?.split('_') ?? [] // pairs
  const isExcluded = searchParams['isExcludedPairs'] === '1'
  const isCopyAll = !isExcluded && currentPairs.length === protocolPairs?.length
  const onChangePairs = (pairs: string[], unPairs: string[]) => {
    if (unPairs?.length) {
      setSearchParams({ ['pairs']: unPairs.join('_'), ['isExcludedPairs']: '1' })
    } else {
      if (!pairs?.length || pairs?.length === protocolPairs?.length) {
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
        role="button"
        icon={<Funnel size={16} weight={hasFilter ? 'fill' : 'regular'} />}
        sx={{
          // transform: 'translateY(-1.5px)',
          color: hasFilter ? 'neutral2' : 'neutral3',
          '&:hover:': { color: 'neutral1' },
        }}
      />
    </FilterPairDropdown>
  )
}

export default FilterPairIcon
