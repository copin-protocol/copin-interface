import { Flex } from 'theme/base'

const Badge = ({
  count,
  sx,
  type = 'default',
}: {
  count: number | string
  sx?: any
  type?: 'default' | 'warning' | 'danger'
}) => {
  let bg, color, borderColor
  switch (type) {
    case 'warning':
      color = 'orange1'
      break
    case 'danger':
      color = 'red2'
      break
    default:
      color = 'neutral2'
      break
  }
  return (
    <Flex
      alignItems="center"
      sx={{
        bg: 'rgba(255,255,255,0.05)',
        color,
        border: '0.5px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 'xs',
        px: '4px',
        lineHeight: '20px',
        fontSize: '12px',
        height: '20px',
        width: 'fit-content',
        ...sx,
      }}
    >
      {count}
    </Flex>
  )
}

export default Badge
