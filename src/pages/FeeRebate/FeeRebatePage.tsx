import {
  ArrowsHorizontal,
  BookBookmark,
  ChartBar,
  ClockCounterClockwise,
  Icon,
  PresentationChart,
  WarningCircle,
} from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { GridProps } from 'styled-system'

import { getEventDetailsBySlug } from 'apis/event'
import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import Logo from 'components/@ui/Logo'
import Table from 'components/@ui/Table'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import EventTradingProtocols from 'components/EventTradingProtocols'
import { EventDetailsData, TradingEventStatusEnum } from 'entities/event'
import { EpochHistoryData } from 'entities/feeRebate'
import useFeeRebateContext, { FeeRebateProvider } from 'hooks/features/useFeeRebateProvider'
import useCountdown from 'hooks/helpers/useCountdown'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import { GradientText } from 'pages/@layouts/Navbar/EventButton'
import { Button } from 'theme/Buttons'
import { TabConfig, TabHeader } from 'theme/Tab'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Image, Li, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DATE_FORMAT, DATE_TEXT_FORMAT, LINKS, TIME_FORMAT } from 'utils/config/constants'
import { EpochStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { compactNumber, formatDate, formatNumber } from 'utils/helpers/format'
import { isAddress } from 'utils/web3/contracts'

import ClaimButton from './ClaimAction'
import ClaimEpochStatus from './ClaimEpochStatus'

export default function FeeRebatePage() {
  const { sm, xl } = useResponsive()
  // const { id: tradingEventId } = useParams<{ id: string }>()()
  const tradingEventSlug = 'decentralized-copy-trading-competition-gtrade'
  const { data: eventDetails } = useQuery(
    [QUERY_KEYS.GET_EVENT_COMPETITION, 'eventDetails', tradingEventSlug],
    () => getEventDetailsBySlug({ slug: tradingEventSlug }),
    {
      enabled: !!tradingEventSlug,
      keepPreviousData: true,
    }
  )

  return (
    <>
      <CustomPageTitle title="10,000 ARB For Decentralized Copy-Trading Fee Rebates" />
      <FeeRebateProvider>
        {xl ? (
          <DesktopVersion eventDetails={eventDetails} />
        ) : sm ? (
          <TabletVersion eventDetails={eventDetails} />
        ) : (
          <MobileVersion eventDetails={eventDetails} />
        )}
      </FeeRebateProvider>
    </>
  )
}

function DesktopVersion({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        // maxWidth: 1512,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    height: '100%',*/}
      {/*    flex: '1 0',*/}
      {/*    borderRight: 'small',*/}
      {/*    borderRightColor: 'neutral4',*/}
      {/*    overflow: 'auto',*/}
      {/*  }}*/}
      {/*></Box>*/}
      <Box
        sx={{
          height: '100%',
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Overview />
        <RewardDistribution />
        <Divider />
        <Box flex="1 0 0">
          <Flex sx={{ height: '100%', flexDirection: 'column' }}>
            <ClaimHistories />
          </Flex>
        </Box>
        <Footer />
      </Box>
      <Box
        sx={{
          height: '100%',
          maxWidth: '400px',
          flex: '1 0 400px',
          borderRight: 'small',
          borderLeft: 'small',
          borderRightColor: 'neutral4',
          borderLeftColor: 'neutral4',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <RegisterArea eventDetails={eventDetails} />
        <Divider />
        <Box sx={{ flex: '1 0 0', overflow: 'hidden' }}>
          <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <Rules eventDetails={eventDetails} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

//=========================
function Label({ icon: Icon, label }: { icon: Icon; label: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      <IconBox icon={<Icon size={20} />} color="primary1" />
      <Type.BodyBold>{label}</Type.BodyBold>
    </Flex>
  )
}
//=========================
function RegisterArea({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  const location = useLocation()
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const locationRef = useRef(location.pathname)
  useEffect(() => {
    if (locationRef.current !== location.pathname) {
      locationRef.current = location.pathname
    }
  }, [location.pathname])

  const today = dayjs().utc().valueOf()
  const registerDate = dayjs(eventDetails?.registerDate).utc().valueOf()
  const startDate = dayjs(eventDetails?.startDate).utc().valueOf()
  const endDate = dayjs(eventDetails?.endDate).utc().valueOf()
  let text = 'Event is starting in'
  let countdownTime: number | null = null
  let icon = null
  switch (eventDetails?.status) {
    case TradingEventStatusEnum.ONGOING:
      icon = <IconBox icon={<ArrowsHorizontal size={24} />} color="primary1" />
      text = 'Event ends in'
      break
    case TradingEventStatusEnum.ENDED:
      text = 'Event ends in'
      break
  }
  if (today < registerDate) {
    countdownTime = registerDate
  }
  if (today < startDate && today >= registerDate) {
    countdownTime = startDate
  }
  if (today < endDate && today >= startDate) {
    countdownTime = endDate
  }
  if (today >= endDate) {
    countdownTime = null
  }
  return (
    <Box sx={{ p: 3, pt: 3, pb: 20, bg: 'neutral5' }}>
      <Flex mb={24} sx={{ alignItems: 'center', gap: 2 }}>
        {icon}
        <Type.Body color="neutral3">{text}</Type.Body>
      </Flex>
      <TimeCountdown time={countdownTime} />
      {eventDetails?.status === TradingEventStatusEnum.ENDED && (
        <Button
          block
          mt={24}
          sx={{ fontWeight: '600', color: 'neutral7', bg: 'neutral3', cursor: 'not-allowed', height: 40 }}
        >
          Event Ended
        </Button>
      )}
      <EventTradingProtocols type={eventDetails?.type} />
    </Box>
  )
}
function TimeCountdown({ time }: { time: number | null }) {
  const timer = useCountdown(dayjs.utc(time).valueOf())
  if (time == null) {
    return (
      <Flex sx={{ gap: 4 }} justifyContent="space-between">
        <CountdownItem value={'0'} unit={'Days'} />
        <CountdownItem value={'0'} unit={'Hours'} />
        <CountdownItem value={'0'} unit={'Minutes'} />
        <CountdownItem value={'0'} unit={'Seconds'} />
      </Flex>
    )
  }
  return (
    <>
      {!!timer?.hasEnded && <Type.LargeBold>--</Type.LargeBold>}
      {!timer?.hasEnded && (
        <Flex sx={{ gap: 4 }} justifyContent="space-between">
          <CountdownItem value={timer?.days} unit={'Days'} />
          <CountdownItem value={timer?.hours} unit={'Hours'} />
          <CountdownItem value={timer?.minutes} unit={'Minutes'} />
          <CountdownItem value={timer?.seconds} unit={'Seconds'} />
        </Flex>
      )}
    </>
  )
}
function CountdownItem({ value, unit }: { value: string | undefined; unit: string }) {
  return (
    <Flex flexDirection="column" alignItems="center" sx={{ flexShrink: 0 }}>
      <Type.LargeBold mb={1} display="block">
        {value ?? '--'}
      </Type.LargeBold>
      <Type.LargeBold color="neutral3">{unit}</Type.LargeBold>
    </Flex>
  )
}

//=========================
function ClaimHistories() {
  const { account: _account } = useAuthContext()
  const { info, histories, format, isLoadingFeeRebate, isLoadingHistories } = useFeeRebateContext()
  const account = isAddress(_account?.address)

  const { sm } = useResponsive()

  const columns: ColumnData<EpochHistoryData>[] = useMemo(
    () => [
      {
        title: 'Epoch',
        dataIndex: 'epochId',
        key: 'epochId',
        style: { minWidth: '130px', textAlign: 'left' },
        render: (item) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EpochStatus epochId={item.epochId} status={item.status} />
          </Box>
        ),
      },
      {
        title: 'Duration',
        dataIndex: 'epochStart',
        key: 'epochStart',
        style: { minWidth: '180px' },
        render: (item) => (
          <>
            <Type.Caption
              color="neutral1"
              data-tip="React-tooltip"
              data-tooltip-id={`tt_rebate_${item.epochId}_${account}`}
              data-tooltip-delay-show={360}
            >
              {formatDate(item.epochStart, DATE_TEXT_FORMAT)} - {formatDate(item.epochEnd, DATE_TEXT_FORMAT)}
            </Type.Caption>
            <Tooltip
              id={`tt_rebate_${item.epochId}_${account}`}
              place="top"
              type="dark"
              effect="solid"
              clickable={false}
            >
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption width={65} color="neutral3">
                  Start Date:
                </Type.Caption>
                <Type.Caption>{formatDate(item.epochStart, format)}</Type.Caption>
              </Flex>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption width={65} color="neutral3">
                  End Date:
                </Type.Caption>
                <Type.Caption>{formatDate(item.epochEnd, format)}</Type.Caption>
              </Flex>
            </Tooltip>
          </>
        ),
      },
      {
        title: 'Your Trading Fees',
        dataIndex: 'totalRewardPool',
        key: 'totalRewardPool',
        style: { minWidth: '130px', textAlign: 'right' },
        render: (item) => <TraderReward epochHistory={item} account={account} />,
      },
      {
        title: 'Your Earned Rebate',
        dataIndex: 'rebateData',
        key: 'rebateData',
        style: { minWidth: '130px', textAlign: 'right' },
        render: (item) => <TraderReward epochHistory={item} account={account} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '150px', textAlign: 'right' },
        render: (item) => (
          <ClaimEpochStatus
            epochHistory={item}
            account={account}
            epochId={!!info?.currentEpochId && item.epochId <= info?.currentEpochId ? item.epochId : undefined}
            epochStatus={item.status}
          />
        ),
      },
    ],
    [account, info?.currentEpochId]
  )

  return (
    <>
      {sm ? (
        <Box flex="1 0 0">
          <Flex p={3} alignItems="center" sx={{ gap: 2 }}>
            <ClockCounterClockwise size={24} color={themeColors.primary1} />
            <Type.LargeBold>Claim Fee Rebates History</Type.LargeBold>
          </Flex>
          <Table
            restrictHeight={false}
            data={histories}
            columns={columns}
            isLoading={(isLoadingFeeRebate || isLoadingHistories) ?? false}
            tableBodyWrapperSx={{
              overflow: 'auto',
              flex: 'auto',
            }}
            containerSx={{
              height: 'auto',
              '& th:first-child, td:first-child': {
                pl: '16px !important',
              },
              '& th:last-child, td:last-child': {
                pr: '16px !important',
              },
              '& th, td': {
                border: 'none !important',
              },
            }}
          />
        </Box>
      ) : (
        <Flex
          flex="1 0 0"
          sx={{
            overflow: 'auto',
            flexDirection: 'column',
            '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4' },
            '& > *:last-child': { borderBottom: 'none' },
          }}
        >
          <Flex p={3} alignItems="center" sx={{ gap: 2 }}>
            <ClockCounterClockwise size={24} color={themeColors.primary1} />
            <Type.LargeBold>Claim Fee Rebates History</Type.LargeBold>
          </Flex>
          {histories?.map((_d) => {
            return (
              <Box key={_d.epochId} sx={{ mx: 3, py: 12 }}>
                <Flex mb={12} sx={{ alignItems: 'center', gap: 2 }}>
                  <Flex alignItems="center" sx={{ gap: 1 }}>
                    <Type.Caption>Epoch</Type.Caption>
                    <EpochStatus epochId={_d.epochId} status={_d.status} />
                  </Flex>
                </Flex>
                <Flex mb={12} alignItems="center" sx={{ gap: 2 }}>
                  <Type.Caption color="neutral3">Duration</Type.Caption>
                  <Type.Caption color="neutral1">
                    {formatDate(_d.epochStart, DATE_TEXT_FORMAT)} - {formatDate(_d.epochEnd, DATE_TEXT_FORMAT)}
                  </Type.Caption>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 3 }}>
                  <Flex flex={1} flexDirection="column">
                    <Type.Caption color="neutral3">Trading Fees</Type.Caption>
                    <TraderReward epochHistory={_d} account={account} sx={{ justifyContent: 'flex-start' }} />
                  </Flex>
                  <Flex flex={1} flexDirection="column">
                    <Type.Caption color="neutral3">Earned Rebate</Type.Caption>
                    <TraderReward epochHistory={_d} account={account} sx={{ justifyContent: 'flex-start' }} />
                  </Flex>
                  <Flex flex={1} flexDirection="column">
                    <Type.Caption color="neutral3">Status</Type.Caption>
                    <ClaimEpochStatus
                      epochHistory={_d}
                      account={account}
                      epochId={!!info?.currentEpochId && _d.epochId <= info?.currentEpochId ? _d.epochId : undefined}
                      epochStatus={_d.status}
                    />
                  </Flex>
                </Flex>
              </Box>
            )
          })}
        </Flex>
      )}
    </>
  )
}

function Overview() {
  return (
    <Box p={3}>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 3 }}>
        <Flex
          alignItems="center"
          sx={{ p: 1, backgroundColor: `${themeColors.primary1}40`, borderRadius: 'sm', gap: 2 }}
        >
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Image src="/images/protocols/GNS.png" width={16} alt="gTrade" />
            <Type.Small fontWeight={500}>gTrade</Type.Small>
          </Flex>
          <VerticalDivider sx={{ backgroundColor: themeColors.primary1 }} />
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <IconBox icon={<Logo size={12} />} />
            <Type.Small fontWeight={500}>Copin</Type.Small>
          </Flex>
        </Flex>
        <Flex
          as="a"
          href="https://copin-io.notion.site/Draft-version-Join-Copin-s-Decentralized-Copy-Trading-Fee-Rebates-and-Competition-to-earn-20-000--de7e58a6cc7c43a3a6d71c9a60ed4eb7"
          target="_blank"
          alignItems="center"
          sx={{ gap: 2 }}
        >
          <IconBox icon={<WarningCircle size={24} />} color="primary1" />
          <Type.CaptionBold color="primary1">How It Works</Type.CaptionBold>
        </Flex>
      </Flex>
      <Type.H5 mt={2}>10,000 ARB Incentives For Decentralized Copy-Trading Fee Rebates</Type.H5>
      <Type.Body color="neutral3">
        Let’s copy - trade through gTrade to get more profit and receive fee rebates from Copin
      </Type.Body>
    </Box>
  )
}

//=========================
function Footer() {
  const { histories, info, format } = useFeeRebateContext()
  const currentEpoch = histories?.find((e) => e.epochId === info?.currentEpochId)

  return (
    <Flex
      as="footer"
      display="block"
      py={1}
      px={3}
      sx={{
        borderTop: 'small',
        borderColor: 'neutral4',
        '& a': {
          color: 'inherit',
          '&:hover': {
            color: 'neutral1',
          },
        },
        zIndex: 10,
      }}
      alignItems="center"
      justifyContent="space-between"
    >
      <Type.Caption color="neutral3">
        Have question? Please ask in{' '}
        <a href={LINKS.telegram} target="_blank" rel="noreferrer">
          <Type.Caption color="primary1">here</Type.Caption>
        </a>{' '}
        or see the{' '}
        <a href={LINKS.blog} target="_blank" rel="noreferrer">
          <Type.Caption color="primary1">Blog</Type.Caption>
        </a>
      </Type.Caption>
      <Type.Caption color="neutral3">
        Last update:{' '}
        {formatDate(!!currentEpoch?.lastUpdated ? currentEpoch?.lastUpdated : currentEpoch?.epochStart, format)}
      </Type.Caption>
    </Flex>
  )
}

//=========================
function RewardDistribution() {
  const { xl } = useResponsive()
  const { info, reload } = useFeeRebateContext()
  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr 1fr 1fr', '1fr 1fr 1fr 1fr'],
        }}
      >
        {xl && (
          <RewardWrapper
            label={<Type.Body color="primary1">ARB Distribution</Type.Body>}
            value={`${formatNumber(info?.totalDistributedReward, 2)} / ${formatNumber(info?.maxReward, 0)}`}
            hasBorder
          />
        )}
        <RewardWrapper label={'Total Earned Rebate'} value={formatNumber(info?.totalFees, 2)} hasBorder />
        <RewardWrapper label={'Claimed Rebate'} value={formatNumber(info?.claimedFees, 2)} hasBorder />
        <RewardWrapper
          label={'Unclaim Rebate'}
          value={formatNumber(info?.claimableFees, 2)}
          action={
            !!info?.claimableFees ? <ClaimButton availableClaim={info?.claimableFees} onSuccess={reload} /> : undefined
          }
          hasGradient
        />
      </Box>
    </Box>
  )
}
function RewardWrapper({
  label,
  value,
  action,
  hasBorder,
  hasGradient,
}: {
  label: ReactNode
  value: string | undefined
  action?: ReactNode
  hasBorder?: boolean
  hasGradient?: boolean
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRight: hasBorder ? 'small' : undefined,
        borderColor: 'neutral4',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          background: 'linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)',
        }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          top: '4px',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1,
          bg: 'neutral7',
        }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          borderTopLeftRadius: '4px 2px',
          borderTopRightRadius: '4px 2px',
          top: '4px',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 2,
          background: 'linear-gradient(180.26deg, #272C43 0.23%, rgba(11, 13, 23, 0) 85.39%)',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          py: 64,
          zIndex: 3,
        }}
      >
        <Flex width="100%" justifyContent="center" alignItems="center" sx={{ mb: 2, gap: 2 }}>
          <Type.Body color="neutral3" display="block" sx={{ textAlign: 'center' }}>
            {hasGradient ? <GradientText>{label}</GradientText> : label}
          </Type.Body>
          <ArbitrumLogo size={24} />
        </Flex>
        <Type.H4 display="block" sx={{ textAlign: 'center' }}>
          {value ? `${value}` : '--'}
        </Type.H4>
        {action && (
          <Flex sx={{ position: 'absolute', justifyContent: 'center', width: '100%', bottom: 3 }}>{action}</Flex>
        )}
      </Box>
    </Box>
  )
}

