import { ArrowFatLineRight, HourglassLow, ShootingStar, Trophy } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import noEventIcon from 'assets/icons/no-event.png'
import banner from 'assets/images/event-banner.png'
import ActiveDot from 'components/@ui/ActiveDot'
import RewardWithSymbol from 'components/@ui/RewardWithSymbol'
import { EventDetailsData, TradingEventStatusEnum } from 'entities/event'
import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useSearchParams from 'hooks/router/useSearchParams'
import { BodyWrapperMobile, BottomTabItemMobile, BottomTabWrapperMobile } from 'pages/@layouts/Components'
import { Button } from 'theme/Buttons'
import CalendarStarIcon from 'theme/Icons/CalendarStarIcon'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import ROUTES from 'utils/config/routes'
import { ellipsisLineClamp } from 'utils/helpers/css'
import { formatDate, formatImageUrl } from 'utils/helpers/format'
import { generateEventDetailsRoute } from 'utils/helpers/generateRoute'

import ShareEventButton from './ShareEventButton'

export default function EventPage() {
  const { events } = useSystemConfigContext()
  const { md } = useResponsive()
  if (!events?.length) return null
  const Events = md ? DesktopEvents : MobileEvents
  return (
    <Flex height="100%" sx={{ flexDirection: 'column' }}>
      <Flex
        px={3}
        py={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
      >
        <Box flex={1}>
          <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <Type.H5>Events</Type.H5>
            {!md && <RewardHistoryButton />}
          </Flex>
          <Type.Caption color="neutral3">Claim rewards by joining events and competitions</Type.Caption>
        </Box>
        {md && <RewardHistoryButton />}
      </Flex>
      <Box sx={{ flex: '1 0 0', overflow: 'hidden' }}>
        <Events events={events} />
      </Box>
    </Flex>
  )
}

function DesktopEvents({ events }: { events: EventDetailsData[] }) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          flex: '1',
          borderLeft: 'small',
          borderRight: 'small',
          borderRightColor: 'neutral4',
          borderLeftColor: 'neutral4',
          overflow: 'auto',
        }}
      >
        <EventByStatus events={events} status={TradingEventStatusEnum.UPCOMING} />
      </Box>
      <Box
        sx={{
          height: '100%',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <EventByStatus events={events} status={TradingEventStatusEnum.ONGOING} />
      </Box>
      <Box
        sx={{
          height: '100%',
          flex: '1',
          borderLeft: 'small',
          borderRight: 'small',
          borderRightColor: 'neutral4',
          borderLeftColor: 'neutral4',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <EventByStatus events={events} status={TradingEventStatusEnum.ENDED} />
      </Box>
    </Box>
  )
}

function MobileEvents({ events }: { events: EventDetailsData[] }) {
  const { searchParams, setSearchParamsOnly } = useSearchParams()
  const eventStatus =
    Object.values(TradingEventStatusEnum).find((v) => v == searchParams.tab) ?? TradingEventStatusEnum.ONGOING
  const handleClickItem = (key: string) => {
    setSearchParamsOnly({ tab: key })
  }
  return (
    <BodyWrapperMobile>
      <Box sx={{ width: '100%', height: '100%' }}>
        <EventByStatus events={events} status={eventStatus} />
      </Box>
      <BottomTabWrapperMobile>
        {tabConfigs.map((config, index) => {
          const isActive = eventStatus === config.key
          return (
            <BottomTabItemMobile
              key={index}
              color={isActive ? 'primary1' : 'neutral3'}
              onClick={() => handleClickItem(config.key)}
              fontWeight={isActive ? 500 : 400}
              text={config.name}
            />
          )
        })}
      </BottomTabWrapperMobile>
    </BodyWrapperMobile>
  )
}

const tabConfigs = [
  {
    name: 'Ongoing',
    key: TradingEventStatusEnum.ONGOING,
  },
  {
    name: 'Upcoming',
    key: TradingEventStatusEnum.UPCOMING,
  },
  {
    name: 'Ended',
    key: TradingEventStatusEnum.ENDED,
  },
]

function RewardHistoryButton() {
  return (
    <Button type="button" variant="ghostPrimary" as={Link} to={ROUTES.FEE_REBATE.path} sx={{ flexShrink: 0 }}>
      <Type.Caption>Reward History</Type.Caption>
    </Button>
  )
}

function EventByStatus({ events, status }: { events?: EventDetailsData[]; status: TradingEventStatusEnum }) {
  const filteredEvents = events?.filter((e) => e.status === status)
  let statusIcon: ReactNode
  let statusText: string
  switch (status) {
    case TradingEventStatusEnum.ONGOING:
      statusIcon = <ArrowFatLineRight />
      statusText = 'Ongoing'
      break
    case TradingEventStatusEnum.UPCOMING:
      statusIcon = <ShootingStar />
      statusText = 'Upcoming'
      break
    case TradingEventStatusEnum.ENDED:
      statusIcon = <HourglassLow />
      statusText = 'Ended'
      break
    default:
      statusIcon = <HourglassLow />
      statusText = 'Ended'
      break
  }

  return (
    <Flex py={3} sx={{ height: '100%', flexDirection: 'column' }}>
      <Flex mb={3} alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
        <IconBox icon={statusIcon} color="primary1" />
        <Type.BodyBold>{statusText}</Type.BodyBold>
      </Flex>
      <Box sx={{ px: 3, flex: '1 0 0', overflow: 'auto' }}>
        {filteredEvents?.length ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 3,
            }}
          >
            {filteredEvents.map((_e) => {
              let statusColor = 'neutral3'
              switch (_e.status) {
                case TradingEventStatusEnum.ONGOING:
                  statusColor = 'green1'
                  break
                case TradingEventStatusEnum.UPCOMING:
                  statusColor = 'primary1'
                  break
              }
              return (
                <Box
                  key={_e.id}
                  mb={3}
                  mt="1px"
                  as={Link}
                  to={generateEventDetailsRoute(_e)}
                  sx={{
                    position: 'relative',
                    display: 'block',
                    bg: 'neutral5',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    // outline: `1px solid ${themeColors.neutral5}`,
                    '&:hover': { bg: 'neutral4', outline: `1px solid ${themeColors.neutral4}` },
                  }}
                >
                  <Box
                    sx={{
                      height: 98,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  >
                    <Image
                      src={
                        _e?.bannerUrl
                          ? formatImageUrl(_e.bannerUrl)
                          : _e?.thumbUrl
                          ? formatImageUrl(_e?.thumbUrl)
                          : banner
                      }
                      sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  </Box>
                  <Box p={3}>
                    <Flex mb={2} sx={{ gap: 2 }}>
                      <Box pt={2} sx={{ flexShrink: 0 }}>
                        <ActiveDot color={statusColor} />
                      </Box>
                      <Box flex="1 0 0">
                        <Type.CaptionBold color="neutral1" sx={{ width: '100%', height: 44, ...ellipsisLineClamp(2) }}>
                          <Box as="span">{_e.title}</Box>
                        </Type.CaptionBold>
                      </Box>
                    </Flex>
                    <Flex mb={2} sx={{ alignItems: 'center', gap: 2 }}>
                      <IconBox icon={<Trophy size={20} />} color="primary1" />
                      <Type.CaptionBold color="primary1">
                        <RewardWithSymbol value={_e.maxReward} rewardSymbol={_e.rewardSymbol} />
                      </Type.CaptionBold>
                    </Flex>
                    <Flex sx={{ alignItems: 'center', gap: 2 }}>
                      <IconBox icon={<CalendarStarIcon size={20} />} color="neutral3" />
                      <Type.Caption color="neutral3">
                        {formatDate(_e.registerDate)} - {formatDate(_e.endDate)}
                      </Type.Caption>
                    </Flex>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      backgroundColor: 'neutral6',
                      borderRadius: '2px',
                    }}
                  >
                    <ShareEventButton event={_e} />
                  </Box>
                </Box>
              )
            })}
          </Box>
        ) : (
          <NoEvent status={status} />
        )}
      </Box>
    </Flex>
  )
}

function NoEvent({ status }: { status: TradingEventStatusEnum }) {
  let text = 'No Event'
  switch (status) {
    case TradingEventStatusEnum.ONGOING:
      text = 'No ongoing events at the moment.'
      break
    case TradingEventStatusEnum.UPCOMING:
      text = 'No upcoming events at the moment.'
      break
    case TradingEventStatusEnum.ENDED:
      text = 'No event has been ended yet.'
      break
  }
  return (
    <Flex sx={{ width: '100%', height: 200, flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Box sx={{ width: 90, height: 90, background: `url(${noEventIcon}) no-repeat`, backgroundSize: '100% 100%' }} />
      <Type.Caption color="neutral3">{text}</Type.Caption>
    </Flex>
  )
}
