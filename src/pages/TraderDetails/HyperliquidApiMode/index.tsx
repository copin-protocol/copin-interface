import Divider from 'components/@ui/Divider'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import HLChartPnL from './HLChartPnL'
import HLOverview from './HLOverview'

export default function HyperliquidApiMode({ address, protocol }: { address: string; protocol: ProtocolEnum }) {
  return (
    <Flex
      flexDirection="column"
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <HLChartPnL />
      <Divider />
      <Box flex={1}>
        <HLOverview />
      </Box>
    </Flex>
  )
}
