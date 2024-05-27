// eslint-disable-next-line no-restricted-imports
import { useResponsive } from 'ahooks'
import React from 'react'

import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import useTraderBalances from 'hooks/features/useTraderBalances'
import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten, formatNumber } from 'utils/helpers/format'

const TREASURY_WALLET = '0x76Ea7951214A0a3b8D132fb7C80c174dbeD62bcf'
export default function WalletWatcher() {
  const { sm } = useResponsive()
  const { balance } = useTraderBalances({
    account: TREASURY_WALLET,
    protocol: ProtocolEnum.KWENTA,
  })
  return (
    <Box p={3} sx={{ height: '100%', overflow: 'hidden auto' }}>
      <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
        <Type.Caption color="neutral3">Wallet Address:</Type.Caption>
        <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Type.Caption>{sm ? TREASURY_WALLET : addressShorten(TREASURY_WALLET)}</Type.Caption>
          <CopyButton
            type="button"
            variant="ghost"
            value={TREASURY_WALLET}
            size="sm"
            sx={{ color: 'neutral3', p: 0 }}
            iconSize={14}
          />
          <ExplorerLogo
            protocol={ProtocolEnum.KWENTA}
            explorerUrl={`${PROTOCOL_PROVIDER[ProtocolEnum.KWENTA]?.explorerUrl}/address/${TREASURY_WALLET}`}
            size={16}
          />
        </Flex>
        <VerticalDivider />
        <Type.CaptionBold>${formatNumber(balance)}</Type.CaptionBold>
      </Flex>
    </Box>
  )
}
