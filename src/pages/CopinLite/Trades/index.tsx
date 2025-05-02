import { Trans } from '@lingui/macro'
import { Warning } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

import useTabHandler from 'hooks/router/useTabHandler'
import Tabs, { TabPane } from 'theme/Tab'
import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'

import LiteDepositsAndWithdrawals from '../Transactions/DepositsAndWithdrawals'
import LiteActivities from './Activities'
import LiteHistory from './History'
import LiteOpeningPositions from './OpeningPositions'
import { TradesTab } from './types'
import { LiteActivitiesProvider } from './useActivitiesContext'
import { LiteHistoryPositionProvider } from './useHistoryPositionsContext'
import { LiteOpeningPositionProvider, useLiteOpeningPositionsContext } from './useOpeningPositionsContext'

const Trades = () => {
  const { tab, handleTab: setTab } = useTabHandler({ defaultTab: TradesTab.OpeningPositions, tabKey: 'table' })
  const handleChangeTab = (tab: string) => setTab({ tab })
  const { lg } = useResponsive()

  useEffect(() => {
    if (!lg && tab === TradesTab.DepositsAndWithdrawals) {
      setTab({ tab: TradesTab.OpeningPositions })
    }
  }, [lg, tab])

  return (
    <Box sx={{ overflowY: 'hidden' }} height="100%">
      <LiteOpeningPositionProvider>
        <MainWrapper currentTab={tab} onChangeTab={handleChangeTab} />
      </LiteOpeningPositionProvider>

      {tab === TradesTab.History && (
        <TabWrapper>
          <LiteHistoryPositionProvider>
            <LiteHistory currentTab={tab} />
          </LiteHistoryPositionProvider>
        </TabWrapper>
      )}
      {tab === TradesTab.Activities && (
        <TabWrapper>
          <LiteActivitiesProvider>
            <LiteActivities currentTab={tab} />
          </LiteActivitiesProvider>
        </TabWrapper>
      )}
      {lg && tab === TradesTab.DepositsAndWithdrawals ? (
        <TabWrapper>
          <LiteDepositsAndWithdrawals currentTab={tab} />
        </TabWrapper>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default Trades

function MainWrapper({ currentTab, onChangeTab }: { currentTab: string; onChangeTab: (tab: string) => void }) {
  const contextValues = useLiteOpeningPositionsContext()
  const { lg } = useResponsive()

  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
    }
    if (currentTab !== TradesTab.StuckPositions) return
    if (!contextValues.stuckPositions?.length) onChangeTab(TradesTab.OpeningPositions)
  }, [currentTab, contextValues.stuckPositions])

  return (
    <>
      <Tabs
        defaultActiveKey={currentTab}
        onChange={onChangeTab}
        fullWidth
        sx={{
          height: 40,
        }}
        tabPanelSx={{
          height: 0,
          overflow: 'hidden',
          py: 0,
        }}
      >
        <TabPane destroyOnInactive key={TradesTab.OpeningPositions} tab={<Trans>Opening</Trans>}>
          <></>
        </TabPane>
        {loaded &&
          !!contextValues.stuckPositions?.length &&
          ((
            <TabPane
              destroyOnInactive
              key={TradesTab.StuckPositions}
              tab={
                <Trans>
                  <Warning
                    style={{
                      color: themeColors.orange1,
                      verticalAlign: 'middle',
                      marginRight: '4px',
                      transform: 'translateY(-1px)',
                    }}
                    size={14}
                  />
                  Stuck Positions
                </Trans>
              }
            >
              <></>
            </TabPane>
          ) as any)}
        <TabPane destroyOnInactive key={TradesTab.History} tab={<Trans>History</Trans>}>
          <></>
        </TabPane>
        <TabPane destroyOnInactive key={TradesTab.Activities} tab={<Trans>Activities</Trans>}>
          <></>
        </TabPane>
        {lg ? (
          <TabPane
            destroyOnInactive
            key={TradesTab.DepositsAndWithdrawals}
            tab={<Trans>Deposits And Withdrawals</Trans>}
          >
            <></>
          </TabPane>
        ) : (
          <></>
        )}
      </Tabs>

      {currentTab === TradesTab.OpeningPositions && <LiteOpeningPositions {...contextValues} />}
      {!!contextValues.stuckPositions?.length && currentTab === TradesTab.StuckPositions && (
        <LiteOpeningPositions isStuckPositionsView {...contextValues} />
      )}
    </>
  )
}

function TabWrapper({ children }: { children: ReactNode }) {
  return <Box height="calc(100% - 40px)">{children}</Box>
}
