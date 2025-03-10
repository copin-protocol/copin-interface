import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

import { Box } from 'theme/base'
import { NAVBAR_HEIGHT } from 'utils/config/constants'

// import { ELEMENT_IDS } from 'utils/config/keys'
import { MoreDropdownMobile } from './MoreDropdown'
import { MobileEventNavLinks, MobileNavLinks } from './NavLinks'
import { MenuWrapper } from './styled'

interface Props {
  visible: boolean
  onClose?: () => void
  hasEvents?: boolean
}

export default function Menu({ visible, onClose, hasEvents }: Props) {
  const handleOutsideClick = (e: any) => {
    const target = e?.target as HTMLDivElement
    if (!target?.classList?.length) return
    if (target.classList.contains('hamburger-menu') || target.classList.contains('hamburger-line')) return
    onClose?.()
  }
  const [menuTop, setMenuTop] = useState(NAVBAR_HEIGHT)
  useEffect(() => {
    const handleResize = () => {
      // const bingXWrapper = document.getElementById(ELEMENT_IDS.BINGX_INFO_WRAPPER)
      // const _menuTop = NAVBAR_HEIGHT + (warningLimitWrapper?.clientHeight ?? 0) + (bingXWrapper?.clientHeight ?? 0)
      // TODO: Using when move banner on top
      // const warningBanner = document.getElementById(ELEMENT_IDS.WARNING_BANNER)
      // const _menuTop = NAVBAR_HEIGHT + (warningBanner?.clientHeight ?? 0)
      const _menuTop = NAVBAR_HEIGHT
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
          <MobileEventNavLinks onClose={onClose} hasEvents={hasEvents} />
          <MoreDropdownMobile onClickItem={onClose} hasEvents={hasEvents} />
        </Box>
      </MenuWrapper>
    </OutsideClickHandler>,
    document.body
  )
}
