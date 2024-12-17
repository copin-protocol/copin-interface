import { ArrowSquareOut, ShootingStar } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useQuery } from 'react-query'
import Slider, { Settings } from 'react-slick'

import { getPerpDexEventApi } from 'apis/perpDex'
import homeEventBanner from 'assets/images/home-event-banner.png'
import PerpDexLogo from 'components/@ui/PerpDexLogo'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { PerpDEXEventResponse } from 'entities/perpDexsExplorer'
import useMyProfile from 'hooks/store/useMyProfile'
import { HorizontalCarouselWrapper } from 'theme/Carousel/Wrapper'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatImageUrl } from 'utils/helpers/format'
import { logEventCompetition } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { checkNotEndedEvent, renderEventTime, sortEvents } from '../helpers/eventsHelper'

const settings: Settings = {
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
}
export default function PerpDEXsEventOverview() {
  const { data: perpDEXEvent } = useQuery([QUERY_KEYS.GET_PERP_DEX_EVENT], getPerpDexEventApi)
  const { featuringEvents, commonEvents } = (perpDEXEvent ?? [])
    .filter((event) => checkNotEndedEvent(event.startTime, event.endTime))
    .reduce<{
      featuringEvents: PerpDEXEventResponse[]
      commonEvents: PerpDEXEventResponse[]
    }>(
      (acc, event) => {
        if (event.isFeaturing) {
          acc.featuringEvents.push(event)
        } else {
          acc.commonEvents.push(event)
        }
        return acc
      },
      { featuringEvents: [], commonEvents: [] }
    )

  const sortedFeatEvents = sortEvents(featuringEvents)
  const sortedCommonEvents = sortEvents(commonEvents)

  const { lg } = useResponsive()

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        borderLeft: 'small',
        borderLeftColor: 'neutral4',
      }}
    >
      <Flex px={3} sx={{ alignItems: 'center', my: '10px', gap: 2 }}>
        {lg ? (
          <>
            <IconBox icon={<ShootingStar size={24} weight={'fill'} />} sx={{ color: 'neutral3' }} />
            <Type.BodyBold color="neutral1">Events</Type.BodyBold>
          </>
        ) : (
          <Type.BodyBold color="neutral1">PERP EVENTS</Type.BodyBold>
        )}
      </Flex>
      <FeaturingEvents events={sortedFeatEvents} />
      <CommonEvents events={sortedCommonEvents} />
    </Flex>
  )
}
function FeaturingEvents({ events }: { events: PerpDEXEventResponse[] }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <HorizontalCarouselWrapper>
        <Slider {...settings}>
          {events?.map((event) => {
            return <EventItem key={event.id} eventDetails={event} />
          })}
        </Slider>
      </HorizontalCarouselWrapper>
    </Box>
  )
}
function EventItem({ eventDetails }: { eventDetails: PerpDEXEventResponse }) {
  const { myProfile } = useMyProfile()
  const eventLink = eventDetails?.link
  return (
    <Box height={140} sx={{ margin: '0 auto', maxHeight: '140px' }}>
      <Box
        role="button"
        as={eventLink ? 'a' : 'div'}
        href={eventLink ? `${eventLink}` : undefined}
        target="_blank"
        onClick={() => {
          logEventCompetition({
            event: EVENT_ACTIONS[EventCategory.COMPETITION].HOME_CLICK_BANNER,
            username: myProfile?.username,
          })
        }}
        sx={{ borderBottom: 'small', borderBottomColor: 'neutral4', position: 'relative' }}
      >
        <Image
          src={eventDetails?.banner ? formatImageUrl(eventDetails?.banner) : homeEventBanner}
          sx={{ objectFit: 'cover', height: '100%', width: '100%', aspectRatio: '342/140' }}
        />
      </Box>
    </Box>
  )
}
function CommonEvents({ events }: { events: PerpDEXEventResponse[] }) {
  return events?.length ? (
    <Flex
      // mt={3}
      px={3}
      sx={{
        flexDirection: 'column',
        // gap: 3,
        flex: '1 0 0',
        overflow: 'auto',
        '& > *:last-child': { border: 'none' },
      }}
    >
      {events.map((data) => {
        const { startTime, endTime, perpdex, protocolName, link, title, id } = data
        return (
          <Box key={id} sx={{ py: 3, borderBottom: 'small', borderBottomColor: 'neutral4' }}>
            <Flex
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex sx={{ gap: 2, alignItems: 'center' }}>
                {/* {data.featuringScore} */}

                {renderLogo(data)}
                {/* {`start: ${new Date(startTime).toLocaleDateString('en-GB')}, end: ${new Date(
                  endTime
                ).toLocaleDateString('en-GB')}`} */}
                <Type.CaptionBold color="neutral1">{protocolName || perpdex.name}</Type.CaptionBold>
              </Flex>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <Type.Small color="neutral3">{renderEventTime(startTime, endTime)}</Type.Small>
                <IconBox
                  role="button"
                  as={link ? 'a' : 'div'}
                  href={link ? `${link}` : undefined}
                  target="_blank"
                  icon={<ArrowSquareOut size={16} weight={'regular'} />}
                  sx={{ cursor: 'pointer', color: 'neutral3' }}
                />
              </Flex>
            </Flex>
            <Type.Caption color="neutral2">{title}</Type.Caption>
          </Box>
        )
      })}
    </Flex>
  ) : null
}
const renderLogo = (perpDex: PerpDEXEventResponse) => {
  const { protocol, perpdex } = perpDex

  if (protocol) {
    return <ProtocolLogo protocol={protocol} size={24} hasText={false} />
  }

  return <PerpDexLogo perpDex={perpdex.perpdex} size={24} />
}
