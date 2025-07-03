import React, { ReactNode } from 'react'
import { PlacesType } from 'react-tooltip'

import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

const ActiveDot = ({
  tooltipId,
  tooltipContent,
  size = 8,
  color = themeColors.green2,
  placeTooltip = 'top',
}: {
  tooltipId?: string
  tooltipContent?: ReactNode
  size?: number
  color?: string
  placeTooltip?: PlacesType
}) => {
  return (
    <>
      <Box
        width={size}
        height={size}
        bg={color}
        sx={{
          borderRadius: '50%',
        }}
        data-tip="React-tooltip"
        data-tooltip-id={tooltipId}
      />
      {!!tooltipContent && (
        <Tooltip id={tooltipId} clickable={false} place={placeTooltip}>
          <Type.Small sx={{ maxWidth: [300, 400] }}>{tooltipContent}</Type.Small>
        </Tooltip>
      )}
    </>
  )
}

export default ActiveDot
