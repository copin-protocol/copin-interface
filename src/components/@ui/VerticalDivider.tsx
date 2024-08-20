import styled from 'styled-components/macro'

import { Box } from 'theme/base'

export const VerticalDivider = styled(Box)`
  flex-shrink: 0;
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.neutral3};
`
