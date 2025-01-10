import {
  ArrowsHorizontal,
  BookBookmark,
  ChartBar,
  Icon,
  PresentationChart,
  Trophy,
  Wallet,
  XCircle,
} from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  getEventDetails,
  getEventDetailsBySlug,
  getEventLeaderboard,
  getEventTotalVolume,
  getUserEventRanking,
  registerEvent,
} from 'apis/event'
import banner from 'assets/images/event-banner.png'
import registerSuccess from 'assets/images/success-img.png'
import logo from 'assets/logo.svg'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import RankingNumber from 'components/@trader/TraderLeaderboardTableView/RankingNumber'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import RewardWithSymbol from 'components/@ui/RewardWithSymbol'
import ToastBody from 'components/@ui/ToastBody'
import CreateSmartWalletAction from 'components/@wallet/CreateSmartWalletAction'
import EventTradingProtocols from 'components/@widgets/EventTradingProtocols'
import { CopyWalletData } from 'entities/copyWallet'
import { EventDetailsData, TradingEventStatusEnum, UserEventRankingData } from 'entities/event'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useCountdown from 'hooks/helpers/useCountdown'
import usePageChange from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import Dropdown from 'theme/Dropdown'
import Modal from 'theme/Modal'
import { PaginationWithSelect } from 'theme/Pagination'
import { TabConfig, TabHeader } from 'theme/Tab'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Image, Li, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DATE_FORMAT, DEFAULT_PROTOCOL, LINKS, TIME_FORMAT } from 'utils/config/constants'
import { CopyTradePlatformEnum, EventTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten, compactNumber, formatDate, formatImageUrl, formatNumber } from 'utils/helpers/format'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'
import { getErrorMessage } from 'utils/helpers/handleError'
import { pageToOffset, parseExchangeImage, parseWalletName } from 'utils/helpers/transform'
import { logEventCompetition } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const ALLOWED_EXCHANGE = [CopyTradePlatformEnum.BINGX, CopyTradePlatformEnum.BITGET]

type EventDetailsProps = {
  eventDetails: EventDetailsData | undefined
  userEventDetails: UserEventRankingData | undefined
  totalVolume: number | undefined
  isLoading: boolean
}

export default function EventDetailsPage() {
  const { sm, xl } = useResponsive()
  const { id } = useParams<{ id: string }>()
  const isSlug = id?.includes('-')
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const { data: eventDetails, isLoading: isLoadingEventDetails } = useQuery(
    [QUERY_KEYS.GET_EVENT_COMPETITION, 'eventDetails', id],
    () => (isSlug ? getEventDetailsBySlug({ slug: id }) : getEventDetails({ tradingEventId: id })),
    {
      enabled: !!id,
      keepPreviousData: true,
    }
  )
  const tradingEventId = eventDetails?.id
  const { data: userEventDetails } = useQuery(
    [QUERY_KEYS.GET_EVENT_COMPETITION, 'user', myProfile?.id, tradingEventId],
    () => getUserEventRanking({ tradingEventId }),
    {
      enabled: !!myProfile?.id && !!tradingEventId,
    }
  )
  const { data: totalVolume } = useQuery(
    [QUERY_KEYS.GET_EVENT_COMPETITION, 'totalVolume', tradingEventId],
    () => getEventTotalVolume({ tradingEventId: tradingEventId ?? '' }),
    { enabled: !!tradingEventId, keepPreviousData: true }
  )

  const RenderComponent = xl ? DesktopVersion : sm ? TabletVersion : MobileVersion

  return (
    <>
      <CustomPageTitle title={eventDetails?.title ?? 'On-chain Copy-Trading to share $50,000 & Merchs rewards'} />
      <RenderComponent
        userEventDetails={userEventDetails}
        eventDetails={eventDetails}
        totalVolume={totalVolume}
        isLoading={isLoadingEventDetails}
      />
    </>
  )
}

