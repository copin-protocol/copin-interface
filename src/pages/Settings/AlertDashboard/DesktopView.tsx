import { Trans } from '@lingui/macro'
import { Gear, Plus, Wrench } from '@phosphor-icons/react'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import InputSearchText from 'components/@ui/InputSearchText'
import SectionTitle from 'components/@ui/SectionTitle'
import { BotAlertData } from 'entities/alert'
import useAlertDashboardContext from 'hooks/features/alert/useAlertDashboardContext'
import Badge from 'theme/Badge'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { PaginationWithSelect } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

import NoCustomAlert from './NoCustomAlert'
import { AlertActions, AlertChannel, AlertName, AlertStatus, AlertStatusAction, AlertType } from './config'


export default function DesktopView() {
  const {
    systemAlerts,
    customAlerts,
    loadingAlerts,
    traderAlerts,
    maxTraderAlert,
    totalCustoms,
    maxCustoms,
    isLimited,
    isVIPUser,
    currentPage,
    changeCurrentPage,
    keyword,
    setKeyword,
    handleCreateCustomAlert,
  } = useAlertDashboardContext()

  const columns = useMemo(() => {
    const result: ColumnData<BotAlertData>[] = [
      {
        title: '',
        dataIndex: 'enableAlert',
        key: 'alertType',
        style: { minWidth: '50px' },
        render: (item) => <AlertStatusAction data={item} />,
      },
      {
        title: 'NAME',
        dataIndex: 'name',
        key: 'name',
        style: { minWidth: '200px', maxWidth: '200px' },
        render: (item) => (
          <AlertName data={item} totalTraders={traderAlerts?.meta?.total ?? 0} maxTraders={maxTraderAlert ?? 0} />
        ),
      },
      {
        title: 'DELIVERY CHANNEL',
        dataIndex: 'channels',
        key: 'channels',
        style: { minWidth: '215px', maxWidth: '215px' },
        render: (item) => <AlertChannel data={item} />,
      },
      // {
      //   title: 'LAST MESSAGE',
      //   dataIndex: 'lastMessageAt',
      //   key: 'lastMessageAt',
      //   style: { minWidth: '150px', textAlign: 'right' },
      //   render: (item) => <AlertLastMessageAt data={item} />,
      // },
      {
        title: 'TYPE',
        dataIndex: 'type',
        key: 'type',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => <AlertType data={item} />,
      },
      {
        title: 'STATUS',
        dataIndex: 'enableAlert',
        key: 'enableAlert',
        style: { minWidth: '120px', textAlign: 'right', justifyContent: 'right', display: 'flex' },
        render: (item) => <AlertStatus data={item} />,
      },
      {
        title: 'ACTION',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '50px', textAlign: 'right' },
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
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent="space-between"
            width="100%"
            minHeight="40px"
            sx={{
              gap: 2,
              px: 3,
              py: 2,
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            <SectionTitle
              icon={Gear}
              title={
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <Trans>SYSTEM ALERT</Trans>
                  <Badge count={systemAlerts?.length ?? 0} />
                </Flex>
              }
              sx={{ mb: 0 }}
            />
          </Flex>
          <Flex
            sx={{
              flexDirection: 'column',
              gap: [2, 2, 3],
            }}
          >
            <Table
              restrictHeight={false}
              data={systemAlerts}
              columns={columns}
              isLoading={!!loadingAlerts}
              tableHeadSx={{
                '& th': {
                  py: 2,
                  pr: 2,
                },
              }}
              tableBodySx={{
                '& td': {
                  height: 40,
                  pr: 2,
                },
              }}
            />
          </Flex>
          <Flex
            flexDirection="row"
            alignItems={'center'}
            justifyContent="space-between"
            width="100%"
            minHeight="40px"
            sx={{
              gap: 2,
              px: 3,
              borderTop: 'small',
              borderBottom: 'small',
              borderColor: 'neutral4',
              flexWrap: 'wrap',
            }}
          >
            <Flex flex={2} py={1} alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
              <SectionTitle
                icon={Wrench}
                title={
                  <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
                    <Trans>CUSTOM ALERT</Trans>
                    <Badge count={`${totalCustoms}/${maxCustoms}`} />
                    {!isVIPUser && isLimited ? (
                      <Link to={ROUTES.SUBSCRIPTION.path}>
                        <Button size="xs" variant="outlinePrimary">
                          <Trans>Upgrade</Trans>
                        </Button>
                      </Link>
                    ) : (
                      <ButtonWithIcon
                        size="xs"
                        variant="outlinePrimary"
                        icon={<Plus />}
                        disabled={isLimited}
                        onClick={handleCreateCustomAlert}
                      >
                        <Type.Caption>Create New Alert</Type.Caption>
                      </ButtonWithIcon>
                    )}
                  </Flex>
                }
                sx={{ mb: 0 }}
              />
            </Flex>
            {setKeyword && (
              <Flex
                pl={3}
                height={40}
                alignItems="center"
                width="200px"
                sx={{ borderLeft: 'small', borderColor: 'neutral4' }}
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
          </Flex>
          {!!customAlerts?.data?.length && (
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
              <Table
                restrictHeight
                data={customAlerts?.data}
                columns={columns}
                isLoading={!!loadingAlerts}
                tableHeadSx={{
                  '& th': {
                    py: 2,
                    pr: 2,
                  },
                }}
                tableBodySx={{
                  '& td': {
                    height: 40,
                    pr: 2,
                  },
                }}
              />
            </Flex>
          )}
          {!customAlerts?.data?.length && <NoCustomAlert />}
          {currentPage && changeCurrentPage && (
            <Box sx={{ backgroundColor: 'neutral7' }}>
              <PaginationWithSelect
                currentPage={currentPage}
                onPageChange={changeCurrentPage}
                apiMeta={customAlerts?.meta}
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
          )}
        </Flex>
      </Flex>
    </>
  )
}
