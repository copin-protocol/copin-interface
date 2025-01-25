import { Plus } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo } from 'react'

import { BotAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import usePageChange from 'hooks/helpers/usePageChange'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { PaginationWithSelect } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { AlertTypeEnum } from 'utils/config/enums'

import { AlertActions, AlertChannel, AlertLastMessageAt, AlertName, AlertStatus, AlertType } from './config'

export default function AlertDashboard() {
  return <AlertDashboardComponent />
}
function AlertDashboardComponent() {
  const { lg } = useResponsive()
  const isMobile = !lg
  const { botAlerts, loadingAlerts } = useBotAlertContext()

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'alert-list' })
  const { traderAlerts, maxTraderAlert } = useBotAlertContext()

  const columns = useMemo(() => {
    const result: ColumnData<BotAlertData>[] = [
      {
        title: '',
        dataIndex: 'isRunning',
        key: 'isRunning',
        style: { minWidth: '50px' },
        render: (item) => <AlertStatus data={item} />,
      },
      {
        title: 'NAME',
        dataIndex: 'name',
        key: 'name',
        style: { minWidth: '200px' },
        render: (item) => (
          <AlertName data={item} totalTraders={traderAlerts?.meta?.total ?? 0} maxTraders={maxTraderAlert} />
        ),
      },
      {
        title: 'DELIVERY CHANNEL',
        dataIndex: 'chatId',
        key: 'chatId',
        style: { minWidth: '215px' },
        render: (item) => <AlertChannel data={item} />,
      },
      {
        title: 'LAST MESSAGE',
        dataIndex: 'lastMessageAt',
        key: 'lastMessageAt',
        style: { minWidth: '150px' },
        render: (item) => <AlertLastMessageAt data={item} />,
      },
      {
        title: 'TYPE',
        dataIndex: 'type',
        key: 'type',
        style: { minWidth: '150px' },
        render: (item) => <AlertType data={item} />,
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '50px' },
        render: (item) => <AlertActions data={item} />,
      },
    ]
    return result
  }, [maxTraderAlert, traderAlerts?.meta?.total])

  return (
    <>
      <Flex
        sx={{
          alignItems: 'center',
          height: '100%',
          width: '100%',
          maxWidth: ['auto', 'auto', 962],
          mx: 'auto',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflow: ['hidden', 'hidden', 'auto'],
            border: ['none', 'none', 'small'],
            borderTop: ['none', 'none', 'none'],
            borderBottom: ['none', 'none', 'none'],
            borderColor: ['none', 'none', 'neutral4'],
          }}
        >
          <Flex
            flexDirection={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            justifyContent="space-between"
            width="100%"
            minHeight="40px"
            sx={{
              gap: 2,
              px: 3,
              py: 2,
              backgroundColor: 'neutral5',
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            <Type.Caption flex={2}>Easily create, modify and track alerts.</Type.Caption>
            <Flex minWidth="max-content" alignItems="center" flex={1} justifyContent="flex-end">
              <ButtonWithIcon
                data-tip="React-tooltip"
                data-tooltip-id={`tt-coming-soon`}
                data-tooltip-delay-show={360}
                variant="ghostPrimary"
                disabled
                icon={<Plus />}
                p={0}
              >
                <Type.Caption>Create New Alert</Type.Caption>
              </ButtonWithIcon>
              <Tooltip id="tt-coming-soon" place="left">
                <Type.Caption color="neutral2" sx={{ maxWidth: 350 }}>
                  Coming Soon
                </Type.Caption>
              </Tooltip>
            </Flex>
          </Flex>
          <Flex
            sx={{
              flex: '1 0 0',
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              gap: [2, 2, 3],
              overflow: 'auto',
            }}
          >
            {isMobile ? (
              <Flex mt={2} flexDirection="column" sx={{ gap: 2 }}>
                {botAlerts?.data?.map((data) => {
                  return (
                    <Flex key={data.id} variant="card" flexDirection="column" width="100%" sx={{ gap: 3 }}>
                      <Flex alignItems="center" justifyContent="space-between">
                        <Type.Caption color="neutral1" sx={{ textTransform: 'capitalize' }}>
                          {data.type === AlertTypeEnum.TRADERS
                            ? `${data.name} (${traderAlerts?.meta?.total ?? 0}/${maxTraderAlert})`
                            : data.name}
                        </Type.Caption>
                        <Flex alignItems="center" sx={{ gap: 3 }}>
                          <AlertStatus data={data} />
                          <AlertActions data={data} />
                        </Flex>
                      </Flex>
                      <MobileRowItem label={'Delivery Channel'} value={<AlertChannel data={data} />} />
                      <MobileRowItem label={'Last Message'} value={<AlertLastMessageAt data={data} />} />
                      <MobileRowItem
                        label={'Type'}
                        value={<AlertType data={data} />}
                        textColor={data.type === AlertTypeEnum.CUSTOM ? 'violet' : 'orange2'}
                      />
                    </Flex>
                  )
                })}
              </Flex>
            ) : (
              <Table
                restrictHeight
                data={botAlerts?.data}
                columns={columns}
                isLoading={loadingAlerts}
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
              />
            )}
          </Flex>
          <Box sx={{ backgroundColor: 'neutral7' }}>
            <PaginationWithSelect
              currentPage={currentPage}
              onPageChange={changeCurrentPage}
              apiMeta={botAlerts?.meta}
              sx={{
                width: '100%',
                justifyContent: 'end',
                py: 1,
                px: 2,
                borderTop: 'small',
                borderColor: 'neutral4',
              }}
            />
          </Box>
        </Flex>
      </Flex>
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
    <Flex alignItems="center" justifyContent="space-between">
      <Type.Caption color="neutral3" display="block">
        {label}
      </Type.Caption>
      <Type.Caption color={textColor}>{value}</Type.Caption>
    </Flex>
  )
}
