import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

import { Box, Flex, Type } from 'theme/base'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'

interface GroupAlert {
  userId: string
  name: string
  id?: string
  category?: any
  isActive?: boolean
}

export const GroupAlertList = ({
  groupAlerts = [],
  onSelectGroupAlert,
}: {
  groupAlerts?: GroupAlert[]
  onSelectGroupAlert?: (groupAlert: GroupAlert) => void
  address?: string
  protocol?: string
}) => {
  const history = useHistory()

  const handleSelectGroupAlert = (groupAlert: GroupAlert) => {
    onSelectGroupAlert?.(groupAlert)
    if (groupAlert.id && groupAlert.category) {
      history.push(
        generateAlertSettingDetailsRoute({
          id: groupAlert.id,
          type: groupAlert.category,
        })
      )
    }
  }
  return (
    <>
      <Flex
        sx={{
          maxHeight: '120px',
          overflowY: 'auto',
          flexWrap: 'wrap',
        }}
      >
        {groupAlerts.map((groupAlert) => {
          const dotTooltipId = `alert_group_status_${groupAlert.id || groupAlert.userId}`
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                px: 2,
                mt: 2,
                mr: 1,
                borderRadius: 'sm',
                bg: 'neutral5',
                cursor: 'pointer',
                '&:hover': {
                  bg: 'neutral4',
                },
              }}
              key={groupAlert.id || groupAlert.userId}
              p={1}
              onClick={() => handleSelectGroupAlert(groupAlert)}
            >
              <Box
                data-tooltip-id={dotTooltipId}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: groupAlert.isActive ? 'green2' : 'red1',
                  mr: 2,
                  cursor: 'pointer',
                }}
              />
              <Tooltip id={dotTooltipId} place="top">
                <Type.Caption color="neutral2">{groupAlert.isActive ? 'Active group' : 'Inactive group'}</Type.Caption>
              </Tooltip>
              <Type.Caption color="neutral1">
                <Trans>{groupAlert.name}</Trans>
              </Type.Caption>
            </Box>
          )
        })}
      </Flex>
    </>
  )
}
