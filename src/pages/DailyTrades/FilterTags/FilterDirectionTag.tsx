import { DIRECTION_OPTIONS } from 'components/@dailyTrades/DirectionFilterIcon'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Type } from 'theme/base'

import { useDailyOrdersContext } from '../Orders/useOrdersProvider'

export default function OrderDirectionTag() {
  const { direction, changeDirection } = useDailyOrdersContext()
  if (!direction) return null
  return (
    <TagWrapper onClear={direction ? () => changeDirection(undefined) : undefined}>
      <Type.Caption>Direction:</Type.Caption>
      {direction ? (
        <Type.Caption>{DIRECTION_OPTIONS.find((o) => o.value === direction)?.label}</Type.Caption>
      ) : (
        <Type.Caption>All</Type.Caption>
      )}
    </TagWrapper>
  )
}
