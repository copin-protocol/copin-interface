import { Trans } from '@lingui/react'
import { RocketLaunch, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { LiteText } from 'pages/@layouts/Navbar/NavLinks'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex } from 'theme/base'
import ROUTES from 'utils/config/routes'
import { logEventLite } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function CtaPremium() {
  // const [isVisible, setIsVisible] = useState(true)

  // if (!isVisible) return null

  return (
    <Flex
      width="100%"
      justifyContent={'center'}
      alignItems={'center'}
      py={9}
      sx={{
        m: '0 auto',
        background: 'rgba(78, 174, 253, 0.1)',
        borderTop: '1px solid',
        borderColor: 'rgba(49, 56, 86, 1)',
        position: 'relative',
      }}
    >
      <svg width="0" height="0">
        <linearGradient id="gradient" x1="22.88%" y1="0%" x2="73.32%" y2="100%">
          <stop stopColor="#ffc24b" offset="0%" />
          <stop stopColor="#02ffe8" offset="100%" />
        </linearGradient>
      </svg>
      <Box
        as={Link}
        to={ROUTES.SUBSCRIPTION.path}
        onClick={() =>
          logEventLite({
            event: EVENT_ACTIONS[EventCategory.LITE].LITE_UPGRADE,
          })
        }
      >
        <GradientText fontSize={['10px', '12px']}>
          <RocketLaunch size={16} />
          <UnderlinedText>Upgrade</UnderlinedText>
          <Box>to reach more traders & more insights</Box>
        </GradientText>
      </Box>
      {/* <IconButton
        variant="ghost"
        icon={
          <X
            size={16}
            onClick={(e) => {
              e.preventDefault()
              setIsVisible(false)
            }}
          />
        }
        sx={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      /> */}
    </Flex>
  )
}

const GradientText = styled(LiteText)`
  display: inline-flex;
  align-items: center;
  svg {
    fill: url(#gradient);
    vertical-align: middle;
    margin-right: 4px;
  }
`

const UnderlinedText = styled.span`
  background: linear-gradient(93.49deg, #ffc24b 22.88%, #02ffe8 73.32%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
  margin-right: 4px;

  &::after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 0.5px;
    background: linear-gradient(93.49deg, #ffc24b 22.88%, #02ffe8 73.32%);
  }
`
