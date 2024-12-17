import { Trans } from '@lingui/macro'
import { Bank, ClockCounterClockwise, Pulse, Vault } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { vaultHistoryColumns } from 'components/@position/configs/traderPositionRenderProps'
import useVaultDetailsContext from 'hooks/features/useVaultDetailsProvider'
import useVaultPositionContext from 'hooks/features/useVaultPositionProvider'
import { useAuthContext } from 'hooks/web3/useAuth'
import VaultOnchainPositions from 'pages/MyProfile/VaultManagement/VaultOnchainPositions'
import Tabs, { TabPane } from 'theme/Tab'
import IconTabItem from 'theme/Tab/IconTabItem'
import { Flex } from 'theme/base'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import VaultBalances from './VaultBalances'
import VaultHistoryPositions from './VaultHistoryPositions'
import VaultOpeningPositions from './VaultOpeningPositions'
import VaultPerformance from './VaultPerformance'

export enum VaultInfoTab {
  Balances = 'Balances',
  Performance = 'Performance',
  OpenPositions = 'OpenPositions',
  HistoryPositions = 'HistoryPositions',
  OnchainPositions = 'OnchainPositions',
}

export default function VaultInfo() {
  const [tab, setTab] = useState<string>(VaultInfoTab.Balances)
  const {
    openingPositions,
    closedPositions,
    isLoadingOpening,
    isLoadingClosed,
    hasNextClosedPositions,
    handleFetchClosedPositions,
    currentSort,
    changeCurrentSort,
    currentSortOpening,
    changeCurrentSortOpening,
  } = useVaultPositionContext()

  const { vaultOwner, vaultCopyWallet } = useVaultDetailsContext()
  const { profile } = useAuthContext()

  const totalOpening = openingPositions?.length ?? 0
  const totalClosed = closedPositions?.meta?.total ?? 0

  return (
    <>
      <Flex flexDirection="column" height="100%" p={3} pb={0}>
        <Tabs
          defaultActiveKey={tab}
          onChange={(tab) => setTab(tab)}
          sx={{
            width: '100%',
          }}
          headerSx={{ marginBottom: 0, gap: 0, width: '100%', mb: 3, px: 0 }}
          tabItemSx={{
            pt: 0,
            px: 24,
          }}
        >
          <TabPane
            key={VaultInfoTab.Balances}
            tab={
              <IconTabItem
                icon={<Bank size={24} weight={tab === VaultInfoTab.Balances ? 'fill' : 'regular'} />}
                text={<Trans>Vault Information</Trans>}
                active={tab === VaultInfoTab.Balances}
              />
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={VaultInfoTab.Performance}
            tab={
              <IconTabItem
                icon={<Vault size={24} weight={tab === VaultInfoTab.Performance ? 'fill' : 'regular'} />}
                text={<Trans>Vault Performance</Trans>}
                active={tab === VaultInfoTab.Performance}
              />
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={VaultInfoTab.OpenPositions}
            tab={
              <IconTabItem
                icon={<Pulse size={24} weight={tab === VaultInfoTab.OpenPositions ? 'fill' : 'regular'} />}
                text={`Opening Positions${totalOpening ? ` (${formatNumber(totalOpening)})` : ''}`}
                active={tab === VaultInfoTab.OpenPositions}
              />
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={VaultInfoTab.HistoryPositions}
            tab={
              <IconTabItem
                icon={
                  <ClockCounterClockwise
                    size={24}
                    weight={tab === VaultInfoTab.HistoryPositions ? 'fill' : 'regular'}
                  />
                }
                text={`History${totalClosed ? ` (${formatNumber(totalClosed)})` : ''}`}
                active={tab === VaultInfoTab.HistoryPositions}
              />
            }
          >
            <></>
          </TabPane>
        </Tabs>
        {tab === VaultInfoTab.Balances && <VaultBalances />}
        {tab === VaultInfoTab.Performance && <VaultPerformance />}
        {tab === VaultInfoTab.OpenPositions && (
          <VaultOpeningPositions
            protocol={ProtocolEnum.GNS}
            data={openingPositions}
            isLoading={isLoadingOpening}
            currentSort={currentSortOpening}
            changeCurrentSort={changeCurrentSortOpening}
          />
        )}
        {tab === VaultInfoTab.HistoryPositions && (
          <VaultHistoryPositions
            data={closedPositions?.data}
            dataMeta={closedPositions?.meta}
            isLoading={isLoadingClosed}
            fetchNextPage={handleFetchClosedPositions}
            hasNextPage={hasNextClosedPositions}
            tableSettings={vaultHistoryColumns}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
          />
        )}
        {profile?.username === vaultOwner && tab === VaultInfoTab.OnchainPositions && (
          <VaultOnchainPositions smartWalletAddress={vaultCopyWallet} />
        )}
      </Flex>
    </>
  )
}
