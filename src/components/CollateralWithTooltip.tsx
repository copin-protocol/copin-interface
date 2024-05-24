import { ReactNode } from 'react'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Image } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_COLLATERAL_SUPPORT } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
import { parseCollateralImage } from 'utils/helpers/transform'

export default function CollateralWithTooltip({
  protocol,
  collateralToken,
  collateral,
  collateralInToken,
  value,
}: {
  protocol?: ProtocolEnum
  collateralToken?: string
  collateral?: number
  collateralInToken?: number
  value?: ReactNode
}) {
  if (!collateral && !value) return <>{'--'}</>
  if (!protocol && !collateralToken && !value) return <>{`$${formatNumber(collateral, 0)}`}</>
  const isToken = !!collateralToken && !!protocol
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
        {!!value ? value : isToken ? formatNumber(collateralInToken, 2, 2) : `$${formatNumber(collateral, 0)}`}
        {isToken && (
          <Image
            src={parseCollateralImage(TOKEN_COLLATERAL_SUPPORT[protocol][collateralToken]?.symbol)}
            sx={{ width: 16, height: 16 }}
          />
        )}
        {isToken && (
          <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={false}>
            {`${formatNumber(collateralInToken, 2, 2)} ${
              TOKEN_COLLATERAL_SUPPORT[protocol][collateralToken].symbol
            } ~ $${formatNumber(collateral, 0)}`}
          </Tooltip>
        )}
      </Flex>
    </>
  )
}
