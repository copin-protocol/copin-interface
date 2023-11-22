import { SystemStyleObject } from '@styled-system/css'
import React, { ReactNode } from 'react'
import { GridProps } from 'styled-system'

import Tooltip from 'theme/Tooltip'
import { Type } from 'theme/base'

const LabelWithTooltip = ({
  id,
  sx = {},
  children,
  tooltip,
}: {
  id: string
  sx?: SystemStyleObject & GridProps
  children: ReactNode
  tooltip: ReactNode
}) => {
  return (
    <>
      <Type.Caption
        data-tip="React-tooltip"
        data-tooltip-id={id}
        sx={{
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: 'rgba(119, 126, 144, 0.5)',
          ...sx,
        }}
      >
        {children}
      </Type.Caption>
      <Tooltip id={id} place="top" type="dark" effect="solid">
        <Type.Caption
          maxWidth={350}
          textAlign="center"
          style={{
            textTransform: 'none',
          }}
        >
          {tooltip}
        </Type.Caption>
      </Tooltip>
    </>
  )
}

export default LabelWithTooltip
