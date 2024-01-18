import { XCircle } from '@phosphor-icons/react'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import { SystemStyleObject } from '@styled-system/css'
import React from 'react'
import { animated, easings, useTransition } from 'react-spring'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'

import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import { Flex, Type } from 'theme/base'
import { Colors } from 'theme/types'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)<{ mode?: ModalProps['mode'] }>`
  ${({ theme, mode }) => `
    &[data-reach-dialog-overlay] {
      z-index: 9998;
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      display: flex;
      align-items: ${mode === 'bottom' ? 'end' : 'center'};
      justify-content: ${mode === 'bottom' ? 'center' : 'end'};
      background-color: ${theme.colors.modalBG1};
      // backdrop-filter: blur(5px);
    }
  `}
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element

// eslint-disable-next-line
const StyledDialogContent = styled(({ background, size, mode, mobile, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog',
})`
  overflow-${({ mode }) => (mode === 'bottom' ? 'x' : 'y')}: visible;
  &[data-reach-dialog-content] {
    background: ${({ theme, background }) => (background ? (theme.colors[background] as string) : 'black')};
    position: relative;
    box-shadow: ${({ theme }) => theme.shadows[4]};
    width: ${({ mode, size }) => (mode === 'bottom' ? '100vw' : size ?? '50vw')};
    min-width: ${({ mode, size }) => (mode === 'bottom' ? '100vw' : size ?? '50vw')};
    height: ${({ mode, size }) => (mode === 'bottom' ? size ?? '50vh' : '100svh')};
    min-height: ${({ mode, size }) => (mode === 'bottom' ? size ?? '50vh' : '100svh')};
  }
`
const StyledDialogBody = styled.div`
  padding: 0;
  overflow: auto;
  flex: 1 1 auto;
  outline: none;
`

export interface ModalProps {
  isOpen: boolean
  mode?: 'bottom' | 'right'
  onDismiss?: () => void
  dismissable?: boolean
  size?: string
  hasClose?: boolean
  initialFocusRef?: React.RefObject<any>
  footer?: React.ReactNode
  children?: React.ReactNode
  title?: React.ReactNode
  headSx?: SystemStyleObject & GridProps
  background?: keyof Colors | string
  dangerouslyBypassFocusLock?: boolean
}

export default function Drawer({
  isOpen,
  onDismiss,
  size,
  dismissable = true,
  title,
  hasClose,
  initialFocusRef,
  mode = 'bottom',
  background,
  footer,
  children,
  headSx,
  dangerouslyBypassFocusLock = false,
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, {
    config: { duration: 240, easing: easings.linear },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const transformTransition = useTransition(isOpen, {
    config: { duration: 240, easing: easings.linear },
    from: { transform: mode === 'bottom' ? `translateY(100%)` : `translateX(100%)` },
    enter: { transform: mode === 'bottom' ? `translateY(0%)` : `translateX(0%)` },
    leave: { transform: mode === 'bottom' ? `translateY(100%)` : `translateX(100%)` },
  })

  const isMobile = useIsMobile()

  const onDismissRequest = () => (onDismiss ? onDismiss() : null)

  return (
    <>
      {fadeTransition((props: any, item) => {
        return (
          item && (
            <StyledDialogOverlay
              style={props}
              onDismiss={() => dismissable && onDismissRequest()}
              initialFocusRef={initialFocusRef}
              dangerouslyBypassFocusLock={dangerouslyBypassFocusLock}
              mode={mode}
            >
              {transformTransition(
                (props: any, item) =>
                  item && (
                    <StyledDialogContent
                      mode={mode}
                      style={props}
                      maxHeight="100svh"
                      maxWidth="100vw"
                      aria-label="dialog content"
                      mobile={isMobile}
                      size={size}
                      background={background}
                    >
                      {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                      {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                      <Flex
                        flexDirection="column"
                        width="100%"
                        height="100%"
                        sx={{ '&:focus-visible': { outline: 'none' } }}
                      >
                        {(Boolean(title) || hasClose) && (
                          <Flex
                            sx={{
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: hasClose ? 'flex-end' : 'flex-start',
                              py: 3,
                              px: 24,
                              ...(headSx ?? {}),
                            }}
                          >
                            {Boolean(title) && (
                              <Flex flex="1 1 auto">
                                {typeof title === 'string' ? <Type.H5>{title}</Type.H5> : title}
                              </Flex>
                            )}
                            {hasClose && (
                              <IconButton
                                variant="ghost"
                                onClick={() => onDismissRequest()}
                                icon={<XCircle size={24} />}
                                size={24}
                              />
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
                    </StyledDialogContent>
                  )
              )}
            </StyledDialogOverlay>
          )
        )
      })}
    </>
  )
}
