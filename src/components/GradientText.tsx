import styled from 'styled-components/macro'

import { Box } from 'theme/base'

export const GradientText = styled(Box).attrs({ as: 'span' })`
  color: ${({ theme }) => theme.colors.neutral8};
  @supports (-webkit-background-clip: text) and (-webkit-text-fill-color: transparent) {
    background: linear-gradient(221.71deg, #fcfcfd 35.89%, rgba(252, 252, 253, 0.18) 131.35%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`
