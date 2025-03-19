import { Siren, Sliders, Target, Warning } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import alertSettingBg from 'assets/images/alert_setting_bg.png'
import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import CustomTag from 'components/@ui/CustomTag'
import { BotAlertData } from 'entities/alert'
import { AlertSettingDetailsProvider, useAlertSettingDetailsContext } from 'hooks/features/alert/useAlertDetailsContext'
import VerticalArrow from 'theme/Icons/VerticalArrow'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { AlertCategoryEnum, AlertSettingsEnum, AlertTypeEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'

import SettingChannel from './SettingChannel'
import SettingCopiedTraders from './SettingCopiedTraders'
import SettingCustomAlert from './SettingCustomAlert'
import SettingTrigger from './SettingTrigger'
import SettingWatchlistTraders from './SettingWatchlistTraders'

export default function AlertSettingDetailsPage() {
  return (
    <AlertSettingDetailsProvider>
      <AlertSettingDetailsComponent />
    </AlertSettingDetailsProvider>
  )
}

function AlertSettingDetailsComponent() {
  const {
    isMobile,
    botAlert,
    loadingAlerts,
    traderAlerts,
    currentStep,
    openDrawer,
    isCreatingCustomAlert,
    watchlistTraders,
    copiedTraders,
    totalCopiedTraders,
    totalMatchingTraders,
    currentPage,
    changeCurrentPage,
    currentSort,
    changeCurrentSort,
    onChangeStep,
    onDismiss,
  } = useAlertSettingDetailsContext()

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
                <Type.Body minWidth="max-content" sx={{ fontWeight: 500 }}>
                  COPIN ALERT
                </Type.Body>
              </Link>
              <Type.Body sx={{ fontWeight: 500, ...overflowEllipsis() }}>{`/ ${
                botAlert?.name?.toUpperCase() ?? ''
              }`}</Type.Body>
            </Flex>
            <CustomTag
              width={80}
              text={isCreatingCustomAlert ? 'CREATING' : botAlert?.enableAlert ? 'RUNNING' : 'STOPPED'}
              color={isCreatingCustomAlert ? 'orange1' : botAlert?.enableAlert ? 'green2' : 'red1'}
              hasDot
            />
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
                mt: !isMobile ? 72 : 0,
                position: 'relative',
                flexDirection: 'column',
                overflow: 'hidden auto',
                justifyContent: !isMobile ? 'flex-start' : 'center',
                alignItems: 'center',
              }}
            >
              <SettingItem
                botAlert={botAlert}
                step={AlertSettingsEnum.TRADERS}
                isActive={currentStep === AlertSettingsEnum.TRADERS}
                content={
                  botAlert.category === AlertCategoryEnum.CUSTOM ? (
                    isCreatingCustomAlert ? (
                      <Type.Caption color="orange1">No Traders</Type.Caption>
                    ) : (
                      <Flex
                        alignItems="center"
                        sx={{ borderRadius: 26, border: 'small', borderColor: 'neutral4', px: 2 }}
                      >
                        <Type.Caption color="neutral1">{formatNumber(totalMatchingTraders, 0)} traders</Type.Caption>
                      </Flex>
                    )
                  ) : (
                    <ListTradersContent
                      traders={
                        botAlert?.type === AlertTypeEnum.COPY_TRADE
                          ? copiedTraders?.data?.map((e) => e?.account ?? e.address)
                          : traderAlerts?.data?.map((e) => e.address)
                      }
                      total={
                        botAlert?.type === AlertTypeEnum.COPY_TRADE ? totalCopiedTraders : traderAlerts?.meta?.total
                      }
                    />
                  )
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
                disabled={isCreatingCustomAlert}
              />
              <Box pr={120}>
                <VerticalArrow />
              </Box>
              <SettingItem
                step={AlertSettingsEnum.CHANNEL}
                isActive={currentStep === AlertSettingsEnum.CHANNEL}
                content={<ChannelContent botAlert={botAlert} />}
                onSelect={onChangeStep}
                disabled={isCreatingCustomAlert}
              />
            </Flex>
            {isMobile ? (
              <Box>
                <Modal mode="bottom" isOpen={openDrawer} onDismiss={onDismiss}>
                  <Container sx={{ position: 'relative', height: '100%', minHeight: '400px' }}>
                    <Box height="100%" overflow="auto">
                      {currentStep === AlertSettingsEnum.TRADERS &&
                        (botAlert?.type === AlertTypeEnum.COPY_TRADE ? (
                          <SettingCopiedTraders botAlert={botAlert} totalCopiedTraders={totalCopiedTraders} />
                        ) : botAlert?.type === AlertTypeEnum.TRADERS ? (
                          <SettingWatchlistTraders
                            botAlert={botAlert}
                            traders={watchlistTraders}
                            currentPage={currentPage}
                            changeCurrentPage={changeCurrentPage}
                            currentSort={currentSort}
                            changeCurrentSort={changeCurrentSort}
                            onChangeStep={onChangeStep}
                          />
                        ) : (
                          <SettingCustomAlert botAlert={botAlert} />
                        ))}
                      {currentStep === AlertSettingsEnum.TRIGGER && <SettingTrigger />}
                      {currentStep === AlertSettingsEnum.CHANNEL && <SettingChannel botAlert={botAlert} />}
                    </Box>
                  </Container>
                </Modal>
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
                  ) : botAlert?.type === AlertTypeEnum.TRADERS ? (
                    <SettingWatchlistTraders
                      botAlert={botAlert}
                      traders={watchlistTraders}
                      currentPage={currentPage}
                      changeCurrentPage={changeCurrentPage}
                      currentSort={currentSort}
                      changeCurrentSort={changeCurrentSort}
                      onChangeStep={onChangeStep}
                    />
                  ) : (
                    <SettingCustomAlert botAlert={botAlert} />
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
  disabled,
  content,
  onSelect,
}: {
  botAlert?: BotAlertData
  step: AlertSettingsEnum
  isActive: boolean
  disabled?: boolean
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
      if (botAlert?.type === AlertTypeEnum.CUSTOM) {
        if (botAlert?.id === 'new') {
          description = 'Create your own filters.'
        } else {
          description = 'When traders matching the filters'
        }
      } else {
        description = 'Which traders receive alerts.'
      }
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
    <>
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
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={() => (disabled ? undefined : onSelect?.(step))}
        data-tip="React-tooltip"
        data-tooltip-id={`tt-${step}`}
        data-tooltip-delay-show={360}
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
      {disabled && (
        <Tooltip id={`tt-${step}`}>
          <Type.Caption color="neutral2">You need to create a filter before opening this step.</Type.Caption>
        </Tooltip>
      )}
    </>
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
  return !!botAlert?.channels?.length ? (
    <Type.Caption color="primary2">({botAlert.channels.length} Connected)</Type.Caption>
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
