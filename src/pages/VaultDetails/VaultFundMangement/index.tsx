import { Trans } from '@lingui/macro'
import { ArrowSquareDownLeft, ArrowSquareUpRight, Cardholder } from '@phosphor-icons/react'
import React, { useState } from 'react'

import SectionTitle from 'components/@ui/SectionTitle'
import useVaultDetailsContext from 'pages/VaultDetails/useVaultDetailsProvider'
import { TabHeader } from 'theme/Tab'
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
        <SectionTitle title={<Trans>FUND MANAGEMENT</Trans>} icon={Cardholder} />
        <TabHeader
          configs={[
            {
              name: <Trans>DEPOSIT</Trans>,
              key: VaultFundTab.Deposit,
              icon: <ArrowSquareDownLeft size={20} />,
            },
            {
              name: <Trans>WITHDRAW</Trans>,
              key: VaultFundTab.Withdraw,
              icon: <ArrowSquareUpRight size={20} />,
            },
          ]}
          hasLine
          isActiveFn={(config) => config.key === tab}
          onClickItem={(key) => setTab(key as VaultFundTab)}
          fullWidth
          size="md"
          sx={{ mb: 3 }}
        />
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