function DesktopVersion({ userEventDetails, eventDetails, totalVolume, isLoading }: EventDetailsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        maxWidth: 1512,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '300px',
          flexShrink: 0,
          borderLeft: 'small',
          borderRight: 'small',
          borderRightColor: 'neutral4',
          borderLeftColor: 'neutral4',
          overflow: 'auto',
        }}
      >
        <UserOverview
          eventDetails={eventDetails}
          userEventDetails={userEventDetails}
          rewardSymbol={eventDetails?.rewardSymbol}
        />
        <Divider />
        <RewardDistribution eventDetails={eventDetails} totalVolume={totalVolume} />
      </Box>
      <Box
        sx={{
          height: '100%',
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Banner eventDetails={eventDetails} isLoading={isLoading} />
        <VolumeProgress eventDetails={eventDetails} totalVolume={totalVolume} />
        <Divider mt={2} mb={3} />
        <Box flex="1 0 0">
          <Flex sx={{ height: '100%', flexDirection: 'column' }}>
            <LeaderBoard tradingEventId={eventDetails?.id} rewardSymbol={eventDetails?.rewardSymbol} />
          </Flex>
        </Box>
      </Box>
      <Box
        sx={{
          height: '100%',
          width: '400px',
          flexShrink: 0,
          borderLeft: 'small',
          borderRight: 'small',
          borderRightColor: 'neutral4',
          borderLeftColor: 'neutral4',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <RegisterArea userEventDetails={userEventDetails} eventDetails={eventDetails} />
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
function RegisterArea({
  userEventDetails,
  eventDetails,
}: {
  userEventDetails: UserEventRankingData | undefined
  eventDetails: EventDetailsData | undefined
}) {
  const refetchQueries = useRefetchQueries()
  const location = useLocation()
  const [showModal, setShowModal] = useState<'notEligible' | 'success' | null>(null)
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const locationRef = useRef(location.pathname)
  useEffect(() => {
    if (locationRef.current !== location.pathname) {
      locationRef.current = location.pathname
      setShowModal(null)
    }
  }, [location.pathname])
  const { mutate, isLoading } = useMutation(() => registerEvent({ tradingEventId: eventDetails?.id }), {
    onError: (error: Error) => {
      const errorMsg = getErrorMessage(error)
      if (errorMsg?.match('not eligible')) {
        setShowModal('notEligible')

        logEventCompetition({
          event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_REGISTER_NOT_ELIGIBLE,
          username: myProfile?.username,
        })
      } else {
        toast.error(<ToastBody title={'Error'} message={getErrorMessage(error)} />)

        logEventCompetition({
          event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_REGISTER_ERROR,
          username: myProfile?.username,
        })
      }
    },
    onSuccess: () => {
      refetchQueries([QUERY_KEYS.GET_EVENT_COMPETITION])
      setShowModal('success')

      logEventCompetition({
        event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_REGISTER_ELIGIBLE,
        username: myProfile?.username,
      })
    },
  })
  const handleClickLogin = useClickLoginButton()
  const handleDismiss = () => setShowModal(null)
  const today = dayjs().utc().valueOf()
  const registerDate = dayjs(eventDetails?.registerDate).utc().valueOf()
  const startDate = dayjs(eventDetails?.startDate).utc().valueOf()
  const endDate = dayjs(eventDetails?.endDate).utc().valueOf()
  let text = 'Competition is starting in'
  let countdownTime: number | null = null
  let icon = null
  switch (eventDetails?.status) {
    case TradingEventStatusEnum.ONGOING:
      icon = <IconBox icon={<ArrowsHorizontal size={24} />} color="primary1" />
      text = 'Competition ends in'
      break
    case TradingEventStatusEnum.ENDED:
      text = 'Competition ends in'
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

  const isDCP = eventDetails?.type === EventTypeEnum.GNS
  const isJoined = userEventDetails?.tradingEventId === eventDetails?.id

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
      {eventDetails?.status !== TradingEventStatusEnum.ENDED && (
        <>
          {isDCP ? (
            <EventTradingProtocols type={eventDetails?.type} />
          ) : isJoined ? (
            <>
              {eventDetails?.status === TradingEventStatusEnum.UPCOMING && (
                <Button variant="primary" block mt={24} sx={{ fontWeight: '600', fontSize: '12px', py: 2 }} disabled>
                  Joined
                </Button>
              )}
              {eventDetails?.status === TradingEventStatusEnum.ONGOING && (
                <Button
                  variant="primary"
                  block
                  mt={24}
                  as={Link}
                  to={generateExplorerRoute({ protocol: DEFAULT_PROTOCOL })}
                  onClick={() => {
                    logEventCompetition({
                      event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_CLICK_COPYTRADE,
                      username: myProfile?.username,
                    })
                  }}
                  sx={{ fontWeight: '600', fontSize: '12px', py: 2 }}
                >
                  Copy Trade
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="primary"
                block
                mt={24}
                onClick={() => {
                  if (myProfile?.id) {
                    mutate()

                    logEventCompetition({
                      event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_CLICK_REGISTER,
                      username: myProfile?.username,
                    })
                  } else {
                    handleClickLogin()

                    logEventCompetition({
                      event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_CLICK_CONNECT_WALLET,
                      username: myProfile?.username,
                    })
                  }
                }}
                sx={{ height: 40 }}
                disabled={today < registerDate || isLoading}
                isLoading={isLoading}
              >
                Register
              </Button>
            </>
          )}
        </>
      )}

      <Modal width="350px" isOpen={!!showModal} onDismiss={handleDismiss}>
        {showModal === 'notEligible' && <NotEligible onDismiss={handleDismiss} />}
        {showModal === 'success' && <RegisterSuccess onDismiss={handleDismiss} />}
      </Modal>
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
function NotEligible({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Box sx={{ p: 3, bg: 'neutral7' }}>
      <Flex mb={3} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
        <Type.LargeBold color="orange1">Not Eligible</Type.LargeBold>
        <IconBox
          role="button"
          icon={<XCircle size={20} />}
          color="neutral3"
          sx={{ '&:hover': { color: 'neutral1' } }}
          onClick={onDismiss}
        />
      </Flex>
      <Type.Caption mb={3} color="orange1">
        Only users who have referred Copin at CEXs are eligible to attend this event.
      </Type.Caption>
      <Box
        sx={{ px: 2, py: 1, bg: 'neutral5', borderRadius: '4px', a: { '&:hover': { textDecoration: 'underline' } } }}
      >
        <Type.Caption color="neutral2">
          To qualify, register an account on CEXs using Copin&apos;s referral code:
          <Li>
            <Box as="a" href="https://bingx.com/invite/DY5QNN" target="_blank">
              https://bingx.com/invite/DY5QNN
            </Box>
          </Li>
          <Li>
            <Box as="a" href="https://partner.bitget.online/bg/HPM3BN" target="_blank">
              https://partner.bitget.online/bg/HPM3BN
            </Box>
          </Li>
        </Type.Caption>
      </Box>
    </Box>
  )
}
function RegisterSuccess({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Box sx={{ p: 3, bg: 'neutral7' }}>
      <Flex mb={3} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
        <Box />
        <IconBox
          role="button"
          icon={<XCircle size={20} />}
          color="neutral3"
          sx={{ '&:hover': { color: 'neutral1' } }}
          onClick={onDismiss}
        />
      </Flex>
      <Image mb={3} src={registerSuccess} width={160} sx={{ display: 'block', mx: 'auto' }} />
      <Type.Caption color="green1" display="block" sx={{ textAlign: 'center' }}>
        Join event successfully
      </Type.Caption>
    </Box>
  )
}
//=========================
function Banner({ eventDetails, isLoading }: { eventDetails: EventDetailsData | undefined; isLoading: boolean }) {
  return (
    <Box sx={{ height: [154, 154, 220, 220, 220], flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      {!isLoading && (
        <Image
          src={
            eventDetails?.type === EventTypeEnum.GNS && eventDetails?.bannerUrl
              ? formatImageUrl(eventDetails?.bannerUrl)
              : banner
          }
          sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
        />
      )}
    </Box>
  )
}

//=========================
const LIMIT = 10
function LeaderBoard({ tradingEventId, rewardSymbol }: { tradingEventId: string | undefined; rewardSymbol?: string }) {
  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'page' })
  const { data: leaderboard } = useQuery(
    [QUERY_KEYS.GET_EVENT_COMPETITION, 'leaderboard', currentPage, tradingEventId],
    () => getEventLeaderboard({ tradingEventId, limit: LIMIT, offset: pageToOffset(currentPage, LIMIT) }),
    { enabled: !!tradingEventId, keepPreviousData: true, retry: 0 }
  )

  const { sm } = useResponsive()

  const columns: ColumnData<UserEventRankingData>[] = useMemo(
    () => [
      {
        title: 'Rank',
        dataIndex: 'ranking',
        key: 'ranking',
        style: { minWidth: '100px', textAlign: 'left' },
        render: (item) => (
          <Box sx={{ display: 'flex', height: '41px', alignItems: 'center' }}>
            <RankingNumber ranking={item.ranking} />
          </Box>
        ),
      },
      {
        title: `Copier ${!!leaderboard?.meta?.total ? ` (${formatNumber(leaderboard?.meta?.total)})` : ''}`,
        dataIndex: 'username',
        key: 'username',
        style: { minWidth: '130px' },
        render: (item) => <Type.CaptionBold color="neutral1">{addressShorten(item.username)}</Type.CaptionBold>,
      },
      {
        title: 'Copy Trading Volume',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '200px', textAlign: 'right' },
        render: (item) => (
          <Type.CaptionBold color="neutral1">
            {item.volume != null ? `$${formatNumber(item.volume, 2, 2)}` : '--'}
          </Type.CaptionBold>
        ),
      },
      {
        title: 'Estimate Rewards',
        dataIndex: 'estimateReward',
        key: 'estimateReward',
        style: { minWidth: '150px', textAlign: 'right', pr: 3 },
        render: (item) => (
          <Type.CaptionBold color="neutral1">
            <RewardWithSymbol value={item.estimateReward} rewardSymbol={rewardSymbol} />
          </Type.CaptionBold>
        ),
      },
    ],
    [leaderboard?.meta?.total]
  )

  return (
    <>
      {sm ? (
        !!leaderboard?.data?.length ? (
          <Box flex="1 0 0">
            <Table
              restrictHeight={false}
              data={leaderboard?.data}
              columns={columns}
              isLoading={false}
              tableBodyWrapperSx={{
                overflow: 'auto',
                flex: 'auto',
              }}
              containerSx={{
                height: 'auto',
                '& th:first-child, td:first-child': {
                  pl: '16px !important',
                },
                '& th, td': {
                  border: 'none !important',
                },
              }}
            />
          </Box>
        ) : null
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
          {leaderboard?.data?.map((_d) => {
            return (
              <Box key={_d.username} sx={{ mx: 3, py: 12 }}>
                <Flex mb={12} sx={{ alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '40px' }}>
                    <RankingNumber ranking={_d.ranking} />
                  </Box>
                  <Type.CaptionBold>{addressShorten(_d.username)}</Type.CaptionBold>
                </Flex>
                <Flex mb={12} sx={{ width: '100%', justifyContent: 'space-between' }}>
                  <Type.Caption color="neutral3">Estimate Rewards</Type.Caption>
                  <Type.Caption>
                    <RewardWithSymbol value={_d.estimateReward} rewardSymbol={rewardSymbol} />
                  </Type.Caption>
                </Flex>
                <Flex sx={{ width: '100%', justifyContent: 'space-between' }}>
                  <Type.Caption color="neutral3">Copy Volume</Type.Caption>
                  <Type.Caption>${formatNumber(_d.volume)}</Type.Caption>
                </Flex>
              </Box>
            )
          })}
        </Flex>
      )}
      {!!leaderboard?.data?.length && <Divider />}
      <PaginationWithSelect
        currentPage={currentPage}
        onPageChange={changeCurrentPage}
        apiMeta={leaderboard?.meta}
        // disabledInput
        inputWrapperSx={{ bg: 'neutral7', border: 'none', '&[disabled]': { bg: 'neutral6' } }}
        sx={{ justifyContent: 'end', width: '100%' }}
      />
    </>
  )
}

//=========================
function VolumeProgress({
  eventDetails,
  totalVolume = 0,
}: {
  eventDetails: EventDetailsData | undefined
  totalVolume: number | undefined
}) {
  if (!eventDetails) return null
  const configs = eventDetails?.rewardMilestones
  const paddingTop = totalVolume > 0 ? 48 : 28
  const addedHeight = totalVolume > 0 ? 40 : 28
  return (
    <Box sx={{ py: 3 }}>
      <Box px={3}>
        <Type.H5 mb={12}>{eventDetails.title}</Type.H5>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <IconBox icon={<Trophy size={24} />} color="neutral3" />
            <Type.BodyBold>Rewards:</Type.BodyBold>
            <Type.H5 color="green1">
              <RewardWithSymbol value={eventDetails.maxReward} rewardSymbol={eventDetails?.rewardSymbol} size={24} />
            </Type.H5>
          </Flex>
          <StatusTag eventDetails={eventDetails} />
        </Flex>
      </Box>
      {/* <Box sx={{ width: '100%', height: [108, 100], overflow: 'auto hidden', px: 3, pt: totalVolume > 0 ? 48 : 28 }}> */}
      <Box
        sx={{
          width: '100%',
          height: [108 + addedHeight, 100 + addedHeight],
          overflow: 'auto hidden',
          px: 18,
          pt: paddingTop,
        }}
      >
        <Box sx={{ width: '100%', minWidth: 500 }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              background: 'linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)',
            }}
          >
            <Box sx={{ position: 'absolute', left: 0, top: 0, pt: 24 }}>
              <Type.Caption mb={18} display="block" height={24} color="neutral3">
                Volume
              </Type.Caption>
              <Type.Caption display="block" height={24} color="neutral3">
                Reward
              </Type.Caption>
              {/* <IconBox icon={<Equalizer size={24} />} color="primary1" sx={{ display: 'block', mb: 18 }} />
              <IconBox icon={<CoinVertical size={24} />} color="primary1" /> */}
            </Box>
            {configs?.map((config, index) => {
              const minVolume = index === 0 ? 0 : configs[index - 1].volume
              const maxVolume = config.volume
              const percent = Math.min(100, (Math.max(0, totalVolume - minVolume) / (maxVolume - minVolume)) * 100)
              const isFirstItem = index === 0
              const isLastItem = index === configs.length - 1
              const isCurrent =
                (isLastItem && totalVolume >= minVolume) || (totalVolume >= minVolume && totalVolume < maxVolume)
              const isActive = percent === 100
              return (
                <Box
                  key={index}
                  // flex={config.widthFactor}
                  flex="1"
                  sx={{
                    position: 'relative',
                    height: '16px',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 0,
                      top: 0,
                      bottom: 0,
                      right: 0,
                      left: 0,
                      bg: 'neutral4',
                      clipPath:
                        percent > 0 ? `polygon(100% 0, ${percent}% 0, ${percent}% 100%, 100% 100%, 100% 0)` : undefined,
                    }}
                  />
                  {isCurrent && (
                    <Box
                      sx={{
                        position: 'absolute',
                        zIndex: 2,
                        width: 28,
                        height: 28,
                        pl: 1,
                        top: '50%',
                        left: `${percent}%`,
                        transform: 'translateX(-50%) translateY(-50%)',
                        bg: 'neutral7',
                        borderRadius: '50%',
                        border: 'small',
                        borderColor: 'primary1',
                      }}
                    >
                      <Image src={logo} width={20} height={20} />
                      {totalVolume > 0 ? (
                        <>
                          <Box
                            sx={{
                              width: '4px',
                              height: '4px',
                              position: 'absolute',
                              bg: 'neutral1',
                              top: '-10px',
                              left: 12,
                              zIndex: 1,
                              transformOrigin: 'center',
                              transform: 'rotate(45deg)',
                            }}
                          />
                          {/* Volume Tag */}
                          <Flex
                            sx={{
                              width: 80,
                              height: 24,
                              borderRadius: '8px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundImage:
                                'linear-gradient(90deg, #ABECA2 -1.42%, rgba(47, 179, 254, 0.5) 30.38%, rgba(106, 142, 234, 0.3) 65.09%, rgba(161, 133, 244, 0.15) 99.55%)',
                              position: 'absolute',
                              top: '-32px',
                              left: '50%',
                              transform: isFirstItem
                                ? `translateX(calc(${Math.min(50, percent) * -1}% - ${
                                    16 * (1 - Math.min(1, percent / 50))
                                  }px))`
                                : isLastItem
                                ? `translateX(calc(${Math.max(50, percent) * -1}% + ${
                                    16 * Math.min(1, Math.max(0, percent - 50) / 50)
                                  }px))`
                                : 'translateX(-50%)',
                              zIndex: 0,
                            }}
                          >
                            <Type.Caption>${compactNumber(totalVolume, 2)}</Type.Caption>
                          </Flex>
                        </>
                      ) : null}
                    </Box>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 1,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      left: 'calc(100% - 2px)',
                      bg: 'neutral1',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        transform: isLastItem ? 'translateX(-100%)' : 'translateX(-50%)',
                        width: 'max-content',
                        pt: 24,
                      }}
                    >
                      <Type.CaptionBold
                        mb={20}
                        color={isActive ? 'neutral1' : 'neutral3'}
                        display="block"
                        sx={{ textAlign: isLastItem ? 'right' : 'center' }}
                      >
                        ${compactNumber(maxVolume)}
                      </Type.CaptionBold>
                      <Type.CaptionBold
                        color={isActive ? 'neutral1' : 'neutral3'}
                        display="block"
                        sx={{ textAlign: isLastItem ? 'right' : 'center' }}
                      >
                        <RewardWithSymbol isCompact value={config.reward} rewardSymbol={eventDetails?.rewardSymbol} />
                      </Type.CaptionBold>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
function StatusTag({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  if (!eventDetails?.status) return null
  let text = 'Upcoming'
  const bg = 'neutral5'
  let color = 'primary1'
  switch (eventDetails.status) {
    case TradingEventStatusEnum.ONGOING:
      text = 'Ongoing'
      color = 'green1'
      break
    case TradingEventStatusEnum.ENDED:
      text = 'Ended'
      color = 'neutral3'
      break
  }
  return (
    <Type.Caption color={color} sx={{ px: 2, py: 1, bg, borderRadius: '4px' }}>
      {text}
    </Type.Caption>
  )
}
//=========================
function UserOverview({
  eventDetails,
  userEventDetails,
  rewardSymbol,
}: {
  eventDetails: EventDetailsData | undefined
  userEventDetails: UserEventRankingData | undefined
  rewardSymbol?: string
}) {
  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const { copyWallets, reloadCopyWallets } = useCopyWalletContext()

  const eligibleWallets: CopyWalletData[] = []
  switch (eventDetails?.type) {
    case EventTypeEnum.CEX:
      ALLOWED_EXCHANGE.forEach((exchange) => {
        copyWallets?.forEach((wallet) => {
          if (wallet.isReferral && wallet.exchange === exchange) {
            eligibleWallets.push(wallet)
          }
        })
      })
      break
    case EventTypeEnum.GNS:
      const gnsWallets = copyWallets?.filter((e) => e.exchange === CopyTradePlatformEnum.GNS_V8)
      gnsWallets?.forEach((wallet) => {
        eligibleWallets.push(wallet)
      })
      break
  }

  return (
    <Box sx={{ px: 3, py: 24 }}>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Label icon={Wallet} label={myProfile?.username ? addressShorten(myProfile?.username) : '--'} />
        {!!eligibleWallets?.length && (
          <Dropdown
            buttonVariant="ghostPrimary"
            inline
            placement="bottomRight"
            menu={
              <Box py={2}>
                <Flex px={2} sx={{ flexDirection: 'column', gap: 12, maxHeight: 200, overflow: 'hidden auto' }}>
                  {eligibleWallets.map((wallet) => {
                    return (
                      <Flex key={wallet.id} sx={{ alignItems: 'center', gap: 2, width: '100%' }}>
                        <Image
                          src={parseExchangeImage(wallet.exchange)}
                          width={20}
                          height={20}
                          sx={{ flexShrink: 0 }}
                        />
                        <Type.CaptionBold sx={{ flex: 1, maxWidth: 120, ...overflowEllipsis() }}>
                          {parseWalletName(wallet)}
                        </Type.CaptionBold>
                        {/* {CEX_EXCHANGES.includes(wallet.exchange) && (
                          <ReferralStatus data={wallet} hasText={false} sx={{ width: 'auto', p: 1 }} size={16} />
                        )} */}
                      </Flex>
                    )
                  })}
                </Flex>
                <Box px={2}>
                  <Divider my={2} />
                </Box>
                <Type.Caption px={2} display="block" color="primary1" sx={{ textAlign: 'center' }}>
                  <Box
                    as={Link}
                    to={ROUTES.WALLET_MANAGEMENT.path}
                    target="_blank"
                    sx={{ '&:hover': { textDecoration: 'underline' } }}
                  >
                    Wallet Management
                  </Box>
                </Type.Caption>
              </Box>
            }
          >
            <Type.Body
              onClick={() => {
                logEventCompetition({
                  event: EVENT_ACTIONS[EventCategory.COMPETITION].EVENT_CLICK_VIEW_ACCOUNTS,
                  username: myProfile?.username,
                })
              }}
            >
              {eligibleWallets.length} Account{eligibleWallets.length > 1 && 's'}
            </Type.Body>
          </Dropdown>
        )}
      </Flex>
      {eventDetails?.type === EventTypeEnum.GNS && (!eligibleWallets?.length || eligibleWallets.length === 0) ? (
        <CreateSmartWalletAction exchange={CopyTradePlatformEnum.GNS_V8} onSuccess={reloadCopyWallets} />
      ) : (
        <Box my={3}>
          <OverviewItem
            label={'Cumulative Copy Trading Volume'}
            value={userEventDetails?.volume ? `$${formatNumber(userEventDetails?.volume)}` : '--'}
          />
          <Box mb={3} />
          <OverviewItem label={'Ranking'} value={userEventDetails?.ranking ?? '--'} />
          <Box mb={3} />
          <OverviewItem
            label={'Estimate Rewards'}
            value={
              <RewardWithSymbol
                value={userEventDetails?.estimateReward}
                rewardSymbol={rewardSymbol}
                sx={{ justifyContent: 'flex-start' }}
              />
            }
          />
        </Box>
      )}
    </Box>
  )
}
function OverviewItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <>
      <Type.Caption display="block" color="neutral3">
        {label}
      </Type.Caption>
      <Type.BodyBold display="block">{value}</Type.BodyBold>
    </>
  )
}
//=========================
function RewardDistribution({
  eventDetails,
  totalVolume = 0,
}: {
  eventDetails: EventDetailsData | undefined
  totalVolume: number | undefined
}) {
  let currentReward: any = null
  eventDetails?.rewardMilestones?.forEach((_m) => {
    if (totalVolume >= _m.volume) currentReward = _m
  })
  const topCount = currentReward?.distribution?.[(currentReward?.distribution?.length ?? 1) - 1]?.rank?.split('-')?.[1]
  return (
    <Box sx={{ p: 3 }}>
      <Label icon={Trophy} label={'Rewards'} />
      <Box mb={3} />
      <Type.Caption mb={24} color="neutral3">
        The top{' '}
        <Box as="span" color="neutral1">
          {topCount ? topCount : 20}
        </Box>{' '}
        copiers will receive the rewards below
      </Type.Caption>
      <Box mb={3} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
        <TopRewardWrapper
          label={'Top 1'}
          value={currentReward?.distribution?.[0].reward}
          rewardSymbol={eventDetails?.rewardSymbol}
        />
        <TopRewardWrapper
          label={'Top 2'}
          value={currentReward?.distribution?.[1].reward}
          rewardSymbol={eventDetails?.rewardSymbol}
        />
        <TopRewardWrapper
          label={'Top 3'}
          value={currentReward?.distribution?.[2].reward}
          rewardSymbol={eventDetails?.rewardSymbol}
        />
      </Box>
      <Flex sx={{ flexDirection: 'column', gap: 2 }}>
        {currentReward?.distribution?.slice?.(3) ? (
          currentReward?.distribution?.slice?.(3)?.map((_d: any, index: any) => {
            return (
              <OthersRewardWrapper
                key={index}
                label={`Top ${_d?.rank}`}
                value={_d?.reward}
                rewardSymbol={eventDetails?.rewardSymbol}
              />
            )
          })
        ) : (
          <>
            <OthersRewardWrapper label={`Top 4-10`} value={undefined} />
            <OthersRewardWrapper label={`Top 11-20`} value={undefined} />
          </>
        )}
      </Flex>
    </Box>
  )
}
function TopRewardWrapper({ label, value, rewardSymbol }: { label: ReactNode; value?: number; rewardSymbol?: string }) {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '4px 4px 0 0' }}>
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
          borderTopLeftRadius: '4px 2px',
          borderTopRightRadius: '4px 2px',
          top: '2px',
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
          top: '2px',
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
          py: 3,
          zIndex: 3,
        }}
      >
        <Type.Caption display="block" mb={2} sx={{ textAlign: 'center' }}>
          {label}
        </Type.Caption>
        <Type.CaptionBold display="block" color="green1" sx={{ textAlign: 'center' }}>
          <RewardWithSymbol value={value} rewardSymbol={rewardSymbol} />
        </Type.CaptionBold>
      </Box>
    </Box>
  )
}
function OthersRewardWrapper({
  label,
  value,
  rewardSymbol,
}: {
  label: ReactNode
  value?: number
  rewardSymbol?: string
}) {
  return (
    <Box sx={{ px: 3, py: 2, bg: 'neutral6' }}>
      <Li
        signcolor={themeColors.primary1}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Type.Caption>{label}</Type.Caption>
        <Type.CaptionBold>
          <RewardWithSymbol value={value} rewardSymbol={rewardSymbol} />
        </Type.CaptionBold>
      </Li>
    </Box>
  )
}
//=================
export function Rules({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  const isDCP = eventDetails?.type === EventTypeEnum.GNS
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
      {isDCP ? <RulesDCP eventDetails={eventDetails} /> : <RulesNormal eventDetails={eventDetails} />}
      {!isDCP && (
        <Box px={3}>
          <Divider my={2} />
          <Type.Caption color="neutral3">
            Any question? Contact us on{' '}
            <Box as="a" href={LINKS.telegram} target="_blank" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              Telegram
            </Box>
          </Type.Caption>
        </Box>
      )}
    </Box>
  )
}

function RulesNormal({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  const format = `${DATE_FORMAT} - ${TIME_FORMAT} UTC+0`
  return (
    <Box flex="1 0 1" sx={{ px: 3, overflow: 'hidden auto' }}>
      <Flex sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Label icon={BookBookmark} label={'Rules'} />
        <Type.Caption>
          <Box
            as="a"
            href={
              eventDetails?.blogUrl ?? 'https://blog.copin.io/p/join-the-on-chain-copy-trading-event#%C2%A7event-rules'
            }
            rel="noreferrer"
            target="_blank"
            sx={{ '&:hover': { textDecoration: 'underline' } }}
          >
            View full
          </Box>
        </Type.Caption>
      </Flex>
      <Box mb={10} />
      <Type.Caption color="neutral3" sx={{ '& > *': { mb: '4px' } }}>
        {eventDetails && (
          <>
            <Li mb={2}>
              Register:{' '}
              <Box as="span" color="neutral2">
                {formatDate(eventDetails.registerDate, format)}
              </Box>
            </Li>
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
        <Li>
          This event is exclusively available to users who have registered using Copin&apos;s referral link, those who
          trade using Copin&apos;s API/Product on BingX, Bitget.
        </Li>
        <Box pl={3}>
          <Li signradius="0px">
            BingX:{' '}
            <Box
              as="a"
              href={LINKS.registerBingX}
              target="_blank"
              rel="noreferrer"
              sx={{ color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
            >
              https://bingx.com/invite/DY5QNN
            </Box>
            <br />
            (Referral code: DY5QNN)
          </Li>
          <Li signradius="0px">
            Bitget:{' '}
            <Box
              as="a"
              href={LINKS.registerBitget}
              target="_blank"
              rel="noreferrer"
              sx={{ color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
            >
              https://partner.bitget.online/bg/HPM3BN
            </Box>
            <br />
            (Referral code: 1qlg)
          </Li>
        </Box>
        <Li>Event for Copin users after clicking the registration button.</Li>
        <Li>The reward is unlocked when the total copy-trading volume reaches at least 5 million during the event.</Li>
        <Li>
          Copy-trading volume is calculated based on the total volume of closed positions (including open and closed
          volume) during the event.
        </Li>
        <Li>
          Top 10 users will be eligible to receive rewards from Gate; with the condition of registering a Gate account
          under Copin&apos;s referral link (
          <Box
            as="a"
            href={LINKS.registerGate}
            target="_blank"
            rel="noreferrer"
            sx={{ color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
          >
            https://www.gate.io/signup/AgBFAApb?ref_type=103
          </Box>
          , ref code: AgBFAApb) before the event ends:
        </Li>
        <Box pl={3}>
          <Li signradius="0px">Top 1: Badminton Set.</Li>
          <Li signradius="0px">Top 2, 3: Wireless charging.</Li>
          <Li signradius="0px">Top 4 - 10: Umbrella.</Li>
        </Box>
        <Li>
          After the event ends, the top winner contacts the Copin team to provide the UID and recipient information.
          After Gate confirms that the UID is under the Copin ref, the reward will be sent immediately.
        </Li>
        <Li>
          The rewards will be distributed in the form of a &quot;USDT&quot; within 7 working days after the conclusion
          event.
        </Li>
        <Li>
          Copin reserves the right to change or revise the terms of this event, or cancel it at any time and for any
          reason without notice in its sole discretion.
        </Li>
        <Li>
          Copin reserves the right to disqualify unsatisfactory users if they engage in any inappropriate, dishonest or
          abusive activities (such as volume tampering, participating with multiple accounts, etc.) throughout the
          competition. Copin reserves the right to not reward all users who violate Copin&apos;s rules and regulations,
          or users who show any signs of fraud.
        </Li>
      </Type.Caption>
    </Box>
  )
}

function RulesDCP({ eventDetails }: { eventDetails: EventDetailsData | undefined }) {
  const format = `${DATE_FORMAT} - ${TIME_FORMAT} UTC+0`
  return (
    <Box flex="1 0 1" sx={{ px: 3, overflow: 'hidden auto' }}>
      <Flex sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Label icon={BookBookmark} label={'Rules'} />
        <Type.Caption>
          <Box
            as="a"
            href={
              eventDetails?.blogUrl ??
              'https://blog.copin.io/p/join-copins-decentralized-copy-trading?r=2m5jsa&utm_campaign=post&utm_medium=web&triedRedirect=true'
            }
            rel="noreferrer"
            target="_blank"
            sx={{ '&:hover': { textDecoration: 'underline' } }}
          >
            View full
          </Box>
        </Type.Caption>
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
            Only trades executed through the copy-trading feature are eligible for the competition.
          </Li>
        </Box>
        <Li>
          Reward Distribution: Rewards will be distributed in the form of ARB within 7 working days after the event
          ends.
        </Li>
        <Li>Ranking Criteria:</Li>
        <Box pl={3}>
          <Li signradius="0px">
            Participants are ranked based on their total copy-trading volumes over the competition period.
          </Li>
          <Li signradius="0px">
            Regular updates on rankings will be provided to keep participants informed of their standings.
          </Li>
        </Box>
        <Li>Disclaimers:</Li>
        <Box pl={3}>
          <Li signradius="0px">
            Copin reserves the right to change or revise the terms of this event, or cancel it at any time and for any
            reason without notice in its sole discretion.
          </Li>
          <Li signradius="0px">
            Any form of manipulation or unethical trading practices will result in disqualification.
          </Li>
          <Li signradius="0px">
            Copin reserves the right to disqualify users if they engage in inappropriate, dishonest, or abusive
            activities (such as volume tampering, participating with multiple accounts, etc.) throughout the
            competition.
          </Li>
          <Li signradius="0px">
            Copin reserves the right to not reward users who violate Copin&apos;s rules and regulations or who show any
            signs of fraud.
          </Li>
        </Box>
      </Type.Caption>
    </Box>
  )
}

enum TabKeyEnum {
  OVERVIEW = 'overview',
  RANKING = 'ranking',
  RULES = 'rules',
}

const tabConfigs: TabConfig[] = [
  {
    name: 'Overview',
    activeIcon: <PresentationChart size={24} weight="fill" />,
    icon: <PresentationChart size={24} />,
    key: TabKeyEnum.OVERVIEW,
  },
  {
    name: 'Ranking',
    activeIcon: <ChartBar size={24} weight="fill" />,
    icon: <ChartBar size={24} />,
    key: TabKeyEnum.RANKING,
  },
  {
    name: 'Rules',
    activeIcon: <BookBookmark size={24} weight="fill" />,
    icon: <BookBookmark size={24} />,
    key: TabKeyEnum.RULES,
  },
]

function MobileVersion({ userEventDetails, eventDetails, totalVolume, isLoading }: EventDetailsProps) {
  const [currentTab, setTab] = useState(TabKeyEnum.OVERVIEW)
  return (
    <Flex sx={{ flexDirection: 'column', height: '100%' }}>
      <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
          {currentTab === TabKeyEnum.OVERVIEW && (
            <Box>
              <Banner eventDetails={eventDetails} isLoading={isLoading} />
              <RegisterArea userEventDetails={userEventDetails} eventDetails={eventDetails} />
              <VolumeProgress eventDetails={eventDetails} totalVolume={totalVolume} />
              <Divider mt={2} />
              <RewardDistribution eventDetails={eventDetails} totalVolume={totalVolume} />
            </Box>
          )}
          {currentTab === TabKeyEnum.RANKING && (
            <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
              <UserOverview
                eventDetails={eventDetails}
                userEventDetails={userEventDetails}
                rewardSymbol={eventDetails?.rewardSymbol}
              />
              <Divider my={3} />
              <Box flex="1 0 0">
                <Flex sx={{ height: '100%', flexDirection: 'column' }}>
                  <LeaderBoard tradingEventId={eventDetails?.id} rewardSymbol={eventDetails?.rewardSymbol} />
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

function TabletVersion({ userEventDetails, eventDetails, totalVolume, isLoading }: EventDetailsProps) {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Box
          flex="0 0 300px"
          sx={{ height: '100%', overflow: 'auto', borderRight: 'small', borderRightColor: 'neutral4' }}
        >
          <UserOverview
            eventDetails={eventDetails}
            userEventDetails={userEventDetails}
            rewardSymbol={eventDetails?.rewardSymbol}
          />
          <Divider />
          <RewardDistribution eventDetails={eventDetails} totalVolume={totalVolume} />
          <Divider />
          <Rules eventDetails={eventDetails} />
        </Box>
        <Flex flex="1" sx={{ height: '100%', overflow: 'auto', flexDirection: 'column' }}>
          <Banner eventDetails={eventDetails} isLoading={isLoading} />
          <RegisterArea userEventDetails={userEventDetails} eventDetails={eventDetails} />
          <VolumeProgress eventDetails={eventDetails} totalVolume={totalVolume} />
          <Divider my={3} />
          <Box flex="1 0 0">
            <Flex sx={{ height: '100%', flexDirection: 'column' }}>
              <LeaderBoard tradingEventId={eventDetails?.id} rewardSymbol={eventDetails?.rewardSymbol} />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}
