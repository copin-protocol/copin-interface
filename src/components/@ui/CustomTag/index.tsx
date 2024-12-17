import React, { ReactNode, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'

const CustomTag = ({
  text,
  color,
  backgroundColor,
  tooltipContent,
  clickableTooltip,
  sx,
  ...props
}: {
  text: ReactNode
  color?: string
  backgroundColor?: string
  tooltipContent?: ReactNode
  clickableTooltip?: boolean
} & any) => {
  const uuid = useRef(uuidv4()).current

  const tooltipId = `tt-tag-${uuid}`
  const hasTooltip = !!tooltipContent

  return (
    <Flex
      variant="card"
      justifyContent="center"
      alignItems="center"
      bg={backgroundColor ?? 'neutral5'}
      px="6px"
      py="2px"
      sx={{
        borderRadius: '4px',
        gap: 1,
        ...(sx ?? {}),
      }}
      {...props}
    >
      <Type.Caption
        width="100%"
        textAlign="center"
        color={color ?? 'neutral3'}
        flex={1}
        sx={
          hasTooltip
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
        {text}
      </Type.Caption>
      {!!tooltipContent && (
        <Tooltip id={tooltipId} place="bottom" type="dark" effect="solid" clickable={clickableTooltip}>
          {tooltipContent}
        </Tooltip>
      )}
    </Flex>
  )
}

export default CustomTag
