import { SystemStyleObject } from '@styled-system/css'
import { ReactNode, useMemo } from 'react'
import { GridProps } from 'styled-system'
import { v4 as uuidv4 } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Type } from 'theme/base'

const LabelWithTooltip = ({
  id,
  sx = {},
  children,
  tooltip,
  dashed = false,
  tooltipSx = {},
  tooltipClickable = false,
}: {
  id: string
  sx?: SystemStyleObject & GridProps
  children: ReactNode
  tooltip: ReactNode
  dashed?: boolean
  tooltipSx?: any
  tooltipClickable?: boolean
}) => {
  const uuid = useMemo(() => id + uuidv4(), [])
  return (
    <>
      <Type.Caption
        data-tip="React-tooltip"
        data-tooltip-id={uuid}
        data-tooltip-delay-show={360}
        color="inherit"
        sx={
          dashed
            ? {
                borderBottom: '1px dashed',
                borderBottomColor: 'neutral4',
                ...sx,
              }
            : {
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                textDecorationColor: 'rgba(119, 126, 144, 0.5)',
                ...sx,
              }
        }
      >
        {children}
      </Type.Caption>
      <Tooltip id={uuid} clickable={tooltipClickable}>
        <Type.Caption
          maxWidth={300}
          textAlign="center"
          style={{
            textTransform: 'none',
            ...tooltipSx,
          }}
        >
          {tooltip}
        </Type.Caption>
      </Tooltip>
    </>
  )
}

export default LabelWithTooltip
