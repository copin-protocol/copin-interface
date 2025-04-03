import { Trans } from '@lingui/macro'
import { Plus, Target } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import noChannel from 'assets/images/alert_no_channel.png'
import Divider from 'components/@ui/Divider'
import SectionTitle from 'components/@ui/SectionTitle'
import ToastBody from 'components/@ui/ToastBody'
import { AlertSettingData, BotAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useMyProfile from 'hooks/store/useMyProfile'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import Alert from 'theme/Alert'
import Badge from 'theme/Badge'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

import LinkWebhookAlertAction from './LinkWebhookAlertAction'
import { ChannelAction, ChannelConnection, ChannelName, ChannelStatus, ChannelType, MobileRowItem } from './config'


export default function SettingChannel({ botAlert }: { botAlert?: BotAlertData }) {
  const { handleGenerateLinkBot, isVIPUser, isPremiumUser } = useBotAlertContext()
  const { myProfile } = useMyProfile()
  const { subscriptionLimit } = useSystemConfigStore()
  const userAlertLimit = subscriptionLimit?.[myProfile?.plan ?? SubscriptionPlanEnum.BASIC]
  const totalChannels = botAlert?.channels?.length ?? 0
  const maxChannels = userAlertLimit?.channelAlerts ?? 0
  const isLimited = totalChannels >= maxChannels

  const { lg } = useResponsive()
  const isMobile = !lg

  const handleAddChannel = () => {
    if (isLimited) {
      toast.error(
        <ToastBody
          title="Error"
          message="You have reached the maximum number of alert channels. Please upgrade your account to continue."
        />
      )
      return
    }
    if (botAlert?.alertType && handleGenerateLinkBot) {
      handleGenerateLinkBot(botAlert.alertType, botAlert?.id)
    }
  }

  const columns = useMemo(() => {
    const result: ColumnData<AlertSettingData>[] = [
      {
        title: 'RUN',
        dataIndex: 'isPause',
        key: 'isPause',
        style: { minWidth: '50px' },
        render: (item) => <ChannelStatus data={item} />,
      },
      {
        title: 'CHANNEL NAME',
        dataIndex: 'chatId',
        key: 'chatId',
        style: { minWidth: '150px', maxWidth: '150px' },
        render: (item) => <ChannelName data={item} />,
      },
      {
        title: 'TYPE',
        dataIndex: 'channelType',
        key: 'channelType',
        style: { minWidth: '100px' },
        render: (item) => <ChannelType data={item} />,
      },
      {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '100px' },
        render: (item) => <ChannelConnection data={item} />,
      },
      {
        title: 'Action',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '50px', textAlign: 'right' },
        render: (item) => <ChannelAction data={item} />,
      },
    ]
    return result
  }, [])

  return (
    <Flex flexDirection="column" height="100%" width="100%" sx={{ overflow: 'hidden' }}>
      <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <SectionTitle
          icon={Target}
          title={'DELIVERY ALERT CHANNEL'}
          suffixPlacement="flex-start"
          suffix={
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Badge count={`${totalChannels}/${maxChannels}`} />
              {!isVIPUser && isLimited && (
                <Link to={ROUTES.SUBSCRIPTION.path}>
                  <Button size="xs" variant="outlinePrimary">
                    <Trans>Upgrade</Trans>
                  </Button>
                </Link>
              )}
            </Flex>
          }
          sx={{ mb: 0 }}
        />
      </Flex>
      <Flex flexDirection="column" flex={1} sx={{ overflow: 'auto' }}>
        {!botAlert?.channels?.length ? (
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
                  <Button variant="ghostPrimary" p={0} onClick={handleAddChannel}>
                    <Type.CaptionBold>Let’s setup now</Type.CaptionBold>
                  </Button>
                </Flex>
              }
            />
          </Box>
        ) : (
          <Flex flex={1} flexDirection="column" sx={{ overflow: 'auto' }}>
            {isMobile ? (
              <Flex mt={2} flexDirection="column" sx={{ gap: 2 }}>
                {!!botAlert?.channels?.length &&
                  botAlert?.channels?.map((data) => {
                    return (
                      <Flex
                        key={data.id}
                        variant="card"
                        flexDirection="column"
                        bg="neutral6"
                        width="100%"
                        height={100}
                        sx={{ pt: 2, gap: 2 }}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ pb: 2, borderBottom: 'small', borderColor: 'neutral5' }}
                        >
                          <ChannelName data={data} />
                          <Flex alignItems="center" sx={{ gap: 3 }}>
                            <ChannelStatus data={data} />
                            <ChannelAction data={data} />
                          </Flex>
                        </Flex>
                        <MobileRowItem label={'Type'} value={<ChannelType data={data} />} />
                        <MobileRowItem label={'Status'} value={<ChannelConnection data={data} />} />
                      </Flex>
                    )
                  })}
              </Flex>
            ) : (
              <Table
                restrictHeight={false}
                data={botAlert?.channels}
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
            )}
          </Flex>
        )}
      </Flex>
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
            onClick={() => {
              if (botAlert?.alertType && handleGenerateLinkBot) {
                handleGenerateLinkBot(botAlert.alertType, botAlert?.id)
              }
            }}
            disabled={!!botAlert?.chatId || isLimited}
            data-tooltip-id={isLimited ? 'tt-max-channels' : undefined}
            data-tooltip-delay-show={360}
          >
            Telegram
          </ButtonWithIcon>
          <LinkWebhookAlertAction botAlert={botAlert} isPremiumUser={isPremiumUser} isLimited={isLimited} />
          <Tooltip id={'tt-max-channels'} clickable>
            <Type.Caption color="neutral2" sx={{ maxWidth: 350 }}>
              You have reached the maximum number of alert channels. Please{' '}
              <Link to={ROUTES.SUBSCRIPTION.path}>
                <Button type="button" variant="ghostPrimary" p={0} sx={{ textTransform: 'lowercase' }}>
                  upgrade
                </Button>
              </Link>{' '}
              your account to continue.
            </Type.Caption>
          </Tooltip>
        </Flex>
      </Box>
    </Flex>
  )
}
