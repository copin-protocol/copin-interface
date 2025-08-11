import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import React from 'react'

import KeyListener from 'components/@ui/KeyListener'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { KeyNameEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'
import { addressShorten } from 'utils/helpers/format'

import { AlertLabelForm } from './AlertLabelForm'

interface GroupAlert {
  userId: string
  name: string
  id?: string
  category?: any
  isActive?: boolean
}

interface AlertLabelTooltipProps {
  address: string | undefined
  protocol: any
  position?: { top: number; left: number } | undefined
  submitting: boolean
  onSave: (label?: string) => void
  onCancel?: () => void
  currentLabel?: any
  isEditMode?: boolean
  parentScroll?: React.RefObject<HTMLElement>
  groupAlerts?: GroupAlert[]
  onSelectGroupAlert?: (groupAlert: GroupAlert) => void
  isUnsubscribe?: boolean
  onRequestUnsubscribe?: () => void
  editModeShowed?: boolean
  shouldShowGroupAlert?: boolean
  tooltipOpen?: boolean
  shouldShowCloseEdit?: boolean
  isAlertEnabled?: boolean
}

const AlertLabelTooltip = ({
  address,
  protocol,
  position,
  submitting,
  onSave,
  onCancel,
  currentLabel = '',
  groupAlerts = [],
  onRequestUnsubscribe,
  editModeShowed = false,
  shouldShowGroupAlert = true,
  shouldShowCloseEdit = true,
  tooltipOpen,
  isAlertEnabled,
}: AlertLabelTooltipProps) => {
  const [label, setLabel] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!!address) {
      setLabel(currentLabel)
    }
  }, [address])

  useEffect(() => {
    if (editModeShowed) {
      setIsEditing(true)
    }
  }, [editModeShowed])

  const { md } = useResponsive()

  useEffect(() => {
    if (!address || !protocol || !position) return
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onCancel?.()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [address, protocol, position, onCancel])

  const handleSave = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const value = label.trim()
    onSave(value)
    setIsEditing(false)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleEditCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsEditing(false)
    setLabel(currentLabel)
    if (inputRef.current) {
      inputRef.current.value = currentLabel
    }
  }

  const handleUnotify = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onRequestUnsubscribe?.()
  }

  if (!address || !protocol || !position) {
    return null
  }

  const alertLabelForm = (
    <AlertLabelForm
      label={label}
      setLabel={setLabel}
      isEditing={isEditing}
      isAlertEnabled={isAlertEnabled || false}
      editModeShowed={editModeShowed}
      currentLabel={currentLabel}
      inputRef={inputRef}
      submitting={submitting}
      shouldShowCloseEdit={shouldShowCloseEdit}
      shouldShowGroupAlert={shouldShowGroupAlert}
      groupAlerts={groupAlerts}
      onSave={handleSave}
      onEditClick={handleEditClick}
      onEditCancel={handleEditCancel}
      onUnotify={handleUnotify}
    />
  )

  return (
    <>
      {md ? (
        <Box
          ref={tooltipRef}
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
          }}
          sx={{
            display: !!address ? 'block' : 'none',
            position: 'fixed',
            zIndex: Z_INDEX.TOASTIFY + 1,
            top: position?.top ?? 0,
            left: position.left ?? 0,
            bg: 'neutral7',
            border: 'small',
            borderColor: 'neutral4',
            boxShadow: '0px 0px 12px -3px rgba(255, 255, 255, 0.1)',
            p: 12,
            borderRadius: 'xs',
            width: 260,
          }}
        >
          <Flex alignItems="center" width="100%" sx={{ position: 'relative' }}>
            <Type.Caption textAlign="left" color="neutral3" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
              <Trans>Watchlist</Trans>
            </Type.Caption>
            <Box
              sx={{
                flex: 1,
                height: '0.1px',
                backgroundColor: 'neutral4',
              }}
            />
          </Flex>
          <KeyListener keyName={KeyNameEnum.ESCAPE} onFire={onCancel} />
          {alertLabelForm}
        </Box>
      ) : (
        <Modal isOpen={!!tooltipOpen} zIndex={Z_INDEX.TOASTIFY + 100}>
          <Flex
            flexDirection="column"
            ref={tooltipRef}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
            }}
            sx={{
              // bg: 'neutral7',
              p: 20,
              borderRadius: 'xs',
            }}
          >
            <Flex alignItems="center" width="100%" sx={{ position: 'relative' }}>
              <Type.BodyBold textAlign="left" color="neutral3" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                <Trans>Watchlist</Trans>
              </Type.BodyBold>
              <Type.BodyBold textAlign="right" color="neutral1" sx={{ whiteSpace: 'nowrap' }}>
                {addressShorten(address)}
              </Type.BodyBold>
              <Box
                sx={{
                  ml: 2,
                  flex: 1,
                  height: '0.1px',
                  backgroundColor: 'neutral4',
                }}
              />
            </Flex>
            <KeyListener keyName={KeyNameEnum.ESCAPE} onFire={onCancel} />
            {alertLabelForm}
          </Flex>
        </Modal>
      )}
    </>
  )
}

export default AlertLabelTooltip
