import { Info } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button, ButtonProps } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'

interface PopconfirmProps {
  action: ReactNode
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
}

const Popconfirm = ({
  action,
  title,
  description,
  icon = <Info size={18} />,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonProps = {},
  cancelButtonProps = {},
}: PopconfirmProps) => {
  const tooltipId = uuidv4()
  const [visible, setVisible] = useState(false)

  const handleConfirm = () => {
    onConfirm?.()
    setVisible(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setVisible(false)
  }

  return (
    <>
      <Box data-tip="React-tooltip" data-tooltip-id={tooltipId}>
        {action}
      </Box>
      <Tooltip
        id={tooltipId}
        openEvents={{ click: true }}
        closeEvents={{ click: true }}
        isOpen={visible}
        setIsOpen={setVisible}
        afterHide={onCancel}
        clickable
      >
        <Content
          title={title}
          icon={icon}
          description={description}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmText={confirmText}
          cancelText={cancelText}
          confirmButtonProps={confirmButtonProps}
          cancelButtonProps={cancelButtonProps}
        />
      </Tooltip>
    </>
  )
}

interface ContentProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmText: string
  cancelText: string
  confirmButtonProps: object
  cancelButtonProps: object
}

const Content = ({
  icon,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmButtonProps,
  cancelButtonProps,
}: ContentProps) => {
  return (
    <Flex
      flexDirection="column"
      maxWidth={250}
      sx={{
        gap: 1,
        color: 'neutral1',
      }}
    >
      <Flex width="100%" sx={{ gap: 1 }}>
        {!!icon && <IconBox icon={icon} color="orange1" />}
        <Flex flex={1} flexDirection="column">
          <Type.Caption textAlign="left">{title}</Type.Caption>
          {description && <Type.Caption color="neutral2">{description}</Type.Caption>}
        </Flex>
      </Flex>
      <Flex justifyContent="flex-end" alignItems="center">
        <Button variant="ghost" onClick={onCancel} {...cancelButtonProps} py={0}>
          {cancelText}
        </Button>
        <Button variant="ghostPrimary" onClick={onConfirm} {...confirmButtonProps} py={0}>
          {confirmText}
        </Button>
      </Flex>
    </Flex>
  )
}

export default Popconfirm
