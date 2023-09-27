import styled, { css } from 'styled-components/macro'

import { Box, Flex } from 'theme/base'
import { MEDIA_WIDTHS } from 'theme/theme'
import { transition } from 'utils/helpers/css'

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
  padding: 4px 6px;
  z-index: 4;
`

export const Wrapper = styled(Box)`
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

export const MenuWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  gap: 30px;

  p a {
    color: ${({ theme }) => theme.colors.neutral3};
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;

    &:hover {
      color: ${({ theme }) => theme.colors.neutral3};
      border-bottom: 2px solid ${({ theme }) => theme.colors.primary1};
      padding-bottom: 6px;
    }
  }

  @media screen and (max-width: ${MEDIA_WIDTHS.upToMedium}px) {
    position: fixed;
    z-index: 107;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: block;
    background: ${({ theme }) => theme.colors.neutral7};
    backdrop-filter: blur(10px);
    padding: 30px 20px;
    transform: translateX(-100%);
    ${transition()}

    p {
      margin-bottom: 30px;
    }

    p a {
      font-size: 15px;
      text-transform: capitalize;
    }

    ${({ visible }) => {
      return visible
        ? css`
            transform: translateX(0);
          `
        : ''
    }}
  }

  @media screen and (max-width: ${MEDIA_WIDTHS.upToSmall}px) {
    gap: 15px;

    p a {
      font-size: 15px;
      text-transform: capitalize;
    }
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
