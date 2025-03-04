import { SelectedMarkets } from 'components/@ui/MarketFilter/SelectedMarkets'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Box, Type } from 'theme/base'
import { Color } from 'theme/types'

export default function FilterPairTag({
  pairs,
  excludedPairs,
  onClear,
  tagSx,
  textColor,
  hasLabel,
}: {
  pairs?: string[]
  excludedPairs?: string[]
  onClear?: () => void
  tagSx?: any
  textColor?: Color
  hasLabel?: boolean
}) {
  const { hasFilter } = useFilterPairs({ pairs: pairs ?? [], excludedPairs: excludedPairs ?? [] })
  return (
    <TagWrapper onClear={hasFilter && onClear ? onClear : undefined} sx={tagSx}>
      {hasLabel && <Type.Caption>Pairs:</Type.Caption>}
      <Box>
        <Type.Caption color={textColor ?? 'inherit'}>
          <SelectedMarkets pairs={pairs ?? []} excludedPairs={excludedPairs ?? []} />
        </Type.Caption>
      </Box>
    </TagWrapper>
  )
}
