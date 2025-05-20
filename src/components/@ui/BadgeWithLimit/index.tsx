import React, { ReactNode, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Badge from 'theme/Badge'
import Tooltip from 'theme/Tooltip'
import { Box } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

const BadgeWithLimit = ({
  total = 0,
  limit,
  tooltipContent,
  clickableTooltip,
  sx,
}: {
  total?: number
  limit?: number
  tooltipContent?: ReactNode
  clickableTooltip?: boolean
  sx?: any
}) => {
  const uuid = useRef(uuidv4()).current

  const tooltipId = `tt-tag-${uuid}`
  const hasTooltip = !!tooltipContent && !!limit && total >= limit
  return (
    <>
      <Box data-tip="React-tooltip" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
        <Badge
          count={!!limit ? `${formatNumber(total)}/${formatNumber(limit)}` : `${formatNumber(total)}`}
          sx={{ color: !!limit && total > limit ? 'red1' : !!limit && total === limit ? 'orange1' : 'neutral1', ...sx }}
        />
      </Box>
      {hasTooltip && (
        <Tooltip id={tooltipId} clickable={clickableTooltip}>
          {tooltipContent}
        </Tooltip>
      )}
    </>
  )
}

export default BadgeWithLimit
