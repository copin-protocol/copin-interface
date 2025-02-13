import { Trans } from '@lingui/macro'
import React from 'react'

import useVaultDetailsContext from 'pages/VaultDetails/useVaultDetailsProvider'
import { Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function VaultFees({ sx }: { sx?: any }) {
  const { vault } = useVaultDetailsContext()
  return (
    <Flex mt={3} flexDirection="column" sx={{ gap: 2, ...sx }}>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
        <Type.Caption color="neutral2">
          <Trans>Management Fee</Trans>
        </Type.Caption>
        <Type.CaptionBold>
          {vault?.managementFee ? `${formatNumber(vault.managementFee * 100, 2)}%/year` : '--'}
        </Type.CaptionBold>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
        <Type.Caption color="neutral2">
          <Trans>Profit Sharing</Trans>
        </Type.Caption>
        <Type.CaptionBold>
          {' '}
          {vault?.profitSharingRatio ? `${formatNumber(vault.profitSharingRatio * 100, 2)}%` : '--'}
        </Type.CaptionBold>
      </Flex>
      {/*<Flex alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>*/}
      {/*  <Type.Caption color="neutral2">*/}
      {/*    <Trans>Execution Fee</Trans>*/}
      {/*  </Type.Caption>*/}
      {/*  <Type.CaptionBold>Follow DCP Fee</Type.CaptionBold>*/}
      {/*</Flex>*/}
    </Flex>
  )
}
