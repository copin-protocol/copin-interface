import { Clock, ClockCounterClockwise } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import useGlobalStore from 'hooks/store/useGlobalStore'
import { Box, IconBox } from 'theme/base'

export default function TimeColumnTitleWrapper({ children }: { children: ReactNode }) {
  const [positionTimeType, setPositionTimeType] = useGlobalStore((s) => [s.positionTimeType, s.setPositionTimeType])
  const Icon = positionTimeType === 'relative' ? ClockCounterClockwise : Clock
  return (
    <Box as="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box as="span">{children}</Box>
      <IconBox
        iconColor="inherit"
        icon={<Icon size={16} />}
        sx={{ '&:hover': { color: 'neutral2' }, cursor: 'pointer' }}
        onClick={() => setPositionTimeType(positionTimeType === 'absolute' ? 'relative' : 'absolute')}
      />
    </Box>
  )
}
