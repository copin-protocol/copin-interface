import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { Box } from 'theme/base'

export default function Accordion({
  defaultOpen = false,
  header,
  body,
  wrapperSx,
}: {
  header: ReactNode
  body: ReactNode
  wrapperSx?: any
  defaultOpen?: boolean
}) {
  const [isExpand, setIsExpand] = useState(false)
  const firstUpdated = useRef(false)
  useEffect(() => {
    if (firstUpdated.current) return
    if (!!defaultOpen) {
      firstUpdated.current = true
      setIsExpand(true)
    }
  }, [defaultOpen])
  return (
    <Box
      sx={{
        borderBottom: 'normal',
        borderBottomColor: 'neutral6',
        padding: '16px 0',
        ...(wrapperSx || {}),
      }}
    >
      <Box
        onClick={() => setIsExpand((prev) => !prev)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '& svg': {
            color: 'primary1',
          },
        }}
      >
        {header}
        {isExpand ? (
          <CaretUp weight="bold" size={24} style={{ flexShrink: 0, marginLeft: '8px' }} />
        ) : (
          <CaretDown weight="bold" size={24} style={{ flexShrink: 0, marginLeft: '8px' }} />
        )}
      </Box>
      <Box
        sx={{
          height: 'max-content',
          maxHeight: isExpand ? '999px' : '0px',
          transition: isExpand ? 'max-height 1s ease-in-out' : 'max-height 0.5s cubic-bezier(0, 1, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {body}
      </Box>
    </Box>
  )
}
