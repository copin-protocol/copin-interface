import { Trans } from '@lingui/macro'
import { Gear, Wrench } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'

import useAlertDashboardContext, { TabKeyEnum } from 'hooks/features/alert/useAlertDashboardContext'
import { PaginationWithSelect } from 'theme/Pagination'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, Type } from 'theme/base'
import { AlertTypeEnum } from 'utils/config/enums'
import { overflowEllipsis } from 'utils/helpers/css'

import NoCustomAlert from './NoCustomAlert'
import { AlertActions, AlertChannel, AlertStatus, AlertStatusAction, AlertType } from './config'

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>SYSTEM ALERT</Trans>,
    activeIcon: <Gear size={24} weight="fill" />,
    icon: <Gear size={24} />,
    key: TabKeyEnum.SYSTEM,
  },
  {
    name: <Trans>CUSTOM ALERT</Trans>,
    activeIcon: <Wrench size={24} weight="fill" />,
    icon: <Wrench size={24} />,
    key: TabKeyEnum.CUSTOM,
  },
]

export default function MobileView() {
  const { systemAlerts, customAlerts, traderAlerts, maxTraderAlert, currentPage, changeCurrentPage, tab, setTab } =
    useAlertDashboardContext()

  return (
    <>
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
        <Box display={tab === TabKeyEnum.CUSTOM ? 'flex' : 'none'} sx={{ flexDirection: 'column' }}>
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
            {!customAlerts?.data?.length && <NoCustomAlert />}
          </Flex>
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
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          />
        )}
        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.key === tab}
          onClickItem={(key) => setTab(key as TabKeyEnum)}
          fullWidth
          itemSx={{
            width: '100%',
          }}
        />
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
