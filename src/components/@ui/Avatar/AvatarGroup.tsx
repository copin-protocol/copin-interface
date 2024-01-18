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
  if (!numberOfAddress) return <></>
  return (
    <Flex sx={{ position: 'relative', height: size }}>
      {addresses.slice(0, limit).map((address) => {
        return (
          <Box
            key={address}
            sx={{
              width: size / 2,
              height: size,
            }}
          >
            <AddressAvatar size={size} address={address} />
          </Box>
        )
      })}
      {numberOfAddress <= limit && <Box width={size / 2} />}
      {numberOfAddress > limit ? (
        <Flex
          sx={{
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '40px',
            bg: 'neutral4',
            border: 'small',
            borderColor: 'neutral1',
            minWidth: size,
            px: '2px',
          }}
        >
          <Type.Caption
            style={{
              position: 'relative',
              wordBreak: 'unset',
              textAlign: 'center',
              overflowWrap: 'unset',
            }}
            sx={{
              ...(numberOfAddress - limit > 99 ? { fontSize: '12px', lineHeight: '12px' } : {}),
            }}
          >{`+${numberOfAddress - limit}`}</Type.Caption>
        </Flex>
      ) : null}
    </Flex>
  )
}
