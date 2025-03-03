import { SelectedMarkets } from 'components/@ui/MarketFilter/SelectedMarkets'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Type } from 'theme/base'

export default function FilterPairTag({
  pairs,
  excludedPairs,
  onClear,
}: {
  pairs: string[]
  excludedPairs: string[]
  onClear: () => void
}) {
  const { hasFilter } = useFilterPairs({ pairs, excludedPairs })
  return (
    <TagWrapper onClear={hasFilter ? onClear : undefined}>
      <Type.Caption>
        <SelectedMarkets pairs={pairs} excludedPairs={excludedPairs} />
      </Type.Caption>
    </TagWrapper>
  )
}
