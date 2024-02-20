import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

import { Box } from 'theme/base'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import { ELEMENT_IDS } from 'utils/config/keys'

import { MoreDropdownMobile } from './MoreDropdown'
import { MobileNavLinks } from './NavLinks'
import { MenuWrapper } from './styled'

interface Props {
  visible: boolean
  onClose?: () => void
}

export default function Menu({ visible, onClose }: Props) {
  const handleOutsideClick = (e: any) => {
    const target = e?.target as HTMLDivElement
    if (!target?.classList?.length) return
    if (target.classList.contains('hamburger-menu') || target.classList.contains('hamburger-line')) return
    onClose?.()
  }
  const [menuTop, setMenuTop] = useState(NAVBAR_HEIGHT)
  useEffect(() => {
    const handleResize = () => {
      const warningLimitWrapper = document.getElementById(ELEMENT_IDS.WARNING_LIMIT_VOLUME_WRAPPER)
      const bingXWrapper = document.getElementById(ELEMENT_IDS.BINGX_INFO_WRAPPER)
      const _menuTop = NAVBAR_HEIGHT + (warningLimitWrapper?.clientHeight ?? 0) + (bingXWrapper?.clientHeight ?? 0)
      setMenuTop(_menuTop)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [visible])
  return createPortal(
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <MenuWrapper visible={visible} top={menuTop}>
        <Box sx={{ bg: 'neutral8', p: 3 }}>
          <MobileNavLinks onClose={onClose} />
          <MoreDropdownMobile onClickItem={onClose} />
        </Box>
      </MenuWrapper>
    </OutsideClickHandler>,
    document.body
  )
}
