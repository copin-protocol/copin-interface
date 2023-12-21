import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { Box, Flex, IconBox } from 'theme/base'

export default function Accordion({
  defaultOpen = false,
  header,
  body,
  wrapperSx,
  type = 'horizontal',
}: {
  header: ReactNode
  body: ReactNode
  wrapperSx?: any
  defaultOpen?: boolean
  type?: 'horizontal' | 'vertical'
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
  if (type === 'horizontal') {
    return (
      <Box
        sx={{
          padding: '16px 0',
          ...(wrapperSx || {}),
        }}
      >
        <Box
          onClick={() => setIsExpand((prev) => !prev)}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            '& svg': {
              color: 'neutral3',
            },
          }}
        >
          {header}
          {isExpand ? (
            <CaretUp weight="bold" size={16} style={{ flexShrink: 0, marginLeft: '8px' }} />
          ) : (
            <CaretDown weight="bold" size={16} style={{ flexShrink: 0, marginLeft: '8px' }} />
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
  if (type === 'vertical') {
    return (
      <Box>
        {header}
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
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            pt: 2,
            width: '100%',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            cursor: 'pointer',
          }}
          onClick={() => setIsExpand((prev) => !prev)}
        >
          <IconBox color="neutral3" icon={isExpand ? <CaretUp size={16} /> : <CaretDown size={16} />} />
        </Flex>
      </Box>
    )
  }
  return <></>
}
