import { Trans } from '@lingui/macro'
import { Siren, Trash } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useCallback, useMemo, useState } from 'react'

import { ApiListResponse } from 'apis/api'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import InputSearchText from 'components/@ui/InputSearchText'
import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import TraderLastViewed from 'pages/Settings/AlertSettingDetails/TraderLastViewed'
import IconButton from 'theme/Buttons/IconButton'
import { PaginationWithSelect } from 'theme/Pagination'
import Popconfirm from 'theme/Popconfirm'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Flex } from 'theme/base'
import { AlertSettingsEnum } from 'utils/config/enums'
import { goToPreviousPage } from 'utils/helpers/transform'

import SearchToAdd from './SearchToAdd'
import { MobileRowItem, Trader24hTrades, TraderAddress, TraderCreatedAt, TraderStatus } from './config'

export default function SettingWatchlistTraders({
  botAlert,
  traders,
  currentPage,
  changeCurrentPage,
  currentSort,
  changeCurrentSort,
  onChangeStep,
}: {
  botAlert?: BotAlertData
  traders?: ApiListResponse<TraderAlertData>
  currentPage: number
  changeCurrentPage: (page: number) => void
  currentSort: TableSortProps<TraderAlertData> | undefined
  changeCurrentSort: (value: TableSortProps<TraderAlertData> | undefined) => void
  onChangeStep: (step: AlertSettingsEnum) => void
}) {
  const { lg } = useResponsive()
  const isMobile = !lg
  const { maxTraderAlert, usage } = useBotAlertContext()
  const [searchText, setSearchText] = useState('')
  const protocolOptionsMapping = useGetProtocolOptionsMapping()

  const { isAvailableWatchlistAlert, watchlistRequiredPlan, userWatchlistNextPlan } = useAlertPermission()

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

  const onSuccess = () => {
    if (traders && currentPage && !!changeCurrentPage) {
      goToPreviousPage({ total: traders.meta.total, limit: 10, currentPage, changeCurrentPage })
    }
  }
  const { createTraderAlert, deleteTraderAlert, submittingDelete } = useSettingWatchlistTraders({ onSuccess })

  const handleUnsubscribeAlert = (alert?: TraderAlertData) => {
    if (alert?.id) {
      deleteTraderAlert(alert.id)
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
                icon={<Trash size={16} />}
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
            confirmButtonProps={{ variant: 'ghostDanger' }}
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
        dataIndex: 'enableAlert',
        key: 'enableAlert',
        style: { minWidth: '50px' },
        render: (item) => <TraderStatus data={item} />,
      },
      {
        title: 'TRADERS',
        dataIndex: 'address',
        key: 'address',
        sortBy: 'address',
        style: { minWidth: '150px' },
        render: (item) => <TraderAddress data={item} />,
      },
      {
        title: 'LATEST ADDED',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sortBy: 'createdAt',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <TraderCreatedAt data={item} />,
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

  const totalTrader = usage?.watchedListAlerts ?? 0

  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <Flex
        alignItems={isMobile ? 'flex-start' : 'center'}
        justifyContent={isMobile ? 'flex-start' : 'space-between'}
        flexDirection={isMobile ? 'column' : 'row'}
        px={3}
        sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
      >
        <Flex flex={1} py={2} alignItems="center" flexWrap="wrap">
          <SectionTitle
            icon={Siren}
            title={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                {botAlert?.name?.toUpperCase() ?? ''}
                <BadgeWithLimit
                  total={totalTrader}
                  limit={maxTraderAlert}
                  tooltipContent={
                    userWatchlistNextPlan && (
                      <PlanUpgradePrompt
                        requiredPlan={userWatchlistNextPlan}
                        title={<Trans>You have exceeded your trader limit for the current plan.</Trans>}
                        confirmButtonVariant="textPrimary"
                        titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
                      />
                    )
                  }
                  clickableTooltip
                />
              </Flex>
            }
            suffix={
              isAvailableWatchlistAlert && (
                <UpgradeButton requiredPlan={watchlistRequiredPlan} showIcon={isMobile} showCurrentPlan={!isMobile} />
              )
            }
            sx={{ mb: 0 }}
          />
        </Flex>
      </Flex>
      <Flex alignItems="center" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <Flex sx={{ pl: 1, width: 200, borderRight: 'small', borderColor: 'neutral4' }}>
          <InputSearchText
            placeholder="SEARCH TRADER"
            sx={{
              width: '100%',
              height: 'max-content',
              border: 'none',
              borderRadius: 'xs',
              backgroundColor: 'transparent !important',
            }}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </Flex>
        <Flex flex={1} justifyContent="flex-end" sx={{ pr: 3, gap: 2 }}>
          <SearchToAdd
            totalTrader={totalTrader}
            maxTraderAlert={maxTraderAlert ?? 0}
            ignoreSelectTraders={ignoreSelectTraders}
            onSelect={onAddWatchlist}
            onRemove={(data: TraderData) => {
              const traderAlertData = filteredTraders?.data?.find(
                (e) => e.address === data.account && e.protocol === data.protocol
              )
              if (traderAlertData) {
                handleUnsubscribeAlert(traderAlertData)
              }
            }}
          />
        </Flex>
      </Flex>
      {!traders?.data?.length ? (
        <TraderLastViewed />
      ) : (
        <Flex flex={1} flexDirection="column" sx={{ overflow: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
          {isMobile ? (
            <Flex pt={2} flexDirection="column" sx={{ gap: 2, overflow: 'auto' }}>
              {!!filteredTraders?.data?.length &&
                filteredTraders?.data?.map((data) => {
                  return (
                    <Flex
                      key={data.id}
                      variant="card"
                      flexDirection="column"
                      bg="neutral6"
                      width="100%"
                      sx={{ pt: 2, gap: 2 }}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ pb: 2, borderBottom: 'small', borderColor: 'neutral5' }}
                      >
                        <TraderAddress data={data} />
                        <Flex alignItems="center" sx={{ gap: 3 }}>
                          <TraderStatus data={data} />
                          <TraderActions data={data} />
                        </Flex>
                      </Flex>
                      <MobileRowItem label={'Latest Added'} value={<TraderCreatedAt data={data} />} />
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
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
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
