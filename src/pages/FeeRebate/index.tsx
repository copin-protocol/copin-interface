import { ArrowsHorizontal, BookBookmark, Icon, PresentationChart } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'

import { getEventDetailsBySlug } from 'apis/event'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import CreateSmartWalletAction from 'components/@wallet/CreateSmartWalletAction'
import EventTradingProtocols from 'components/@widgets/EventTradingProtocols'
import { EventDetailsData, TradingEventStatusEnum } from 'entities/event'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useCountdown from 'hooks/helpers/useCountdown'
import { FeeRebateProvider } from 'pages/FeeRebate/useFeeRebateProvider'
import { Button } from 'theme/Buttons'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, IconBox, Li, Type } from 'theme/base'
import { DATE_FORMAT, TIME_FORMAT } from 'utils/config/constants'
import { CopyTradePlatformEnum, EventTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { compactNumber, formatDate, formatNumber } from 'utils/helpers/format'

import CopinRebate from './CopinRebate'
import GTradeRewards from './GTradeRewards'
import Layout from './Layout'

export default function FeeRebatePage() {
  const { sm, xl, md } = useResponsive()
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
        ) : md ? (
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
        <Layout copinFeeRebate={<CopinRebate />} gnsFeeRebate={<GTradeRewards />} />
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
  const { reloadCopyWallets, smartWallets } = useCopyWalletContext()
  const location = useLocation()
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

  const gnsWallets = smartWallets?.filter((w) => w.exchange === CopyTradePlatformEnum.GNS_V8)

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
      {eventDetails?.type === EventTypeEnum.GNS && (!gnsWallets?.length || gnsWallets.length === 0) ? (
        <CreateSmartWalletAction exchange={CopyTradePlatformEnum.GNS_V8} onSuccess={reloadCopyWallets} />
      ) : (
        <EventTradingProtocols type={eventDetails?.type} />
      )}
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
          <Box mb={2}>
            <Flex alignItems="center" justifyContent="space-between">
              <Type.Caption>Fees Structure:</Type.Caption>
              <Type.Caption>
                <Box
                  as="a"
                  href={
                    eventDetails?.blogUrl ??
                    'https://docs.copin.io/features/decentralized-copy-trading-dcp/fees-structure'
                  }
                  rel="noreferrer"
                  target="_blank"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  Read more
                </Box>
              </Type.Caption>
            </Flex>
            <FeeStructureItem labelLeft={'Fee type'} labelMid={'Basic Fees'} labelRight={'Incentive Rebate'} />
            <Divider my="2px" />
            <FeeStructureItem labelLeft={'Copin Fees'} labelMid={'0.025%'} labelRight={'-100%'} />
            <FeeStructureItem labelLeft={'Perp DEX Fees'} labelMid={'0.08%'} labelRight={'-75%'} />
          </Box>
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
    icon: <PresentationChart size={24} />,
    key: TabKeyEnum.OVERVIEW,
  },
  // {
  //   name: 'History',
  //   activeIcon: <ChartBar size={24} weight="fill" />,
  //   inactiveIcon: <ChartBar size={24} />,
  //   key: TabKeyEnum.HISTORY,
  // },
  {
    name: 'Rules',
    activeIcon: <BookBookmark size={24} weight="fill" />,
    icon: <BookBookmark size={24} />,
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
            <Layout copinFeeRebate={<CopinRebate />} gnsFeeRebate={<GTradeRewards />} />
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
          <Layout copinFeeRebate={<CopinRebate />} gnsFeeRebate={<GTradeRewards />} />
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

function FeeStructureItem({
  labelLeft,
  labelMid,
  labelRight,
}: {
  labelLeft: string
  labelMid: string
  labelRight: string
}) {
  return (
    <Flex alignItems="center">
      <Flex flex="30%" alignItems="center">
        <Type.Caption>{labelLeft}</Type.Caption>
      </Flex>
      <Flex flex="35%" alignItems="center" justifyContent="flex-end">
        <Type.Caption textAlign="right">{labelMid}</Type.Caption>
      </Flex>
      <Flex flex="45%" alignItems="center" justifyContent="flex-end">
        <Type.Caption textAlign="right">{labelRight}</Type.Caption>
      </Flex>
    </Flex>
  )
}
