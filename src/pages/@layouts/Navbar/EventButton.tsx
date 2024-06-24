import styled from 'styled-components/macro'

import { Box, Flex, Type } from 'theme/base'

export default function EventButton() {
  return (
    <Flex sx={{ height: '100%' }}>
      <Type.CaptionBold>
        <GradientText>Event $50k</GradientText> 🏆
      </Type.CaptionBold>
    </Flex>
  )
}

export const GradientText = styled(Box).attrs({ as: 'span' })`
  color: ${({ theme }) => theme.colors.neutral1};
  @supports (-webkit-background-clip: text) and (-webkit-text-fill-color: transparent) {
    background: linear-gradient(90deg, #abeca2 -1.42%, #2fb3fe 30.38%, #6a8eea 65.09%, #a185f4 99.55%);
    background-size: 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  animation: event_text_ani 5s linear infinite;
  @keyframes event_text_ani {
    0% {
      background-position: 0 0;
    }
    25% {
      background-position: 100% 0;
    }
    50% {
      background-position: 100% 100%;
    }
    75% {
      background-position: 0 100%;
    }
    100% {
      background-position: 0 0;
    }
  }
`
