import styled from 'styled-components/macro'

import colors from 'assets/images/subscription-colors.png'
import grid from 'assets/images/subscription-grid.png'
import { Box, Type } from 'theme/base'

export const PlanRowWrapper = styled(Box)`
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`

export const SubscriptionGrid = styled(Box)`
  background-image: url(${grid});
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`
export const SubscriptionColors = styled(Box)`
  opacity: 0.6;
  background-image: url(${colors});
  background-position: 50%;
  background-size: contain;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: rotate(0deg);
  animation: ani_colors 20s linear infinite;

  @keyframes ani_colors {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
export const SubscriptionTitle = styled(Type.H1)`
  background: linear-gradient(221.71deg, #fcfcfd 35.89%, rgba(252, 252, 253, 0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2px;
`
