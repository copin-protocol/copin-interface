import { Trans } from '@lingui/macro'
import { DotsThreeVertical, Siren, Trash } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ApiListResponse } from 'apis/api'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import InputSearchText from 'components/@ui/InputSearchText'
import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import AlertLabelButton from 'components/@widgets/AlertLabelButton'
import { BotAlertData, TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import { useAlertSettingDetailsContext } from 'hooks/features/alert/useAlertDetailsContext'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import TraderLastViewed from 'pages/Settings/AlertSettingDetails/TraderLastViewed'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { PaginationWithSelect } from 'theme/Pagination'
import Popconfirm from 'theme/Popconfirm'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
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
  const { keyword: searchText, setKeyword: setSearchText } = useAlertSettingDetailsContext()
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const { isAvailableWatchlistAlert, watchlistRequiredPlan, userWatchlistNextPlan } = useAlertPermission()
  const [traderData, setTraderData] = useState<TraderAlertData[]>(traders?.data || [])
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null)

  useEffect(() => {
    const element = tableWrapperRef.current
    if (!element || dropdownVisible === null) return

    const handleScroll = () => {
      setDropdownVisible(null)
    }

    element.addEventListener('scroll', handleScroll)
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [dropdownVisible, tableWrapperRef])

  useEffect(() => {
    if (traders?.data) {
      setTraderData(traders.data)
    }
  }, [traders?.data])

  const filteredTraders = useMemo(() => {
    if (!traderData?.length) return traders
    const filtered = traderData.filter((e) => {
      const search = searchText?.toLowerCase() ?? ''
      return (
        e?.address?.toLowerCase()?.includes(search) ||
        e?.protocol?.toLowerCase()?.includes(search) ||
        e?.label?.toLowerCase()?.includes(search) ||
        protocolOptionsMapping[e.protocol]?.text?.toLowerCase().includes(search) ||
        protocolOptionsMapping[e.protocol]?.label?.toLowerCase().includes(search)
      )
    })
    return {
      data: filtered,
      meta: {
        ...traders?.meta,
        total: filtered.length,
      },
    } as ApiListResponse<TraderAlertData>
  }, [protocolOptionsMapping, searchText, traders, traderData])

  const onSuccess = () => {
    if (traders && currentPage && !!changeCurrentPage) {
      goToPreviousPage({ total: traders.meta.total, limit: 10, currentPage, changeCurrentPage })
    }
  }
  const { createTraderAlert, deleteTraderAlert, submittingDelete } = useSettingWatchlistTraders({ onSuccess })

  const handleUnsubscribeAlert = (alert?: TraderAlertData) => {
    if (alert?.id) {
      deleteTraderAlert(alert.id)
      setTraderData((prev) => prev.filter((trader) => trader.id !== alert.id))
      setDropdownVisible(null)
    }
  }

  const onAddWatchlist = (data?: TraderData) => {
    if (data) {
      createTraderAlert({ address: data.account, protocol: data.protocol })
    }
  }

  const handleLabelChange = (traderId: string, newLabel: string) => {
    setTraderData((prev) => prev.map((trader) => (trader.id === traderId ? { ...trader, label: newLabel } : trader)))
  }

  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [lastVisibleIndex, setLastVisibleIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          const lastVisible = visibleEntries.reduce((prev, curr) =>
            prev.boundingClientRect.top > curr.boundingClientRect.top ? prev : curr
          )
          const index = itemRefs.current.findIndex((el) => el === lastVisible.target)
          setLastVisibleIndex(index)
        }
      },
      {
        root: tableWrapperRef.current,
        threshold: 0.25,
      }
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [filteredTraders?.data])

  const ignoreSelectTraders =
    traderData?.map((e) => {
      return {
        account: e.address,
        protocol: e.protocol,
      }
    }) ?? []

  const TraderActions = useCallback(
    ({ data, text, iconSx }: { data: TraderAlertData; text?: string; iconSx?: React.CSSProperties }) => {
      return (
        <Flex alignItems="center" justifyContent="flex-end">
          <Popconfirm
            action={
              <Flex>
                <IconButton
                  variant="ghost"
                  icon={<Trash size={16} />}
                  size={16}
                  sx={{
                    color: 'neutral3',
                    '&:hover:not(:disabled),&:active:not(:disabled)': {
                      color: 'red1',
                    },
                    ...iconSx,
                  }}
                  disabled={submittingDelete}
                />
                {text && (
                  <Type.Caption color="red1" ml={1}>
                    <Trans> {text}</Trans>
                  </Type.Caption>
                )}
              </Flex>
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

  const AddressItem = ({ item, index }: { item: TraderAlertData; index: any }) => {
    const isLastVisible = index === lastVisibleIndex
    return (
      <Flex alignItems="center" sx={{ gap: 2 }} ref={(i) => (itemRefs.current[index] = i)}>
        <Flex flexDirection="column" width={160}>
          <TraderAddress data={item} />
        </Flex>

        <Box className="alert-label-btn" pt={2}>
          <AlertLabelButton
            alertId={item.id}
            address={item.address}
            protocol={item.protocol}
            initialLabel={item.label || ''}
            hasLabel={!!item.label}
            positionTooltip={
              (index !== undefined && index >= 7) || isLastVisible ? { top: 25, left: 0 } : { top: -5, left: 10 }
            }
            containerRef={tableWrapperRef}
            onLabelChange={(newLabel) => {
              if (item.id) {
                handleLabelChange(item.id, newLabel)
              }
            }}
          />
        </Box>
      </Flex>
    )
  }

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
        render: (item, index) => <AddressItem item={item} index={index} />,
      },
      {
        title: 'LATEST ADDED',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sortBy: 'createdAt',
        style: { maxWidth: 120, width: 120, textAlign: 'right' },
        render: (item) => <TraderCreatedAt data={item} />,
      },
      {
        title: '24H TRADES',
        dataIndex: 'trade24h',
        key: 'trade24h',
        style: { maxWidth: 85, width: 85, textAlign: 'right' },
        render: (item) => <Trader24hTrades data={item} />,
      },
      {
        title: 'ACTION',
        dataIndex: 'id',
        key: 'id',
        style: { maxWidth: 80, width: 80, textAlign: 'right' },
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
        <Flex sx={{ pl: 1, width: 240, borderRight: 'small', borderColor: 'neutral4' }}>
          <InputSearchText
            placeholder="SEARCH ADDRESS/ LABEL"
            sx={{
              width: '100%',
              height: 'max-content',
              border: 'none',
              borderRadius: 'xs',
              backgroundColor: 'transparent !important',
            }}
            searchText={searchText || ''}
            setSearchText={
              setSearchText
                ? (t) => setSearchText(t as any)
                : (t) => {
                    console.warn('setSearchText is not defined', t)
                  }
            }
          />
        </Flex>
        <Flex flex={1} justifyContent="flex-end" sx={{ pr: [1, 3], gap: 2 }}>
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
      {!searchText && !traders?.data?.length ? (
        <TraderLastViewed />
      ) : (
        <Flex ref={tableWrapperRef} flex={1} flexDirection="column" sx={{ overflow: 'auto' }}>
          {isMobile ? (
            <Flex pt={2} flexDirection="column" sx={{ gap: 2 }}>
              {!!filteredTraders?.data?.length &&
                filteredTraders?.data?.map((data, index) => {
                  const isLastVisible = index === lastVisibleIndex
                  return (
                    <Flex
                      key={data.id}
                      variant="card"
                      flexDirection="column"
                      bg="neutral6"
                      width="100%"
                      sx={{ pt: 2, gap: 2 }}
                      ref={(i) => (itemRefs.current[index] = i)}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ pb: 2, borderBottom: 'small', borderColor: 'neutral5' }}
                      >
                        <Flex flexDirection="column" sx={{ gap: 1 }}>
                          <TraderAddress data={data} />
                        </Flex>

                        <Flex alignItems="center" sx={{ gap: 3 }}>
                          <TraderStatus data={data} />
                          <Dropdown
                            visible={dropdownVisible === index}
                            setVisible={(v) => setDropdownVisible(v ? index : null)}
                            menuPosition="bottom"
                            hasArrow={false}
                            menuSx={{
                              width: '150px',
                              p: 1,
                              border: 'small',
                              borderRadius: 'sm',
                              position: 'absolute',
                              left: -130,
                            }}
                            buttonSx={{
                              border: 'none',
                              p: 0,
                              mt: 1,
                            }}
                            menu={
                              <Flex flexDirection="column" alignItems={'flex-start'}>
                                {/* TODO: Check bug when enter space without as=div */}
                                <DropdownItem as="div">
                                  <Flex
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                    py={1}
                                    px={0}
                                  >
                                    <AlertLabelButton
                                      alertId={data.id}
                                      address={data.address}
                                      protocol={data.protocol}
                                      initialLabel={data.label || ''}
                                      hasLabel={!!data.label}
                                      positionTooltip={{ top: 70, left: 100 }}
                                      // containerRef={tableWrapperRef}
                                      text="EDIT LABEL"
                                      onLabelChange={(newLabel) => {
                                        if (data.id) {
                                          handleLabelChange(data.id, newLabel)
                                          setDropdownVisible(null)
                                        }
                                      }}
                                    />
                                  </Flex>
                                </DropdownItem>
                                <DropdownItem>
                                  <Flex
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                    py={1}
                                    px={0}
                                  >
                                    <TraderActions data={data} text={'REMOVE TRADER'} iconSx={{ color: 'red1' }} />
                                  </Flex>
                                </DropdownItem>
                              </Flex>
                            }
                          >
                            <DotsThreeVertical size={20} />
                          </Dropdown>
                        </Flex>
                      </Flex>
                      <MobileRowItem label={'Latest Added'} value={<TraderCreatedAt data={data} />} />
                      <MobileRowItem label={'24H Trades'} value={<Trader24hTrades data={data} />} />
                    </Flex>
                  )
                })}
              {!filteredTraders?.data?.length && searchText && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
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
                  '.alert-label-btn': {
                    opacity: 0,
                    visibility: 'hidden',
                    transition: 'all 240ms ease',
                  },
                  '& tr:hover .alert-label-btn, & tr:has(:focus) .alert-label-btn': {
                    opacity: 1,
                    visibility: 'visible',
                  },
                },
              }}
            />
          )}
        </Flex>
      )}
      {!filteredTraders?.data?.length && searchText ? (
        <></>
      ) : (
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
      )}
    </Flex>
  )
}
