import MarketGroup from 'components/@ui/MarketGroup'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Type } from 'theme/base'
import { getSymbolFromPair } from 'utils/helpers/transform'

export default function FilterPairTag({ pairs, onClear }: { pairs: string[] | undefined; onClear: () => void }) {
  return (
    <TagWrapper onClear={pairs?.length ? onClear : undefined}>
      <Type.Caption>Pair:</Type.Caption>
      {pairs?.length ? (
        <MarketGroup symbols={pairs.map((p) => getSymbolFromPair(p))} />
      ) : (
        <Type.Caption>All pairs</Type.Caption>
      )}
    </TagWrapper>
  )
}
