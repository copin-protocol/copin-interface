import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeSupport } from 'utils/config/trades'
import { parseMarketImage } from 'utils/helpers/transform'

export default function Market({
  protocol,
  indexToken,
  size = 20,
  hasName = false,
  hasTooltip = false,
  sx,
}: {
  protocol: ProtocolEnum
  indexToken: string
  size?: number
  hasName?: boolean
  hasTooltip?: boolean
  sx?: SystemStyleObject & GridProps
}) {
  const tooltipId = useMemo(() => uuid(), [])
  const symbol = getTokenTradeSupport(protocol)[indexToken]?.symbol
  if (!symbol) return <></>
  return (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <Flex
        width={size}
        height={size}
        sx={{
          borderRadius: size / 2,
          overflow: 'hidden',
          flexShrink: 0,
          border: 'small',
          borderColor: 'neutral4',
          ...sx,
        }}
        alignItems="center"
        justifyContent="center"
        data-tip="React-tooltip"
        data-tooltip-id={hasTooltip ? tooltipId : undefined}
        data-tooltip-delay-show={360}
      >
        <Image src={parseMarketImage(symbol)} sx={{ width: size, height: size }} />
      </Flex>
      {hasName && !!symbol && <Type.Small fontSize="10px">{symbol}</Type.Small>}
      {hasTooltip && (
        <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable>
          <Flex alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
            <Image src={parseMarketImage(symbol)} sx={{ width: size, height: size }} />
            <Type.Small fontSize="10px">{symbol}</Type.Small>
          </Flex>
        </Tooltip>
      )}
    </Flex>
  )
}
