import React from 'react'

import useIsMobile from 'hooks/helpers/useIsMobile'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import DiscordIcon from 'theme/Icons/DiscordIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS, NAVBAR_HEIGHT } from 'utils/config/constants'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const JoinDiscord = () => {
  const { myProfile } = useMyProfile()
  const isMobile = useIsMobile()
  const size = 40
  return (
    <Button
      as={'a'}
      href={LINKS.discord}
      target="_blank"
      type="button"
      variant="ghost"
      sx={{
        height: NAVBAR_HEIGHT,
        gap: 12,
        bg: '#5765F2',
        px: 3,
        py: 10,
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={() => {
        logEvent({
          category: EventCategory.ROUTES,
          action: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_DISCORD,
          label: getUserForTracking(myProfile?.username),
        })
      }}
    >
      <Box sx={{ position: 'relative', animation: 'zoomInZoomOut 10s infinite' }}>
        <IconBox
          icon={<DiscordIcon size={size} variant="Bold" />}
          sx={{
            width: size,
            height: size,
            animation: 'delaySpin',
            animationDuration: '10s',
            animationTimingFunction: 'ease',
            animationIterationCount: 'infinite',
          }}
        />
      </Box>
      {!isMobile && (
        <Flex flexDirection="column" sx={{ gap: 1 }}>
          <Type.Caption lineHeight="13px">Join Our</Type.Caption>
          <Type.BodyBold lineHeight="16px">Discord</Type.BodyBold>
        </Flex>
      )}
    </Button>
  )
}

export default JoinDiscord
