import { Trans } from '@lingui/macro'
import { Siren } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ApiListResponse } from 'apis/api'
import InputSearchText from 'components/@ui/InputSearchText'
import NoDataFound from 'components/@ui/NoDataFound'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/useSettingWatchlistTraders'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import TraderLastViewed from 'pages/Settings/AlertList/TraderLastViewed'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import AlertOffIcon from 'theme/Icons/AlerOffIcon'
import { PaginationWithSelect } from 'theme/Pagination'
import Popconfirm from 'theme/Popconfirm'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Flex, IconBox, Type } from 'theme/base'
import { AlertSettingsEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

import SearchToAdd from './SearchToAdd'
import { MobileRowItem, Trader24hTrades, TraderAddress, TraderLastTradeAt, TraderStatus } from './config'

export default function SettingWatchlistTraders({
  botAlert,
  traders,
  currentPage,
  changeCurrentPage,
  onChangeStep,
}: {
  botAlert?: BotAlertData
  traders?: ApiListResponse<TraderAlertData>
  currentPage: number
  changeCurrentPage: (page: number) => void
  onChangeStep: (step: AlertSettingsEnum) => void
}) {
  const { lg } = useResponsive()
  const isMobile = !lg
  const { maxTraderAlert, isVIPUser } = useBotAlertContext()
  const [searchText, setSearchText] = useState('')
  const protocolOptionsMapping = useGetProtocolOptionsMapping()

  const filteredTraders = useMemo(() => {
    if (!traders?.data) return traders
    const filtered = traders.data.filter((e) => {
      return (
        e?.address?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        e?.protocol?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        protocolOptionsMapping[e.protocol]?.text?.toLowerCase().includes(searchText.toLowerCase()) ||
        protocolOptionsMapping[e.protocol]?.label?.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    return {
      data: filtered,
      meta: {
        ...traders.meta,
        total: filtered.length,
      },
    } as ApiListResponse<TraderAlertData>
  }, [protocolOptionsMapping, searchText, traders])

  const { createTraderAlert, deleteTraderAlert, submittingDelete } = useSettingWatchlistTraders({})

  const handleUnsubscribeAlert = (alert?: TraderAlertData) => {
    if (alert) {
      deleteTraderAlert(alert?.id)
    }
  }

  const onAddWatchlist = (data?: TraderData) => {
    if (data) {
      createTraderAlert({ address: data.account, protocol: data.protocol })
    }
  }

  const ignoreSelectTraders =
    traders?.data?.map((e) => {
      return {
        account: e.address,
        protocol: e.protocol,
      }
    }) ?? []

  const TraderActions = useCallback(
    ({ data }: { data: TraderAlertData }) => {
      return (
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
                disabled={submittingDelete}
              />
            }
            title="Are you sure to unsubscribe this trader?"
            onConfirm={() => handleUnsubscribeAlert(data)}
          />
        </Flex>
      )
    },
    [submittingDelete]
  )

  const columns = useMemo(() => {
    const result: ColumnData<TraderAlertData>[] = [
      {
        title: 'RUN',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '50px' },
        render: (item) => <TraderStatus data={item} />,
      },
      {
        title: 'TRADERS',
        dataIndex: 'address',
        key: 'address',
        style: { minWidth: '150px' },
        render: (item) => <TraderAddress data={item} />,
      },
      {
        title: '24H LAST TRADE',
        dataIndex: 'lastTradeAt',
        key: 'lastTradeAt',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <TraderLastTradeAt data={item} />,
      },
      {
        title: '24H TRADES',
        dataIndex: 'trade24h',
        key: 'trade24h',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <Trader24hTrades data={item} />,
      },
      {
        title: 'ACTION',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '50px', textAlign: 'right' },
        render: (item) => <TraderActions data={item} />,
      },
    ]
    return result
  }, [TraderActions])

  const totalTrader = traders?.meta?.total ?? 0

  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <Flex
        alignItems={isMobile ? 'flex-start' : 'center'}
        justifyContent={isMobile ? 'flex-start' : 'space-between'}
        flexDirection={isMobile ? 'column' : 'row'}
        px={3}
        sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
      >
        <Flex
          flex={1}
          py={2}
          alignItems="center"
          flexWrap="wrap"
          sx={{ gap: 2, borderRight: isMobile ? 'none' : 'small', borderColor: 'neutral4' }}
        >
          <IconBox icon={<Siren size={20} weight="fill" />} />
          <Type.Body>
            {botAlert?.name?.toUpperCase() ?? ''} ({totalTrader}/{maxTraderAlert})
          </Type.Body>
          {!isVIPUser && totalTrader >= (maxTraderAlert ?? 0) && (
            <Link to={ROUTES.SUBSCRIPTION.path}>
              <Button size="xs" variant="outlinePrimary">
                <Trans>Upgrade</Trans>
              </Button>
            </Link>
          )}
          {totalTrader < (maxTraderAlert ?? 0) && (
            // <ButtonWithIcon size="xs" variant="outlinePrimary" icon={<Plus />} onClick={() => setOpenModalAdd(true)}>
            //   <Trans>Add Trader</Trans>
            // </ButtonWithIcon>
            <SearchToAdd ignoreSelectTraders={ignoreSelectTraders} onSelect={onAddWatchlist} />
          )}
        </Flex>
        <Flex alignItems="center" width={isMobile ? '100%' : '164px'} mt={isMobile ? 2 : 0} mb={isMobile ? 3 : 0}>
          {/*<SearchTraders*/}
          {/*  limit={500}*/}
          {/*  timeOption={TIME_FILTER_OPTIONS[4]}*/}
          {/*  onSelect={onAddWatchlist}*/}
          {/*  resultHeight={180}*/}
          {/*  ignoreSelectTraders={ignoreSelectTraders}*/}
          {/*  selectedTrader={null}*/}
          {/*  placeholder={'Search Trader To Add'}*/}
          {/*  addWidget={*/}
          {/*    <ButtonWithIcon variant="ghostPrimary" icon={<Plus />} p={0}>*/}
          {/*      ADD*/}
          {/*    </ButtonWithIcon>*/}
          {/*  }*/}
          {/*/>*/}
          <InputSearchText
            placeholder="SEARCH TRADER"
            sx={{
              width: '100%',
              height: 'max-content',
              border: isMobile ? undefined : 'none',
              borderRadius: 'xs',
              backgroundColor: 'transparent !important',
              pr: isMobile ? undefined : 0,
            }}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </Flex>
      </Flex>
      {!traders?.data?.length ? (
        <TraderLastViewed />
      ) : (
        <Flex flex={1} flexDirection="column" sx={{ overflow: 'auto' }}>
          {isMobile ? (
            <Flex px={3} flexDirection="column" sx={{ gap: 2 }}>
              {!!filteredTraders?.data?.length &&
                filteredTraders?.data?.map((data, index) => {
                  return (
                    <Flex
                      key={data.id}
                      flexDirection="column"
                      width="100%"
                      sx={{ py: 2, gap: 2, borderTop: index > 0 ? 'small' : 'none', borderColor: 'neutral4' }}
                    >
                      <Flex alignItems="center" justifyContent="space-between">
                        <TraderAddress data={data} />
                        <Flex alignItems="center" sx={{ gap: 3 }}>
                          <TraderStatus data={data} />
                          <TraderActions data={data} />
                        </Flex>
                      </Flex>
                      <MobileRowItem label={'24H Last Trade'} value={<TraderLastTradeAt data={data} />} />
                      <MobileRowItem label={'24H Trades'} value={<Trader24hTrades data={data} />} />
                    </Flex>
                  )
                })}
              {!filteredTraders?.data?.length && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
            </Flex>
          ) : (
            <Table
              data={filteredTraders?.data}
              columns={columns}
              isLoading={false}
              tableHeadSx={{
                '& th': {
                  py: 2,
                  borderBottom: 'small',
                  borderColor: 'neutral4',
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
      <PaginationWithSelect
        currentPage={currentPage}
        onPageChange={changeCurrentPage}
        apiMeta={filteredTraders?.meta}
        sx={{
          width: '100%',
          justifyContent: 'end',
          py: 1,
          px: 2,
          borderTop: 'small',
          borderColor: 'neutral4',
        }}
      />
    </Flex>
  )
}
