import React, { ReactNode } from 'react'

import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

const ActiveDot = ({
  tooltipId,
  tooltipContent,
  size = 8,
  color = themeColors.green2,
}: {
  tooltipId?: string
  tooltipContent?: ReactNode
  size?: number
  color?: string
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
        <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={false}>
          <Type.Small sx={{ maxWidth: [300, 400] }}>{tooltipContent}</Type.Small>
        </Tooltip>
      )}
    </>
  )
}

export default ActiveDot
