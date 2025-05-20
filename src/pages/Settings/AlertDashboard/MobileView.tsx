import { Trans } from '@lingui/macro'
import { Gear, Plus, Wrench } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import InputSearchText from 'components/@ui/InputSearchText'
import useAlertDashboardContext, { TabKeyEnum } from 'hooks/features/alert/useAlertDashboardContext'
import Badge from 'theme/Badge'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { PaginationWithSelect } from 'theme/Pagination'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, Type } from 'theme/base'
import { AlertTypeEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'

import NoCustomAlert from './NoCustomAlert'
import { AlertActions, AlertChannel, AlertStatus, AlertStatusAction, AlertType } from './config'

export default function MobileView() {
  const {
    systemAlerts,
    customAlerts,
    traderAlerts,
    maxTraderAlert,
    totalCustoms,
    maxCustoms,
    customRequiredPlan,
    userCustomNextPlan,
    isAvailableCustomAlert,
    handleCreateCustomAlert,
    currentPage,
    changeCurrentPage,
    tab,
    setTab,
    keyword,
    setKeyword,
  } = useAlertDashboardContext()

  const tabConfigs: TabConfig[] = [
    {
      name: (
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Trans>SYSTEM ALERT</Trans>
          <Badge count={systemAlerts?.length ?? 0} />
        </Flex>
      ),
      activeIcon: <Gear size={24} weight="fill" />,
      icon: <Gear size={24} />,
      key: TabKeyEnum.SYSTEM,
    },
    {
      name: (
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Trans>CUSTOM ALERT</Trans>
          <BadgeWithLimit
            total={totalCustoms}
            limit={maxCustoms}
            tooltipContent={
              userCustomNextPlan && (
                <PlanUpgradePrompt
                  requiredPlan={userCustomNextPlan}
                  title={<Trans>You have exceeded your custom alert limit for the current plan.</Trans>}
                  confirmButtonVariant="textPrimary"
                  titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
                />
              )
            }
            clickableTooltip
          />
        </Flex>
      ),
      activeIcon: <Wrench size={24} weight="fill" />,
      icon: <Wrench size={24} />,
      key: TabKeyEnum.CUSTOM,
    },
  ]

  return (
    <>
      <TabHeader
        configs={tabConfigs}
        isActiveFn={(config) => config.key === tab}
        onClickItem={(key) => setTab(key as TabKeyEnum)}
        fullWidth
        itemSx={{
          width: '100%',
        }}
        sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
      />
      {tab === TabKeyEnum.CUSTOM && (
        <Flex width="100%" alignItems="center">
          {isAvailableCustomAlert && (
            <Flex width="100%" alignItems="center" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
              {setKeyword && (
                <Flex
                  px={3}
                  height={40}
                  alignItems="center"
                  width={220}
                  sx={{ borderRight: 'small', borderColor: 'neutral4' }}
                >
                  <InputSearchText
                    placeholder="SEARCH ALERT NAME"
                    sx={{
                      width: '100%',
                      border: 'none',
                      backgroundColor: 'transparent !important',
                      p: 0,
                    }}
                    searchText={keyword ?? ''}
                    setSearchText={setKeyword}
                  />
                </Flex>
              )}
              <Flex flex={1} pr={3} justifyContent="flex-end">
                <ButtonWithIcon size="xs" variant="outlinePrimary" icon={<Plus />} onClick={handleCreateCustomAlert}>
                  <Type.Caption>Create New Alert</Type.Caption>
                </ButtonWithIcon>
              </Flex>
            </Flex>
          )}
        </Flex>
      )}
      <Box flex="1 0 0" sx={{ position: 'relative', overflow: 'auto' }}>
        <Box height="100%" display={tab === TabKeyEnum.SYSTEM ? 'flex' : 'none'} sx={{ flexDirection: 'column' }}>
          <Flex mt={2} flexDirection="column" sx={{ gap: 2 }}>
            {systemAlerts?.map((data) => {
              return (
                <Flex
                  key={data.id}
                  variant="card"
                  bg="neutral6"
                  flexDirection="column"
                  width="100%"
                  sx={{ gap: 2, py: 2, px: 3 }}
                >
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    width="100%"
                    sx={{ pb: 2, borderBottom: 'small', borderColor: 'neutral5' }}
                  >
                    <Type.Caption flex={1} color="neutral1" sx={{ textTransform: 'capitalize', ...overflowEllipsis() }}>
                      {data.alertType === AlertTypeEnum.TRADERS
                        ? `${data.name} (${traderAlerts?.meta?.total ?? 0}/${maxTraderAlert})`
                        : data.name}
                    </Type.Caption>
                    <Flex alignItems="center" sx={{ gap: 3 }}>
                      <AlertStatusAction data={data} />
                      <AlertActions data={data} />
                    </Flex>
                  </Flex>
                  <MobileRowItem label={'Delivery Channel'} value={<AlertChannel data={data} isMobile />} />
                  {/*<MobileRowItem label={'Last Message'} value={<AlertLastMessageAt data={data} />} />*/}
                  {/*<MobileRowItem label={'Type'} value={<AlertType data={data} />} />*/}
                  <MobileRowItem label={'Status'} value={<AlertStatus data={data} />} />
                </Flex>
              )
            })}
          </Flex>
        </Box>
        <Box height="100%" display={tab === TabKeyEnum.CUSTOM ? 'flex' : 'none'} sx={{ flexDirection: 'column' }}>
          <Box flex="1 0 0" sx={{ position: 'relative', overflow: 'auto' }}>
            <Flex mt={2} flexDirection="column" sx={{ gap: 2 }}>
              {customAlerts?.data?.map((data) => {
                return (
                  <Flex
                    key={data.id}
                    variant="card"
                    bg="neutral6"
                    flexDirection="column"
                    width="100%"
                    sx={{ gap: 2, py: 2, px: 3 }}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ pb: 2, borderBottom: 'small', borderColor: 'neutral5' }}
                    >
                      <Type.Caption color="neutral1" sx={{ textTransform: 'capitalize' }}>
                        {data.alertType === AlertTypeEnum.TRADERS
                          ? `${data.name} (${traderAlerts?.meta?.total ?? 0}/${maxTraderAlert})`
                          : data.name}
                      </Type.Caption>
                      <Flex alignItems="center" sx={{ gap: 2 }}>
                        <AlertStatusAction data={data} />
                        <AlertActions data={data} />
                      </Flex>
                    </Flex>
                    <MobileRowItem label={'Delivery Channel'} value={<AlertChannel data={data} isMobile />} />
                    {/*<MobileRowItem label={'Last Message'} value={<AlertLastMessageAt data={data} />} />*/}
                    <MobileRowItem label={'Type'} value={<AlertType data={data} />} />
                    <MobileRowItem label={'Status'} value={<AlertStatus data={data} />} />
                  </Flex>
                )
              })}
              {!isAvailableCustomAlert && !customAlerts?.meta?.total && (
                <Box px={3}>
                  <PlanUpgradePrompt
                    requiredPlan={customRequiredPlan}
                    title={<Trans>Available from {SUBSCRIPTION_PLAN_TRANSLATION[customRequiredPlan]} plans</Trans>}
                    description={<Trans>Build your own alert rules.Only get notified when it really matters.</Trans>}
                    noLoginTitle={<Trans>Login to view more information</Trans>}
                    showTitleIcon
                    showLearnMoreButton
                    useLockIcon
                    learnMoreSection={SubscriptionFeatureEnum.TRADER_ALERT}
                    titleSx={{
                      pt: 4,
                    }}
                    buttonsWrapperSx={{
                      pb: 4,
                    }}
                  />
                </Box>
              )}
              {isAvailableCustomAlert && !customAlerts?.data?.length && <NoCustomAlert />}
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box flexShrink={0} sx={{ borderTop: 'small', borderTopColor: 'neutral4' }}>
        {tab === TabKeyEnum.CUSTOM && currentPage && changeCurrentPage && (
          <PaginationWithSelect
            currentPage={currentPage}
            onPageChange={changeCurrentPage}
            apiMeta={customAlerts?.meta}
            sx={{
              width: '100%',
              justifyContent: 'end',
              py: 1,
              px: 2,
            }}
          />
        )}
      </Box>
    </>
  )
}

function MobileRowItem({
  label,
  value,
  textColor = 'neutral1',
}: {
  label: ReactNode
  value: ReactNode
  textColor?: string
}) {
  return (
    <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
      <Type.Caption minWidth="fit-content" color="neutral3" display="block">
        {label}
      </Type.Caption>
      <Type.Caption color={textColor} textAlign="right">
        {value}
      </Type.Caption>
    </Flex>
  )
}
