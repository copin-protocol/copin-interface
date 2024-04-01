import { Box, Flex, Image } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { parseProtocolImage } from 'utils/helpers/transform'

import ExplorerLogo from './ExplorerLogo'

export default function ProtocolWithChainIcon({ protocol, size = 18 }: { protocol: ProtocolEnum; size?: number }) {
  return (
    <Box sx={{ position: 'relative', height: 'auto' }}>
      <Flex sx={{ borderRadius: '50%', p: '6px', border: 'small', borderColor: 'primary1' }}>
        <Image src={parseProtocolImage(protocol)} width={size} height={size} sx={{ overflow: 'hidden' }} />
      </Flex>
      <ExplorerLogo
        protocol={protocol}
        size={16}
        sx={{ filter: 'none', position: 'absolute', top: '-4px', right: '-6px' }}
      />
    </Box>
  )
}
