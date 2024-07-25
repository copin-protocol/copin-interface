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
}: {
  id: string
  sx?: SystemStyleObject & GridProps
  children: ReactNode
  tooltip: ReactNode
}) => {
  const uuid = useMemo(() => id + uuidv4(), [])
  return (
    <>
      <Type.Caption
        data-tip="React-tooltip"
        data-tooltip-id={uuid}
        sx={{
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: 'rgba(119, 126, 144, 0.5)',
          ...sx,
        }}
      >
        {children}
      </Type.Caption>
      <Tooltip id={uuid} place="top" type="dark" effect="solid">
        <Type.Caption
          maxWidth={300}
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
