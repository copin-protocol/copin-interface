import { CaretDown, CaretLeft, CaretRight, CaretUp } from '@phosphor-icons/react'

import IconButton from 'theme/Buttons/IconButton'

function DirectionButton({
  onClick,
  direction,
  buttonSx = {},
}: {
  onClick: () => void
  direction: 'left' | 'right' | 'bottom' | 'top'
  buttonSx?: any
}) {
  let sx = { border: 'small', borderColor: 'neutral4' } as any
  let Icon = CaretRight
  switch (direction) {
    case 'right':
      sx = {
        ...sx,
        borderRadius: '0px 4px 4px 0px',
        width: 16,
        height: 41,
        borderLeft: 'none',
      }
      break
    case 'left':
      Icon = CaretLeft
      sx = {
        ...sx,
        borderRadius: '4px 0px 0px 4px',
        width: 16,
        height: 41,
        borderRight: 'none',
      }
      break
    case 'top':
      Icon = CaretUp
      sx = {
        ...sx,
        borderRadius: '4px 4px 0px 0px',
        width: 40,
        height: 16,
        borderBottom: 'none',
      }
      break
    case 'bottom':
      Icon = CaretDown
      sx = {
        ...sx,
        borderRadius: '0px 0px 4px 4px',
        width: 40,
        height: 16,
        borderTop: 'none',
      }
      break
    default:
      break
  }
  return (
    <IconButton
      icon={<Icon size={16} />}
      variant="outline"
      onClick={onClick}
      sx={{
        position: 'absolute',
        zIndex: 3,
        bg: 'neutral7',
        color: 'neutral3',
        '&:hover:not([disabled])': {
          borderColor: 'neutral4',
          color: 'neutral1',
        },
        ...sx,
        ...buttonSx,
      }}
    />
  )
}

export default DirectionButton
