import GroupBookmarkDropdown from 'components/@trader/GroupBookmarkDropdown'
import { Flex, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

interface FilterGroupBookmarkTagProps {
  currentGroupId?: string
  onChangeGroupId?: (groupId: string | undefined) => void
  allowedFilter?: boolean
  planToFilter?: SubscriptionPlanEnum
}

export default function FilterGroupBookmarkTag({
  currentGroupId,
  onChangeGroupId,
  allowedFilter,
  planToFilter,
}: FilterGroupBookmarkTagProps) {
  if (!onChangeGroupId) return null

  return (
    <Flex sx={{ alignItems: 'center', gap: 1, mr: 2, flexShrink: 0 }}>
      <Type.Caption mr={1} display={['none', 'none', 'block']} color="neutral2">
        TRADERS:
      </Type.Caption>
      <GroupBookmarkDropdown
        currentGroupId={currentGroupId}
        onChangeGroupId={onChangeGroupId}
        allowedFilter={allowedFilter}
        planToFilter={planToFilter}
      />
    </Flex>
  )
}
