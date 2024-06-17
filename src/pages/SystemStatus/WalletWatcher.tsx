// eslint-disable-next-line no-restricted-imports
import { useResponsive } from 'ahooks'
import React from 'react'

import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import useTraderBalances from 'hooks/features/useTraderBalances'
import CopyButton from 'theme/Buttons/CopyButton'
import { Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten, formatNumber } from 'utils/helpers/format'

const RELAYER_WALLET_OP = '0x76Ea7951214A0a3b8D132fb7C80c174dbeD62bcf'
const RELAYER_WALLET_ARB = '0xbd3726fc0B8411869aE8268345cFfF48747F39da'
export default function WalletWatcher() {
  return (
    <Flex flexDirection="column" p={3} sx={{ gap: 3, height: '100%', overflow: 'hidden auto' }}>
      <WalletItem protocol={ProtocolEnum.KWENTA} account={RELAYER_WALLET_OP} />
      <WalletItem protocol={ProtocolEnum.GMX} account={RELAYER_WALLET_ARB} />
    </Flex>
  )
}

function WalletItem({ protocol, account }: { protocol: ProtocolEnum; account: string }) {
  const { sm } = useResponsive()
  const { balance } = useTraderBalances({
    account,
    protocol,
  })
  return (
    <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
      <Type.Caption color="neutral3">Wallet Address:</Type.Caption>
      <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
        <Type.Caption>{sm ? account : addressShorten(account)}</Type.Caption>
        <CopyButton
          type="button"
          variant="ghost"
          value={account}
          size="sm"
          sx={{ color: 'neutral3', p: 0 }}
          iconSize={14}
        />
        <ExplorerLogo
          protocol={protocol}
          explorerUrl={`${PROTOCOL_PROVIDER[protocol]?.explorerUrl}/address/${account}`}
          size={16}
        />
      </Flex>
      <VerticalDivider />
      <Type.CaptionBold>${formatNumber(balance)}</Type.CaptionBold>
    </Flex>
  )
}
