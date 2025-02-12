import styled from 'styled-components/macro'

import { Box } from 'theme/base'

export const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  background: neutral7;
  padding-left: 16px;
  border-bottom: small;
  border-bottom-color: neutral4;
  @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) or (-moz-backdrop-filter: blur(20px)) {
    background: neutral7;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    -mox-backdrop-filter: blur(20px);
  }
`

// Base search result that can be extended
export const SearchResult = styled<any>(Box)`
  position: absolute;
  top: 48px;
  left: 0;
  border-radius: 4px;
  width: 100%;
  border: 1px solid neutral4;
  z-index: 4;
  max-height: 80vh;
  overflow: auto;
`
