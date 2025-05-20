import styled, { css } from 'styled-components/macro'

import { SearchResult } from 'theme/Search'
import { Flex } from 'theme/base'
import { MEDIA_WIDTHS } from 'theme/theme'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import { Z_INDEX } from 'utils/config/zIndex'
import { transition } from 'utils/helpers/css'

const LARGE_BREAK_POINT = 1400

export const displayMobileStyles = {
  [`@media all and (max-width: ${LARGE_BREAK_POINT}px)`]: { display: 'block' },
}

export const hiddenMobileStyles = {
  [`@media all and (max-width: ${LARGE_BREAK_POINT}px)`]: { display: 'none' },
}

export const SearchResultFixed = styled(SearchResult)`
  background-color: ${({ theme }) => theme.colors.neutral7};
  overflow: visible;
  max-height: none;
`

export const Main = styled(Flex)`
  gap: 16px;
  margin: 0 auto;
  height: 100%;
  justify-content: space-between;
  align-items: center;
`

export const LogoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const MenuWrapper = styled.div<{ visible: boolean; top?: number }>`
  display: none;

  @media screen and (max-width: ${LARGE_BREAK_POINT}px) {
    position: fixed;
    z-index: ${Z_INDEX.THEME_MODAL + 1};
    top: ${({ top }) => (top == null ? NAVBAR_HEIGHT : top)}px;
    margin-top: 1px;
    left: 0;
    height: ${({ top }) => `calc(100vh - ${top == null ? NAVBAR_HEIGHT : top}px)`};
    width: 100%;
    display: block;
    background: #0b0e18d6;
    transform: translateX(100%);
    ${transition()}
    overflow-y: auto;

    ${({ visible }) => {
      return visible
        ? css`
            transform: translateX(0);
          `
        : ''
    }}
  }
`

export const HamburgerMenuWrapper = styled(Flex)`
  display: none;
  @media screen and (max-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: flex;
    align-items: center;
  }
`

export const CloseBtn = styled.div`
  display: none;
  padding: 4px;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.neutral1};
  width: fit-content;
  margin: 0 -5px;
  margin-bottom: 30px;
  border: 1px solid ${({ theme }) => theme.colors.neutral5};
  border-radius: 50%;

  @media screen and (max-width: ${MEDIA_WIDTHS.upToMedium}px) {
    display: flex;
    align-items: center;
  }
`
