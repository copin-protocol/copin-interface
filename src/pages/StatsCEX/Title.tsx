import { Trans } from '@lingui/macro'

import { Type } from 'theme/base'

export default function CexDepthTitle() {
  return (
    <Type.H5 color="neutral8" maxWidth="fit-content" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
      <Trans>CEX Depth</Trans>
    </Type.H5>
  )
}
