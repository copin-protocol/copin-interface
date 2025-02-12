import { Trans } from '@lingui/macro'
import React from 'react'

import useVaultDetailsContext from 'pages/VaultDetails/useVaultDetailsProvider'
import { Flex, Type } from 'theme/base'
import { formatNumber, formatPrice } from 'utils/helpers/format'

import RowItem from './RowItem'
import VaultFees from './VaultFees'

export default function VaultBalances() {
  const { vault, vaultAvailableBalance } = useVaultDetailsContext()
  const currentSharePrice =
    vault?.totalSupply && vault?.totalPooledToken ? vault?.totalPooledToken / vault?.totalSupply : 0

  return (
    <Flex flexDirection="column" flex={1} sx={{ overflow: 'auto' }}>
      <Type.Caption>
        Copin has integrated over <b>25 PerpDex protocols</b>, offering unique insights into the market. Using its own
        evaluation criteria, Copin has launched a trial version of its Vault to replicate on-chain trades from carefully
        selected traders. The Copin Vault functions as a smart wallet, where data analytics (DA) is authorized solely to
        manage copy trading activities. Risk management for the Copin Vault is handled through data analytics, ensuring
        both effectiveness and security.
      </Type.Caption>
      <Flex flexDirection="column" mt={12} sx={{ maxWidth: 400, gap: 1 }}>
        <Type.CaptionBold>
          <Trans>Assets and Shares</Trans>
        </Type.CaptionBold>
        <RowItem
          label={'Total Balance'}
          content={vault?.totalPooledToken ? `$${formatNumber(vault.totalPooledToken, 2, 2)}` : '--'}
        />
        <RowItem
          label={'Available Balance'}
          content={vaultAvailableBalance ? `$${formatNumber(vaultAvailableBalance, 2, 2)}` : '--'}
        />
        <RowItem
          label={'Total Shares'}
          content={vault?.totalShares ? `${formatNumber(vault.totalShares, 2, 2)}` : '--'}
        />
        <RowItem
          label={'Price Shares'}
          content={currentSharePrice ? `$${formatPrice(currentSharePrice, 2, 2)}` : '--'}
        />
      </Flex>
      <Flex flexDirection="column" mt={12} sx={{ maxWidth: 400, gap: 1 }}>
        <Type.CaptionBold>
          <Trans>Fees and Profit Sharing</Trans>
        </Type.CaptionBold>
        <VaultFees sx={{ mt: 0 }} />
      </Flex>
    </Flex>
  )
}
