import { ReactNode } from 'react'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Image } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_COLLATERAL_SUPPORT } from 'utils/config/trades'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair, parseCollateralImage, parseMarketImage } from 'utils/helpers/transform'

export default function ValueOrToken({
  pair,
  indexToken,
  value,
  protocol,
  valueInToken,
  component,
  hasCompact,
  hasPrefix = true,
  maxDigit = 0,
  minDigit,
  defaultToken,
}: {
  value: number | undefined
  valueInToken?: number
  protocol?: ProtocolEnum
  indexToken?: string
  pair?: string
  component?: ReactNode
  hasCompact?: boolean
  hasPrefix?: boolean
  maxDigit?: number
  minDigit?: number
  defaultToken?: string
}) {
  if (!value && !component && !valueInToken) return <>{'--'}</>
  if (value != null && !component) {
    const sign = value < 0 ? '-' : ''
    return <>{`${sign}${hasPrefix ? '$' : ''}${formatNumber(Math.abs(value), maxDigit, minDigit)}`}</>
  }
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
          : `${hasPrefix && !defaultToken ? '$' : ''}${formatNumber(value, maxDigit, minDigit)}`}
        {(isToken || defaultToken) && (
          <Image
            src={
              isToken && pair
                ? parseMarketImage(getSymbolFromPair(pair))
                : parseCollateralImage(
                    isToken ? TOKEN_COLLATERAL_SUPPORT[protocol][indexToken]?.symbol : defaultToken ?? ''
                  )
            }
            sx={{ width: 16, height: 16, flexShrink: 0 }}
          />
        )}
        {(isToken || defaultToken) && (
          <Tooltip id={tooltipId} clickable={false}>
            {`${formatNumber(isToken ? valueInToken : defaultToken ? value : undefined, 2, 2)} ${
              isToken
                ? pair
                  ? getSymbolFromPair(pair)
                  : TOKEN_COLLATERAL_SUPPORT[protocol][indexToken]?.symbol
                : defaultToken ?? ''
            } ${
              value != null
                ? `~ ${value < 0 ? '-' : ''}${hasPrefix && '$'}${formatNumber(Math.abs(value), maxDigit, minDigit)}`
                : ''
            }`}
          </Tooltip>
        )}
      </Flex>
    </>
  )
}
