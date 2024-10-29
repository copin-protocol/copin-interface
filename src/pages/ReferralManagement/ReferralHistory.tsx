import { Trans } from '@lingui/macro'
import { ArrowSquareOut, Funnel } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getClaimHistoryListApi, getRebateHistoryListApi, getReferralListApi } from 'apis/referralManagement'
import tokenNotFound from 'assets/images/token-not-found.png'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import NoDataFound from 'components/@ui/NoDataFound'
import SubscriptionIcon from 'components/@ui/SubscriptionIcon'
import { ReferralClaimHistoryData, ReferralListData, ReferralRebateHistoryData } from 'entities/referralManagement'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import Dropdown from 'theme/Dropdown'
import { PaginationWithLimit, PaginationWithSelect } from 'theme/Pagination'
import Tabs, { TabPane } from 'theme/Tab'
import Table from 'theme/Table'
import { ColumnData, TableProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, DEFAULT_LIMIT } from 'utils/config/constants'
import {
  ClaimRewardStatusEnum,
  ReferralHistoryStatusEnum,
  ReferralTierEnum,
  ReferralTypeEnum,
  SortTypeEnum,
  SubscriptionPlanEnum,
} from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { addressShorten, compactNumber, formatDate, formatNumber } from 'utils/helpers/format'
import { pageToOffset } from 'utils/helpers/transform'
import { ARBITRUM_CHAIN, CHAINS } from 'utils/web3/chains'

import { ClaimRewardModal } from './ReferralStats'
// import IconUsdt from './IconUsdt'
import { TIER_SYSTEM } from './configs'

