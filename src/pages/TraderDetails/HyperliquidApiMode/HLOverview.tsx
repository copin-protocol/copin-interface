import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'

import { useHyperliquidTraderContext } from 'hooks/features/trader/useHyperliquidTraderContext'
import Tabs, { TabConfig, TabPane } from 'theme/Tab'
import { Box, Flex } from 'theme/base'

import HLDepositWithdraw from './HLDepositWithdraw'
import HLPerformance from './HLPerformance'
import HLPortfolio from './HLPortfolio'
import HLSpotHolding from './HLSpotHolding'

enum TabEnum {
  PERFORMANCE = 'PERFORMANCE',
  PORTFOLIO = 'PORTFOLIO',
  SPOT = 'SPOT',
  DEPOSIT = 'DEPOSIT',
}

const tabsDesktop: TabConfig[] = [
  {
    key: TabEnum.DEPOSIT,
    name: <Trans>DEPOSIT & WITHDRAW</Trans>,
  },
  {
    key: TabEnum.SPOT,
    name: <Trans>SPOT HOLDINGS</Trans>,
  },
]

const tabsMobile: TabConfig[] = [
  {
    key: TabEnum.PERFORMANCE,
    name: <Trans>PERP PERFORMANCE</Trans>,
  },
  {
    key: TabEnum.PORTFOLIO,
    name: <Trans>PORTFOLIO</Trans>,
  },
  {
    key: TabEnum.DEPOSIT,
    name: <Trans>DEPOSIT & WITHDRAW</Trans>,
  },
  {
    key: TabEnum.SPOT,
    name: <Trans>SPOT HOLDINGS</Trans>,
  },
]

export default function HLOverview() {
  const { xl } = useResponsive()
  const { hlAccountSpotData, address } = useHyperliquidTraderContext()
  const [tab, setTab] = useState<TabEnum>(xl ? TabEnum.DEPOSIT : TabEnum.PERFORMANCE)

  return (
    <Flex flexDirection="column" width="100%" height={xl ? 'calc(100% - 40px)' : '100%'}>
      <Tabs
        defaultActiveKey={tab}
        onChange={(tab) => setTab(tab as TabEnum)}
        sx={{
          width: '100%',
        }}
      >
        {(xl ? tabsDesktop : tabsMobile).map((tab) => (
          <TabPane tab={tab.name} key={tab.key}>
            <></>
          </TabPane>
        ))}
      </Tabs>
      {!xl && tab === TabEnum.PERFORMANCE && (
        <Box p={12}>
          <HLPerformance />
        </Box>
      )}
      {!xl && tab === TabEnum.PORTFOLIO && <HLPortfolio />}
      {tab === TabEnum.SPOT && <HLSpotHolding hlAccountSpotData={hlAccountSpotData} />}
      {tab === TabEnum.DEPOSIT && <HLDepositWithdraw address={address} />}
    </Flex>
  )
}
