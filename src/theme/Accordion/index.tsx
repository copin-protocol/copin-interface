import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { Box, Flex, IconBox } from 'theme/base'

export default function Accordion({
  disabled,
  defaultOpen = false,
  header,
  body,
  wrapperSx = {},
  headerWrapperSx = {},
  type = 'horizontal',
  direction = 'right',
  iconSize = 16,
  subHeader,
}: {
  disabled?: boolean
  header: ReactNode
  subHeader?: ReactNode
  body: ReactNode
  wrapperSx?: any
  headerWrapperSx?: any
  defaultOpen?: boolean
  type?: 'horizontal' | 'vertical'
  direction?: 'left' | 'right'
  iconSize?: number
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
          ...wrapperSx,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            '& svg': {
              color: 'neutral3',
            },
            ...headerWrapperSx,
          }}
        >
          <Box
            sx={{
              order: direction === 'right' ? 0 : 1,
              width: '100%',
              height: '100%',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => !disabled && setIsExpand((prev) => !prev)}
          >
            {header}
          </Box>
          {isExpand ? (
            <CaretUp
              className="icon"
              weight="bold"
              size={iconSize}
              style={{
                flexShrink: 0,
                marginLeft: '8px',
                order: direction === 'right' ? 1 : 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !disabled && setIsExpand((prev) => !prev)}
            />
          ) : (
            <CaretDown
              className="icon"
              weight="bold"
              size={iconSize}
              style={{
                flexShrink: 0,
                marginLeft: '8px',
                order: direction === 'right' ? 1 : 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !disabled && setIsExpand((prev) => !prev)}
            />
          )}
          {isExpand && subHeader}
        </Box>
        {!disabled && (
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
        )}
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
            borderTop: '1px dashed',
            borderTopColor: 'neutral4',
            cursor: 'pointer',
          }}
          onClick={() => setIsExpand((prev) => !prev)}
        >
          <IconBox color="neutral3" icon={isExpand ? <CaretUp size={iconSize} /> : <CaretDown size={iconSize} />} />
        </Flex>
      </Box>
    )
  }
  return <></>
}
