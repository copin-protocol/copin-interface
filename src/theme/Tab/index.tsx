import { SystemStyleObject } from '@styled-system/css'
import React, { ReactElement, ReactNode } from 'react'
import { Link } from 'react-router-dom'
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
          mb={3}
          sx={{
            display: fullWidth ? 'flex' : ['flex', 'flex', 'block'],
            gap: 28,
            ...sx,
          }}
        >
          {configs.map((tab) => {
            const isActive = isActiveFn(tab)
            return (
              <TabItem
                key={tab.key}
                as={tab.route ? Link : undefined}
                to={tab.route ?? ''}
                type="button"
                size="lg"
                onClick={onClickItem ? () => onClickItem(tab.key) : undefined}
                active={isActive}
                inactiveHasLine={inactiveHasLine}
                sx={{
                  flex: '1 1 auto',
                  ...(tab.route
                    ? {
                        '&:active,&:focus,&:hover': { color: 'primary1' },
                      }
                    : {}),
                  ...itemSx,
                  ...(isActive ? itemActiveSx : {}),
                }}
              >
                {tab.activeIcon && tab.inactiveIcon ? (
                  <Flex alignItems="center" sx={{ gap: 2 }}>
                    {isActive ? tab.activeIcon : tab.inactiveIcon}
                    <Box as="span">{tab.name}</Box>
                  </Flex>
                ) : (
                  tab.name
                )}
              </TabItem>
            )
          })}
        </Header>
      </HeaderOverlay>
    </Box>
  )
}
