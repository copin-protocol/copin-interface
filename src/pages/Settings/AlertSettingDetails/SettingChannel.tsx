import { Trans } from '@lingui/macro'
import { Plus, Target } from '@phosphor-icons/react'
import React, { useMemo } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { unlinkToBotAlertApi } from 'apis/alertApis'
import noChannel from 'assets/images/alert_no_channel.png'
import Divider from 'components/@ui/Divider'
import SectionTitle from 'components/@ui/SectionTitle'
import ToastBody from 'components/@ui/ToastBody'
import { BotAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import AlertOffIcon from 'theme/Icons/AlerOffIcon'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import Popconfirm from 'theme/Popconfirm'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, Type } from 'theme/base'
import { TELEGRAM_TYPE_TRANS } from 'utils/config/translations'

export default function SettingChannel({ botAlert }: { botAlert?: BotAlertData }) {
  const { handleGenerateLinkBot, refetchAlerts } = useBotAlertContext()

  const { mutate: unlink, isLoading } = useMutation(unlinkToBotAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Unlink Copin Telegram Bot successfully</Trans>} />
      )
      refetchAlerts()
    },
    onError: () => {
      toast.error(<ToastBody title="Error" message={<Trans>Something went wrong, please try later</Trans>} />)
    },
  })
  const handleUnlink = () => {
    unlink()
  }

  const columns = useMemo(() => {
    const result: ColumnData<BotAlertData>[] = [
      {
        title: 'RUN',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '50px' },
        render: (item) => <SwitchInput checked={item.isRunning} disabled />,
      },
      {
        title: 'CHANNEL RECEIVE ALERT',
        dataIndex: 'chatId',
        key: 'chatId',
        style: { minWidth: '200px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <TelegramIcon size={18} variant="Bold" />
            <Type.Caption color="neutral1">@{item.chatId}</Type.Caption>
          </Flex>
        ),
      },
      {
        title: 'TYPE',
        dataIndex: 'telegramType',
        key: 'telegramType',
        style: { minWidth: '150px' },
        render: (item) => (
          <Type.Caption color="neutral1">
            {item.telegramType ? TELEGRAM_TYPE_TRANS[item.telegramType] : 'N/A'}
          </Type.Caption>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '50px', textAlign: 'right' },
        render: () => (
          <Flex alignItems="center" justifyContent="flex-end">
            <Popconfirm
              action={
                <IconButton
                  variant="ghost"
                  icon={<AlertOffIcon size={16} />}
                  size={16}
                  sx={{
                    color: 'neutral3',
                    '&:hover:not(:disabled),&:active:not(:disabled)': {
                      color: 'red1',
                    },
                  }}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              }
              title="Unlink your account with Copin Telegram Bot?"
              onConfirm={() => handleUnlink()}
            />
          </Flex>
        ),
      },
    ]
    return result
  }, [])

  return (
    <Flex flexDirection="column" width="100%" sx={{ overflow: 'hidden' }}>
      <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <SectionTitle icon={Target} title={'DELIVERY ALERT CHANNEL'} sx={{ mb: 0 }} />
      </Flex>
      <Box>
        {!botAlert?.chatId ? (
          <Box px={3}>
            <Alert
              mt={3}
              mb={0}
              variant="cardWarning"
              description={
                <Flex flexDirection="column" alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
                  <Image src={noChannel} alt="alert-no-channel" />
                  <Type.Caption textAlign="center" color="orange1">
                    <Trans>You still not setup any channel.</Trans>
                  </Type.Caption>
                  <Button variant="ghostPrimary" p={0} onClick={handleGenerateLinkBot}>
                    <Type.CaptionBold>Let’s setup now</Type.CaptionBold>
                  </Button>
                </Flex>
              }
            />
          </Box>
        ) : (
          <Flex flexDirection="column" sx={{ overflow: 'auto' }}>
            <Table
              data={[botAlert]}
              columns={columns}
              isLoading={false}
              tableHeadSx={{
                '& th': {
                  py: 2,
                  borderBottom: 'small',
                  borderColor: 'neutral4',
                },
              }}
              tableBodySx={{
                '& td': {
                  height: 40,
                },
              }}
              wrapperSx={{
                table: {
                  '& th:first-child, td:first-child': {
                    pl: 3,
                  },
                  '& th:last-child, td:last-child': {
                    pr: 3,
                  },
                },
              }}
            />
          </Flex>
        )}
      </Box>
      <Box py={3}>
        <Flex px={3} width=" 100%" alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
          <Divider flex={1} color="neutral4" height={1} />
          <Type.Caption color="neutral3">Add channel to receive alert</Type.Caption>
          <Divider flex={1} color="neutral4" height={1} />
        </Flex>
        <Flex mt={3} width="100%" alignItems="center" justifyContent="center" sx={{ gap: 3 }}>
          <ButtonWithIcon
            icon={<Plus />}
            variant="primary"
            sx={{ width: 178 }}
            onClick={handleGenerateLinkBot}
            disabled={!!botAlert?.chatId}
            data-tooltip-id={!!botAlert?.chatId ? 'tt-next-version' : undefined}
            data-tooltip-delay-show={360}
          >
            Telegram
          </ButtonWithIcon>
          <ButtonWithIcon
            icon={<Plus />}
            variant="primary"
            sx={{ width: 178 }}
            disabled
            data-tooltip-id={'tt-coming-soon'}
            data-tooltip-delay-show={360}
          >
            Webhook
          </ButtonWithIcon>
          <Tooltip id={'tt-next-version'}>
            <Type.Caption color="neutral3" sx={{ maxWidth: 350 }}>
              You can add more Telegram channels in the next version
            </Type.Caption>
          </Tooltip>
          <Tooltip id="tt-coming-soon">
            <Type.Caption color="neutral3" sx={{ maxWidth: 350 }}>
              Coming Soon
            </Type.Caption>
          </Tooltip>
        </Flex>
      </Box>
    </Flex>
  )
}
