import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'

import { ApiMeta } from 'apis/api'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ReverseTag from 'components/@ui/ReverseTag'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyWalletData } from 'entities/copyWallet'
import { UserActivityData } from 'entities/user'
import { Box, Flex, Image, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { PROTOCOL_PROVIDER, TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { ORDER_TYPE_TRANS } from 'utils/config/translations'
import { addressShorten, formatLocalDate, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseExchangeImage, parseProtocolImage, parseWalletName } from 'utils/helpers/transform'

export interface UserActivityTableProps {
  data: UserActivityData[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  tableSettings: ColumnData<UserActivityData>[]
}

export type CopySelection = {
  id?: string
}

export type ExternalSource = {
  handleSelectCopyItem: (data: CopySelection) => void
  copyWallets: CopyWalletData[] | undefined
  isMobile?: boolean
}

type ActivityColumnData = ColumnData<UserActivityData, ExternalSource>

export const renderProps: Record<string, ActivityColumnData['render']> = {
  time: (item, index, externalSource) => {
    const isMobile = externalSource?.isMobile
    return (
      <Box sx={{ position: 'relative' }}>
        {item.isReverse && <ReverseTag sx={{ top: isMobile ? '-45px' : '-12px', left: '-16px' }} />}
        <Type.Caption color="neutral3">{formatLocalDate(item.createdAt, DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
      </Box>
    )
  },
  copy: (item) => (
    <Type.CaptionBold
      color="neutral1"
      sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1em' }}
    >
      {item.copyTradeTitle}
    </Type.CaptionBold>
  ),
  sourceTrader: (item) => (
    <Flex
      as={Link}
      to={generateTraderDetailsRoute(item.protocol, item.sourceAccount)}
      sx={{ alignItems: 'center', gap: 2 }}
    >
      <Type.Caption color="neutral1">{addressShorten(item.sourceAccount)}</Type.Caption>
      <VerticalDivider />
      <Image src={parseProtocolImage(item.protocol)} width={20} height={20} />
    </Flex>
  ),
  sourceAction: (item) => (
    <Type.Caption color="neutral1">{item.type ? ORDER_TYPE_TRANS[item.type] : '--'}</Type.Caption>
  ),
  sourceDetails: (item) => (
    <Flex
      sx={{
        gap: 1,
        alignItems: 'center',
        color: 'neutral1',
      }}
    >
      <Type.Caption width={8} color={item.isLong ? 'green1' : 'red2'}>
        {item.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      <VerticalDivider />
      <Type.Caption>{TOKEN_TRADE_SUPPORT[item.protocol][item.indexToken]?.symbol}</Type.Caption>
      <VerticalDivider />
      <Type.Caption>
        {item.sourcePrice ? PriceTokenText({ value: item.sourcePrice, maxDigit: 2, minDigit: 2 }) : '--'}
      </Type.Caption>
      {item.sourceTxHash && (
        <>
          <Type.Caption color="neutral3">-</Type.Caption>
          <Type.Caption>
            <Box
              as="a"
              href={`${PROTOCOL_PROVIDER[item.protocol].explorerUrl}/tx/${item.sourceTxHash}`}
              target="_blank"
            >
              <Trans>TxHash</Trans>
            </Box>
          </Type.Caption>
        </>
      )}
    </Flex>
  ),
  targetWallet: (item, _, externalSource) => {
    let walletName = '--'
    if (item.copyWalletName) {
      walletName = item.copyWalletName
    } else if (item.copyWalletId) {
      const walletFromContext = externalSource?.copyWallets?.find((wallet) => wallet.id === item.copyWalletId)
      if (walletFromContext) {
        walletName = parseWalletName(walletFromContext)
      }
    }
    return (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Type.Caption
          color="neutral1"
          sx={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {walletName}
        </Type.Caption>
        <VerticalDivider />
        <Image src={parseExchangeImage(item.exchange)} width={20} height={20} />
      </Flex>
    )
  },
  targetAction: (item, _, externalSource) => {
    const parseErrMsg =
      item.errorMsg && item.errorMsg.startsWith('"') && item.errorMsg.endsWith('"')
        ? JSON.parse(item.errorMsg)
        : item.errorMsg

    const isLong = (item.isLong ? 1 : -1) * (item.isReverse ? -1 : 1) === 1
    return item.isSuccess ? (
      <Flex
        sx={{
          gap: 1,
          alignItems: 'center',
          color: 'neutral1',
        }}
      >
        <Type.Caption width={8} color={isLong ? 'green1' : 'red2'}>
          {isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
        </Type.Caption>
        <VerticalDivider />
        <Type.Caption>{TOKEN_TRADE_SUPPORT[item.protocol][item.indexToken]?.symbol}</Type.Caption>
        <VerticalDivider />
        <Type.Caption>
          {item.price ? PriceTokenText({ value: item.price, maxDigit: 2, minDigit: 2 }) : '--'}
        </Type.Caption>{' '}
        <Type.Caption color="neutral3">
          (<Trans>slippage</Trans>{' '}
          {item.sourcePrice && item.price
            ? formatNumber(((item.sourcePrice - item.price) / item.sourcePrice) * 100, 2, 2) + '%'
            : '--'}
          )
        </Type.Caption>
        <Type.Caption color="neutral3">-</Type.Caption>
        {item.copyPositionId && (
          <Type.Caption
            onClick={() => externalSource?.handleSelectCopyItem({ id: item.copyPositionId })}
            color="primary1"
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary2' } }}
          >
            <Trans>Details</Trans>
          </Type.Caption>
        )}
        {item.targetTxHash && (
          <>
            <VerticalDivider />
            <Type.Caption>
              <Box
                as="a"
                href={`${PROTOCOL_PROVIDER[item.protocol].explorerUrl}/tx/${item.sourceTxHash}`}
                target="_blank"
              >
                <Trans>TxHash</Trans>
              </Box>
            </Type.Caption>
          </>
        )}
      </Flex>
    ) : (
      <Type.Caption color="neutral3" sx={{ whiteSpace: 'pre-line' }}>
        {parseErrMsg ?? <Trans>Error while place order</Trans>}
      </Type.Caption>
    )
  },
  status: (item) => (
    <Type.Caption
      color={item.isSuccess ? 'green2' : 'red2'}
      sx={{ borderRadius: '16px', width: '70px', textAlign: 'center', lineHeight: '24px', bg: 'neutral7' }}
    >
      {item.isSuccess ? <Trans>Success</Trans> : <Trans>Failed</Trans>}
    </Type.Caption>
  ),
}

export const activityTitles = {
  time: <Trans>Time</Trans>,
  copy: <Trans>Copy</Trans>,
  sourceTrader: <Trans>Source Trader</Trans>,
  sourceAction: <Trans>Source Action</Trans>,
  sourceDetails: <Trans>Source Details</Trans>,
  targetWallet: <Trans>Target Wallet</Trans>,
  targetAction: <Trans>Target Action</Trans>,
  status: <Trans>Status</Trans>,
}

export const userActivityColumns: ColumnData<UserActivityData, ExternalSource>[] = [
  {
    title: activityTitles.time,
    dataIndex: 'createdAt',
    key: 'createdAt',
    style: { minWidth: 200, width: 200, pl: '16px !important' },
    render: renderProps.time,
  },
  {
    title: activityTitles.copy,
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    style: { minWidth: 200, width: 200, pr: 3 },
    render: renderProps.copy,
  },
  {
    title: activityTitles.sourceTrader,
    dataIndex: 'sourceAccount',
    key: 'sourceAccount',
    style: { minWidth: 200, width: 200 },
    render: renderProps.sourceTrader,
  },
  {
    title: activityTitles.sourceAction,
    dataIndex: 'type',
    key: 'type',
    style: { minWidth: 120, width: 120 },
    render: renderProps.sourceAction,
  },
  {
    title: activityTitles.sourceDetails,
    dataIndex: 'sourcePrice',
    key: 'sourcePrice',
    style: { minWidth: 200, width: 200 },
    render: renderProps.sourceDetails,
  },
  {
    title: activityTitles.targetWallet,
    dataIndex: 'copyWalletName',
    key: 'copyWalletName',
    style: { minWidth: 200, width: 200 },
    render: renderProps.targetWallet,
  },
  {
    title: activityTitles.targetAction,
    dataIndex: 'price',
    key: 'price',
    style: { minWidth: 350 },
    render: renderProps.targetAction,
  },
  {
    title: (
      <Box as="span" pr={3}>
        {activityTitles.status}
      </Box>
    ),
    dataIndex: 'isSuccess',
    key: 'isSuccess',
    style: { minWidth: 100, width: 100, textAlign: 'center' },
    render: renderProps.status,
  },
]
