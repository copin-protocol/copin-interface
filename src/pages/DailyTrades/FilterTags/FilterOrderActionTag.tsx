import { ORDER_ACTION_OPTIONS } from 'components/@dailyTrades/OrderActionFilterTitle'
import { Type } from 'theme/base'

import { useDailyOrdersContext } from '../Orders/useOrdersProvider'
import TagWrapper from './TagWrapper'

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
