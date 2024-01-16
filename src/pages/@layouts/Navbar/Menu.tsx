import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

import { Box } from 'theme/base'

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
  return createPortal(
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <MenuWrapper visible={visible}>
        <Box sx={{ bg: 'neutral8', p: 3 }}>
          <MobileNavLinks onClose={onClose} />
          <MoreDropdownMobile onClickItem={onClose} />
        </Box>
      </MenuWrapper>
    </OutsideClickHandler>,
    document.body
  )
}
