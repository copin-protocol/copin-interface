import { Trans } from '@lingui/macro'
import { ArrowSquareOut, ShootingStar } from '@phosphor-icons/react'
import Slider, { Settings } from 'react-slick'

import noEventImage from 'assets/images/no-event.png'
import Icon from 'components/@widgets/IconGroup/Icon'
import { PerpDEXEventResponse } from 'entities/perpDexsExplorer'
import { HorizontalCarouselWrapper } from 'theme/Carousel/Wrapper'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { parsePerpdexImage, parsePlainProtocolImage } from 'utils/helpers/transform'

import { renderEventTime } from '../helpers/eventsHelper'

export default function Events({
  isLoading,
  events,
}: {
  isLoading: boolean
  events: PerpDEXEventResponse[] | undefined
}) {
  if (!events?.length) return null

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Flex px={3} sx={{ alignItems: 'center', gap: 2, position: 'absolute', left: 0, top: 0, height: 56, zIndex: 1 }}>
        <IconBox icon={<ShootingStar size={24} weight={'fill'} />} sx={{ color: 'neutral3' }} />
        <Type.Body color="neutral1" sx={{ fontWeight: 500 }}>
          Events / Incentives
        </Type.Body>
      </Flex>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundImage: 'linear-gradient(105.46deg, #111650 8.57%, #101423 38.44%, rgba(16, 20, 35, 0) 76.46%)',
        }}
      />
      {!isLoading && !events?.length && (
        <>
          {/* <Box
              sx={{
                position: 'absolute',
                pt: 4,
                pl: 3,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.5,
              }}
            >
              <BackgroundIcon perpdex={perpdexData.perpdex} protocol={protocolData?.protocol} />
            </Box> */}
          <Flex
            pt={40}
            width="100%"
            sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            <Image mb={12} src={noEventImage} width={80} />
            <Type.Caption color="neutral3">
              <Trans>Opp, No upcoming events.</Trans>
            </Type.Caption>
          </Flex>
        </>
      )}
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
  const { startTime, endTime, perpdex, protocol, protocolName, link, title, id } = eventDetails
  return (
    <Box height={172} sx={{ margin: '0 auto', maxHeight: 172, position: 'relative' }}>
      <Flex sx={{ p: 3, pt: 56, width: '100%', height: '100%', flexDirection: 'column' }}>
        <Box sx={{ position: 'absolute', pb: 2, pr: 2, bottom: 0, right: 0, zIndex: 1, opacity: 0.25 }}>
          <BackgroundIcon perpdex={perpdex.perpdex} protocol={protocol} />
        </Box>

        <Box
          as={link ? 'a' : 'div'}
          href={link ? `${link}` : undefined}
          target="_blank"
          sx={{ '&:hover': { '*:first-child': { textDecoration: 'underline' } } }}
        >
          <Type.Caption color="neutral1" sx={{ position: 'relative', zIndex: 2 }}>
            {title}
          </Type.Caption>

          <Flex mt={1} sx={{ alignItems: 'center', gap: 2, position: 'relative', zIndex: 2 }}>
            <Type.Small color="neutral3">{renderEventTime(startTime, endTime)}</Type.Small>
            <IconBox
              icon={<ArrowSquareOut size={16} weight={'regular'} />}
              sx={{ cursor: 'pointer', color: 'neutral3' }}
            />
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

function BackgroundIcon({ perpdex, protocol }: { perpdex: string; protocol: ProtocolEnum | undefined }) {
  return (
    <>
      {!!protocol ? (
        <Icon
          iconName={protocol}
          size={116}
          iconUriFactory={() => parsePlainProtocolImage(protocol, false)}
          hasBorder={false}
        />
      ) : (
        <Icon
          iconName={perpdex}
          size={116}
          iconUriFactory={() => parsePerpdexImage(perpdex, false)}
          hasBorder={false}
        />
      )}
    </>
  )
}

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