//=================
function Rules({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  const format = `${DATE_FORMAT} - ${TIME_FORMAT} UTC+0`
  return (
    <Box
      py={3}
      sx={{
        display: ['block', 'block', 'block', 'block', 'flex'],
        flexDirection: 'column',
        width: '100%',
        height: ['auto', 'auto', 'auto', 'auto', '100%'],
      }}
    >
      <Box flex="1 0 1" sx={{ px: 3, overflow: 'hidden auto' }}>
        <Flex sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
          <Label icon={BookBookmark} label={'Rules'} />
        </Flex>
        <Box mb={10} />
        <Type.Caption color="neutral3" sx={{ '& > *': { mb: '4px' } }}>
          {eventDetails && (
            <>
              <Li mb={2}>
                Event begins:{' '}
                <Box as="span" color="neutral2">
                  {formatDate(eventDetails.startDate, format)}
                </Box>
              </Li>
              <Li mb={2}>
                Event ends:{' '}
                <Box as="span" color="neutral2">
                  {formatDate(eventDetails.endDate, format)}
                </Box>
              </Li>
            </>
          )}
          <Li>Eligibility:</Li>
          <Box pl={3}>
            <Li signradius="0px">Users must utilize Decentralized Copy-Trading through gTrade.</Li>
            <Li signradius="0px">
              Orders must be opened on gTrade using the copy-trading feature from traders on Copin.
            </Li>
            <Li signradius="0px">Orders can be closed using the copy-trade feature or manually by the trader.</Li>
          </Box>
          <Li>Total Rewards: {formatNumber(eventDetails?.maxReward)} ARB</Li>
          <Li>Reward Distribution:</Li>
          <Box pl={3}>
            <Li signradius="0px">Rewards will be distributed in the form of ARB.</Li>
            <Li signradius="0px">Rewards will be available for claiming at the end of each epoch.</Li>
          </Box>
          <Li>There are 5 epochs in total, with each epoch lasting 1 week.</Li>
          <Li>Claiming Rewards: Users must claim their rewards at the end of each epoch.</Li>
          <Li>Disclaimers:</Li>
          <Box pl={3}>
            <Li signradius="0px">
              Copin reserves the right to change or revise the terms of this program, or cancel it at any time and for
              any reason without notice in its sole discretion.
            </Li>
            <Li signradius="0px">
              Copin reserves the right to disqualify users if they engage in inappropriate, dishonest, or abusive
              activities (such as volume tampering, participating with multiple accounts, etc.) throughout the program.
            </Li>
            <Li signradius="0px">
              Copin reserves the right to not reward users who violate Copin&apos;s rules and regulations or who show
              any signs of fraud.
            </Li>
            <Li signradius="0px">
              By participating in the &quot;{eventDetails?.maxReward ? compactNumber(eventDetails?.maxReward, 0) : '--'}{' '}
              ARB Decentralized Copy-Trading Fee Rebates&quot; program, you agree to the terms and conditions outlined
              above. Happy copy-trading and enjoy your fee rebates!
            </Li>
          </Box>
        </Type.Caption>
      </Box>
    </Box>
  )
}

enum TabKeyEnum {
  OVERVIEW = 'overview',
  HISTORY = 'history',
  RULES = 'rules',
}

const tabConfigs: TabConfig[] = [
  {
    name: 'Overview',
    activeIcon: <PresentationChart size={24} weight="fill" />,
    inactiveIcon: <PresentationChart size={24} />,
    key: TabKeyEnum.OVERVIEW,
  },
  {
    name: 'History',
    activeIcon: <ChartBar size={24} weight="fill" />,
    inactiveIcon: <ChartBar size={24} />,
    key: TabKeyEnum.HISTORY,
  },
  {
    name: 'Rules',
    activeIcon: <BookBookmark size={24} weight="fill" />,
    inactiveIcon: <BookBookmark size={24} />,
    key: TabKeyEnum.RULES,
  },
]

function MobileVersion({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  const [currentTab, setTab] = useState(TabKeyEnum.OVERVIEW)
  return (
    <Flex sx={{ flexDirection: 'column', height: '100%' }}>
      <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          {currentTab === TabKeyEnum.OVERVIEW && (
            <Box>
              <MobileOverview />
              <RewardDistribution />
            </Box>
          )}
          {currentTab === TabKeyEnum.HISTORY && (
            <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
              <Box flex="1 0 0">
                <Flex sx={{ height: '100%', flexDirection: 'column' }}>
                  <ClaimHistories />
                </Flex>
              </Box>
            </Flex>
          )}
          {currentTab === TabKeyEnum.RULES && (
            <Box>
              <Rules eventDetails={eventDetails} />
            </Box>
          )}
        </Box>
      </Box>
      <Divider />
      <TabHeader
        configs={tabConfigs}
        isActiveFn={(config) => config.key === currentTab}
        onClickItem={(key) => setTab(key as TabKeyEnum)}
        fullWidth
      />
    </Flex>
  )
}

function TabletVersion({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Flex flex="1" sx={{ height: '100%', overflow: 'auto', flexDirection: 'column' }}>
          <MobileOverview />
          {/*<RegisterArea eventDetails={eventDetails} />*/}
          <RewardDistribution />
          <Divider />
          <Box flex="1 0 0">
            <Flex sx={{ height: '100%', flexDirection: 'column' }}>
              <ClaimHistories />
            </Flex>
          </Box>
        </Flex>
        <Box
          flex="0 0 360px"
          sx={{ height: '100%', overflow: 'auto', borderLeft: 'small', borderLeftColor: 'neutral4' }}
        >
          {/*<RewardDistribution />*/}
          <RegisterArea eventDetails={eventDetails} />
          {/*<Divider />*/}
          <Rules eventDetails={eventDetails} />
        </Box>
      </Flex>
    </Box>
  )
}

export function EpochStatus({ epochId, status }: { epochId?: number; status?: EpochStatusEnum }) {
  if (epochId == null) return <>--</>

  return (
    <Flex alignItems="center" sx={{ gap: 2 }}>
      <Type.Caption color="neutral1">#{formatNumber(epochId, 0)}</Type.Caption>
      <Tag status={status} sx={{ borderRadius: '2px' }} />
    </Flex>
  )
}

export function TraderReward({
  epochHistory,
  account,
  sx,
}: {
  epochHistory?: EpochHistoryData
  account?: string
  sx?: SystemStyleObject & GridProps
}) {
  if (!epochHistory || !account) return <>--</>
  const traderReward = epochHistory.rebateData.find((e) => e.trader?.toLowerCase() === account?.toLowerCase())

  return (
    <Flex alignItems="center" justifyContent="flex-end" sx={{ gap: 1, ...sx }}>
      <Type.Caption color="neutral1">{traderReward?.fee ? formatNumber(traderReward.fee, 2) : '--'}</Type.Caption>
      {traderReward?.fee && <ArbitrumLogo size={16} />}
    </Flex>
  )
}

function MobileOverview() {
  const { info, format } = useFeeRebateContext()
  return (
    <Box p={3}>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 3 }}>
        <Flex
          alignItems="center"
          sx={{ p: 1, backgroundColor: `${themeColors.primary1}40`, borderRadius: 'sm', gap: 2 }}
        >
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Image src="/images/protocols/GNS.png" width={16} alt="gTrade" />
            <Type.Small fontWeight={500}>gTrade</Type.Small>
          </Flex>
          <VerticalDivider sx={{ backgroundColor: themeColors.primary1 }} />
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <IconBox icon={<Logo size={12} />} />
            <Type.Small fontWeight={500}>Copin</Type.Small>
          </Flex>
        </Flex>
        {/*<Flex alignItems="center" sx={{ gap: 2 }}>*/}
        {/*  <IconBox icon={<WarningCircle size={24} />} color="primary1" />*/}
        {/*  <Type.CaptionBold color="primary1">How It Works</Type.CaptionBold>*/}
        {/*</Flex>*/}
      </Flex>
      <Type.H5 mt={2}>10,000 $ARB Incentives For Decentralized Copy-Trading Fee Rebates</Type.H5>
      <Flex mt={3} alignItems="center" sx={{ gap: 1 }}>
        <ArbitrumLogo size={24} />
        <Type.Body color="neutral3">$ARB Distribution:</Type.Body>
      </Flex>
      <Type.Body fontWeight={500} mt={1}>
        {formatNumber(info?.totalDistributedReward, 2)} / {formatNumber(info?.maxReward)}
      </Type.Body>
      <Flex mt={20} alignItems="center" sx={{ gap: 2 }}>
        <IconBox icon={<ArrowsHorizontal size={24} />} color="primary1" />
        <Type.Body color="neutral3">Duration:</Type.Body>
      </Flex>
      <Type.Body mt={1}>{formatDate(info?.epochStart, format)} -</Type.Body>
      <Type.Body>{formatDate(info?.epochEnd, format)}</Type.Body>
      <Flex
        as="a"
        href="https://copin-io.notion.site/Draft-version-Join-Copin-s-Decentralized-Copy-Trading-Fee-Rebates-and-Competition-to-earn-20-000--de7e58a6cc7c43a3a6d71c9a60ed4eb7"
        target="_blank"
        mt={3}
        alignItems="center"
        sx={{ gap: 2 }}
      >
        <IconBox icon={<WarningCircle size={24} />} color="primary1" />
        <Type.CaptionBold color="primary1">How It Works</Type.CaptionBold>
      </Flex>
    </Box>
  )
}
