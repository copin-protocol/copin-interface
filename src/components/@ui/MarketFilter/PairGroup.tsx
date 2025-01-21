import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'

import Market from '../MarketGroup/Market'

export default function PairGroup({
  pairs,
  size = 20,
  limit = 3,
  hasName = true,
  sx,
}: {
  pairs: string[]
  size?: number
  limit?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const tooltipId = useMemo(() => uuid(), [])
  const numberOfSymbols = pairs?.length

  if (!numberOfSymbols) return <></>
  return (
    <Flex sx={{ position: 'relative', height: size, ...sx }}>
      {pairs.slice(0, limit).map((pair) => {
        return (
          <Box
            key={pair}
            sx={{
              width: size / 1.5,
              height: size,
            }}
          >
            <Market symbol={pair} size={size} hasTooltip={numberOfSymbols <= limit} />
          </Box>
        )
      })}
      {numberOfSymbols <= limit && <Box width={size / 2} />}
      {numberOfSymbols > limit ? (
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
                ...(numberOfSymbols - limit > 99 ? { fontSize: '10px', lineHeight: '12px' } : {}),
              }}
            >{`+${numberOfSymbols - limit}`}</Type.Caption>
          </Flex>
          <Tooltip id={tooltipId} clickable>
            <PairGroupFull pairs={pairs} hasName={hasName} sx={{ maxWidth: 400, maxHeight: 350, overflowY: 'auto' }} />
          </Tooltip>
        </>
      ) : null}
    </Flex>
  )
}

export function PairGroupFull({
  pairs,
  size = 20,
  hasName = true,
  sx,
}: {
  pairs: string[]
  size?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const numberOfSymbols = pairs?.length
  if (!numberOfSymbols) return <></>
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: '6px',
        ...sx,
      }}
    >
      {pairs.map((pair) => {
        return <Market key={pair} symbol={pair} size={size} hasName={hasName} />
      })}
    </Box>
  )
}
