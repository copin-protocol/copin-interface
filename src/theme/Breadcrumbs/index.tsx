import { CaretRight } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { Box, Flex, LinkText, Type } from 'theme/base'
import { overflowEllipsis } from 'utils/helpers/css'

export type BreadcrumbItem = {
  title: ReactNode
  path?: string
  textColor?: string
}

const renderBreadcrumbItem = (item: BreadcrumbItem) =>
  item.path ? (
    <Flex sx={{ alignItems: 'center' }}>
      <Type.Caption width="100%" color="inherit" sx={{ ...overflowEllipsis() }}>
        <LinkText to={item.path}>{item.title}</LinkText>
      </Type.Caption>
    </Flex>
  ) : (
    <Type.Caption width="100%" color="inherit" sx={{ ...overflowEllipsis(), flexShrink: 0 }}>
      {item.title}
    </Type.Caption>
  )

function Breadcrumb({ items, type }: { items?: BreadcrumbItem[]; type?: 'light' }) {
  return (
    <Box mb={3}>
      {items?.length === 1 ? (
        <Type.H4 textAlign="center">{items?.[0]?.title}</Type.H4>
      ) : (
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            {items?.map((item, index) => {
              if (index === items.length - 1) {
                return (
                  <Box flex="1" color={type === 'light' ? 'neutral1' : 'neutral1'} key={index} lineHeight="0">
                    {renderBreadcrumbItem(item)}
                  </Box>
                )
              }
              return (
                <Flex key={index} color={type === 'light' ? 'neutral3' : 'neutral3'} alignItems="center">
                  {renderBreadcrumbItem(item)}
                  <Box mx={2} verticalAlign="middle" lineHeight="0">
                    <CaretRight size={16} />
                  </Box>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      )}
    </Box>
  )
}

export default Breadcrumb
