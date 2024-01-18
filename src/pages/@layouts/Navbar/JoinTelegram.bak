import React from 'react'

import useIsMobile from 'hooks/helpers/useIsMobile'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS, NAVBAR_HEIGHT } from 'utils/config/constants'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const JoinTelegram = () => {
  const { myProfile } = useMyProfile()
  const isMobile = useIsMobile()
  const size = isMobile ? 32 : 40
  return (
    <Button
      as={'a'}
      href={LINKS.telegram}
      target="_blank"
      type="button"
      variant="ghost"
      sx={{
        height: NAVBAR_HEIGHT,
        gap: 2,
        bg: 'rgba(45, 161, 218, 0.9)',
        px: 12,
        py: 10,
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        '&:hover:not(:disabled),&:active:not(:disabled)': {
          color: 'neutral1',
          bg: 'rgba(45, 161, 218, 1)',
        },
      }}
      onClick={() => {
        logEvent({
          category: EventCategory.ROUTES,
          action: EVENT_ACTIONS[EventCategory.ROUTES].JOIN_TELEGRAM,
          label: getUserForTracking(myProfile?.username),
        })
      }}
    >
      <Box sx={{ position: 'relative', animation: 'zoomInZoomOut 10s infinite' }}>
        <IconBox
          icon={<TelegramIcon size={size} variant="Bold" />}
          // sx={{
          //   width: size,
          //   height: size,
          //   animation: 'delaySpin',
          //   animationDuration: '10s',
          //   animationTimingFunction: 'ease',
          //   animationIterationCount: 'infinite',
          // }}
        />
      </Box>
      {!isMobile && (
        <Flex
          flexDirection="column"
          sx={{
            gap: 1,
          }}
        >
          <Type.Caption lineHeight="13px">Join Our</Type.Caption>
          <Type.BodyBold lineHeight="16px">Telegram</Type.BodyBold>
        </Flex>
      )}
    </Button>
  )
}

export default JoinTelegram
