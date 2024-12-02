import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'

import Icon from './Icon'

export default function IconGroup({
  iconNames,
  size = 20,
  limit = 3,
  hasName = false,
  sx,
  iconUriFactory,
}: {
  iconNames: string[]
  iconUriFactory: (symbol: string) => string
  size?: number
  limit?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const tooltipId = useMemo(() => uuid(), [])
  const numberOfAddress = iconNames.length
  if (!numberOfAddress) return <></>
  return (
    <Flex sx={{ position: 'relative', height: size, flexShrink: 0, ...sx }}>
      {iconNames.slice(0, limit).map((iconName) => {
        return (
          <Box
            key={iconName}
            sx={{
              width: size / 1.3,
              height: size,
              flexShrink: 0,
            }}
          >
            <Icon iconName={iconName} size={size} hasTooltip iconUriFactory={iconUriFactory} />
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
              flexShrink: 0,
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
            <IconGroupFull
              iconNames={iconNames}
              hasName={hasName}
              sx={{ maxWidth: 400, maxHeight: 350, overflowY: 'auto' }}
              iconUriFactory={iconUriFactory}
            />
          </Tooltip>
        </>
      ) : null}
    </Flex>
  )
}

export function IconGroupFull({
  iconNames,
  size = 20,
  hasName = true,
  sx,
  iconUriFactory,
}: {
  iconNames: string[]
  size?: number
  hasName?: boolean
  sx?: SystemStyleObject & GridProps
  iconUriFactory: (iconName: string) => string
}) {
  const numberOfAddress = iconNames.length
  if (!numberOfAddress) return <></>
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: '6px',
        ...sx,
      }}
    >
      {iconNames.map((iconName) => {
        return (
          <Icon
            key={iconName}
            iconName={iconName}
            size={size}
            hasName={hasName}
            iconUriFactory={iconUriFactory}
            hasTooltip
          />
        )
      })}
    </Box>
  )
}
