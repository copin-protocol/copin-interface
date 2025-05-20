import { Trans } from '@lingui/macro'
import { Plus, Target } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useMemo, useState } from 'react'

import noChannel from 'assets/images/alert_no_channel.png'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import Divider from 'components/@ui/Divider'
import SectionTitle from 'components/@ui/SectionTitle'
import { AlertSettingData, BotAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import { useIsElite } from 'hooks/features/subscription/useSubscriptionRestrict'
import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Image, Type } from 'theme/base'

import LinkWebhookAlertAction from './LinkWebhookAlertAction'
import { ChannelAction, ChannelConnection, ChannelName, ChannelStatus, ChannelType, MobileRowItem } from './config'

export default function SettingChannel({ botAlert }: { botAlert?: BotAlertData }) {
  const { usage, handleGenerateLinkBot } = useBotAlertContext()
  const [openLimitModal, setOpenLimitModal] = useState(false)
  const isEliteUser = useIsElite()
  const { maxChannelQuota, channelQuota, webhookRequiredPlan, isAvailableWebhookAlert } = useAlertPermission()
  const { userNextPlan } = useUserNextPlan()
  const totalChannels = usage?.channelAlerts ?? 0
  const isLimited = totalChannels >= channelQuota

  const { lg } = useResponsive()
  const isMobile = !lg

  const handleAddChannel = () => {
    if (isLimited) {
      setOpenLimitModal(true)
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

  const tableLength = botAlert?.channels?.length ?? 0
  const isOverflowItems = tableLength > 10

  return (
    <Flex flexDirection="column" height="100%" width="100%" sx={{ overflow: 'hidden' }}>
      <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <SectionTitle
          icon={Target}
          title={
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Trans>DELIVERY ALERT CHANNEL</Trans>
              <BadgeWithLimit
                total={totalChannels}
                limit={channelQuota}
                tooltipContent={
                  !isEliteUser &&
                  userNextPlan && (
                    <PlanUpgradePrompt
                      requiredPlan={userNextPlan}
                      title={<Trans>You have exceeded your channel limit for the current plan.</Trans>}
                      confirmButtonVariant="textPrimary"
                      titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
                    />
                  )
                }
                clickableTooltip
              />
            </Flex>
          }
          suffix={isLimited && <UpgradeButton requiredPlan={userNextPlan} showIcon={false} showCurrentPlan />}
          sx={{ mb: 0 }}
        />
      </Flex>
      <Flex flexDirection="column" flex={1} sx={{ overflow: 'auto' }}>
        {!tableLength ? (
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
                {!!tableLength &&
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
              <Box height={isOverflowItems ? 400 : '100%'}>
                <Table
                  restrictHeight={isOverflowItems}
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
                    maxHeight: isOverflowItems ? 400 : undefined,
                    overflow: isOverflowItems ? 'auto' : undefined,
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
              </Box>
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
            sx={{ width: 225 }}
            onClick={() => {
              if (isLimited) {
                setOpenLimitModal(true)
                return
              }
              if (botAlert?.alertType && handleGenerateLinkBot) {
                handleGenerateLinkBot(botAlert.alertType, botAlert?.id)
              }
            }}
            disabled={!!botAlert?.chatId}
          >
            Telegram
          </ButtonWithIcon>
          <LinkWebhookAlertAction
            botAlert={botAlert}
            requiredPlan={webhookRequiredPlan}
            isAvailableFeature={isAvailableWebhookAlert}
            isLimited={isLimited}
            openLimitModal={() => setOpenLimitModal(true)}
          />
          {openLimitModal && (
            <UpgradeModal
              isOpen={openLimitModal}
              onDismiss={() => setOpenLimitModal(false)}
              title={<Trans>YOU’VE HIT YOUR DELIVERY CHANNELS LIMIT</Trans>}
              description={
                <Trans>
                  You’re reach the maximum of delivery channels for your current plan. Upgrade your plan to unlock
                  access up to <b>{maxChannelQuota} channels</b>
                </Trans>
              }
            />
          )}
        </Flex>
      </Box>
    </Flex>
  )
}
