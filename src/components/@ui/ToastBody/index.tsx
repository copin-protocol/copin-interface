import React, { ReactNode } from 'react'

import { Type } from 'theme/base'

const ToastBody = ({ title, message }: { title: ReactNode; message: ReactNode }) => {
  return (
    <div>
      <Type.BodyBold color="neutral1" display="block">
        {title}
      </Type.BodyBold>
      <Type.Caption color="neutral3" sx={{ wordBreak: 'break-word' }}>
        {message}
      </Type.Caption>
    </div>
  )
}

export default ToastBody
