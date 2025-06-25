import { PencilSimpleLine } from '@phosphor-icons/react'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { putAlertLabelApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'
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
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)

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
  }

  const handleCancelTooltip = () => {
    setShowTooltip(false)
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
        top: buttonRect.bottom + 145,
        left: buttonRect.left + buttonRect.width / 2 - 5,
      })
    }

    setShowTooltip(true)
  }

  return (
    <>
      <div className="alert-label-btn">
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
      </div>

      <AlertLabelTooltip
        address={showTooltip ? address : undefined}
        protocol={protocol}
        position={tooltipPosition || positionTooltip}
        submitting={updatingLabel}
        currentLabel={initialLabel}
        isEditMode={hasLabel}
        onSave={handleSaveLabel}
        onCancel={handleCancelTooltip}
        parentScroll={containerRef}
      />
    </>
  )
}
