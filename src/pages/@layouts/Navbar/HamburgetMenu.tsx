import { ReactElement } from 'react'
import styled from 'styled-components/macro'

const Line = styled.span`
  display: block;
  height: 2px;
  width: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.neutral3};
`

// export const Line1 = styled.span`
//   ${line};
//   transform-origin: 0% 0%;
//   transition: transform 0.4s ease-in-out;
// `
// export const Line2 = styled.span`
//   ${line};
//   transition: transform 0.2s ease-in-out;
// `
// export const Line3 = styled.span`
//   ${line};
//   transform-origin: 0% 100%;
//   transition: transform 0.4s ease-in-out;
// `

export const Wrapper = styled.div<{ active: boolean }>`
  cursor: pointer;
  height: 24px;
  width: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
// ${({ active }) =>
// active &&
// css`
//   ${Line1} {
//     transform: rotate(45deg);
//   }
//   ${Line2} {
//     transform: scaleY(0);
//   }
//   ${Line3} {
//     transform: rotate(-45deg);
//   }
// `}
interface Props {
  active: boolean
  onClick: () => void
}

const HamburgerMenu = ({ active, onClick }: Props): ReactElement => {
  return (
    <Wrapper active={active} onClick={onClick}>
      <Line />
      <Line />
      <Line />
    </Wrapper>
  )
}

HamburgerMenu.displayName = `HamburgerMenu`
export default HamburgerMenu
