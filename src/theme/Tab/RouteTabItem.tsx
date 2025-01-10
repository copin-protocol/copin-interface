import { ReactNode, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Badge from 'theme/Badge'
import { ButtonProps } from 'theme/Buttons'
import { Box, IconBox } from 'theme/base'
import { SxProps } from 'theme/types'

import TabItem, { TabItemProps } from './TabItem'

const RouteTabItem = ({
  icon,
  children,
  active,
  sx,
  iconSx,
  route,
  count,
  ...props
}: {
  icon: ReactNode
  children?: ReactNode
  active: boolean
  iconSx: SxProps
  route?: string
  count?: number
} & ButtonProps &
  TabItemProps) => {
  const { search, pathname } = useLocation()
  const _search = useRef('')
  useEffect(() => {
    if (pathname === route) {
      _search.current = search
    }
  }, [pathname, search, route])
  return (
    <TabItem
      as={route ? Link : undefined}
      to={route ? route + _search.current : ''}
      display="flex"
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        height: '100%',
        '& .tab-item-icon': {
          color: active ? 'neutral1' : 'neutral3',
          ...iconSx,
        },
        '&:hover .tab-item-icon, &:focus .tab-item-icon, &:active .tab-item-icon': {
          color: 'neutral1',
        },
        ...sx,
      }}
      active={active}
      {...props}
    >
      {!!icon && <IconBox className="tab-item-icon" icon={icon} />}
      <Box as="span">{children}</Box>
      {!!count && <Badge count={count} />}
    </TabItem>
  )
}

export default RouteTabItem
