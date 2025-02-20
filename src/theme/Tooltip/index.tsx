import { ComponentProps } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import { Box } from 'theme/base'

// function Tooltip(props: any) {
function Tooltip(props: ComponentProps<typeof ReactTooltip>) {
  return (
    // <BodyPortal>
    <ReactTooltip
      variant="dark"
      place="top"
      globalCloseEvents={{ scroll: true }}
      positionStrategy="fixed"
      className="custom_react_tooltip_css"
      style={{ padding: 0 }}
      classNameArrow={
        props.place === 'bottom'
          ? 'custom_react_tooltip_arrow_place_bottom_css'
          : 'custom_react_tooltip_arrow_place_top_css'
      }
      {...props}
    >
      <Box sx={{ p: 2, maxHeight: 350, overflow: 'auto' }}>{props.children as any}</Box>
    </ReactTooltip>
    // </BodyPortal>
  )
}

export default Tooltip
