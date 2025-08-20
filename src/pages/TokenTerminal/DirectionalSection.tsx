import { Trans } from '@lingui/macro'
import React, { useState } from 'react'

import { PositionData } from 'entities/trader'
import { TabHeader } from 'theme/Tab'
import { Box } from 'theme/base'

import ClosedPositionsSection from './ClosedPositionsSection'
import OrdersSection from './OrdersSection'

enum TabEnum {
  CLOSED_POSITIONS = 'CLOSED_POSITIONS',
  RECENT_ORDERS = 'RECENT_ORDERS',
}

const tabConfigs = [
  {
    name: <Trans>Closed Positions</Trans>,
    key: TabEnum.CLOSED_POSITIONS,
  },
  {
    name: <Trans>Recent Orders</Trans>,
    key: TabEnum.RECENT_ORDERS,
  },
]

const DirectionalSection = ({
  token,
  sizeFilter,
  selectedAccounts,
  isLong,
  onSelectPosition,
}: {
  token: string
  sizeFilter: { gte: string | undefined; lte: string | undefined } | null
  selectedAccounts: string[] | null
  isLong: boolean
  onSelectPosition: (position: PositionData) => void
}) => {
  const [tab, setTab] = useState<TabEnum>(TabEnum.CLOSED_POSITIONS)
  return (
    <Box flex="1" sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* <SectionTitle title="Recent Settled" icon={Notebook} sx={{ px: 2 }} /> */}
      <TabHeader
        configs={tabConfigs.map((config) => ({
          ...config,
          activeIcon: <Box width={6} height={6} bg={isLong ? 'green1' : 'red2'} />,
          icon: <Box width={6} height={6} bg="neutral3" />,
        }))}
        isActiveFn={(config) => config.key === tab}
        hasLine
        onClickItem={(key) => setTab(key as TabEnum)}
      />

      <Box flex="1" sx={{ overflow: 'auto', minHeight: 0 }}>
        {tab === TabEnum.CLOSED_POSITIONS && (
          <ClosedPositionsSection
            isLong={isLong}
            token={token}
            sizeFilter={sizeFilter ?? null}
            selectedAccounts={selectedAccounts}
            onSelectItem={onSelectPosition}
          />
        )}
        {tab === TabEnum.RECENT_ORDERS && (
          <OrdersSection
            isLong={isLong}
            token={token}
            sizeFilter={sizeFilter ?? null}
            selectedAccounts={selectedAccounts}
          />
        )}
      </Box>
    </Box>
  )
}

export default DirectionalSection
