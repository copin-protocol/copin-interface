import { SystemStyleObject } from '@styled-system/css'
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'

import { Box, Flex } from 'theme/base'
import { SxProps } from 'theme/types'

import TabItem from './TabItem'

type TabPaneProps = {
  children: ReactElement | ReactElement[] | string
  active?: boolean
  tab: ReactNode
  key: string
}

type TabsProps = {
  children: ReactElement[] | ReactElement
  defaultActiveKey?: string
  inactiveHasLine?: boolean
  fullWidth?: boolean
  onChange?: (key: string) => void
  tabItemSx?: SystemStyleObject & GridProps
  tabItemActiveSx?: SystemStyleObject & GridProps
  tabPanelSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
  headerSx?: SystemStyleObject & GridProps
} & SxProps

export const TabPane = styled(Box)<TabPaneProps>`
  display: ${(props) => (props.active ? 'block' : 'none')};
`

const Header = styled(Box)`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const HeaderOverlay = styled.div<{ hasOverlay: boolean }>`
  position: relative;
  display: flex;
  justify-content: start;
  ${({ hasOverlay }) =>
    hasOverlay &&
    ` &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      height: calc(100% - 2px);
      width: 48px;
    }`}
`

const Tabs = ({
  children,
  defaultActiveKey,
  inactiveHasLine = true,
  fullWidth = true,
  sx,
  headerSx,
  tabItemSx,
  tabItemActiveSx,
  tabPanelSx,
  onChange,
}: TabsProps) => {
  const elements = children as ReactElement[]
  if (elements.length) {
    const tabs = elements
      .filter((c: ReactElement) => c.props.active !== false)
      .map((c: ReactElement) => ({
        key: c.key?.toString() ?? '',
        name: c.props.tab,
      }))
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <TabHeader
          configs={tabs}
          isActiveFn={(config) => config.key === defaultActiveKey}
          fullWidth={fullWidth}
          sx={headerSx}
          itemSx={tabItemSx}
          itemActiveSx={tabItemActiveSx}
          onClickItem={(key) => {
            onChange && onChange(key)
          }}
          inactiveHasLine={inactiveHasLine}
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
        <TabItem active={true} key={child.key} type="button">
          {child.props.tab}
        </TabItem>
      </Header>
      {React.cloneElement(child, { active: true })}
    </Box>
  )
}

export default Tabs

export type TabConfig = {
  name: ReactNode
  activeIcon?: ReactNode
  inactiveIcon?: ReactNode
  key: string
  route?: string
  paramKey?: string
}
type TabHeadersProps = {
  configs: TabConfig[]
  isActiveFn: (config: TabConfig) => boolean
  fullWidth?: boolean
  sx?: any
  itemSx?: any
  itemActiveSx?: any
  onClickItem?: (key: string) => void
  inactiveHasLine?: boolean
}
export function TabHeader({
  configs,
  isActiveFn,
  fullWidth = true,
  sx,
  itemSx,
  itemActiveSx,
  onClickItem,
  inactiveHasLine,
}: TabHeadersProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <HeaderOverlay hasOverlay={fullWidth}>
        <Header
          sx={{
            px: 3,
            borderBottom: ['none', 'none', 'small'],
            borderBottomColor: ['none', 'none', 'neutral4'],
            width: '100%',
            display: fullWidth ? 'flex' : ['flex', 'flex', 'block'],
            gap: 28,
            ...sx,
          }}
        >
          {configs.map((tab) => {
            const isActive = isActiveFn(tab)
            return (
              <TabRouteItem
                key={tab.key}
                isActive={isActive}
                tabConfig={tab}
                itemOption={{
                  itemSx,
                  itemActiveSx,
                  onClickItem,
                  inactiveHasLine,
                }}
              />
            )
          })}
        </Header>
      </HeaderOverlay>
    </Box>
  )
}

function TabRouteItem({
  tabConfig,
  itemOption,
  isActive,
}: {
  tabConfig: TabConfig
  itemOption: Pick<TabHeadersProps, 'itemSx' | 'itemActiveSx' | 'onClickItem' | 'inactiveHasLine'>
  isActive: boolean
}) {
  const { search, pathname } = useLocation()
  const _search = useRef('')
  useEffect(() => {
    if (pathname === tabConfig.route) {
      _search.current = search
    }
  }, [pathname, search, tabConfig.route])
  return (
    <TabItem
      as={tabConfig.route ? Link : undefined}
      to={tabConfig.route ? tabConfig.route + _search.current : ''}
      type="button"
      size="lg"
      onClick={itemOption.onClickItem ? () => itemOption?.onClickItem?.(tabConfig.key) : undefined}
      active={isActive}
      inactiveHasLine={itemOption.inactiveHasLine}
      sx={{
        flex: ['1 0 auto', '1 0 auto', '0 0 auto'],
        ...(tabConfig.route
          ? {
              '&:active,&:focus,&:hover': { color: 'primary1' },
            }
          : {}),
        ...itemOption.itemSx,
        ...(isActive ? itemOption.itemActiveSx : {}),
      }}
    >
      {tabConfig.activeIcon && tabConfig.inactiveIcon ? (
        <Flex alignItems="center" sx={{ gap: 2 }}>
          {isActive ? tabConfig.activeIcon : tabConfig.inactiveIcon}
          <Box
            as="span"
            sx={{
              textTransform: ['lowercase', 'none'],
              '&:first-letter': { textTransform: 'uppercase' },
            }}
          >
            {tabConfig.name}
          </Box>
        </Flex>
      ) : (
        tabConfig.name
      )}
    </TabItem>
  )
}
