import React from 'react'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
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
  opacity: ${({ disabled }) => (disabled ? '0' : '1')};
  position: absolute;
  top: 0;
  left: ${({ pos }) => (pos === 'left' ? 0 : 'auto')};
  right: ${({ pos }) => (pos === 'right' ? 0 : 'auto')};
  height: 100%;
  width: 32px;
  background: linear-gradient(to ${({ pos }) => pos}, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.5));
  transition: all 360ms ease;
  z-index: 1;
`

export function Right() {
  const { isLastItemVisible, visibleItemsWithoutSeparators } = React.useContext(VisibilityContext)

  const [disabled, setDisabled] = React.useState(!visibleItemsWithoutSeparators.length && isLastItemVisible)
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible)
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators])
  return <Shadow disabled={disabled} pos="right" />
}

export function Left() {
  const { isFirstItemVisible, visibleItemsWithoutSeparators, initComplete } = React.useContext(VisibilityContext)

  const [disabled, setDisabled] = React.useState(!initComplete || (initComplete && isFirstItemVisible))
  React.useEffect(() => {
    // NOTE: detect if whole component visible
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isFirstItemVisible)
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators])
  return <Shadow disabled={disabled} pos="left" />
}

const HorizontalScroll = ({ children }: any) => {
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
        onMouseDown={() => dragStart}
        onMouseUp={() => dragStop}
        onMouseMove={handleDrag}
        RightArrow={Right}
        LeftArrow={Left}
      >
        {children}
      </ScrollMenu>
    </div>
  )
}

export default HorizontalScroll
