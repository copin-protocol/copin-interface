import { Trans } from '@lingui/macro'
import { DotsThreeOutlineVertical, Icon, PencilSimpleLine, Trash, Warning } from '@phosphor-icons/react'
import React, { Fragment, ReactNode } from 'react'
import { Link, useHistory } from 'react-router-dom'

import ActiveDot from 'components/@ui/ActiveDot'
import Divider from 'components/@ui/Divider'
import { BotAlertData } from 'entities/alert'
import useAlertDashboardContext from 'hooks/features/alert/useAlertDashboardContext'
import useCustomAlerts from 'hooks/features/alert/useCustomAlerts'
import useSettingChannels from 'hooks/features/alert/useSettingChannels'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import WebhookIcon from 'theme/Icons/WebhookIcon'
import Popconfirm from 'theme/Popconfirm'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import {
  AlertCategoryEnum,
  AlertCustomType,
  AlertSettingsEnum,
  AlertTypeEnum,
  ChannelTypeEnum,
} from 'utils/config/enums'
import { ALERT_CUSTOM_TYPE_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatLocalRelativeDate } from 'utils/helpers/format'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'
import { goToPreviousPage } from 'utils/helpers/transform'

export const AlertStatusAction = ({ data }: { data: BotAlertData }) => {
  const { updateStatusAlert } = useSettingChannels({})
  const { updateCustomAlert } = useCustomAlerts({})

  const handleUpdateStatus = (status?: boolean) => {
    if (data.category === AlertCategoryEnum.CUSTOM) {
      updateCustomAlert({ id: data.id, data: { enableAlert: !status } })
    } else {
      if (data.alertType && status != null) {
        updateStatusAlert({ type: data.alertType, isPause: status })
      }
    }
  }

  return (
    <>
      <Box>
        <SwitchInput
          checked={data.enableAlert}
          disabled={data.category !== AlertCategoryEnum.CUSTOM && !data?.channels?.length}
          onChange={() => handleUpdateStatus(data.enableAlert)}
        />
      </Box>
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
  return <Type.Caption color="neutral1">{data.type ? ALERT_CUSTOM_TYPE_TRANS[data.type] : 'N/A'}</Type.Caption>
}

export const AlertStatus = ({ data }: { data: BotAlertData }) => {
  const color = data.enableAlert ? 'green2' : 'red1'
  return (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <ActiveDot size={4} color={color} />
      <Type.Caption color={color}>{data.enableAlert ? <Trans>Running</Trans> : <Trans>Stopped</Trans>}</Type.Caption>
    </Flex>
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
    <Type.Caption color="neutral1" width="100%" sx={{ textTransform: 'capitalize', ...overflowEllipsis() }}>
      {data.alertType === AlertTypeEnum.TRADERS ? `${data.name} (${totalTraders}/${maxTraders})` : data.name}
    </Type.Caption>
  )
}

export const AlertChannel = ({ data, isMobile }: { data: BotAlertData; isMobile?: boolean }) => {
  const channels = data?.channels
    ?.filter((channel) => !!channel.chatId || !!channel.webhookUrl)
    ?.map((channel) => `${channel.name}`)
  return !!channels?.length ? (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      {data?.channels?.[0]?.channelType === ChannelTypeEnum.WEBHOOK ? (
        <WebhookIcon size={18} variant="Bold" minWidth={18} />
      ) : (
        <TelegramIcon size={18} variant="Bold" minWidth={18} />
      )}
      <Type.Caption color="neutral1" sx={{ ...overflowEllipsis() }}>
        {channels?.join(', ')}
      </Type.Caption>
    </Flex>
  ) : (
    <Flex alignItems="center" justifyContent={isMobile ? 'flex-end' : 'flex-start'} sx={{ gap: 1, flexWrap: 'wrap' }}>
      <Warning size={16} color={themeColors.orange1} />
      <Type.Caption color="neutral1">No channel yet,</Type.Caption>
      <Button
        as={Link}
        to={generateAlertSettingDetailsRoute({
          type: data.category,
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
  const isCustom = data.category === AlertCategoryEnum.CUSTOM
  return isCustom ? (
    <CustomAlertActions data={data} />
  ) : (
    <Button
      as={Link}
      to={generateAlertSettingDetailsRoute({ id: data.id, type: data.category })}
      variant="ghostPrimary"
      p={0}
    >
      <Type.Caption>Manage</Type.Caption>
    </Button>
  )
}

const CustomAlertActions = ({ data }: { data: BotAlertData }) => {
  const history = useHistory()
  const { currentPage, changeCurrentPage, totalCustoms } = useAlertDashboardContext()

  const onSuccess = () => {
    if (currentPage && !!changeCurrentPage) {
      goToPreviousPage({ total: totalCustoms, limit: DEFAULT_LIMIT, currentPage, changeCurrentPage })
    }
  }
  const { deleteCustomAlert } = useCustomAlerts({ onSuccess })

  const handleSubmit = (type: 'edit' | 'delete') => {
    switch (type) {
      case 'edit':
        history.push(generateAlertSettingDetailsRoute({ id: data.id, type: data.category }))
        return
      case 'delete':
        deleteCustomAlert(data.id)
        return
    }
  }

  return (
    <Flex justifyContent="end">
      <Dropdown
        buttonVariant="ghost"
        inline
        hasArrow={false}
        dismissible={false}
        menuDismissible={true}
        menuSx={{
          bg: 'neutral7',
          width: 140,
        }}
        menu={
          <>
            {configs
              .filter((v) => v.type !== 'delete' || data.type !== AlertCustomType.TRADER_BOOKMARK)
              .map((v, index) => {
                const { title, icon: Icon, type } = v
                return (
                  <Fragment key={index}>
                    {type === 'edit' ? (
                      <ActionItem title={title} icon={<Icon size={18} />} onSelect={() => handleSubmit(type)} />
                    ) : (
                      <Popconfirm
                        action={<ActionItem title={title} icon={<Icon size={18} />} />}
                        title="Are you sure you want to delete this alert?"
                        onConfirm={() => handleSubmit(type)}
                        confirmButtonProps={{ variant: 'ghostDanger' }}
                      />
                    )}
                    {index === 0 && <Divider />}
                  </Fragment>
                )
              })}
          </>
        }
        sx={{}}
        placement="bottomLeft"
      >
        <IconButton
          size={24}
          type="button"
          icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
          variant="ghost"
          sx={{
            color: 'neutral3',
          }}
        />
      </Dropdown>
    </Flex>
  )
}

const ActionItem = ({
  title,
  icon,
  onSelect,
}: {
  title: ReactNode
  icon: ReactNode
  onSelect?: (data?: BotAlertData) => void
}) => {
  return (
    <DropdownItem onClick={() => onSelect?.()}>
      <Flex alignItems="center" sx={{ gap: 2, py: 1 }}>
        <IconBox icon={icon} color="neutral3" />
        <Type.Caption>{title}</Type.Caption>
      </Flex>
    </DropdownItem>
  )
}

const configs: { title: ReactNode; icon: Icon; type: 'edit' | 'delete' }[] = [
  {
    title: <Trans>MANAGE ALERT</Trans>,
    icon: PencilSimpleLine,
    type: 'edit',
  },
  {
    title: <Trans>REMOVE ALERT</Trans>,
    icon: Trash,
    type: 'delete',
  },
]
