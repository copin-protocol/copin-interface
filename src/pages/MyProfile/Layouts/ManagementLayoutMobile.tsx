import { Trans } from '@lingui/macro'
import { ReactNode, useState } from 'react'

import Divider from 'components/@ui/Divider'
import { Box, Flex, Type } from 'theme/base'

import { LayoutComponents } from './types'

enum TabEnum {
  SETTINGS = 'settings',
  POSITIONS = 'positions',
  CHART = 'chart',
}
const tabConfigs = [
  { id: TabEnum.SETTINGS, title: <Trans>Copies</Trans> },
  { id: TabEnum.POSITIONS, title: <Trans>Opening Positions</Trans> },
  { id: TabEnum.CHART, title: <Trans>Charts</Trans> },
]

const TabButton = ({
  // icon: TabIcon,
  title,
  isActive,
  onClick,
}: {
  // icon: Icon
  title: ReactNode
  isActive: boolean
  onClick: () => void
}) => (
  <Flex role="button" onClick={onClick} width="fit-content" sx={{ gap: 2 }} justifyContent="center" alignItems="center">
    {/* <IconBox color={isActive ? 'primary1' : 'neutral3'} icon={<TabIcon size={24} />}></IconBox> */}
    <Type.BodyBold color={isActive ? 'neutral1' : 'neutral3'}>{title}</Type.BodyBold>
  </Flex>
)

export default function ManagementLayoutMobile({ balanceMenu, mainSection, positionsTable, stats }: LayoutComponents) {
  const [tab, setTab] = useState(TabEnum.SETTINGS)
  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <Flex sx={{ height: '100%', width: '100%', flexDirection: 'column' }}>
        {balanceMenu}
        <Divider />
        <Flex sx={{ px: 3, py: 2, gap: 3 }}>
          {tabConfigs.map((configs) => (
            <TabButton
              key={configs.id}
              title={configs.title}
              isActive={tab === configs.id}
              onClick={() => setTab(configs.id)}
            />
          ))}
        </Flex>
        <Divider />
        <Box flex="1 0 0" overflow="hidden">
          {tab === TabEnum.SETTINGS && mainSection}
          {tab === TabEnum.POSITIONS && positionsTable}
          {tab === TabEnum.CHART && stats}
        </Box>
      </Flex>
    </Box>
  )
}
