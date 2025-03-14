import { useState } from 'react'
import { Link } from 'react-router-dom'

import Divider from 'components/@ui/Divider'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { Box, Flex, Type } from 'theme/base'
import { DCP_SUPPORTED_PROTOCOLS } from 'utils/config/constants'
import { EventTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'

export default function EventTradingProtocols({ type }: { type?: EventTypeEnum }) {
  const [protocolHovered, setProtocolHovered] = useState<ProtocolEnum | undefined>()

  if (type !== EventTypeEnum.GNS) return <></>

  return (
    <Flex mt={3} flexDirection="column" alignItems="center">
      <Divider width="100%" isDashed />
      <Type.Caption mt={12} color="primary1">
        Copy trades from traders on the following perpetual DEXs
      </Type.Caption>
      <Flex mt={2} alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ gap: 3 }}>
        {DCP_SUPPORTED_PROTOCOLS.map((protocol: ProtocolEnum) => {
          return (
            <Box
              key={protocol}
              as={Link}
              to={generateExplorerRoute({ protocol })}
              sx={{ cursor: 'pointer' }}
              onMouseEnter={() => setProtocolHovered(protocol)}
              onMouseLeave={() => setProtocolHovered(undefined)}
            >
              <ProtocolLogo protocol={protocol} isActive={protocol === protocolHovered} hasText={false} size={24} />
            </Box>
          )
        })}
      </Flex>
    </Flex>
  )
}
