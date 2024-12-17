import { Trans } from '@lingui/macro'
import { ArrowSquareDownLeft, ArrowSquareUpRight, Cardholder } from '@phosphor-icons/react'
import React, { useState } from 'react'

import LabelWithIcon from 'components/@ui/LabelWithIcon'
import useVaultDetailsContext from 'hooks/features/useVaultDetailsProvider'
import Tabs, { TabPane } from 'theme/Tab'
import IconTabItem from 'theme/Tab/IconTabItem'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import VaultDeposit from './VaultDeposit'
import VaultWithdraw from './VaultWithdraw'

export enum VaultFundTab {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

export default function VaultFundManagement({ vaultAddress }: { vaultAddress: string }) {
  const { reload } = useVaultDetailsContext()
  const [tab, setTab] = useState<string>(VaultFundTab.Deposit)

  function onSuccess() {
    reload?.()
  }

  return (
    <>
      <Box p={3}>
        <LabelWithIcon text={<Trans>Fund Management</Trans>} icon={<Cardholder size={24} />} sx={{ mb: 3 }} />
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
            key={VaultFundTab.Deposit}
            tab={
              <IconTabItem
                icon={<ArrowSquareDownLeft size={24} weight={tab === VaultFundTab.Deposit ? 'fill' : 'regular'} />}
                text={<Trans>Deposit</Trans>}
                active={tab === VaultFundTab.Deposit}
              />
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={VaultFundTab.Withdraw}
            tab={
              <IconTabItem
                icon={<ArrowSquareUpRight size={24} weight={tab === VaultFundTab.Withdraw ? 'fill' : 'regular'} />}
                text={<Trans>Withdraw</Trans>}
                active={tab === VaultFundTab.Withdraw}
              />
            }
          >
            <></>
          </TabPane>
        </Tabs>
        {tab === VaultFundTab.Deposit && (
          <VaultDeposit smartWallet={vaultAddress} platform={CopyTradePlatformEnum.GNS_V8} onSuccess={onSuccess} />
        )}
        {tab === VaultFundTab.Withdraw && (
          <VaultWithdraw smartWallet={vaultAddress} platform={CopyTradePlatformEnum.GNS_V8} onSuccess={onSuccess} />
        )}
      </Box>
    </>
  )
}