export default function ReferralHistory() {
  const handleClickLogin = useClickLoginButton()
  const { isAuthenticated } = useAuthContext()
  const { myProfile: profile } = useMyProfileStore()
  const { sm, xl } = useResponsive()
  const { searchParams, setSearchParams } = useSearchParams()

  const currentPage = Number((searchParams['page'] as string) ?? 1)
  const currentLimit = Number((searchParams['limit'] as string) ?? DEFAULT_LIMIT)
  const currentSortBy = searchParams['sort_by'] as string
  const currentSortType = searchParams['sort_type'] as string
  const currentTab = (searchParams['tab'] as string) ?? tabKeys.F1_REFERRAL_LIST
  const currentFilterType = searchParams['filter'] as ReferralTypeEnum
  const currentFilterStatus = searchParams['status'] as ReferralHistoryStatusEnum

  const paramsRef = useRef<
    Record<
      string,
      {
        currentPage: string
        currentSortBy: string
        currentSortType: string
        filter: string
        status: string
        limit: string
      }
    >
  >({})
  useEffect(() => {
    paramsRef.current = {
      ...paramsRef.current,
      [currentTab]: {
        currentPage: currentPage.toString(),
        currentSortBy,
        currentSortType,
        filter: currentFilterType,
        status: currentFilterStatus,
        limit: currentLimit.toString(),
      },
    }
  }, [currentLimit, currentFilterStatus, currentFilterType, currentPage, currentSortBy, currentSortType, currentTab])

  const changeCurrentPage = (page: number) => setSearchParams({ ['page']: page.toString() })
  const changeCurrentLimit = (limit: number) => setSearchParams({ ['limit']: limit.toString() })
  const changeCurrentSort: TableProps<any, any>['changeCurrentSort'] = (sort) => {
    setSearchParams({ ['sort_by']: sort?.sortBy as any, ['sort_type']: sort?.sortType, ['page']: '1' })
  }
  const changeCurrentFilterType = (filter: string | undefined) => {
    setSearchParams({ ['filter']: filter, ['page']: '1' })
  }
  const changeCurrentFilterStatus = (filter: string | undefined) => {
    setSearchParams({ ['status']: filter, ['page']: '1' })
  }
  const changeCurrentTab = (key: string) => {
    setSearchParams({
      ['tab']: key,
      ['page']: paramsRef.current[key]?.currentPage,
      ['sort_by']: paramsRef.current[key]?.currentSortBy,
      ['sort_type']: paramsRef.current[key]?.currentSortType,
      ['filter']: paramsRef.current[key]?.filter,
      ['status']: paramsRef.current[key]?.status,
    })
  }
  const referralRebateColumns = useReferralRebateColumns({
    currentFilterType,
    changeCurrentFilterType,
    currentFilterStatus,
    changeCurrentFilterStatus,
  })

  const { data: referralF1Listdata, isFetching: isLoadingF1List } = useQuery(
    [
      QUERY_KEYS.GET_REFERRAL_DATA,
      'list',
      ReferralTypeEnum.F1,
      currentSortBy,
      currentSortType,
      currentPage,
      currentLimit,
      isAuthenticated,
      profile?.username,
    ],
    () =>
      getReferralListApi({
        referralType: ReferralTypeEnum.F1,
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        sortBy: currentSortBy,
        sortType: currentSortType as SortTypeEnum,
      }),
    { enabled: currentTab === tabKeys.F1_REFERRAL_LIST && !!isAuthenticated, keepPreviousData: true }
  )
  const { data: referralF2Listdata, isFetching: isLoadingF2List } = useQuery(
    [
      QUERY_KEYS.GET_REFERRAL_DATA,
      'list',
      ReferralTypeEnum.F2,
      currentSortBy,
      currentSortType,
      currentPage,
      currentLimit,
      isAuthenticated,
      profile?.username,
    ],
    () =>
      getReferralListApi({
        referralType: ReferralTypeEnum.F2,
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        sortBy: currentSortBy,
        sortType: currentSortType as SortTypeEnum,
      }),
    { enabled: currentTab === tabKeys.F2_REFERRAL_LIST && !!isAuthenticated, keepPreviousData: true }
  )
  const { data: referralRebateHistoryData, isFetching: isLoadingRebateHistory } = useQuery(
    [
      QUERY_KEYS.GET_REFERRAL_DATA,
      'rebate',
      currentSortBy,
      currentSortType,
      currentFilterStatus,
      currentFilterType,
      isAuthenticated,
      currentPage,
      currentLimit,
      profile?.username,
    ],
    () =>
      getRebateHistoryListApi({
        referralType: currentFilterType,
        status: currentFilterStatus,
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        sortBy: currentSortBy,
        sortType: currentSortType as SortTypeEnum,
      }),
    { enabled: currentTab === tabKeys.REBATE_HISTORY && !!isAuthenticated, keepPreviousData: true }
  )
  const { data: referralClaimHistoryData, isFetching: isLoadingClaimHistory } = useQuery(
    [
      QUERY_KEYS.GET_CLAIM_REWARD_HISTORY,
      currentSortBy,
      currentSortType,
      currentPage,
      currentLimit,
      isAuthenticated,
      profile?.username,
    ],
    () => getClaimHistoryListApi(),
    { enabled: currentTab === tabKeys.CLAIM_HISTORY && !!isAuthenticated }
  )
  let _data: ApiListResponse<any> | undefined
  let isLoading: boolean | undefined
  let columns: any
  let MobileItem: any
  let noDataMessage: ReactNode | undefined = undefined
  switch (currentTab) {
    case tabKeys.F1_REFERRAL_LIST:
      isLoading = isLoadingF1List
      _data = referralF1Listdata
      columns = referralListColumns
      MobileItem = MobileReferralListItem
      noDataMessage = 'Referral List'
      break
    case tabKeys.F2_REFERRAL_LIST:
      isLoading = isLoadingF2List
      _data = referralF2Listdata
      columns = referralListColumns
      MobileItem = MobileReferralListItem
      noDataMessage = 'Referral List'
      break
    case tabKeys.REBATE_HISTORY:
      isLoading = isLoadingRebateHistory
      _data = referralRebateHistoryData
      columns = referralRebateColumns
      MobileItem = MobileRebateListItem
      noDataMessage = 'Commission & Rebate History'
      break
    case tabKeys.CLAIM_HISTORY:
      isLoading = isLoadingClaimHistory
      _data = referralClaimHistoryData
      columns = referralClaimColumns
      MobileItem = MobileClaimListItem
      noDataMessage = 'Claim History'
      break
    default:
      break
  }
  const showNoDataMessage = !referralF1Listdata?.data?.length
  return (
    // NOTE
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', px: 0 }}>
      <Tabs
        defaultActiveKey={currentTab}
        onChange={(tab) => changeCurrentTab(tab)}
        inactiveHasLine={false}
        sx={{
          position: ['sticky', 'sticky', 'sticky', 'relative'],
          top: 0,
          left: 0,
          px: 3,
          // bg: 'neutral5',
        }}
        headerSx={{
          height: 44,
          width: '100%',
          py: 0,
          px: 0, // NOTE
          gap: 0,
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
        tabItemSx={{
          p: 0,
          height: '100%',
          fontSize: '16px',
          color: 'neutral3',
          '&:active,&:focus,&:hover': { color: 'inherit' },
        }}
        tabItemActiveSx={{
          color: ['neutral1', 'neutral1'],
          borderBottomColor: ['primary1', 'primary1'],
        }}
        tabPanelSx={{
          pt: 2,
        }}
      >
        <TabPane tab={'F1 Referral List'} key={tabKeys.F1_REFERRAL_LIST}>
          <></>
        </TabPane>
        <TabPane tab={'F2 Referral List'} key={tabKeys.F2_REFERRAL_LIST}>
          <></>
        </TabPane>
        <TabPane tab={'Commission & Rebate History'} key={tabKeys.REBATE_HISTORY}>
          <></>
        </TabPane>
        <TabPane tab={'Claim History'} key={tabKeys.CLAIM_HISTORY}>
          <></>
        </TabPane>
      </Tabs>
      {!isAuthenticated ? (
        <NoData
          message={
            <Box color="neutral3">
              <Box
                as="span"
                role="button"
                sx={{ color: 'primary1', '&:hover': { color: 'primary2' } }}
                onClick={handleClickLogin}
              >
                Connect Wallet
              </Box>{' '}
              and Invite friends. Your{' '}
              <Box as="span" color="neutral1">
                {noDataMessage}
              </Box>{' '}
              will show here
            </Box>
          }
        />
      ) : (
        <>
          {sm ? (
            <Box flex="1 0 0" display={['none', 'block']}>
              <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
                <Box flex="1 0 0">
                  <Table
                    currentSort={{ sortBy: currentSortBy, sortType: currentSortType as SortTypeEnum }}
                    restrictHeight
                    data={_data?.data}
                    columns={columns}
                    isLoading={!!isLoading}
                    changeCurrentSort={changeCurrentSort}
                    noDataComponent={
                      showNoDataMessage ? (
                        <NoData
                          message={
                            <Box as="span" color="neutral3">
                              Invite friends and your{' '}
                              <Box as="span" color="neutral1">
                                {noDataMessage}
                              </Box>{' '}
                              will show here
                            </Box>
                          }
                        />
                      ) : undefined
                    }
                    noDataWrapperSx={{ bg: 'transparent' }}
                    containerSx={{
                      'tr td:first-child,tr th:first-child': { pl: 3 }, // NOTE
                      'tr th:first-child': { clipPath: 'polygon(16px 0, 100% 0, 100% 100%, 16px 100%)' }, // NOTE
                      'tr th:last-child': {
                        clipPath: 'polygon(0 0, calc(100% - 16px) 0, calc(100% - 16px) 100%, 0 100%)',
                      }, // NOTE
                      'td:last-child, th:last-child': { pr: 3 }, // NOTE
                    }}
                  />
                </Box>
                <Flex
                  sx={{
                    px: 3,
                    borderTop: 'small',
                    borderTopColor: 'neutral4',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Type.Small color="neutral3" sx={{ lineHeight: '32px' }}>
                    {_data?.data?.[0]?.statisticAt &&
                      `Last update: ${formatDate(_data?.data?.[0]?.statisticAt, DAYJS_FULL_DATE_FORMAT)}`}
                  </Type.Small>
                  {xl ? (
                    <PaginationWithLimit
                      sx={{ px: 0 }}
                      dividerSx={{ bg: 'transparent' }}
                      currentLimit={currentLimit}
                      onLimitChange={changeCurrentLimit}
                      currentPage={currentPage}
                      onPageChange={changeCurrentPage}
                      apiMeta={_data?.meta}
                    />
                  ) : (
                    <PaginationWithSelect
                      currentPage={currentPage}
                      onPageChange={changeCurrentPage}
                      apiMeta={_data?.meta}
                    />
                  )}
                </Flex>
              </Flex>
            </Box>
          ) : (
            <>
              {showNoDataMessage ? (
                <NoData
                  message={
                    <Box as="span" color="neutral3">
                      Invite friends and your{' '}
                      <Box as="span" color="neutral1">
                        {noDataMessage}
                      </Box>{' '}
                      will show here
                    </Box>
                  }
                />
              ) : (
                <>
                  {!isLoading && _data?.data?.length ? (
                    <>
                      <Box
                        flex="1 0 0"
                        sx={{
                          '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', mx: 3, px: 0 },
                          '& > *:last-child': { borderBottom: 'none' },
                        }}
                      >
                        {_data?.data?.map((item: any, index: number) => {
                          return (
                            <Box key={index} sx={{ p: 3 }}>
                              <MobileItem data={item} />
                            </Box>
                          )
                        })}
                        <Type.Small color="neutral3" display="block" textAlign="center" lineHeight="40px">
                          Last update: {formatDate(new Date().toISOString(), DAYJS_FULL_DATE_FORMAT)}
                        </Type.Small>
                      </Box>
                      <Box
                        sx={{
                          px: 3,
                          position: 'sticky',
                          bottom: 0,
                          left: 0,
                          bg: 'neutral5',
                          borderTop: 'small',
                          borderTopColor: 'neutral4',
                        }}
                      >
                        <PaginationWithLimit
                          dividerSx={{ bg: 'transparent' }}
                          currentLimit={currentLimit}
                          onLimitChange={changeCurrentLimit}
                          currentPage={currentPage}
                          onPageChange={changeCurrentPage}
                          apiMeta={_data?.meta}
                        />
                        {/* <PaginationWithSelect
                          currentPage={currentPage}
                          onPageChange={changeCurrentPage}
                          apiMeta={_data?.meta}
                        /> */}
                      </Box>
                    </>
                  ) : (
                    <NoDataFound />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Flex>
  )
}

function NoData({ message }: { message: ReactNode }) {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Image mt={64} mb={2} src={tokenNotFound} width={190} height={190} alt="token" />
      <Type.Caption color="neutral3" mb={24}>
        {message}
      </Type.Caption>
    </Flex>
  )
}

const tabKeys = {
  F1_REFERRAL_LIST: 'f1_referral_list',
  F2_REFERRAL_LIST: 'f2_referral_list',
  REBATE_HISTORY: 'rebate_history',
  CLAIM_HISTORY: 'claim_history',
}
const referralListColumns: ColumnData<ReferralListData>[] = [
  {
    title: <Box as="span">Join time</Box>,
    dataIndex: 'joinTime',
    key: 'joinTime',
    sortBy: 'joinTime',
    style: { minWidth: '200px' },
    render: (item) => {
      return (
        <Box as="span">
          <Time time={item.joinTime} />
        </Box>
      )
    },
  },
  {
    title: 'Referral Account',
    dataIndex: 'referralAccount',
    key: 'referralAccount',
    style: { minWidth: '150px' },
    render: (item) => {
      return <TraderAddress address={item.referralAccount} subscriptionPlan={item.referralPlan} />
    },
  },
  {
    title: 'Total DCP Volume',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    sortBy: 'totalVolume',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => {
      return <Amount amount={item.totalVolume} />
    },
  },
  {
    title: 'DCP Fees',
    dataIndex: 'totalFee',
    key: 'totalFee',
    sortBy: 'totalFee',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => {
      return <Amount amount={item.totalFee} />
    },
  },
  {
    title: 'Total Commission (USDC)',
    dataIndex: 'totalCommission',
    key: 'totalCommission',
    sortBy: 'totalCommission',
    style: { minWidth: '260px', width: 260, maxWidth: 260, textAlign: 'right' },
    render: (item) => {
      return (
        <Flex sx={{ justifyContent: 'end', width: '100%' }}>
          <SignedAmount amount={item.totalCommission} />
        </Flex>
      )
    },
  },
]

function useReferralRebateColumns({
  currentFilterStatus,
  changeCurrentFilterStatus,
  currentFilterType,
  changeCurrentFilterType,
}: {
  currentFilterType: ReferralTypeEnum
  changeCurrentFilterType: (filter: ReferralTypeEnum | undefined) => void
  currentFilterStatus: ReferralHistoryStatusEnum
  changeCurrentFilterStatus: (status: ReferralHistoryStatusEnum | undefined) => void
}) {
  const referralRebateColumns: ColumnData<ReferralRebateHistoryData>[] = useMemo(
    () => [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        sortBy: 'time',
        style: { minWidth: 200, width: 200, maxWidth: 200 },
        render: (item) => {
          return <Time time={item.time} />
        },
      },
      {
        title: 'Account',
        dataIndex: 'referralAccount',
        key: 'referralAccount',
        style: { minWidth: '150px' },
        render: (item) => {
          return <TraderAddress address={item.referralAccount} subscriptionPlan={item.referralPlan} />
        },
      },
      {
        title: (
          <RebateTypeTitle currentFilterType={currentFilterType} changeCurrentFilterType={changeCurrentFilterType} />
        ),
        dataIndex: 'referralType',
        key: 'referralType',
        style: { minWidth: '150px', textAlign: 'left' },
        render: (item) => {
          return <RebateType referralTier={item.referralTier} referralType={item.referralType} />
        },
      },
      {
        title: (
          <RebateStatusTitle
            currentFilterStatus={currentFilterStatus}
            changeCurrentFilterStatus={changeCurrentFilterStatus}
          />
        ),
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '150px' },
        render: (item) => {
          return <RebateStatus status={item.status} />
        },
      },
      {
        title: 'Earning (USDC)',
        dataIndex: 'commission',
        key: 'commission',
        sortBy: 'commission',
        style: { minWidth: '200px', width: 200, maxWidth: 200, textAlign: 'right' },
        render: (item) => {
          return (
            <Flex sx={{ justifyContent: 'end', width: '100%' }}>
              <SignedAmount amount={item.commission} />
            </Flex>
          )
        },
      },
    ],
    [changeCurrentFilterStatus, changeCurrentFilterType, currentFilterStatus, currentFilterType]
  )
  return referralRebateColumns
}
const referralClaimColumns: ColumnData<ReferralClaimHistoryData>[] = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    sortBy: 'time',
    style: { minWidth: '150px' },
    render: (item) => {
      return <Time time={item.time} />
    },
  },
  {
    title: 'Amount (USDC)',
    dataIndex: 'amount',
    key: 'amount',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => {
      return <Amount amount={item.amount} />
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    style: { minWidth: '150px', textAlign: 'right' },
    render: (item) => {
      return <ClaimRebateStatus data={item} />
    },
  },
]

// Referral list item
function MobileReferralListItem({ data }: { data: ReferralListData }) {
  return (
    <>
      <Flex mb={12} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <TraderAddress address={data.referralAccount} subscriptionPlan={data.referralPlan} />
        <Time time={data.joinTime} />
      </Flex>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <MobileStatsItemColumn
          sx={{ width: '80px' }}
          label={<Trans>DCP Volume</Trans>}
          value={<Amount amount={data.totalVolume} isCompactNumber />}
        />
        <MobileStatsItemColumn
          sx={{ width: '80px' }}
          label={<Trans>Fees</Trans>}
          value={<Amount amount={data.totalFee} isCompactNumber />}
        />
        <MobileStatsItemColumn
          sx={{ width: '80px', textAlign: 'right' }}
          label={<Trans>Commission</Trans>}
          // value={<SignedAmount amount={data.totalCommission} isCompactNumber />}
          value={<SignedAmount amount={100000.23} isCompactNumber />}
        />
      </Flex>
    </>
  )
}

// Rebate history item
function MobileRebateListItem({ data }: { data: ReferralRebateHistoryData }) {
  return (
    <>
      <Flex mb={12} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <TraderAddress address={data.referralAccount} subscriptionPlan={data.referralPlan} />
        <Time time={data.time} />
      </Flex>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <MobileStatsItemRow
          sx={{ width: '200px' }}
          label={<Trans>Type</Trans>}
          value={<RebateType referralTier={data.referralTier} referralType={data.referralType} />}
        />
        <MobileStatsItemRow
          sx={{ width: '100px', textAlign: 'right' }}
          label={<Trans>Earning (USDC)</Trans>}
          value={<SignedAmount amount={data.commission} isCompactNumber />}
        />
      </Flex>
    </>
  )
}

// Claim history item
function MobileClaimListItem({ data }: { data: ReferralClaimHistoryData }) {
  return (
    <>
      <Time time={data.time} />
      <Box mb={12} />
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <MobileStatsItemRow label={<Trans>Amount</Trans>} value={<Amount amount={data.amount} isCompactNumber />} />
        <ClaimRebateStatus data={data} />
      </Flex>
    </>
  )
}

// Atom
function MobileStatsItemColumn({ label, value, sx = {} }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Box sx={sx}>
      <Type.Small mb={'2px'} display="block" color="neutral3">
        {label}
      </Type.Small>
      <Type.Small>{value}</Type.Small>
    </Box>
  )
}
function MobileStatsItemRow({ label, value, sx = {} }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Box sx={{ ...sx }}>
      <Type.Small mb={'2px'} display="block" color="neutral3">
        {label}
      </Type.Small>
      <Type.Small>{value}</Type.Small>
    </Box>
  )
}

function Time({ time }: { time: string }) {
  return (
    <Type.Small color="neutral1">
      <LocalTimeText date={time} format={DAYJS_FULL_DATE_FORMAT} />
    </Type.Small>
  )
}
function TraderAddress({ address, subscriptionPlan }: { address: string; subscriptionPlan?: SubscriptionPlanEnum }) {
  return (
    <Type.Small color="neutral1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box as="span">{addressShorten(address)}</Box>
      {!!subscriptionPlan && <SubscriptionIcon plan={subscriptionPlan} />}
    </Type.Small>
  )
}

function Amount({ amount, isCompactNumber = false }: { amount: number | undefined; isCompactNumber?: boolean }) {
  return (
    <Type.Small color="neutral1">
      {!!amount ? (isCompactNumber ? `$${compactNumber(amount, 2)}` : `$${formatNumber(amount, 2, 2)}`) : '--'}
    </Type.Small>
  )
}
function SignedAmount({ amount, isCompactNumber = false }: { amount: number | undefined; isCompactNumber?: boolean }) {
  return (
    <Type.Small color="neutral1" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {!!amount ? (
        <>
          <SignedText value={amount} minDigit={2} maxDigit={2} fontInherit isCompactNumber={isCompactNumber} />
          {/* <IconUsdt size={16} /> */}
        </>
      ) : (
        '--'
      )}
    </Type.Small>
  )
}
function RebateType({
  referralType,
  referralTier,
}: {
  referralType: ReferralTypeEnum
  referralTier: ReferralTierEnum
}) {
  const tier = TIER_SYSTEM[referralTier]
  let type = ''
  let ratio = 0
  switch (referralType) {
    case ReferralTypeEnum.F0:
      type = 'Fee Rebate'
      ratio = tier.rebateF0
      break
    case ReferralTypeEnum.F1:
      type = 'F1 commission'
      ratio = tier.commissionF1
      break
    case ReferralTypeEnum.F2:
      type = 'F2 commission'
      ratio = tier.commissionF2
      break
  }
  return (
    <Type.Small color="neutral1">
      {type} ({ratio}%)
    </Type.Small>
  )
}
function RebateStatus({ status }: { status: ReferralHistoryStatusEnum }) {
  let text = ''
  let color = ''
  switch (status) {
    case ReferralHistoryStatusEnum.PENDING:
      text = 'Pending'
      color = 'orange1'
      break
    case ReferralHistoryStatusEnum.CLAIMABLE:
      text = 'Claimable'
      color = 'orange2'
      break
    case ReferralHistoryStatusEnum.CLAIMED:
      text = 'Claimed'
      color = 'neutral1'
      break
    case ReferralHistoryStatusEnum.IN_PROGRESS:
      text = 'In progress'
      color = 'primary2'
      break
  }
  return <Type.Small color={color}>{text}</Type.Small>
}

function ClaimRebateStatus({ data }: { data: ReferralClaimHistoryData }) {
  // need type, and user tier at that moment
  let text = ''
  let color = ''
  switch (data.status) {
    case ClaimRewardStatusEnum.PENDING:
      text = 'Pending'
      color = 'orange1'
      break
    case ClaimRewardStatusEnum.FAILURE:
      text = 'Claimable'
      color = 'red1'
      break
    case ClaimRewardStatusEnum.CLAIMED:
      text = 'Claimed'
      color = 'neutral1'
      break
    case ClaimRewardStatusEnum.IN_PROGRESS:
      text = 'In progress'
      color = 'neutral1'
      break
  }
  const profile = useMyProfileStore((s) => s.myProfile)
  const [openModal, setOpenModal] = useState(false)
  const enabledRetry = data.nonce && data.signature && data.status !== ClaimRewardStatusEnum.CLAIMED
  return (
    <Box
      sx={{
        color,
        svg: { color: 'neutral3' },
        'svg:hover': { color: 'neutral2' },
      }}
    >
      <Type.Small
        color="inherit"
        sx={{
          fontWeight: '500',
        }}
      >
        {text}
        {data.status === ClaimRewardStatusEnum.CLAIMED && !!data.txHash && (
          <>
            {' '}
            <a target="_blank" href={`${CHAINS[ARBITRUM_CHAIN].blockExplorerUrl}/tx/${data.txHash}`} rel="noreferrer">
              <ArrowSquareOut size={16} style={{ verticalAlign: 'top' }} />
            </a>
          </>
        )}
        {enabledRetry && (
          <>
            {' '}
            <Box
              as="span"
              sx={{ color: 'primary1', '&:hover': { color: 'primary2' }, cursor: 'pointer' }}
              onClick={enabledRetry ? () => setOpenModal(true) : undefined}
            >
              (Claim)
            </Box>
          </>
        )}
      </Type.Small>
      <ClaimRewardModal
        key={openModal.toString()}
        amount={data.amount}
        isOpen={openModal}
        onDismiss={() => setOpenModal(false)}
        retryClaimData={{
          user: profile?.username ?? '',
          amount: data.amount,
          nonce: data.nonce ?? '',
          signature: data.signature ?? '',
        }}
      />
    </Box>
  )
}

function RebateTypeTitle({
  currentFilterType,
  changeCurrentFilterType,
}: {
  currentFilterType: ReferralTypeEnum
  changeCurrentFilterType: (filter: ReferralTypeEnum | undefined) => void
}) {
  return (
    <Flex sx={{ width: '100%', justifyContent: 'start', alignItems: 'center', gap: 1, position: 'relative' }}>
      <Box as="span">Type</Box>
      <Dropdown
        buttonSx={{ p: '0 4px', border: 'none' }}
        hasArrow={false}
        menu={
          <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
            {rebateTypeFilter.map((config) => {
              const isActive = config.filter == currentFilterType
              return (
                <Box
                  role="button"
                  key={`${config.filter}`}
                  sx={{
                    height: 32,
                    lineHeight: '32px',
                    px: 2,
                    bg: isActive ? 'neutral4' : 'transparent',
                    '&:hover': { bg: 'neutral5' },
                  }}
                  onClick={() => changeCurrentFilterType(config.filter)}
                >
                  {config.title}
                </Box>
              )
            })}
          </Flex>
        }
      >
        <IconBox
          role="button"
          icon={<Funnel size={16} weight={!!currentFilterType ? 'fill' : 'regular'} />}
          sx={{ color: !!currentFilterType ? 'neutral2' : 'neutral3', '&:hover:': { color: 'neutral1' } }}
        />
      </Dropdown>
    </Flex>
  )
}
const rebateTypeFilter = [
  {
    title: 'All',
    filter: undefined,
  },
  {
    title: 'F1 commission',
    filter: ReferralTypeEnum.F1,
  },
  {
    title: 'F2 commission',
    filter: ReferralTypeEnum.F2,
  },
  {
    title: 'Fee rebate',
    filter: ReferralTypeEnum.F0,
  },
]

function RebateStatusTitle({
  currentFilterStatus,
  changeCurrentFilterStatus,
}: {
  currentFilterStatus: ReferralHistoryStatusEnum
  changeCurrentFilterStatus: (filter: ReferralHistoryStatusEnum | undefined) => void
}) {
  return (
    <Flex sx={{ width: '100%', justifyContent: 'start', alignItems: 'center', gap: 1, position: 'relative' }}>
      <Box as="span">Status</Box>
      <Dropdown
        buttonSx={{ p: '0 4px', border: 'none' }}
        hasArrow={false}
        menu={
          <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
            {rebateStatusFilter.map((config) => {
              const isActive = config.filter == currentFilterStatus
              return (
                <Box
                  role="button"
                  key={`${config.filter}`}
                  sx={{
                    height: 32,
                    lineHeight: '32px',
                    px: 2,
                    bg: isActive ? 'neutral4' : 'transparent',
                    '&:hover': { bg: 'neutral5' },
                  }}
                  onClick={() => changeCurrentFilterStatus(config.filter)}
                >
                  {config.title}
                </Box>
              )
            })}
          </Flex>
        }
      >
        <IconBox
          role="button"
          icon={<Funnel size={16} weight={!!currentFilterStatus ? 'fill' : 'regular'} />}
          sx={{ color: !!currentFilterStatus ? 'neutral2' : 'neutral3', '&:hover:': { color: 'neutral1' } }}
        />
      </Dropdown>
    </Flex>
  )
}
const rebateStatusFilter = [
  {
    title: 'All',
    filter: undefined,
  },
  {
    title: 'Pending',
    filter: ReferralHistoryStatusEnum.PENDING,
  },
  {
    title: 'Claimable',
    filter: ReferralHistoryStatusEnum.CLAIMABLE,
  },
  {
    title: 'Inprogress',
    filter: ReferralHistoryStatusEnum.IN_PROGRESS,
  },
  {
    title: 'Claimed',
    filter: ReferralHistoryStatusEnum.CLAIMED,
  },
]
