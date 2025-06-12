import { SystemStyleObject } from '@styled-system/css'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'

import { Box, Flex } from 'theme/base'
import { BoxProps, SxProps } from 'theme/types'
import { PAGE_TITLE_HEIGHT, TAB_HEIGHT } from 'utils/config/constants'

import RouteTabItem from './RouteTabItem'

type TabPaneProps = {
  destroyOnInactive?: boolean
  children: ReactElement | ReactElement[] | string
  active?: boolean
  tab: ReactNode
  key: string
  activeIcon?: ReactNode
  icon?: ReactNode
  route?: string
  count?: number
  sx?: any
}

type TabsProps = {
  children: ReactElement[] | ReactElement
  defaultActiveKey?: string
  hasLine?: boolean
  hasOverlay?: boolean
  fullWidth?: boolean
  onChange?: (key: string) => void
  tabItemSx?: any
  tabItemActiveSx?: any
  tabIconSx?: any
  tabIconActiveSx?: any
  tabPanelSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
  headerSx?: SystemStyleObject & GridProps
  size?: 'lg' | 'md'
} & SxProps

export const TabPane = ({ active, children, destroyOnInactive, ...props }: TabPaneProps & BoxProps) => {
  return destroyOnInactive && !active ? (
    <Box display="none" />
  ) : (
    <Box display={active ? 'block' : 'none'} {...props}>
      {children}
    </Box>
  )
}

const Header = styled(Box)`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  & span {
    width: max-content;
  }
`

const HeaderOverlay = styled.div<{ hasOverlay: boolean }>`
  position: relative;
  display: flex;
  justify-content: start;
  flex: auto;
  width: 100%;
  ${({ hasOverlay, theme }) =>
    hasOverlay &&
    ` &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: calc(100% - 2px);
      width: 20px;
      background: linear-gradient(to right, ${theme.colors.neutral7}00, ${theme.colors.neutral7});
    }`}
`

const Tabs = ({
  children,
  defaultActiveKey,
  hasLine = true,
  hasOverlay,
  fullWidth = true,
  sx,
  headerSx,
  tabItemSx,
  tabItemActiveSx,
  tabIconSx,
  tabIconActiveSx,
  tabPanelSx,
  onChange,
  size = 'md',
}: TabsProps) => {
  const elements = (children as ReactElement[]).filter((e) => !!e)
  if (elements.length) {
    const tabs = elements
      .filter((c: ReactElement) => !!c && c.props.active !== false)
      .map((c: ReactElement) => ({
        key: c.key?.toString() ?? '',
        name: c.props.tab,
      }))
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <TabHeader
          size={size}
          configs={tabs}
          isActiveFn={(config) => config.key === defaultActiveKey}
          fullWidth={fullWidth}
          sx={headerSx}
          itemSx={tabItemSx}
          itemActiveSx={tabItemActiveSx}
          iconSx={tabIconSx}
          iconActiveSx={tabIconActiveSx}
          onClickItem={(key) => {
            onChange && onChange(key)
          }}
          hasLine={hasLine}
          hasOverlay={hasOverlay}
        />

        {elements.map((c: ReactElement) =>
          React.cloneElement(c, { active: defaultActiveKey === c.key?.toString(), sx: tabPanelSx })
        )}
      </Box>
    )
  }
  const child = children as ReactElement
  return (
    <Box sx={sx}>
      <Header mb={3} sx={{ borderBottom: 'small', borderColor: 'neutral6', ...headerSx }} display="flex">
        <RouteTabItem
          active={true}
          icon={!!child.props.activeIcon ? child.props.activeIcon : child.props.icon}
          sx={tabItemActiveSx ?? tabItemSx}
          iconSx={tabItemActiveSx ?? tabItemSx}
          onClick={() => onChange && onChange(child.props.key)}
          hasLine={hasLine}
          size={size}
          route={child.props.route}
        >
          {child.props.tab}
        </RouteTabItem>
      </Header>
      {React.cloneElement(child, { active: true })}
    </Box>
  )
}

export default Tabs

export type TabConfig = {
  name: ReactNode
  activeIcon?: ReactNode
  icon?: ReactNode
  key: string
  route?: string
  paramKey?: string
  count?: number
}
type TabHeadersProps = {
  configs: TabConfig[]
  isActiveFn: (config: TabConfig) => boolean
  fullWidth?: boolean
  sx?: any
  itemSx?: any
  itemActiveSx?: any
  iconSx?: any
  iconActiveSx?: any
  onClickItem?: (key: string) => void
  hasLine?: boolean
  hasOverlay?: boolean
  externalWidget?: ReactNode
  size?: 'lg' | 'md'
}
export function TabHeader({
  configs,
  isActiveFn,
  fullWidth = true,
  sx,
  itemSx,
  itemActiveSx,
  iconSx,
  iconActiveSx,
  onClickItem,
  hasLine,
  hasOverlay,
  externalWidget,
  size = 'md',
}: TabHeadersProps) {
  return (
    <Flex sx={{ width: '100%', ...sx }} alignItems="center">
      <Flex alignItems="center" flex={1} overflow="auto">
        <HeaderOverlay hasOverlay={hasOverlay ?? fullWidth}>
          <Header
            sx={{
              width: '100%',
            }}
          >
            <Flex
              className="tab-header"
              sx={{
                // width: '100%',
                alignItems: 'center',
                width: fullWidth ? ['100%', '100%', 'auto'] : 'max-content',
                '& > *': {
                  width: fullWidth ? ['100%', '100%', 'auto'] : 'max-content',
                },
                height: size === 'lg' ? PAGE_TITLE_HEIGHT : TAB_HEIGHT,
              }}
            >
              {configs.map((tab) => {
                const isActive = isActiveFn(tab)
                return (
                  <RouteTabItem
                    key={tab.key}
                    active={isActive}
                    icon={isActive && !!tab.activeIcon ? tab.activeIcon : tab.icon}
                    sx={isActive && !!itemActiveSx ? itemActiveSx : itemSx}
                    iconSx={isActive && !!iconActiveSx ? iconActiveSx : iconSx}
                    onClick={() => onClickItem?.(tab.key)}
                    hasLine={hasLine}
                    size={size}
                    route={tab.route}
                    count={tab.count}
                  >
                    {tab.name}
                  </RouteTabItem>
                )
              })}
              {fullWidth && hasLine && (
                <Box flex="1" sx={{ borderBottom: 'small', borderColor: 'neutral4', height: '100%' }}></Box>
              )}
            </Flex>
          </Header>
        </HeaderOverlay>
      </Flex>
      <Flex
        minWidth="fit-content"
        alignItems="center"
        height="100%"
        sx={{ borderBottom: hasLine ? 'small' : undefined, borderColor: 'neutral4' }}
      >
        {externalWidget}
      </Flex>
    </Flex>
  )
}
