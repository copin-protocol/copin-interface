import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { CopyPositionData } from 'entities/copyTrade.d'
import { UsdPrices } from 'hooks/store/useUsdPrices'
// import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { calcCopyOpeningPnL } from 'utils/helpers/calculate'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

export function renderEntry(data: CopyPositionData) {
  return (
    <Flex width="100%" sx={{ gap: 2, alignItems: 'center', color: 'neutral1' }}>
      <Type.Caption width={8} color={data.isLong ? 'green1' : 'red2'}>
        {data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      {/* TODO: 2 */}
      <Type.Caption>{TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken].symbol}</Type.Caption>

      <VerticalDivider />
      <Type.Caption>{formatNumber(data.entryPrice, 2)}</Type.Caption>
    </Flex>
  )
}
export function renderPnL(data: CopyPositionData, prices?: UsdPrices) {
  const pnl =
    data.status === PositionStatusEnum.OPEN
      ? calcCopyOpeningPnL(data, prices ? prices[data.indexToken] : undefined)
      : data.pnl
  return (
    <Flex width="100%" sx={{ flexDirection: 'column', color: 'neutral1' }}>
      <Type.Caption color={pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'neutral1'}>{formatNumber(pnl, 2, 2)}</Type.Caption>
      {/* <ProgressBar percent={0} sx={{ width: '100%' }} /> */}
    </Flex>
  )
}

export function renderTrader({ protocol, address }: { protocol: ProtocolEnum; address: string }) {
  return (
    // TODO: 2
    <Link to={generateTraderDetailsRoute(protocol, address)}>
      <Flex sx={{ gap: 2 }} alignItems="center">
        <AddressAvatar address={address} size={24} />
        <Type.Caption color="neutral1" sx={{ ':hover': { textDecoration: 'underline' } }}>
          {addressShorten(address, 3, 5)}
        </Type.Caption>
      </Flex>
    </Link>
  )
}

const VerticalDivider = styled(Box)`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.neutral3};
`
