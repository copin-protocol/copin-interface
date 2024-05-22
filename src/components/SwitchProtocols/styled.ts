import styled from 'styled-components/macro'

import { Box } from 'theme/base'

export const SearchWrapper = styled<any>(Box)`
  position: relative;
`

export const SearchResult = styled<any>(Box)`
  position: absolute;
  top: 48px;
  left: 0;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.neutral6};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral4};
  border-top: none;
  z-index: 4;
  max-height: 80vh;
  overflow: auto;
`

export const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  background: ${({ theme }) => `${theme.colors.neutral7}`};
  padding-left: 16px;
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.neutral4}`};
  @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) or (-moz-backdrop-filter: blur(20px)) {
    background: ${({ theme }) => `${theme.colors.neutral7}`};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    -mox-backdrop-filter: blur(20px);
  }
`
