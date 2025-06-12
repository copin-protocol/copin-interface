import { Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Box, Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { overflowEllipsis } from 'utils/helpers/css'

export type BreadcrumbItem = {
  title: ReactNode
  path?: string
  textColor?: string
}

const BreadcrumbItem = ({ item }: { item: BreadcrumbItem }) =>
  item.path ? (
    <Box as={Link} display="block" to={item.path} sx={{ height: '18px' }}>
      <Type.Body sx={{ ...overflowEllipsis() }}>{item.title}</Type.Body>
    </Box>
  ) : (
    <Type.Body color="inherit" sx={{ ...overflowEllipsis(), flexShrink: 0 }}>
      {item.title}
    </Type.Body>
  )

function Breadcrumb({ items, hasLine, sx }: { items?: BreadcrumbItem[]; hasLine?: boolean } & SxProps) {
  return (
    <Box sx={sx}>
      {items?.length === 1 ? (
        <Type.H4 textAlign="center">{items?.[0]?.title}</Type.H4>
      ) : (
        <Flex
          alignItems="center"
          sx={{ gap: 2, px: 3, py: 12, borderBottom: hasLine ? 'small' : 'none', borderColor: 'neutral4', ...sx }}
        >
          {items?.map((item, index) => {
            if (index === items.length - 1) {
              return <BreadcrumbItem key={index} item={item} />
            }
            return (
              <Fragment key={index}>
                <BreadcrumbItem item={item} />
                <Type.Caption color="neutral3">/</Type.Caption>
              </Fragment>
            )
          })}
        </Flex>
      )}
    </Box>
  )
}

export default Breadcrumb
