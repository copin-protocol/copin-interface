import AddressAvatar from 'components/@ui/AddressAvatar'
import { Box, Flex, Type } from 'theme/base'

export default function AvatarGroup({
  addresses,
  size = 30,
  limit = 5,
}: {
  addresses: string[]
  size?: number
  limit?: number
}) {
  const numberOfAddress = addresses.length
  const width = (((numberOfAddress <= limit ? numberOfAddress : limit + 1) + 1) * size) / 2
  if (!numberOfAddress) return <></>
  return (
    <Box sx={{ position: 'relative', height: size, width }}>
      {addresses.slice(0, limit).map((address, index) => {
        return (
          <Box key={address} sx={{ position: 'absolute', top: 0, left: (index * size) / 2, width: size, height: size }}>
            <AddressAvatar size={size} address={address} />
          </Box>
        )
      })}
      {numberOfAddress > limit ? (
        <Flex
          sx={{
            width: size,
            height: size,
            position: 'absolute',
            top: 0,
            left: (limit * size) / 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bg: 'neutral4',
            border: 'small',
            borderColor: 'neutral1',
          }}
        >
          <Type.Caption sx={numberOfAddress - limit > 99 ? { fontSize: '12px', lineHeight: '12px' } : {}}>{`+${
            numberOfAddress - limit
          }`}</Type.Caption>
        </Flex>
      ) : null}
    </Box>
  )
}
