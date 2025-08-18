import React from 'react'

import CopyButton from 'theme/Buttons/CopyButton'
import { Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/protocolProviderConfig'

import { AccountInfo } from '.'
import ExplorerLogo from '../ExplorerLogo'

export default function ChainAccountInfo({
  address,
  protocol,
  shouldShowProtocol = true,
}: {
  address: string
  protocol: ProtocolEnum
  shouldShowProtocol?: boolean
}) {
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl

  return (
    <Flex sx={{ gap: 2, alignItems: 'center' }}>
      <AccountInfo
        address={address}
        protocol={protocol}
        hasQuickView={false}
        addressFormatter={Type.BodyBold}
        addressWidth="fit-content"
        shouldShowProtocol={shouldShowProtocol}
      />
      <CopyButton type="button" variant="ghost" value={address} size="sm" iconSize={16} sx={{ p: 0 }} />
      <ExplorerLogo protocol={protocol} explorerUrl={`${explorerUrl}/address/${address}`} size={20} />
    </Flex>
  )
}
