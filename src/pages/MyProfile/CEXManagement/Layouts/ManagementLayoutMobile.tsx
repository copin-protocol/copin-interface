import { Trans } from '@lingui/macro'
import { useState } from 'react'

import Divider from 'components/@ui/Divider'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'

import { MainLayoutComponents } from './types'

enum TabEnum {
  SETTINGS = 'settings',
  POSITIONS = 'positions',
  CHART = 'chart',
}
const tabConfigs: TabConfig[] = [
  { key: TabEnum.SETTINGS, name: <Trans>COPIES</Trans> },
  { key: TabEnum.POSITIONS, name: <Trans>OPENING POSITIONS</Trans> },
  { key: TabEnum.CHART, name: <Trans>CHARTS</Trans> },
]

export default function ManagementLayoutMobile({
  balanceMenu,
  mainSection,
  positionsTable,
  stats,
}: MainLayoutComponents) {
  const [tab, setTab] = useState(TabEnum.SETTINGS)
  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <Flex sx={{ height: '100%', width: '100%', flexDirection: 'column' }}>
        {balanceMenu}
        <Divider />
        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config: TabConfig) => (config.key as TabEnum) === tab}
          onClickItem={(key: string) => setTab(key as TabEnum)}
          size="md"
          hasLine={false}
          fullWidth={false}
        />
        {/* <Flex sx={{ px: 3, py: 3, gap: 3 }}>
          {tabConfigs.map((configs) => (
            <TabButton
              key={configs.id}
              title={configs.title}
              isActive={tab === configs.id}
              onClick={() => setTab(configs.id)}
            />
          ))}
        </Flex> */}
        <Divider />
        <Box flex="1 0 0" overflow="hidden">
          {tab === TabEnum.SETTINGS && mainSection}
          {tab === TabEnum.POSITIONS && positionsTable}
          {tab === TabEnum.CHART && (
            <Box maxHeight={300} height="100%">
              {stats}
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
