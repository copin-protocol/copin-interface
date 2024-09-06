import styled from 'styled-components/macro'

import { Box, Flex, Type } from 'theme/base'

export default function EventButton() {
  return (
    <Flex sx={{ height: '100%', alignItems: 'center' }}>
      <ButtonWrapper>
        <Box className="background" />
        <Box className="overlay" />
        <Type.CaptionBold
          color="neutral7"
          sx={{
            position: 'relative',
            zIndex: 2,
            height: 40,
            lineHeight: '40px',
            px: 20,
            transition: '0.3s',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
        >
          <GradientText>Events 🏆</GradientText>
        </Type.CaptionBold>
      </ButtonWrapper>
    </Flex>
  )
}

export const ButtonWrapper = styled(Box)`
  position: relative;
  @supports (-webkit-background-clip: text) and (-webkit-text-fill-color: transparent) {
    & .background {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: 400%;
      background: linear-gradient(90deg, #abeca2 -1.42%, #2fb3fe 30.38%, #6a8eea 65.09%, #a185f4 99.55%);
      border-radius: 4px;
    }
    & .overlay {
      position: absolute;
      z-index: 1;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      border-radius: 4px;
      background: ${({ theme }) => theme.colors.neutral7};
    }
  }
  animation: event_text_ani 30s linear infinite;
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
