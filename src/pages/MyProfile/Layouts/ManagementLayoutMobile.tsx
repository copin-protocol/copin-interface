import { ChartLine, Icon, Nut, Pulse } from '@phosphor-icons/react'
import React, { useState } from 'react'

import Divider from 'components/@ui/Divider'
import { Box, Flex, IconBox, Type } from 'theme/base'

import { LayoutComponents } from './types'

enum TabEnum {
  ACCOUNT = 'account',
  POSITIONS = 'positions',
  CHART = 'chart',
}

const TabButton = ({
  icon: TabIcon,
  title,
  isActive,
  onClick,
}: {
  icon: Icon
  title: string
  isActive: boolean
  onClick: () => void
}) => (
  <Flex role="button" onClick={onClick} width="fit-content" sx={{ gap: 2 }} justifyContent="center" alignItems="center">
    <IconBox color={isActive ? 'primary1' : 'neutral3'} icon={<TabIcon size={24} />}></IconBox>
    <Type.BodyBold color={isActive ? 'neutral1' : 'neutral3'}>{title}</Type.BodyBold>
  </Flex>
)

export default function ManagementLayoutMobile({ balanceMenu, mainSection, positionsTable, stats }: LayoutComponents) {
  const [tab, setTab] = useState(TabEnum.ACCOUNT)
  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <Flex sx={{ height: '100%', width: '100%', flexDirection: 'column' }}>
        {balanceMenu}
        <Divider />
        <Box flex="1 0 0" overflow="hidden">
          {tab === TabEnum.ACCOUNT && mainSection}
          {tab === TabEnum.POSITIONS && positionsTable}
          {tab === TabEnum.CHART && stats}
        </Box>
        <Flex
          sx={{
            width: '100%',
            height: 56,
            bg: 'neutral7',
            justifyContent: 'space-around',
            borderTop: 'small',
            borderColor: 'neutral4',
          }}
        >
          <TabButton
            icon={Nut}
            title="Settings"
            isActive={tab === TabEnum.ACCOUNT}
            onClick={() => setTab(TabEnum.ACCOUNT)}
          />
          <TabButton
            icon={Pulse}
            title="Positions"
            isActive={tab === TabEnum.POSITIONS}
            onClick={() => setTab(TabEnum.POSITIONS)}
          />
          <TabButton
            icon={ChartLine}
            title="Chart"
            isActive={tab === TabEnum.CHART}
            onClick={() => setTab(TabEnum.CHART)}
          />
        </Flex>
      </Flex>
    </Box>
  )
}
