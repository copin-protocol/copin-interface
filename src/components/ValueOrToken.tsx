import { ReactNode } from 'react'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Image } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_COLLATERAL_SUPPORT } from 'utils/config/trades'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { parseCollateralImage } from 'utils/helpers/transform'

export default function ValueOrToken({
  indexToken,
  value,
  protocol,
  valueInToken,
  component,
  hasCompact,
  hasPrefix = true,
}: {
  value: number | undefined
  valueInToken?: number
  protocol?: ProtocolEnum
  indexToken?: string
  component?: ReactNode
  hasCompact?: boolean
  hasPrefix?: boolean
}) {
  if (!value && !component && !valueInToken) return <>{'--'}</>
  if (!protocol && !indexToken && !component) return <>{`${hasPrefix ? '$' : ''}${formatNumber(value, 0)}`}</>
  const isToken = !!indexToken && !!valueInToken && !!protocol
  const tooltipId = uuid()
  return (
    <>
      <Flex
        alignItems="center"
        as="span"
        sx={{ gap: '2px' }}
        data-tip="React-tooltip"
        data-tooltip-id={tooltipId}
        data-tooltip-delay-show={360}
      >
        {!!component
          ? component
          : isToken
          ? hasCompact
            ? compactNumber(valueInToken, 2)
            : formatNumber(valueInToken, 2, 2)
          : `${hasPrefix ? '$' : ''}${formatNumber(value, 0)}`}
        {isToken && (
          <Image
            src={parseCollateralImage(TOKEN_COLLATERAL_SUPPORT[protocol][indexToken]?.symbol)}
            sx={{ width: 16, height: 16, flexShrink: 0 }}
          />
        )}
        {isToken && (
          <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={false}>
            {`${formatNumber(valueInToken, 2, 2)} ${TOKEN_COLLATERAL_SUPPORT[protocol][indexToken]?.symbol} ${
              value != null ? `~ ${hasPrefix ? '$' : ''}${formatNumber(value, 0)}` : ''
            }`}
          </Tooltip>
        )}
      </Flex>
    </>
  )
}
