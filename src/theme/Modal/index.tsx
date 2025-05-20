import { XCircle } from '@phosphor-icons/react'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { AnimatePresence, PanInfo, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import styled, { DefaultTheme, css } from 'styled-components/macro'

import SafeDropdownIndex from 'components/@widgets/SafeDropdownIndex'
import { isIphone } from 'hooks/helpers/useIsIphone'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import { Box, Flex, Type } from 'theme/base'
import { Colors } from 'theme/types'
import { Z_INDEX } from 'utils/config/zIndex'

const MotionDialogOverlay = motion(DialogOverlay)
const StyledDialogOverlay = styled(MotionDialogOverlay)<{
  mode?: ModalProps['mode']
  backdropFilter?: string
  overlayBackground?: string
  zIndex?: number
}>`
  ${({ theme, mode, overlayBackground, zIndex }) => `
    &[data-reach-dialog-overlay] {
      z-index: ${zIndex ?? Z_INDEX.THEME_MODAL};
      width: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      display: flex;
      align-items: ${mode === 'right' ? 'flex-start' : 'center'};
      justify-content: ${mode === 'right' ? 'right' : 'center'};
      background-color: ${overlayBackground ?? theme.colors.modalBG1};
    }
  `}
`

const MotionDialogContent = motion(DialogContent)
const StyledDialogContent = styled(
  ({ background, height, minHeight, maxHeight, maxWidth, mobile, isOpen, mode, ...rest }) => (
    <MotionDialogContent {...rest} />
  )
).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: visible;
  &[data-reach-dialog-content] {
    margin: ${({ mode }) => (mode === 'right' ? '16px' : '0')};
    padding: 0;
    position: relative;
    background: ${({ theme, background }: { theme: DefaultTheme; background?: keyof Colors }) =>
      background ? (theme.colors[background] as string) : 'black'};
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral5};
    box-shadow: ${({ theme }: { theme: DefaultTheme }) => theme.shadows[3]};
    width: ${({ width }) => width ?? '50vw'};
    align-self: ${({ mobile, mode }) =>
      mode === 'right' ? 'flex-start' : mobile && mode === 'bottom' ? 'flex-end' : 'center'};
    ${({ maxWidth }) => css`
      max-width: ${maxWidth || '420px'};
    `}
    ${({ height }) =>
      height &&
      css`
        height: ${height};
      `}
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight};
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight};
      `}
    display: flex;
    border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius.sm};
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
    `}
    ${({ theme, mobile, mode }) => theme.mediaWidth.upToSmall`
    width:  90vw;
      ${
        !!mobile &&
        css`
          width: 100vw;
          border-radius: 20px;
          ${mode === 'bottom' &&
          `
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          `}
        `
      }
    `}
  }
`
const StyledDialogBody = styled.div`
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1 1 auto;
`

export interface ModalProps {
  isOpen: boolean
  isOverflown?: boolean
  mode?: 'center' | 'bottom' | 'right'
  onDismiss?: () => void
  dismissable?: boolean
  width?: string
  maxWidth?: string
  minHeight?: string | false
  maxHeight?: string
  hasClose?: boolean
  initialFocusRef?: React.RefObject<any>
  footer?: React.ReactNode
  children?: React.ReactNode
  title?: React.ReactNode
  background?: keyof Colors | string
  dangerouslyBypassFocusLock?: boolean
  modalContentStyle?: any
  backdropFilter?: string
  overlayBackground?: string
  height?: string
  zIndex?: number
  titleWrapperSx?: any
}

export default function Modal({
  isOpen,
  onDismiss,
  width,
  maxWidth,
  minHeight = false,
  dismissable = true,
  height,
  maxHeight = '90vh',
  title,
  hasClose,
  initialFocusRef,
  mode = 'center',
  background,
  backdropFilter,
  overlayBackground,
  footer,
  children,
  modalContentStyle,
  dangerouslyBypassFocusLock = false,
  zIndex,
  titleWrapperSx = {},
}: ModalProps) {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(isOpen)
  const [dragY, setDragY] = useState(0)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    const timer = setTimeout(() => {
      onDismiss?.()
      setDragY(0)
    }, 200)

    return () => {
      clearTimeout(timer)
      onDismiss?.()
    }
  }, [onDismiss])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setDragY(0)
    }
    return () => {
      setIsVisible(false)
      setDragY(0)
    }
  }, [isOpen])

  const handleDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (mode !== 'bottom' || !isMobile) return

      const newDragY = Math.max(0, info.offset.y)
      setDragY(newDragY)

      if (newDragY > 400 || info.velocity.y > 1000) {
        handleClose()
      }
    },
    [mode, isMobile, handleClose]
  )

  const handleDragEnd = useCallback(() => {
    if (dragY < 400) {
      setDragY(0)
    }
  }, [dragY])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <StyledDialogOverlay
          animate={{
            opacity: [0, 1],
            transition: { type: 'spring', damping: 25, stiffness: 200 },
          }}
          exit={{
            opacity: [1, 0],
            transition: { type: 'spring', damping: 25, stiffness: 200 },
          }}
          onDismiss={() => dismissable && handleClose()}
          initialFocusRef={initialFocusRef}
          unstable_lockFocusAcrossFrames={false}
          mode={mode}
          dangerouslyBypassFocusLock={dangerouslyBypassFocusLock}
          backdropFilter={backdropFilter}
          overlayBackground={overlayBackground}
          zIndex={zIndex}
        >
          <StyledDialogContent
            mode={mode}
            drag={isMobile && !isIphone && mode === 'bottom' ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{
              y: mode === 'bottom' ? dragY : undefined,
              ...(modalContentStyle || {}),
            }}
            animate={
              mode === 'right'
                ? { x: [100, 0], transition: { type: 'spring', damping: 25, stiffness: 200 } }
                : { y: [100, 0], transition: { type: 'spring', damping: 25, stiffness: 200 } }
            }
            exit={
              mode === 'right'
                ? { x: [0, 100], transition: { type: 'spring', damping: 25, stiffness: 200 } }
                : mode === 'bottom' && isMobile
                ? { opacity: [1, 0], transition: { type: 'spring', damping: 25, stiffness: 200 } }
                : { y: [0, window.innerHeight], transition: { type: 'spring', damping: 25, stiffness: 200 } }
            }
            minHeight={minHeight}
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            aria-label="dialog content"
            mobile={isMobile}
            width={width}
            height={height}
            background={background}
          >
            {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
            <Flex flexDirection="column" width="100%">
              {isMobile && mode === 'bottom' && (
                <Box width={80} height={5} sx={{ borderRadius: '100px' }} bg="neutral3" mx="auto" mb={3} mt={1} />
              )}
              {(Boolean(title) || hasClose) && (
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent={hasClose ? 'flex-end' : 'flex-start'}
                  py={3}
                  px={[12, 24]}
                  sx={titleWrapperSx}
                >
                  {Boolean(title) && (
                    <Flex flex="1 1 auto">
                      <Type.H5 width="100%">{title}</Type.H5>
                    </Flex>
                  )}
                  {hasClose && (
                    <IconButton variant="ghost" onClick={handleClose} icon={<XCircle size={24} />} size={24} />
                  )}
                </Flex>
              )}

              <StyledDialogBody>{children}</StyledDialogBody>
              {!!footer && (
                <Flex sx={{ flex: '1 1 auto', pt: 2 }} justifyContent={'flex-end'} px={2}>
                  {footer}
                </Flex>
              )}
            </Flex>
            <SafeDropdownIndex />
          </StyledDialogContent>
        </StyledDialogOverlay>
      )}
    </AnimatePresence>
  )
}
