import { Flex } from 'theme/base'

const Badge = ({ count }: { count: number }) => {
  return (
    <Flex
      alignItems="center"
      sx={{
        bg: 'rgba(255,255,255,0.05)',
        color: 'neutral2',
        border: '0.5px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 'xs',
        px: '4px',
        lineHeight: '20px',
        fontSize: '12px',
        height: '20px',
        width: 'fit-content',
      }}
    >
      {count}
    </Flex>
  )
}

export default Badge
