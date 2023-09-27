import { CaretUp } from '@phosphor-icons/react'
import React from 'react'

import { Box } from 'theme/base'

const LayoutCollapseButton = ({ collapsing, toggleCollapse }: { collapsing: boolean; toggleCollapse: () => void }) => {
  return (
    <Box
      role="button"
      onClick={toggleCollapse}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: collapsing ? 0 : -17,
        left: 'calc(50% - 20px)',
        bg: collapsing ? 'neutral5' : 'neutral7',
        color: 'neutral3',
        px: 12,
        pb: 0,
        borderTopLeftRadius: 'sm',
        borderTopRightRadius: 'sm',
        lineHeight: 0,
        border: 'small',

        borderColor: 'neutral4',
        borderBottom: 'none',
        transform: `rotate(${collapsing ? 180 : 0}deg)`,
      }}
    >
      <CaretUp
        size={16}
        style={{
          position: 'relative',
          top: 2,
          lineHeight: 0,
        }}
      />
    </Box>
  )
}

export default LayoutCollapseButton
