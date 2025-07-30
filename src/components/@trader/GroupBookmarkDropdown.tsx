import { ArrowSquareOut } from '@phosphor-icons/react'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import FilterItemWrapper from 'components/@ui/FilterItemWrapper'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSearchParams from 'hooks/router/useSearchParams'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { BOOKMARK_NO_GROUP_KEY } from 'utils/config/constants'
import { AlertCustomType, SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

interface GroupBookmarkDropdownProps {
  currentGroupId?: string
  onChangeGroupId: (groupId: string | undefined) => void
  buttonVariant?: 'ghostPrimary' | 'ghostInactive'
  menuSx?: any
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  allowedFilter?: boolean
  planToFilter?: SubscriptionPlanEnum
}

export default function GroupBookmarkDropdown({
  currentGroupId,
  onChangeGroupId,
  buttonVariant = 'ghostPrimary',
  menuSx = {},
  placement = 'bottomLeft',
  allowedFilter = true,
  planToFilter,
}: GroupBookmarkDropdownProps) {
  const { bookmarkGroups, loadingBookmarkGroups } = useBotAlertContext()
  const { setSearchParams } = useSearchParams()

  const groups = useMemo(() => {
    return bookmarkGroups?.filter((alert) => alert.type === AlertCustomType.TRADER_BOOKMARK)
  }, [bookmarkGroups])

  const currentGroupInfo = useMemo(() => {
    if (!currentGroupId || currentGroupId === BOOKMARK_NO_GROUP_KEY) return null
    return groups?.find((group) => group.id === currentGroupId)
  }, [currentGroupId, groups])

  useEffect(() => {
    if (loadingBookmarkGroups) return
    if (!currentGroupInfo && currentGroupId) {
      setSearchParams({ groupId: undefined })
    }
  }, [currentGroupInfo, currentGroupId, setSearchParams, loadingBookmarkGroups])

  return (
    <FilterItemWrapper allowedFilter={allowedFilter} planToFilter={planToFilter}>
      <Dropdown
        buttonVariant={buttonVariant}
        inline
        iconSize={allowedFilter ? undefined : 0}
        menuSx={{ width: 200, ...menuSx }}
        placement={placement}
        menu={
          allowedFilter ? (
            <Box sx={{ maxHeight: 250, overflowY: 'auto', py: 2 }}>
              {!groups?.length ? (
                <>
                  <Box px={12} py={2}>
                    <Type.Caption color="neutral3">You can filter data by</Type.Caption>
                    <Flex as={Link} sx={{ alignItems: 'center' }} to={ROUTES.BOOKMARKS.path} target="_blank">
                      <Type.Caption>Group Bookmark</Type.Caption>
                      <IconBox icon={<ArrowSquareOut size={12} />} sx={{ ml: 1 }} />
                    </Flex>
                  </Box>
                </>
              ) : (
                <>
                  <DropdownItem
                    isActive={!currentGroupId || currentGroupId === BOOKMARK_NO_GROUP_KEY}
                    onClick={() => onChangeGroupId(undefined)}
                  >
                    All Traders
                  </DropdownItem>
                  {groups.map((group) => (
                    <DropdownItem
                      key={group.id}
                      isActive={currentGroupId === group.id}
                      onClick={() => onChangeGroupId(group.id)}
                      sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {group.name || 'Unnamed Group'}
                    </DropdownItem>
                  ))}
                </>
              )}
            </Box>
          ) : (
            <></>
          )
        }
      >
        <Type.Caption>{currentGroupInfo ? currentGroupInfo.name : 'All Traders'}</Type.Caption>
      </Dropdown>
    </FilterItemWrapper>
  )
}
