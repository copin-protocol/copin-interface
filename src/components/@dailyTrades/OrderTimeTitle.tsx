import { Clock, ClockCounterClockwise } from '@phosphor-icons/react'

import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'
import { Box, IconBox } from 'theme/base'

export default function OrderTimeTitle() {
  const { timeType, changeTimeType } = useDailyOrdersContext()
  const Icon = timeType === 'relative' ? ClockCounterClockwise : Clock
  return (
    <Box as="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box as="span">Timestamp</Box>
      <IconBox
        iconColor="inherit"
        icon={<Icon size={16} />}
        sx={{ '&:hover': { color: 'neutral2' }, cursor: 'pointer' }}
        onClick={() => changeTimeType()}
      />
    </Box>
  )
}
