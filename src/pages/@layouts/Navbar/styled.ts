import styled, { css } from 'styled-components/macro'

import { Box, Flex } from 'theme/base'
import { MEDIA_WIDTHS } from 'theme/theme'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import { transition } from 'utils/helpers/css'

import { LARGE_BREAK_POINT } from './configs'

export const SearchWrapper = styled<any>(Box)`
  position: relative;
`

export const SearchResult = styled<any>(Box)`
  position: absolute;
  top: 48px;
  left: 0;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.neutral7};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral4};
  z-index: 4;
  max-height: 80vh;
  overflow: auto;
`

export const SearchResultFixed = styled<any>(Box)`
  position: absolute;
  top: 48px;
  left: 0;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.neutral7};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral4};
  z-index: 4;
`

export const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  background: ${({ theme }) => `${theme.colors.neutral7}`};
  padding-left: 16px;
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.neutral4}`};
  @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) or (-moz-backdrop-filter: blur(20px)) {
    background: ${({ theme }) => `${theme.colors.neutral7}`};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    -mox-backdrop-filter: blur(20px);
  }
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
    z-index: 100;
    top: ${({ top }) => (top == null ? NAVBAR_HEIGHT : top)}px;
    left: 0;
    height: calc(100vh - ${NAVBAR_HEIGHT}px);
    width: 100%;
    display: block;
    background: #0b0e18d6;
    transform: translateX(100%);
    ${transition()}

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
