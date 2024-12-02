import { ChainFilterDropdown } from 'components/@widgets/ChainSelection'
import { useChains } from 'pages/PerpDEXsExplorer/hooks/useChains'

export default function ChainFilter() {
  const { chains, changeChains } = useChains()

  return (
    <ChainFilterDropdown
      selectedChains={chains}
      onApply={(chains) => changeChains(chains)}
      onReset={() => changeChains(undefined)}
    />
  )
}
