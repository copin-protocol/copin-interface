import { Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import ProtocolLogo from '../ProtocolLogo'

export default function ProtocolGroup({
  protocols,
  size = 20,
  limit = 3,
  sx,
}: {
  protocols: ProtocolEnum[] | undefined
  size?: number
  limit?: number
  gap?: number
  sx?: any
}) {
  if (!protocols?.length) return null
  const numberOfProtocols = protocols.length
  return (
    <Flex sx={{ position: 'relative', height: size, ...sx }}>
      {protocols.slice(0, limit).map((_protocol) => {
        return <ProtocolLogo key={_protocol} hasText={false} protocol={_protocol} size={21} />
      })}
      {/* {numberOfProtocols <= limit && <Box width={size / 2} />} */}
      {numberOfProtocols > limit ? (
        <>
          <Flex
            sx={{
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '40px',
              bg: 'neutral5',
              border: 'small',
              borderColor: 'neutral4',
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
              fontSize="11px"
              sx={{
                ...(numberOfProtocols - limit > 99 ? { fontSize: '10px', lineHeight: '12px' } : {}),
              }}
            >{`+${numberOfProtocols - limit}`}</Type.Caption>
          </Flex>
        </>
      ) : null}
    </Flex>
  )
}
