import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { useEffect } from 'react'

import useTabHandler from 'hooks/router/useTabHandler'
import Tabs, { TabPane } from 'theme/Tab'
import { Box } from 'theme/base'

import LiteDepositsAndWithdrawals from '../Transactions/DepositsAndWithdrawals'
import LiteActivities from './Activities'
import LiteHLOpeningPositions from './HLPositions'
import LiteHistory from './History'
import LiteOpeningPositions from './OpeningPositions'
import { TradesTab } from './types'
import { LiteActivitiesProvider } from './useActivitiesContext'
import { LiteHistoryPositionProvider } from './useHistoryPositionsContext'
import { LiteOpeningPositionProvider } from './useOpeningPositionsContext'

const Trades = () => {
  const { tab, handleTab: setTab } = useTabHandler(TradesTab.OpeningPositions, true, 'table')
  const { lg } = useResponsive()

  useEffect(() => {
    if (!lg && tab === TradesTab.DepositsAndWithdrawals) {
      setTab(TradesTab.OpeningPositions)
    }
  }, [lg, tab])

  return (
    <Box sx={{ overflowY: 'hidden' }} height="100%">
      <Tabs
        defaultActiveKey={tab}
        onChange={(tab) => setTab(tab)}
        fullWidth
        sx={{
          height: '100%',
        }}
        tabPanelSx={{
          height: 'calc(100% - 40px)',
          py: 0,
        }}
      >
        <TabPane destroyOnInactive key={TradesTab.OpeningPositions} tab={<Trans>Opening</Trans>}>
          <LiteOpeningPositionProvider>
            <LiteOpeningPositions />
          </LiteOpeningPositionProvider>
        </TabPane>
        <TabPane destroyOnInactive key={TradesTab.HLPositions} tab={<Trans>On-Chain Positions</Trans>}>
          <LiteOpeningPositionProvider>
            <LiteHLOpeningPositions />
          </LiteOpeningPositionProvider>
        </TabPane>
        <TabPane destroyOnInactive key={TradesTab.History} tab={<Trans>History</Trans>}>
          <LiteHistoryPositionProvider>
            <LiteHistory currentTab={tab} />
          </LiteHistoryPositionProvider>
        </TabPane>
        <TabPane destroyOnInactive key={TradesTab.Activities} tab={<Trans>Activities</Trans>}>
          <LiteActivitiesProvider>
            <LiteActivities currentTab={tab} />
          </LiteActivitiesProvider>
        </TabPane>
        {lg ? (
          <TabPane
            destroyOnInactive
            key={TradesTab.DepositsAndWithdrawals}
            tab={<Trans>Deposits And Withdrawals</Trans>}
          >
            <LiteDepositsAndWithdrawals currentTab={tab} />
          </TabPane>
        ) : (
          <></>
        )}
      </Tabs>
    </Box>
  )
}

export default Trades
