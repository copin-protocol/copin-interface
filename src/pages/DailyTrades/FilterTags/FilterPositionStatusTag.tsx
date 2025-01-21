import { POSITION_STATUS_OPTIONS } from 'components/@dailyTrades/PositionStatusFilterIcon'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Type } from 'theme/base'

import { useDailyPositionsContext } from '../Positions/usePositionsProvider'

export default function FilterPositionStatusTag() {
  const { status, changeStatus } = useDailyPositionsContext()
  return (
    <TagWrapper onClear={status ? () => changeStatus(undefined) : undefined}>
      <Type.Caption>Status:</Type.Caption>
      {status ? (
        <Type.Caption>{POSITION_STATUS_OPTIONS.find((o) => o.value === status)?.label}</Type.Caption>
      ) : (
        <Type.Caption>All</Type.Caption>
      )}
    </TagWrapper>
  )
}
