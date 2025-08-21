import { PencilSimpleLine } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { putAlertLabelApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import { TraderAlertData } from 'entities/alert'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import AlertLabelTooltip from './AlertLabelNoteTooltip'

export default function AlertLabelButton({
  alertId,
  address,
  protocol,
  initialLabel = '',
  hasLabel = false,
  size = 16,
  hoverColor = 'primary1',
  activeColor = 'neutral1',
  text,
  sx = {},
  onLabelChange,
  positionTooltip,
  containerRef,
  currentAlert,
}: {
  address: string
  protocol: ProtocolEnum
  initialLabel?: string
  hasLabel?: boolean
  size?: number
  hoverColor?: string
  activeColor?: string
  alertId?: string
  sx?: any
  text?: string
  onLabelChange?: (newLabel: string) => void
  positionTooltip?: { top: number; left: number }
  containerRef?: React.RefObject<HTMLElement>
  currentAlert?: TraderAlertData
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [editModeShowed, setEditModeShowed] = useState(false)
  const { md } = useResponsive()

  const handleSuccess = (newLabel: string) => {
    const message = 'Alert label updated successfully'
    toast.success(<ToastBody title="Success" message={message} />)
    setShowTooltip(false)
    setTooltipPosition(null)
    onLabelChange?.(newLabel)
  }

  const { mutate: updateLabel, isLoading: updatingLabel } = useMutation(putAlertLabelApi, {
    onSuccess: (data, variables) => {
      handleSuccess(variables.label || '')
    },
    onError: () => {
      toast.error(<ToastBody title="Error" message="Failed to update alert label" />)
    },
  })

  const handleSaveLabel = (label?: string) => {
    const newLabel = label?.trim() || ''
    if (hasLabel || label) {
      updateLabel({
        id: alertId,
        address,
        protocol,
        label: newLabel,
      })
    }
    setShowTooltip(false)
    setEditModeShowed(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const buttonRect = e.currentTarget.getBoundingClientRect()
    if (positionTooltip) {
      setTooltipPosition({
        top: buttonRect.bottom + buttonRect.width / 2 - positionTooltip.top,
        left: buttonRect.left + buttonRect.width / 2 - positionTooltip.left,
      })
    } else {
      setTooltipPosition({
        top: buttonRect.bottom + 5,
        left: buttonRect.left + buttonRect.width / 2 - 5,
      })
    }

    setShowTooltip(true)
    setEditModeShowed(true)
  }

  return (
    <>
      <Box className="alert-label-btn">
        <Flex onClick={handleClick}>
          <ButtonWithIcon
            type="button"
            variant="ghost"
            disabled={updatingLabel}
            icon={<PencilSimpleLine weight={'light'} size={size} />}
            size={size}
            sx={{
              p: 0,
              color: activeColor,
              '&:hover': {
                color: hoverColor,
              },
              ...sx,
            }}
          />
          {text && (
            <Type.Caption color="neutral1" ml={1}>
              {text}
            </Type.Caption>
          )}
        </Flex>
      </Box>
      <AlertLabelTooltip
        tooltipOpen={!md && showTooltip}
        address={showTooltip ? address : undefined}
        protocol={protocol}
        position={tooltipPosition || positionTooltip}
        submitting={updatingLabel}
        currentLabel={initialLabel}
        editModeShowed={editModeShowed}
        onSave={handleSaveLabel}
        parentScroll={containerRef}
        shouldShowGroupAlert={false}
        shouldShowCloseEdit={false}
        currentAlert={currentAlert}
      />
    </>
  )
}
