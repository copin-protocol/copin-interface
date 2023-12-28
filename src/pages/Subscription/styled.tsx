import styled from 'styled-components/macro'

import colors from 'assets/images/subscription-colors.png'
import grid from 'assets/images/subscription-grid.png'
import { Box } from 'theme/base'

export const PlanRowWrapper = styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: 236px 1fr 294px;
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
