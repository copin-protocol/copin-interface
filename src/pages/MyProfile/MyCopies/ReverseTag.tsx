import { ArrowUUpLeft } from '@phosphor-icons/react'

import { Box } from 'theme/base'
import { TOOLTIP_KEYS } from 'utils/config/keys'

const ReverseTag = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -16,
        left: -8,
        color: 'neutral8',
        p: '2px',
        overflow: 'hidden',
      }}
      width={40}
      height={40}
      data-tooltip-id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}
    >
      <Box
        sx={{
          content: '',
          position: 'absolute',
          bg: 'orange1',
          width: 80,
          height: 80,
          top: -52,
          left: -50,
          zIndex: 0,
          transform: 'rotate(45deg)',
        }}
      ></Box>
      <ArrowUUpLeft size={16} style={{ position: 'relative', zIndex: 1 }} weight="bold" />
    </Box>
  )
}

export default ReverseTag
