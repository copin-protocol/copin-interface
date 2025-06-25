import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import KeyListener from 'components/@ui/KeyListener'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import { Box, Type } from 'theme/base'
import { KeyNameEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'

const LABEL_MAX_LENGTH = 32
interface AlertLabelTooltipProps {
  address: string | undefined
  protocol: any
  position?: { top: number; left: number } | undefined
  submitting: boolean
  onSave: (label?: string) => void
  onCancel: () => void
  currentLabel?: string
  isEditMode?: boolean
  parentScroll?: React.RefObject<HTMLElement>
}

const AlertLabelTooltip = ({
  address,
  protocol,
  position,
  submitting,
  onSave,
  onCancel,
  currentLabel = '',
  isEditMode = false,
  parentScroll,
}: AlertLabelTooltipProps) => {
  const [label, setLabel] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!!address) {
      setLabel(currentLabel || '')
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }, [address, currentLabel])

  useEffect(() => {
    const element = parentScroll?.current
    if (!!address && !!position && element) {
      const hasScrollbar = element.scrollHeight > element.clientHeight
      element.style.overflow = 'hidden'
      if (hasScrollbar) {
        element.style.paddingRight = '6px'
      }
    }

    return () => {
      if (element) {
        element.style.overflow = 'auto'
        element.style.paddingRight = '0px'
      }
    }
  }, [address, position, parentScroll])

  const reset = () => {
    setLabel('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.stopPropagation()
    e.preventDefault()

    onSave(label.trim())
    reset()
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    onCancel()
    reset()
  }

  const { sm, xs, lg } = useResponsive()

  if (!address || !protocol || !position) {
    return null
  }

  return (
    <Box
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
        transform: position && position?.top > 200 ? 'translateY(calc(-100% - 4px))' : 'translateY(28px)',
        maxWidth: xs ? '190px' : 'auto',
      }}
    >
      <OutsideClickHandler
        onOutsideClick={(e) => {
          e.stopPropagation()
          handleCancel(e as any)
        }}
      >
        <Type.CaptionBold textAlign="left" width="100%" color="neutral1">
          <Trans> Label (Optional)</Trans>
        </Type.CaptionBold>
        <KeyListener keyName={KeyNameEnum.ESCAPE} onFire={onCancel} />

        <form onSubmit={handleSave}>
          <Box mt={2} textAlign="right">
            <InputField
              ref={inputRef}
              value={label}
              annotation={`${label?.length ?? 0}/${LABEL_MAX_LENGTH}`}
              block
              inputSx={{
                px: 2,
                py: 1,
                my: 1,
                color: 'neutral1',
              }}
              onChange={(event) => {
                if (event.target.value.length <= LABEL_MAX_LENGTH) {
                  setLabel(event.target.value)
                } else {
                  event.target.value = label || ''
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, ml: !isEditMode ? 0 : 'auto' }}>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                sx={{ fontWeight: 'bold' }}
                onClick={handleCancel}
                disabled={submitting}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button type="submit" variant="ghostPrimary" size="xs" sx={{ fontWeight: 'bold' }} isLoading={submitting}>
                <Trans>Done</Trans>
              </Button>
            </Box>
          </Box>
        </form>
      </OutsideClickHandler>
    </Box>
  )
}

export default AlertLabelTooltip
