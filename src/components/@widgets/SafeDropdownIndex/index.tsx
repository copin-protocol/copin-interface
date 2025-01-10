import { createGlobalStyle } from 'styled-components/macro'

import { Z_INDEX } from 'utils/config/zIndex'

const SafeDropdownIndex = createGlobalStyle`
  .rc-dropdown {
    z-index: ${Z_INDEX.TOASTIFY + 1};
  }
`

export default SafeDropdownIndex
