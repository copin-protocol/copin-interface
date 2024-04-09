import { SystemStyleObject } from '@styled-system/css'
import { GridProps } from 'styled-system'

import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import Market from './Market'

export default function MarketGroup({
  protocol,
  indexTokens,
  size = 20,
  limit = 3,
  hasName = true,
  sx,
}: {
  protocol: ProtocolEnum
  indexTokens: string[]
  size?: number
  limit?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const numberOfAddress = indexTokens?.length
  if (!numberOfAddress) return <></>
  const tooltipId = protocol + indexTokens?.join('_')
  return (
    <Flex sx={{ position: 'relative', height: size, ...sx }}>
      {indexTokens.slice(0, limit).map((indexToken) => {
        return (
          <Box
            key={indexToken}
            sx={{
              width: size / 1.5,
              height: size,
            }}
          >
            <Market protocol={protocol} indexToken={indexToken} size={size} />
          </Box>
        )
      })}
      {numberOfAddress <= limit && <Box width={size / 2} />}
      {numberOfAddress > limit ? (
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
                ...(numberOfAddress - limit > 99 ? { fontSize: '10px', lineHeight: '12px' } : {}),
              }}
            >{`+${numberOfAddress - limit}`}</Type.Caption>
          </Flex>
          <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable>
            <MarketGroupFull
              protocol={protocol}
              indexTokens={indexTokens}
              hasName={hasName}
              sx={{ maxWidth: 400, maxHeight: 350, overflowY: 'auto' }}
            />
          </Tooltip>
        </>
      ) : null}
    </Flex>
  )
}

export function MarketGroupFull({
  protocol,
  indexTokens,
  size = 20,
  hasName = true,
  sx,
}: {
  protocol: ProtocolEnum
  indexTokens: string[]
  size?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const numberOfAddress = indexTokens?.length
  if (!numberOfAddress) return <></>
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr 1fr 1fr 1fr', '1fr 1fr 1fr 1fr'],
        gap: '6px',
        ...sx,
      }}
    >
      {indexTokens.map((indexToken) => {
        return <Market key={indexToken} protocol={protocol} indexToken={indexToken} size={size} hasName={hasName} />
      })}
    </Box>
  )
}
