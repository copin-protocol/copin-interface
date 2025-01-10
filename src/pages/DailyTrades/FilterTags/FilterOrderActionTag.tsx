import { ORDER_ACTION_OPTIONS } from 'components/@dailyTrades/OrderActionFilterIcon'
import { Type } from 'theme/base'

import TagWrapper from '../../../theme/Tag/TagWrapper'
import { useDailyOrdersContext } from '../Orders/useOrdersProvider'

export default function FilterOrderActionTag() {
  const { action, changeAction } = useDailyOrdersContext()
  return (
    <TagWrapper onClear={action ? () => changeAction(undefined) : undefined}>
      <Type.Caption>Action:</Type.Caption>
      {action ? (
        <Type.Caption>{ORDER_ACTION_OPTIONS.find((o) => o.value === action)?.label}</Type.Caption>
      ) : (
        <Type.Caption>All</Type.Caption>
      )}
    </TagWrapper>
  )
}
