import { Warning } from '@phosphor-icons/react'
import React from 'react'
import { Link } from 'react-router-dom'

import { BotAlertData } from 'entities/alert'
import { Button } from 'theme/Buttons'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { AlertSettingsEnum, AlertTypeEnum } from 'utils/config/enums'
import { ALERT_TYPE_TRANS } from 'utils/config/translations'
import { formatLocalRelativeDate } from 'utils/helpers/format'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'

export const AlertStatus = ({ data }: { data: BotAlertData }) => {
  const tooltipId = `tt_${data.id}`
  return (
    <>
      <Box data-tip="React-tooltip" data-tooltip-id={tooltipId}>
        <SwitchInput checked={data.isRunning} disabled />
      </Box>
      <Tooltip id={tooltipId}>
        <Type.Caption color="neutral3">Coming Soon</Type.Caption>
      </Tooltip>
    </>
  )
}

export const AlertLastMessageAt = ({ data }: { data: BotAlertData }) => {
  return (
    <Type.Caption color="neutral1">
      {data.lastMessageAt ? formatLocalRelativeDate(data.lastMessageAt) : 'N/A'}
    </Type.Caption>
  )
}

export const AlertType = ({ data }: { data: BotAlertData }) => {
  return (
    <Type.Caption color={data.type === AlertTypeEnum.CUSTOM ? 'violet' : 'orange2'}>
      {data.type ? ALERT_TYPE_TRANS[data.type] : 'N/A'}
    </Type.Caption>
  )
}

export const AlertName = ({
  data,
  totalTraders,
  maxTraders,
}: {
  data: BotAlertData
  totalTraders: number
  maxTraders: number
}) => {
  return (
    <Type.Caption color="neutral1" sx={{ textTransform: 'capitalize' }}>
      {data.type === AlertTypeEnum.TRADERS ? `${data.name} (${totalTraders}/${maxTraders})` : data.name}
    </Type.Caption>
  )
}

export const AlertChannel = ({ data }: { data: BotAlertData }) => {
  return !!data.chatId ? (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <TelegramIcon size={18} variant="Bold" />
      <Type.Caption color="neutral1">@{data.chatId}</Type.Caption>
    </Flex>
  ) : (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <Warning size={16} color={themeColors.orange1} />
      <Type.Caption color="neutral1">No channel yet,</Type.Caption>
      <Button
        as={Link}
        to={generateAlertSettingDetailsRoute({
          id: data.id.toLowerCase(),
          params: { step: AlertSettingsEnum.CHANNEL },
        })}
        variant="ghostPrimary"
        p={0}
      >
        <Type.Caption>Go to settings</Type.Caption>
      </Button>
    </Flex>
  )
}

export const AlertActions = ({ data }: { data: BotAlertData }) => {
  return (
    <Button as={Link} to={generateAlertSettingDetailsRoute({ id: data.id.toLowerCase() })} variant="ghostPrimary" p={0}>
      <Type.Caption>Edit</Type.Caption>
    </Button>
  )
}
