import { ReactElement } from 'react'
import styled, { css } from 'styled-components/macro'

import { Box } from 'theme/base'

const Line = styled.span.attrs({ className: 'hamburger-line' })`
  display: block;
  height: 2px;
  width: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral3};
  transition: transform 0.4s ease-in-out;
  transform-origin: center;
`

const Line1 = styled(Line)`
  transition: transform 0.2s ease-in-out;
`
const Line3 = styled(Line)`
  transition: transform 0.2s ease-in-out;
`
const Line2 = styled(Line)`
  position: absolute;
  left: 0;
  top: 0;
`
const Line4 = styled(Line)`
  position: absolute;
  left: 0;
  top: 0;
`

export const Wrapper = styled.div<{ active: boolean }>`
  cursor: pointer;
  height: 24px;
  width: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  ${({ active }) =>
    active &&
    css`
      ${Line1}, ${Line3} {
        transform: scaleY(0);
      }
      ${Line2} {
        transform: rotate(45deg) scaleX(1.1);
      }
      ${Line4} {
        transform: rotate(-45deg) scaleX(1.1);
      }
    `}
`
interface Props {
  active: boolean
  onClick: () => void
}

const HamburgerMenu = ({ active, onClick }: Props): ReactElement => {
  return (
    <Wrapper active={active} onClick={onClick} className="hamburger-menu">
      <Line1 />
      <Box sx={{ height: '2px', width: '100%', position: 'relative' }}>
        <Line2 />
        <Line4 />
      </Box>
      <Line3 />
    </Wrapper>
  )
}

HamburgerMenu.displayName = `HamburgerMenu`
export default HamburgerMenu
