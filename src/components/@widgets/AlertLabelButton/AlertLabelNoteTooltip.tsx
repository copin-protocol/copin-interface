import { Trans } from '@lingui/macro'
import { BellSimpleSlash, Check, PencilSimpleLine, X } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import React from 'react'

import KeyListener from 'components/@ui/KeyListener'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { KeyNameEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'
import { addressShorten } from 'utils/helpers/format'

import { AlertLabel } from '../AlertLabel'
import { GroupAlertList } from '../GroupAlertList'

const LABEL_MAX_LENGTH = 30

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

  const hasGroupAlerts = groupAlerts.length > 0

  const AlertLabelForm = () => {
    return (
      <>
        <form onSubmit={handleSave}>
          <Box mt={'10px'} textAlign="right" width="100%">
            {!isEditing && isAlertEnabled && !editModeShowed && (
              // Show "Add label" when a new alert is created without a label
              <Flex
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  cursor: 'pointer',
                }}
              >
                {currentLabel === '' ? (
                  <ButtonWithIcon
                    onClick={handleEditClick}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                      bg: 'neutral5',
                      color: 'neutral3',
                      borderRadius: 20,
                      width: 'fit-content',
                    }}
                    icon={<PencilSimpleLine weight="light" color={`${themeColors.primary1}`} size={16} />}
                  >
                    <Type.Caption>Add label</Type.Caption>
                  </ButtonWithIcon>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      maxWidth: 150,
                    }}
                  >
                    <AlertLabel alertLabel={currentLabel} sx={{ px: '8px', py: '3px', textAlign: 'left' }} />
                    <PencilSimpleLine
                      weight="light"
                      color={`${themeColors.primary1}`}
                      size={16}
                      onClick={handleEditClick}
                    />
                  </Box>
                )}
                <Flex alignItems="start" color={themeColors.red1} onClick={handleUnotify} style={{ cursor: 'pointer' }}>
                  <BellSimpleSlash size={16} />
                  <Type.Caption ml={'2px'}>
                    <Trans>UNOTIFY</Trans>
                  </Type.Caption>
                </Flex>
              </Flex>
            )}
            {(isEditing || !isAlertEnabled) && (
              <Box width={'100%'} mt="10px">
                <InputField
                  autoFocus
                  ref={inputRef}
                  value={label}
                  label={'Label (Optional)'}
                  annotation={`${label?.length ?? 0}/${LABEL_MAX_LENGTH}`}
                  block={true}
                  inputSx={{
                    px: 2,
                    py: 1,
                    border: 'neutral3',
                    backgroundColor: 'neutral6',
                    color: 'neutral1',
                  }}
                  onChange={(event) => {
                    if (event.target.value.length <= LABEL_MAX_LENGTH) {
                      setLabel(event.target.value)
                    }
                  }}
                  suffix={
                    isEditing &&
                    isAlertEnabled && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size={24}
                          type="button"
                          variant="ghostSuccess"
                          icon={<Check size={16} />}
                          onClick={handleSave}
                          disabled={label.trim() === (currentLabel || '').trim() || submitting}
                        />
                        {shouldShowCloseEdit && (
                          <X
                            size={16}
                            style={{
                              cursor: 'pointer',
                              color: themeColors.neutral3,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = themeColors.neutral2)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = themeColors.neutral3)}
                            onClick={handleEditCancel}
                          />
                        )}
                      </Box>
                    )
                  }
                />
              </Box>
            )}
            {!isAlertEnabled && (
              <Button
                type="submit"
                variant="ghostPrimary"
                size="sm"
                sx={{ fontWeight: 'bold', mt: 1 }}
                isLoading={submitting}
              >
                <Trans>NOTIFY</Trans>
              </Button>
            )}
            {hasGroupAlerts && shouldShowGroupAlert && (
              <Box mt={3}>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Flex alignItems="center" width="100%" sx={{ position: 'relative' }}>
                    {md ? (
                      <Type.Caption textAlign="left" color="neutral3" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                        <Trans>Group ALerts</Trans>
                      </Type.Caption>
                    ) : (
                      <Type.BodyBold textAlign="left" color="neutral3" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                        <Trans>Group ALerts</Trans>
                      </Type.BodyBold>
                    )}
                    <Box
                      sx={{
                        flex: 1,
                        height: '0.1px',
                        backgroundColor: 'neutral4',
                      }}
                    />
                  </Flex>
                </Flex>
                <GroupAlertList groupAlerts={groupAlerts} />
              </Box>
            )}
          </Box>
        </form>
      </>
    )
  }

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
          <AlertLabelForm />
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
            <AlertLabelForm />
            {/* <Flex sx={{ mt: 10, justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                sx={{ p: 0, transition: 'none', fontWeight: 'normal' }}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onCancel()
                }}
              >
                Cancel
              </Button>
            </Flex> */}
          </Flex>
        </Modal>
      )}
    </>
  )
}

export default AlertLabelTooltip
