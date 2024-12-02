import { useLayoutEffect, useRef } from 'react'

import { renderRowBackground } from 'pages/PerpDEXsExplorer/helpers/renderHelper'
import useTriggerRenderTableBg from 'pages/PerpDEXsExplorer/hooks/useTriggerRenderTableBg'
import { Box } from 'theme/base'

export default function Wrapper({ children, data }: { children: any; data: any }) {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const { triggerKey } = useTriggerRenderTableBg()
  useLayoutEffect(() => {
    if (!tableWrapperRef.current) return
    renderRowBackground(tableWrapperRef.current) // render even odd bg
  }, [data, triggerKey])
  return (
    <Box ref={tableWrapperRef} sx={{ width: '100%', height: '100%' }}>
      {children}
    </Box>
  )
}
