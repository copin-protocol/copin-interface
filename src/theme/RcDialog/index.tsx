import Dialog from 'rc-dialog'
import 'rc-dialog/assets/index.css'
import { CSSProperties, useEffect } from 'react'
import { createGlobalStyle } from 'styled-components/macro'

import useIsMobile from 'hooks/helpers/useIsMobile'
import { themeColors } from 'theme/colors'
import { Z_INDEX } from 'utils/config/zIndex'

const RcDialogStyle = createGlobalStyle`
  .rc-dialog-wrap {
    display: flex;
  }
`

export default function RcDialog({
  isOpen,
  onDismiss,
  destroyOnClose = false,
  forceRender = true,
  children,
  bg = themeColors.neutral6,
  maxWidth = '1000px',
  offsetTop = '100px',
  offsetBottom = '100px',
  height,
  contentStyles = {},
  bodyStyles = {},
  keyboard = true,
  zIndex = Z_INDEX.THEME_MODAL,
}: {
  isOpen: boolean
  onDismiss: () => void
  destroyOnClose?: boolean
  forceRender?: boolean
  children: React.ReactNode
  bg?: string
  maxWidth?: string
  offsetTop?: string
  offsetBottom?: string
  height?: string
  contentStyles?: CSSProperties
  bodyStyles?: CSSProperties
  keyboard?: boolean
  zIndex?: number
}) {
  const maxHeight = `calc(100svh - ${offsetTop} - ${offsetBottom})`
  const isMobile = useIsMobile()
  useEffect(() => {
    const handleBackButton = () => {
      if (!isOpen || !isMobile) return
      onDismiss()
    }
    window.addEventListener('popstate', handleBackButton)
    return () => {
      window.removeEventListener('popstate', handleBackButton)
    }
  }, [isOpen, isMobile])
  return (
    <>
      <RcDialogStyle />
      <Dialog
        keyboard={keyboard}
        visible={isOpen}
        // wrapClassName={wrapClassName}
        animation="fade"
        maskAnimation="fade"
        onClose={onDismiss}
        // style={style}
        // title="dialog1"
        // mousePosition={mousePosition}
        destroyOnClose={destroyOnClose}
        // closeIcon={useIcon ? getSvg(clearPath, {}, true) : undefined}
        closeIcon={<></>}
        forceRender={forceRender}
        zIndex={zIndex}
        styles={{
          wrapper: {
            margin: 0,
            padding: 0,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'start',
          },
          mask: { backgroundColor: themeColors.modalBG1 },
          content: {
            padding: 0,
            margin: 0,
            borderRadius: 0,
            ...contentStyles,
          },
          body: {
            padding: 0,
            margin: 0,
            backgroundColor: bg,
            ...bodyStyles,
          },
        }}
        style={{
          height: height || isMobile ? '100svh' : 'auto',
          width: '100svw',
          margin: 0,
          padding: 0,
          marginTop: offsetTop,
          marginBottom: offsetBottom,
          maxWidth,
          maxHeight,
          overflow: 'hidden auto',
        }}
        // focusTriggerAfterClose={false}
      >
        {children}
      </Dialog>
    </>
  )
}
