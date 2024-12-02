import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'

import { Button } from 'theme/Buttons'
import { Box, Flex } from 'theme/base'

export function Accordion({
  header,
  pairs,
  subHeader,
  body,
}: {
  header: ReactNode
  subHeader: ReactNode
  body: ReactNode
  pairs: ReactNode
}) {
  const [isExpand, setIsExpand] = useState(false)
  return (
    <Box px={2} py={12}>
      <Box>
        <Flex mb={12} sx={{ gap: 3, alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>{header}</Box>
          <Flex sx={{ flexDirection: 'column', alignItems: 'end', flexShrink: 0 }}>
            <Button
              variant="ghostPrimary"
              onClick={() => setIsExpand((prev) => !prev)}
              sx={{ fontWeight: 'normal', p: 0, height: 24 }}
              mb={'2px'}
            >
              {isExpand ? (
                <>
                  Collapse <CaretUp weight="bold" size={16} style={{ verticalAlign: 'middle' }} />
                </>
              ) : (
                <>
                  Expand <CaretDown weight="bold" size={16} style={{ verticalAlign: 'middle' }} />
                </>
              )}
            </Button>
            {/* {pairs} */}
          </Flex>
        </Flex>
        {subHeader}
      </Box>
      <Box
        sx={{
          height: 'max-content',
          maxHeight: isExpand ? '9999px' : '0px',
          transition: isExpand ? 'max-height 1s ease-in-out' : 'max-height 0.5s cubic-bezier(0, 1, 0, 1)',
          overflow: 'hidden',
        }}
      >
        {body}
      </Box>
    </Box>
  )
}
