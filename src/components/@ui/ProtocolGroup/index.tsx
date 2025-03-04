import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

export default function ProtocolGroup({
  protocols,
  size = 20,
  limit = 3,
  hasTooltip,
  sx,
}: {
  protocols: ProtocolEnum[] | undefined
  size?: number
  limit?: number
  gap?: number
  hasTooltip?: boolean
  sx?: any
}) {
  const tooltipId = useMemo(() => uuid(), [])
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
            data-tip="React-tooltip"
            data-tooltip-id={tooltipId}
            data-tooltip-delay-show={360}
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
          {hasTooltip && (
            <Tooltip id={tooltipId} clickable>
              <ProtocolGroupFull protocols={protocols} sx={{ maxWidth: 500, overflow: 'auto' }} />
            </Tooltip>
          )}
        </>
      ) : null}
    </Flex>
  )
}

export function ProtocolGroupFull({
  protocols,
  size = 20,
  sx,
}: {
  protocols?: ProtocolEnum[]
  size?: number
  sx?: SystemStyleObject & GridProps
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gap: '6px',
        ...sx,
      }}
    >
      {protocols?.map((protocol) => {
        return <ProtocolLogo key={protocol} hasText protocol={protocol} size={size} />
      })}
    </Box>
  )
}
