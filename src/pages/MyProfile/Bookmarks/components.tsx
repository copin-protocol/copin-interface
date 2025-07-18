import { Trans } from '@lingui/macro'
import { Bell, BellSimpleSlash, DotsThreeVertical, Trash } from '@phosphor-icons/react'
import QueryString from 'qs'
import { Link, useHistory } from 'react-router-dom'

import UpgradeModal from 'components/@subscription/UpgradeModal'
import { BotAlertData } from 'entities/alert'
import useAlertDashboardContext from 'hooks/features/alert/useAlertDashboardContext'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Dropdown from 'theme/Dropdown'
import { DropdownItem } from 'theme/Dropdown'
import Popconfirm from 'theme/Popconfirm'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { BOOKMARK_NO_GROUP_KEY } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'

export const GroupItem = ({
  name,
  id,
  isActive = false,
  onChangeGroup,
  onDelete,
}: {
  name: string
  id?: string
  isActive?: boolean
  onChangeGroup: () => void
  onDelete?: () => void
}) => {
  return (
    <Button
      variant="ghost"
      block
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        borderRadius: 'xs',
        '&:hover': { backgroundColor: 'neutral5' },
      }}
      onClick={onChangeGroup}
    >
      <Type.Caption
        color={isActive ? 'neutral1' : 'neutral3'}
        sx={{ textTransform: 'none', fontWeight: isActive ? 'bold' : 'normal' }}
      >
        {name}
      </Type.Caption>

      {!!id && (
        <Box
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <MoreDropdown alertId={id} onDelete={onDelete} />
        </Box>
      )}
    </Button>
  )
}

export const MoreDropdown = ({
  alertId,
  onDelete,
  shouldShowAlertSettings = false,
}: {
  alertId?: string
  onDelete?: () => void
  shouldShowAlertSettings?: boolean
}) => {
  return (
    <Dropdown
      inline
      hasArrow={false}
      buttonVariant="ghost"
      menu={
        <Box my={1}>
          {shouldShowAlertSettings && (
            <Link to={`${ROUTES.ALERT_SETTING_DETAILS.path_prefix}/custom/${alertId}`}>
              <DropdownItem variant="ghost" sx={{ display: 'flex', alignItems: 'center', gap: 12, mb: 1 }}>
                <Bell size={16} />
                <Type.Caption>
                  <Trans>ALERT SETTINGS</Trans>
                </Type.Caption>
              </DropdownItem>
            </Link>
          )}

          <Popconfirm
            action={
              <DropdownItem
                variant="ghostDanger"
                sx={{ display: 'flex', alignItems: 'center', gap: 12 }}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <Trash size={16} />
                <Type.Caption>
                  <Trans>REMOVE GROUP</Trans>
                </Type.Caption>
              </DropdownItem>
            }
            title="Are you sure you want to delete this group?"
            onConfirm={() => {
              onDelete?.()
            }}
            confirmButtonProps={{ variant: 'ghostDanger' }}
          />
        </Box>
      }
    >
      <IconBox sx={{ color: 'neutral2' }} icon={<DotsThreeVertical size={16} />} />
    </Dropdown>
  )
}
export const Actions = ({
  searchParams,
  groupInfo,
  updateCustomAlert,
  deleteCustomAlert,
  tradersCount,
}: {
  searchParams: QueryString.ParsedQs
  groupInfo: BotAlertData | undefined
  updateCustomAlert: (data: { id: string; data: { enableAlert: boolean; showAlert: boolean } }) => void
  deleteCustomAlert: (id: string) => void
  tradersCount: number
}) => {
  const history = useHistory()
  const { openLimitModal, setOpenLimitModal, usage } = useAlertDashboardContext()
  const { userPermission } = useAlertPermission()
  const totalCustoms = usage?.customAlerts ?? 0
  const maxCustoms = userPermission?.customPersonalQuota ?? 0
  const isLimited = totalCustoms >= maxCustoms

  return searchParams?.groupId !== BOOKMARK_NO_GROUP_KEY ? (
    <Flex sx={{ gap: 2, alignItems: 'center' }}>
      {groupInfo?.enableAlert === false && (
        <ButtonWithIcon
          disabled={tradersCount === 0}
          onClick={async () => {
            if (isLimited) {
              setOpenLimitModal(true)
              return
            }
            await updateCustomAlert({
              id: groupInfo?.id as string,
              data: {
                enableAlert: true,
                showAlert: true,
              },
            })
            if (groupInfo?.channels?.length === 0) {
              history.push(`${ROUTES.ALERT_SETTING_DETAILS.path_prefix}/custom/${groupInfo?.id}`)
            }
          }}
          variant="ghostPrimary"
          icon={<Bell size={16} />}
          sx={{ height: 'fit-content', p: 0 }}
        >
          <Box display={['none', 'block']} as="span">
            <Trans>Alert Group</Trans>
          </Box>
          <Box display={['block', 'none']} as="span">
            <Trans>Alert</Trans>
          </Box>
        </ButtonWithIcon>
      )}

      {openLimitModal && (
        <UpgradeModal
          isOpen={openLimitModal}
          onDismiss={() => setOpenLimitModal(false)}
          title={<Trans>YOU’VE HIT YOUR CUSTOM ALERTS LIMIT</Trans>}
          description={
            <Trans>
              You’re reach the maximum of custom alerts for your current plan. Upgrade your plan to unlock more custom
              alerts.
            </Trans>
          }
        />
      )}

      {groupInfo?.enableAlert === true && (
        <ButtonWithIcon
          onClick={() => {
            updateCustomAlert({
              id: groupInfo?.id as string,
              data: {
                enableAlert: false,
                showAlert: false,
              },
            })
          }}
          variant="ghost"
          icon={<BellSimpleSlash size={16} />}
          sx={{ height: 'fit-content', p: 0 }}
        >
          <Trans>Unnotify Group</Trans>
        </ButtonWithIcon>
      )}
      <MoreDropdown
        shouldShowAlertSettings={groupInfo?.enableAlert}
        alertId={searchParams.groupId as string}
        onDelete={() => {
          deleteCustomAlert(searchParams.groupId as string)
        }}
      />
    </Flex>
  ) : (
    <></>
  )
}
