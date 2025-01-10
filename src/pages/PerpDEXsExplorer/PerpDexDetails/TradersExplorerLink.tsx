import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import { Box } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'

export default function TradersExplorerLink({
  protocolData,
  perpdexData,
}: {
  perpdexData: PerpDEXSourceResponse | undefined
  protocolData: any
}) {
  let explorerProtocol: ProtocolEnum | undefined
  if (perpdexData) {
    const protocol = perpdexData.protocols[0]
    if (protocol) explorerProtocol = protocol
  }
  if (protocolData) {
    explorerProtocol = protocolData.protocol
  }
  if (!explorerProtocol) return null
  return (
    <Box
      as={Link}
      to={generateExplorerRoute({ protocol: explorerProtocol })}
      sx={{ fontSize: '13px', lineHeight: '24px', color: 'neutral2', '&:hover': { color: 'neutral1' } }}
    >
      <Trans>TRADER EXPLORER</Trans>
    </Box>
  )
}
