import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Image, Type } from 'theme/base'

export default function Icon({
  iconName,
  iconUriFactory,
  size = 20,
  hasName = false,
  hasTooltip = false,
  sx = {},
  iconNameSx = {},
  hasBorder = true,
}: {
  iconName: string
  iconUriFactory: (symbol: string) => string
  size?: number
  hasName?: boolean
  hasTooltip?: boolean
  sx?: SystemStyleObject & GridProps
  iconNameSx?: any
  hasBorder?: boolean
}) {
  const tooltipId = useMemo(() => uuid(), [])
  if (!iconName) return <></>
  return (
    <Flex alignItems="center" sx={{ gap: 1, flexShrink: 0 }}>
      <Flex
        width={size}
        height={size}
        sx={{
          borderRadius: size / 2,
          overflow: 'hidden',
          flexShrink: 0,
          ...(hasBorder
            ? {
                border: 'small',
                borderColor: 'neutral4',
              }
            : {}),
          bg: 'neutral7',
          ...sx,
        }}
        alignItems="center"
        justifyContent="center"
        data-tip="React-tooltip"
        data-tooltip-id={hasTooltip ? tooltipId : undefined}
        data-tooltip-delay-show={360}
      >
        <Image
          src={iconUriFactory(iconName)}
          sx={{ width: size, height: size, flexShrink: 0, display: 'block', maxWidth: 'unset' }}
        />
      </Flex>
      {hasName && !!iconName && (
        <Type.Small fontSize="10px" sx={{ ...iconNameSx, flexShrink: 0 }}>
          {iconName}
        </Type.Small>
      )}
      {hasTooltip && (
        <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable>
          <Flex alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
            <Image src={iconUriFactory(iconName)} sx={{ width: size, height: size }} />
            <Type.Small fontSize="10px">{iconName}</Type.Small>
          </Flex>
        </Tooltip>
      )}
    </Flex>
  )
}
