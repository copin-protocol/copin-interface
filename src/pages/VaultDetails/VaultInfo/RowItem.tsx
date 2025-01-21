import React, { ReactNode, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'

export default function RowItem({
  label,
  content,
  tooltipContent,
  clickableTooltip,
}: {
  label: ReactNode
  content: ReactNode
  tooltipContent?: ReactNode
  clickableTooltip?: ReactNode
}) {
  const tooltipId = useMemo(() => uuid(), [])
  return (
    <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
      <Type.Caption color="neutral2">{label}</Type.Caption>
      <Type.CaptionBold
        sx={
          !!tooltipContent
            ? {
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                textDecorationColor: 'rgba(119, 126, 144, 0.5)',
              }
            : undefined
        }
        data-tip="React-tooltip"
        data-tooltip-id={tooltipId}
        data-tooltip-delay-show={360}
      >
        {content}
      </Type.CaptionBold>
      {!!tooltipContent && (
        <Tooltip id={tooltipId} clickable={!!clickableTooltip}>
          {tooltipContent}
        </Tooltip>
      )}
    </Flex>
  )
}
