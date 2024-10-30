import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import React, { useEffect, useRef } from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
// eslint-disable-next-line no-restricted-imports
import 'react-horizontal-scrolling-menu/dist/styles.css'
import styled from 'styled-components/macro'

import useDrag from 'hooks/helpers/useDrag'

type ScrollVisibilityApiType = React.ContextType<typeof VisibilityContext>

function onWheel(apiObj: ScrollVisibilityApiType, ev: React.WheelEvent): void {
  const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15
  if (isTouchpad) {
    ev.stopPropagation()
    return
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext()
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev()
  }
}

const Shadow = styled.div<{ disabled: boolean; pos: 'left' | 'right' }>`
  opacity: ${({ disabled }) => (disabled ? '0' : '0.8')};
  position: absolute;
  top: 0;
  left: ${({ pos }) => (pos === 'left' ? 0 : 'auto')};
  right: ${({ pos }) => (pos === 'right' ? 0 : 'auto')};
  height: 100%;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ pos }) => (pos === 'right' ? 'padding-left: 8px' : 'padding-right: 8px')};
  background: linear-gradient(to ${({ pos }) => pos}, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 1));
  transition: all 360ms ease;
  z-index: 1;
`

export function Right() {
  const visibility = React.useContext(VisibilityContext)
  const isLastItemVisible = visibility.useIsVisible('last', false)

  return (
    <Shadow disabled={isLastItemVisible} pos="right" onClick={() => visibility.scrollNext()}>
      <CaretRight size={13} />
    </Shadow>
  )
}

export function Left() {
  const visibility = React.useContext(VisibilityContext)
  const isFirstItemVisible = visibility.useIsVisible('first', true)

  return (
    <Shadow disabled={isFirstItemVisible} pos="left" onClick={() => visibility.scrollPrev()}>
      <CaretLeft size={13} />
    </Shadow>
  )
}

function Footer({ defaultItem }: { defaultItem?: number }) {
  const hasInitRef = useRef<boolean>(false)
  const visibility = React.useContext(VisibilityContext)
  useEffect(() => {
    setTimeout(() => {
      if (defaultItem == null || visibility.items.size <= 0 || hasInitRef.current) return
      hasInitRef.current = true
      visibility.scrollToItem(visibility.getItemByIndex(defaultItem), 'auto', 'center')
    }, 360)
  }, [visibility, defaultItem])
  return <></>
}

const HorizontalScroll = ({ children, defaultItem }: { children: JSX.Element[]; defaultItem?: number }) => {
  const { dragStart, dragStop, dragMove } = useDrag()
  const handleDrag =
    ({ scrollContainer }: ScrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, (posDiff: number) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff
        }
      })
  return (
    <div onMouseLeave={dragStop} style={{ position: 'relative' }}>
      <ScrollMenu
        onWheel={onWheel}
        scrollContainerClassName="no-scroll"
        onMouseDown={() => dragStart}
        onMouseUp={() => dragStop}
        onMouseMove={handleDrag}
        RightArrow={Right}
        LeftArrow={Left}
        Footer={<Footer defaultItem={defaultItem} />}
      >
        {children}
      </ScrollMenu>
    </div>
  )
}

export default HorizontalScroll
