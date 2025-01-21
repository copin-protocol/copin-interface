import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import Market from './Market'

export default function MarketGroup({
  protocol,
  indexTokens,
  symbols,
  size = 20,
  limit = 3,
  hasName = true,
  sx,
  imageUriFactory,
}: {
  protocol?: ProtocolEnum
  indexTokens?: string[]
  symbols?: string[]
  size?: number
  limit?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
  imageUriFactory?: (symbol: string) => string
}) {
  const { getListSymbolByListIndexToken } = useMarketsConfig()
  const tooltipId = useMemo(() => uuid(), [])
  const _symbols = symbols
    ? symbols
    : indexTokens && protocol
    ? getListSymbolByListIndexToken({ protocol, listIndexToken: indexTokens })
    : []
  const numberOfAddress = _symbols ? _symbols.length : indexTokens?.length
  if (!numberOfAddress) return <></>

  return (
    <Flex sx={{ position: 'relative', height: size, ...sx }}>
      {_symbols.slice(0, limit).map((symbol) => {
        return (
          <Box
            key={symbol}
            sx={{
              width: size / 1.5,
              height: size,
            }}
          >
            <Market
              symbol={symbol}
              size={size}
              hasTooltip={numberOfAddress <= limit}
              imageUriFactory={imageUriFactory}
            />
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
                height: `${size}px`,
                lineHeight: `${size}px`,
              }}
              fontSize="11px"
              sx={{
                ...(numberOfAddress - limit > 99 ? { fontSize: '10px' } : {}),
              }}
            >{`+${numberOfAddress - limit}`}</Type.Caption>
          </Flex>
          <Tooltip id={tooltipId} clickable>
            <MarketGroupFull
              protocol={protocol}
              indexTokens={indexTokens}
              symbols={symbols}
              hasName={hasName}
              sx={{ maxWidth: 400, maxHeight: 350, overflowY: 'auto' }}
              imageUriFactory={imageUriFactory}
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
  symbols,
  size = 20,
  hasName = true,
  sx,
  imageUriFactory,
}: {
  protocol?: ProtocolEnum
  indexTokens?: string[]
  symbols?: string[]
  size?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
  imageUriFactory?: (symbol: string) => string
}) {
  const { getListSymbolByListIndexToken } = useMarketsConfig()
  const numberOfAddress = symbols ? symbols.length : indexTokens?.length
  if (!numberOfAddress) return <></>
  const _symbols = symbols
    ? symbols
    : indexTokens && protocol
    ? getListSymbolByListIndexToken({ protocol, listIndexToken: indexTokens })
    : []
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: '6px',
        ...sx,
      }}
    >
      {_symbols.map((symbol) => {
        return <Market key={symbol} symbol={symbol} size={size} hasName={hasName} imageUriFactory={imageUriFactory} />
      })}
    </Box>
  )
}
