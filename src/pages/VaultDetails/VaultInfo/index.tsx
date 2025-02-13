import { Trans } from '@lingui/macro'
import { Bank, Pulse, Vault } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { vaultHistoryColumns } from 'components/@position/configs/traderPositionRenderProps'
import { useAuthContext } from 'hooks/web3/useAuth'
import VaultOnchainPositions from 'pages/MyProfile/VaultManagement/VaultOnchainPositions'
import useVaultDetailsContext from 'pages/VaultDetails/useVaultDetailsProvider'
import useVaultPositionContext from 'pages/VaultDetails/useVaultPositionProvider'
import { TabHeader } from 'theme/Tab'
import { Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { VaultFundTab } from '../VaultFundMangement'
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
        <TabHeader
          configs={[
            {
              name: <Trans>VAULT INFORMATION</Trans>,
              key: VaultInfoTab.Balances,
              icon: <Bank size={20} />,
            },
            {
              name: <Trans>PERFORMANCE</Trans>,
              key: VaultInfoTab.Performance,
              icon: <Vault size={20} />,
            },
            {
              name: <Trans>OPEN POSITIONS</Trans>,
              key: VaultInfoTab.OpenPositions,
              icon: <Pulse size={20} />,
            },
            {
              name: <Trans>HISTORY POSITIONS</Trans>,
              key: VaultInfoTab.HistoryPositions,
              icon: <Vault size={20} />,
            },
          ]}
          hasLine
          isActiveFn={(config) => config.key === tab}
          onClickItem={(key) => setTab(key as VaultFundTab)}
          fullWidth
          size="md"
          sx={{ mb: 3 }}
        />

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
