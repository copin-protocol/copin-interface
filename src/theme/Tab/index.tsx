import { SystemStyleObject } from '@styled-system/css'
import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { GridProps } from 'styled-system'

import { Box } from 'theme/base'
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
  const activeRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState(defaultActiveKey)
  const [defaultActiveTab, setDefaultActiveTab] = useState(defaultActiveKey)

  useEffect(() => {
    if (defaultActiveKey !== defaultActiveTab) {
      setDefaultActiveTab(defaultActiveKey)
      setActiveTab(defaultActiveKey)
    }
  }, [defaultActiveKey, defaultActiveTab])

  useEffect(() => {
    if (activeRef.current) {
      headerRef.current?.scrollTo({ left: activeRef.current.getBoundingClientRect().x, behavior: 'smooth' })
    }
  }, [activeTab])

  const elements = children as ReactElement[]
  if (elements.length) {
    const tabs = elements
      .filter((c: ReactElement) => c.props.active !== false)
      .map((c: ReactElement) => ({
        key: c.key?.toString(),
        name: c.props.tab,
      }))
    return (
      <Box sx={{ width: '100%', ...sx }}>
        <HeaderOverlay hasOverlay={fullWidth}>
          <Header
            ref={headerRef}
            mb={3}
            sx={{
              display: fullWidth ? 'flex' : ['flex', 'flex', 'block'],
              gap: 28,
              ...headerSx,
            }}
          >
            {tabs.map((tab) => (
              <TabItem
                ref={activeTab === tab.key ? activeRef : null}
                type="button"
                size="lg"
                onClick={() => {
                  setActiveTab(tab.key)
                  onChange && onChange(tab?.key?.toString() || '')
                }}
                active={activeTab === tab.key}
                inactiveHasLine={inactiveHasLine}
                key={tab.key}
                sx={{
                  flex: '1 1 auto',
                  ...tabItemSx,
                  ...(activeTab === tab.key ? tabItemActiveSx : {}),
                }}
              >
                {tab.name}
              </TabItem>
            ))}
            {/* {!block && <Box flex="0 0 50px" height="100%"></Box>} */}
          </Header>
        </HeaderOverlay>

        {elements.map((c: ReactElement) =>
          React.cloneElement(c, { active: activeTab === c.key?.toString(), sx: tabPanelSx })
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
