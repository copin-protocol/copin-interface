import { Trans } from '@lingui/macro'
import React from 'react'
import { Link } from 'react-router-dom'

import BalanceText from 'components/@ui/BalanceText'
import { Flex, Image, Type } from 'theme/base'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { parseExchangeImage } from 'utils/helpers/transform'

const LiteBalance = ({ address, balance }: { address: string; balance: number | undefined }) => {
  return (
    <Flex bg="neutral6" px={8} py={1} justifyContent="space-between" alignItems="center">
      <Flex alignItems="center" sx={{ gap: 2 }}>
        <Type.Caption color="neutral2">
          <Trans>Wallet</Trans>
        </Type.Caption>
        <Type.Caption>{addressShorten(address)}</Type.Caption>
        <Link
          to={`${ROUTES.TRADER_DETAILS.path_prefix}/${address}/${ProtocolEnum.HYPERLIQUID.toLowerCase()}`}
          target="_blank"
        >
          <Image src={parseExchangeImage(CopyTradePlatformEnum.COPIN_HYPERLIQUID)} height={24} />
        </Link>
      </Flex>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <Type.Caption color="neutral2">
          <Trans>Balance</Trans>
        </Type.Caption>
        <BalanceText
          value={balance != null ? `$${formatNumber(balance, 2, 2)}` : '--'}
          component={Type.Caption}
          defaultShow
        />
      </Flex>
    </Flex>
  )
}

export default LiteBalance
