import { Siren, Sliders, Target, Warning, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'

import { getTraderAlertListApi } from 'apis/alertApis'
import { getListActiveCopiedTradersApi } from 'apis/copyTradeApis'
import alertSettingBg from 'assets/images/alert_setting_bg.png'
import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { BotAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import usePageChange from 'hooks/helpers/usePageChange'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import IconButton from 'theme/Buttons/IconButton'
import VerticalArrow from 'theme/Icons/VerticalArrow'
import Loading from 'theme/Loading'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { AlertSettingsEnum, AlertTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { pageToOffset } from 'utils/helpers/transform'

import SettingChannel from './SettingChannel'
import SettingCopiedTraders from './SettingCopiedTraders'
import SettingTrigger from './SettingTrigger'
import SettingWatchlistTraders from './SettingWatchlistTraders'

export default function AlertSettingDetailsPage() {
  return <AlertSettingDetailsComponent />
}

function AlertSettingDetailsComponent() {
  const { alertId } = useParams<{ alertId: string }>()
  const { searchParams, setSearchParams } = useSearchParams()
  const { myProfile } = useMyProfile()
  const { lg } = useResponsive()
  const { botAlerts, loadingAlerts, traderAlerts } = useBotAlertContext()
  const botAlert = botAlerts?.data?.find((alert) => alert?.id?.toLowerCase() === alertId?.toLowerCase())
  const [openDrawer, setOpenDrawer] = useState(false)

  const limit = 10

  const [currentStep, setCurrentStep] = useState<AlertSettingsEnum | undefined>(() => {
    return (searchParams?.step as AlertSettingsEnum | undefined) ?? AlertSettingsEnum.TRADERS
  })

  const onChangeStep = (step: AlertSettingsEnum) => {
    setCurrentStep(step)
    setSearchParams({ step })
    if (!lg) {
      setOpenDrawer(true)
    }
  }

  const onReset = () => {
    setCurrentStep(undefined)
    setSearchParams({ step: undefined })
  }

  const onDismiss = () => {
    setOpenDrawer(false)
    onReset()
  }

  useEffect(() => {
    if (lg || openDrawer || !currentStep) return
    setOpenDrawer(true)
  }, [currentStep, lg, openDrawer])

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'page' })
  const { data: watchlistTraders } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, currentPage, limit, myProfile?.id],
    () => getTraderAlertListApi({ limit, offset: pageToOffset(currentPage, limit) }),
    {
      enabled: !!myProfile?.id,
      keepPreviousData: true,
      retry: 0,
    }
  )
  const { data: copiedTraders } = useQuery(
    [QUERY_KEYS.GET_COPIED_TRADER_ALERTS, myProfile?.id],
    () => getListActiveCopiedTradersApi({ limit }),
    {
      enabled: !!myProfile?.id,
      retry: 0,
    }
  )
  const totalCopiedTraders = copiedTraders?.meta?.total ?? 0

  return (
    <>
      <CustomPageTitle title={`Alert Settings - ${botAlert?.name ?? ''}`} />
      {!botAlert && loadingAlerts && <Loading />}
      {botAlert && (
        <Box height="100%" overflow="hidden">
          <Flex
            sx={{
              width: '100%',
              px: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 'small',
              borderBottomColor: 'neutral4',
              gap: 2,
              height: 48,
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <Flex
              sx={{
                width: '100%',
                gap: 1,
                alignItems: 'center',
                color: 'neutral1',
                flex: 1,
              }}
            >
              <Link to={ROUTES.ALERT_LIST.path}>
                <Type.Body sx={{ fontWeight: 500 }}>COPIN ALERT</Type.Body>
              </Link>
              <Type.Body sx={{ fontWeight: 500 }}>{`/ ${botAlert?.name?.toUpperCase() ?? ''}`}</Type.Body>
            </Flex>
          </Flex>
          <Flex
            width="100%"
            height="calc(100% - 48px)"
            overflow="hidden"
            sx={{
              backgroundImage: `url(${alertSettingBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Flex
              flex={1}
              sx={{
                mt: lg ? 72 : 0,
                position: 'relative',
                flexDirection: 'column',
                overflow: 'hidden auto',
                justifyContent: lg ? 'flex-start' : 'center',
                alignItems: 'center',
              }}
            >
              <SettingItem
                botAlert={botAlert}
                step={AlertSettingsEnum.TRADERS}
                isActive={currentStep === AlertSettingsEnum.TRADERS}
                content={
                  <ListTradersContent
                    traders={
                      botAlert?.type === AlertTypeEnum.COPY_TRADE
                        ? copiedTraders?.data?.map((e) => e?.account ?? e.address)
                        : traderAlerts?.data?.map((e) => e.address)
                    }
                    total={botAlert?.type === AlertTypeEnum.COPY_TRADE ? totalCopiedTraders : traderAlerts?.meta?.total}
                  />
                }
                onSelect={onChangeStep}
              />
              <Box pr={120}>
                <VerticalArrow />
              </Box>
              <SettingItem
                step={AlertSettingsEnum.TRIGGER}
                isActive={currentStep === AlertSettingsEnum.TRIGGER}
                onSelect={onChangeStep}
              />
              <Box pr={120}>
                <VerticalArrow />
              </Box>
              <SettingItem
                step={AlertSettingsEnum.CHANNEL}
                isActive={currentStep === AlertSettingsEnum.CHANNEL}
                content={<ChannelContent botAlert={botAlert} />}
                onSelect={onChangeStep}
              />
            </Flex>
            {!lg ? (
              <Box>
                <RcDrawer
                  open={openDrawer}
                  onClose={onDismiss}
                  placement="bottom"
                  height={
                    currentStep === AlertSettingsEnum.TRADERS && botAlert?.type != AlertTypeEnum.COPY_TRADE
                      ? 'calc(100vh - 80px)'
                      : 'max-content'
                  }
                  width="100%"
                  style={{ minHeight: '400px' }}
                  background={themeColors.neutral6}
                >
                  <Container sx={{ position: 'relative', height: '100%' }}>
                    <IconButton
                      icon={<XCircle size={24} />}
                      variant="ghost"
                      sx={{ position: 'absolute', right: 0, top: '-2px', zIndex: 1 }}
                      onClick={onDismiss}
                    />
                    <Box height="100%" overflow="auto">
                      {currentStep === AlertSettingsEnum.TRADERS &&
                        (botAlert?.type === AlertTypeEnum.COPY_TRADE ? (
                          <SettingCopiedTraders botAlert={botAlert} totalCopiedTraders={totalCopiedTraders} />
                        ) : (
                          <SettingWatchlistTraders
                            botAlert={botAlert}
                            traders={watchlistTraders}
                            currentPage={currentPage}
                            changeCurrentPage={changeCurrentPage}
                            onChangeStep={onChangeStep}
                          />
                        ))}
                      {currentStep === AlertSettingsEnum.TRIGGER && <SettingTrigger />}
                      {currentStep === AlertSettingsEnum.CHANNEL && <SettingChannel botAlert={botAlert} />}
                    </Box>
                  </Container>
                </RcDrawer>
              </Box>
            ) : currentStep ? (
              <Box
                sx={{
                  position: 'relative',
                  my: '24px',
                  mr: '24px',
                  width: 540,
                  height: 'max-content',
                  backgroundColor: 'neutral6',
                  border: 'small',
                  borderColor: 'neutral4',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                {currentStep === AlertSettingsEnum.TRADERS &&
                  (botAlert?.type === AlertTypeEnum.COPY_TRADE ? (
                    <SettingCopiedTraders botAlert={botAlert} totalCopiedTraders={totalCopiedTraders} />
                  ) : (
                    <SettingWatchlistTraders
                      botAlert={botAlert}
                      traders={watchlistTraders}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}
                      onChangeStep={onChangeStep}
                    />
                  ))}
                {currentStep === AlertSettingsEnum.TRIGGER && <SettingTrigger />}
                {currentStep === AlertSettingsEnum.CHANNEL && <SettingChannel botAlert={botAlert} />}
              </Box>
            ) : (
              <></>
            )}
          </Flex>
        </Box>
      )}
    </>
  )
}

function SettingItem({
  botAlert,
  step,
  isActive,
  content,
  onSelect,
}: {
  botAlert?: BotAlertData
  step: AlertSettingsEnum
  isActive: boolean
  content?: ReactNode
  onSelect?: (step: AlertSettingsEnum) => void
}) {
  const iconVariant = isActive ? 'fill' : 'regular'
  let icon
  let title
  let description
  switch (step) {
    case AlertSettingsEnum.TRADERS:
      icon = <Siren size={18} weight={iconVariant} />
      title = botAlert?.name ?? 'List Traders'
      description = 'Which traders receive alerts.'
      break
    case AlertSettingsEnum.TRIGGER:
      icon = <Sliders size={18} weight={iconVariant} />
      title = 'Alert Trigger'
      description = 'Which event triggers the rule.'
      break
    case AlertSettingsEnum.CHANNEL:
      icon = <Target size={18} weight={iconVariant} />
      title = 'Delivery Channel'
      description = 'Which channel will deliver the alerts.'
      break
  }
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      variant="card"
      sx={{
        gap: 1,
        width: 320,
        backgroundColor: isActive ? 'neutral6' : 'neutral5',
        border: 'small',
        borderColor: isActive ? 'primary2' : 'neutral4',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={() => onSelect?.(step)}
    >
      <Flex width="100%" alignItems="flex-start" sx={{ gap: 2 }}>
        <IconBox icon={icon} size={18} color={isActive ? 'primary1' : 'neutral2'} />
        <Flex width="100%" flexDirection="column">
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            <Type.CaptionBold color={isActive ? 'primary1' : 'neutral2'} sx={{ textTransform: 'uppercase' }}>
              {title}
            </Type.CaptionBold>
            {content}
          </Flex>
          <Type.Caption mt={1} color="neutral3">
            {description}
          </Type.Caption>
        </Flex>
      </Flex>
    </Flex>
  )
}

function ListTradersContent({ traders, total }: { traders?: string[]; total?: number }) {
  return !!traders?.length ? (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <AvatarGroup addresses={traders} size={18} total={total} />
    </Flex>
  ) : (
    <Flex
      alignItems="center"
      sx={{
        gap: 1,
      }}
    >
      <IconBox icon={<Warning />} size={16} color="orange1" />
      <Type.Caption color="orange1">No Traders</Type.Caption>
    </Flex>
  )
}

function ChannelContent({ botAlert }: { botAlert?: BotAlertData }) {
  return botAlert?.chatId ? (
    <Type.Caption color="primary2">(1 Connected)</Type.Caption>
  ) : (
    <Flex
      alignItems="center"
      sx={{
        gap: 1,
      }}
    >
      <IconBox icon={<Warning />} size={16} color="orange1" />
      <Type.Caption color="orange1">No Channel</Type.Caption>
    </Flex>
  )
}
