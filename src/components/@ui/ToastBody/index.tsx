import { X } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'

import IconButton from 'theme/Buttons/IconButton'
import { Flex, Type } from 'theme/base'

const ToastBody = ({ title, message, onClose }: { title: ReactNode; message: ReactNode; onClose?: () => void }) => {
  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center">
        <Type.BodyBold color="neutral1" display="block">
          {title}
        </Type.BodyBold>
        {!!onClose && <IconButton size={18} variant="ghost" icon={<X size={14} />} onClick={onClose} />}
      </Flex>

      <Type.Caption color="neutral3" sx={{ wordBreak: 'break-word' }}>
        {message}
      </Type.Caption>
    </div>
  )
}

export default ToastBody
