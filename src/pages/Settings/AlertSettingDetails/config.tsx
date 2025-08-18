import { Trash } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'

import ActiveDot from 'components/@ui/ActiveDot'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { AlertSettingData, TraderAlertData } from 'entities/alert'
import useSettingChannels from 'hooks/features/alert/useSettingChannels'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import CopyButton from 'theme/Buttons/CopyButton'
import IconButton from 'theme/Buttons/IconButton'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import WebhookIcon from 'theme/Icons/WebhookIcon'
import Popconfirm from 'theme/Popconfirm'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Flex, Type } from 'theme/base'
import { ChannelStatusEnum, ChannelTypeEnum } from 'utils/config/enums'
import { CHANNEL_STATUS_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'

export const TraderStatus = ({ data }: { data: TraderAlertData }) => {
  const { updateTraderAlert, submittingUpdate } = useSettingWatchlistTraders({})
  const handleUpdateAlert = (alertId?: string) => {
    if (alertId) {
      updateTraderAlert(alertId)
    }
  }
  return (
    <SwitchInput checked={data.enableAlert} disabled={submittingUpdate} onClick={() => handleUpdateAlert(data?.id)} />
  )
}

export const TraderCreatedAt = ({ data }: { data: TraderAlertData }) => {
  return (
    <Type.Caption color="neutral1">{data.createdAt ? formatLocalRelativeDate(data.createdAt) : 'N/A'}</Type.Caption>
  )
}

export const TraderLastTradeAt = ({ data }: { data: TraderAlertData }) => {
  return (
    <Type.Caption color="neutral1">{data.lastTradeAt ? formatLocalRelativeDate(data.lastTradeAt) : 'N/A'}</Type.Caption>
  )
}

export const Trader24hTrades = ({ data }: { data: TraderAlertData }) => {
  return <Type.Caption color="neutral1">{data.trade24h ? formatNumber(data.trade24h) : 'N/A'}</Type.Caption>
}
export const Trader30dTrades = ({ data }: { data: TraderAlertData }) => {
  return <Type.Caption color="neutral1">{data.trade30D ? formatNumber(data.trade30D) : 'N/A'}</Type.Caption>
}

export function MobileRowItem({
  label,
  value,
  textColor = 'neutral1',
}: {
  label: ReactNode
  value: ReactNode
  textColor?: string
}) {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Type.Caption color="neutral3" display="block">
        {label}
      </Type.Caption>
      <Type.Caption color={textColor}>{value}</Type.Caption>
    </Flex>
  )
}

export const ChannelStatus = ({ data }: { data: AlertSettingData }) => {
  const { updateChannelAlert, updateChannelWebhookAlert, submittingUpdate, submittingUpdateWebhook } =
    useSettingChannels({})
  const handleUpdateChannel = (value: boolean) => {
    if (data.channelType === ChannelTypeEnum.WEBHOOK) {
      updateChannelWebhookAlert({ id: data.id, data: { isPause: !value } })
    } else {
      updateChannelAlert({ id: data.id, data: { isPause: !value } })
    }
  }
  return (
    <SwitchInput
      checked={!data.isPause}
      disabled={submittingUpdate || submittingUpdateWebhook}
      onChange={(event) => {
        const status = event.target.checked
        handleUpdateChannel(status)
      }}
    />
  )
}

export const ChannelName = ({ data }: { data: AlertSettingData }) => {
  const isWebhook = data.channelType === ChannelTypeEnum.WEBHOOK
  return (
    <Flex alignItems="center" sx={{ gap: 1, color: 'neutral1' }}>
      {isWebhook ? (
        <WebhookIcon minWidth={18} size={18} variant="Bold" color="neutral3" />
      ) : (
        <TelegramIcon minWidth={18} size={18} variant="Bold" color="neutral3" />
      )}
      <LabelWithTooltip
        id={data.id}
        tooltipClickable
        tooltip={
          <CopyButton
            type="button"
            variant="ghost"
            value={isWebhook ? data.webhookUrl ?? '' : data.chatId ?? ''}
            size="sm"
            sx={{ color: 'neutral3', px: 1, py: 0 }}
            iconSize={18}
          >
            <Type.Caption color="neutral2" textAlign="left">
              {isWebhook ? `Webhook Url: ${data.webhookUrl}` : `Telegram Chat ID: ${data.chatId}`}
            </Type.Caption>
          </CopyButton>
        }
        sx={{ ...overflowEllipsis() }}
      >
        {data.name}
      </LabelWithTooltip>
    </Flex>
  )
}

export const ChannelType = ({ data }: { data: AlertSettingData }) => {
  const isWebhook = data.channelType === ChannelTypeEnum.WEBHOOK
  return (
    <Type.Caption color="neutral1">
      {isWebhook ? 'Webhook' : !!data.chatId ? (Number(data.chatId) > 0 ? 'Direct' : 'Group') : 'N/A'}
    </Type.Caption>
  )
}

export const ChannelConnection = ({ data }: { data: AlertSettingData }) => {
  const isSuspended = data.status === ChannelStatusEnum.SUSPENDED
  const isWebhook = data.channelType === ChannelTypeEnum.WEBHOOK
  const color = isSuspended ? 'red2' : 'neutral1'
  const content = <Type.Caption color={color}>{data.status ? CHANNEL_STATUS_TRANS[data.status] : 'N/A'}</Type.Caption>
  return (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      {data.status && <ActiveDot color={color} size={4} />}
      {isWebhook ? (
        <LabelWithTooltip
          id={`tt-suspended-${data.id}`}
          tooltip={
            <Type.Caption color="neutral2">
              The system will automatically suspend the webhook if delivery fails more than 3 times.
            </Type.Caption>
          }
        >
          {content}
        </LabelWithTooltip>
      ) : (
        content
      )}
    </Flex>
  )
}

export const ChannelAction = ({ data }: { data: AlertSettingData }) => {
  const { deleteChannelAlert, deleteChannelWebhookAlert, submittingDelete, submittingDeleteWebhook } =
    useSettingChannels({})

  const handleUnlink = (id: string, channelType?: ChannelTypeEnum) => {
    if (channelType === ChannelTypeEnum.WEBHOOK) {
      deleteChannelWebhookAlert(id)
    } else {
      deleteChannelAlert(id)
    }
  }
  const isWebhook = data.channelType === ChannelTypeEnum.WEBHOOK
  return (
    <Flex alignItems="center" justifyContent="flex-end">
      <Popconfirm
        action={
          <IconButton
            variant="ghost"
            icon={<Trash size={16} />}
            size={16}
            sx={{
              color: 'neutral3',
              '&:hover:not(:disabled),&:active:not(:disabled)': {
                color: 'red1',
              },
            }}
            isLoading={submittingDelete || submittingDeleteWebhook}
            disabled={submittingDelete || submittingDeleteWebhook}
          />
        }
        title={`Unlink your account with Copin ${isWebhook ? 'Webhook' : 'Telegram Bot'}?`}
        onConfirm={() => handleUnlink(data.id, data.channelType)}
        confirmButtonProps={{ variant: 'ghostDanger' }}
      />
    </Flex>
  )
}
