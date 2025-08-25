import { Trans } from '@lingui/macro'

import { ApiMeta } from 'apis/api'
import { LayoutType } from 'components/@copyActivity/types'
import { AccountInfo } from 'components/@ui/AccountInfo'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Entry from 'components/@ui/Entry'
import ReverseTag from 'components/@ui/ReverseTag'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { UserActivityData } from 'entities/user'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Image, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { EXPLORER_PLATFORMS } from 'utils/config/platforms'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { ORDER_TYPE_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'

import LiteActivitiesFilterTrader from './LiteHistoryFilterTrader'

export interface UserActivityTableProps {
  data: UserActivityData[] | undefined
  dataMeta?: ApiMeta
  isLoading: boolean
  tableSettings: ColumnData<UserActivityData>[]
}

export type ExternalSource = {
  handleSelectCopyItem: (data: CopyPositionData) => void
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
        <Type.Caption color="neutral1">
          <LocalTimeText date={item.createdAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
        </Type.Caption>
      </Box>
    )
  },
  copy: (item) => (
    <Type.CaptionBold
      color="neutral1"
      sx={{
        width: 96,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      {item.copyTradeTitle}
    </Type.CaptionBold>
  ),
  sourceTrader: (item) => (
    <AccountInfo address={item.sourceAccount} protocol={item.protocol} avatarSize={24} textSx={{ color: 'neutral1' }} />
  ),
  sourceAction: (item) => (
    <Type.Caption color="neutral1">{item.type ? ORDER_TYPE_TRANS[item.type] : '--'}</Type.Caption>
  ),
  sourceDetails: (item) => {
    return (
      <Flex
        sx={{
          gap: 1,
          alignItems: 'center',
          color: 'neutral1',
        }}
      >
        <Entry price={item.sourcePrice} isLong={item.isLong} pair={item.pair} />
        {item.sourceTxHash && (
          <>
            <Type.Caption color="neutral3">-</Type.Caption>
            <Type.Caption>
              <Box
                as="a"
                href={`${PROTOCOL_PROVIDER[item.protocol]?.explorerUrl}/tx/${item.sourceTxHash}`}
                target="_blank"
              >
                <Trans>TxHash</Trans>
              </Box>
            </Type.Caption>
          </>
        )}
      </Flex>
    )
  },
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
          sx={{ maxWidth: '122px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
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

    return item.isSuccess || item.isProcessing ? (
      <Flex
        sx={{
          gap: 1,
          alignItems: 'center',
          color: 'neutral1',
        }}
      >
        <Entry price={item.price} isLong={isLong} pair={item.pair} />
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
            onClick={() =>
              externalSource?.handleSelectCopyItem({ id: item.copyPositionId, copyTradeId: item.copyTradeId })
            }
            color="primary1"
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary2' } }}
          >
            <Trans>Details</Trans>
          </Type.Caption>
        )}
        {item.targetTxHash && (
          <Type.Caption>
            <Box as="a" href={`${EXPLORER_PLATFORMS[item.exchange]}/tx/${item.targetTxHash}`} target="_blank">
              <Trans>TxHash</Trans>
            </Box>
          </Type.Caption>
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
      color={item.isProcessing ? 'primary1' : item.isSuccess ? 'green2' : 'red2'}
      sx={{ borderRadius: '16px', width: '70px', textAlign: 'center', lineHeight: '24px', bg: 'neutral7' }}
    >
      {item.isProcessing ? <Trans>Processing</Trans> : item.isSuccess ? <Trans>Success</Trans> : <Trans>Failed</Trans>}
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
    sortBy: 'createdAt',
    style: { minWidth: 150, width: 150, pl: '16px !important' },
    render: renderProps.time,
  },
  {
    title: activityTitles.copy,
    dataIndex: 'copyTradeTitle',
    key: 'copyTradeTitle',
    sortBy: 'copyTradeTitle',
    style: { minWidth: 120, width: 120, pr: 3 },
    render: renderProps.copy,
  },
  {
    title: activityTitles.sourceTrader,
    dataIndex: 'sourceAccount',
    key: 'sourceAccount',
    sortBy: 'sourceAccount',
    style: { minWidth: 150, width: 150 },
    render: renderProps.sourceTrader,
  },
  {
    title: activityTitles.sourceAction,
    dataIndex: 'type',
    key: 'type',
    sortBy: 'type',
    style: { minWidth: 110, width: 110 },
    render: renderProps.sourceAction,
  },
  {
    title: activityTitles.sourceDetails,
    dataIndex: 'sourcePrice',
    key: 'sourcePrice',
    sortBy: 'sourcePrice',
    style: { minWidth: 190, width: 190 },
    render: renderProps.sourceDetails,
  },
  {
    title: activityTitles.targetWallet,
    dataIndex: 'copyWalletName',
    key: 'copyWalletName',
    style: { minWidth: 150, width: 150 },
    render: renderProps.targetWallet,
  },
  {
    title: activityTitles.targetAction,
    dataIndex: 'price',
    key: 'price',
    sortBy: 'price',
    style: { minWidth: 400, width: 400 },
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
    sortBy: 'isSuccess',
    style: { minWidth: 100, width: 100, textAlign: 'center' },
    render: renderProps.status,
  },
]

const liteUserActivityColumns = userActivityColumns.filter((v) => v.key !== 'copyWalletName')
const traderColumnIndex = liteUserActivityColumns.findIndex((v) => v.key === 'sourceAccount')
if (traderColumnIndex !== -1) {
  liteUserActivityColumns[traderColumnIndex] = {
    ...liteUserActivityColumns[traderColumnIndex],
    filterComponent: <LiteActivitiesFilterTrader type="icon" />,
  }
}

const mapping: Record<LayoutType, ColumnData<UserActivityData, ExternalSource>[]> = {
  lite: liteUserActivityColumns,
  normal: userActivityColumns,
}

export function getUserActivityColumns({
  layoutType,
  excludingColumnKeys,
}: {
  layoutType: LayoutType
  excludingColumnKeys?: (keyof UserActivityData)[]
}) {
  return mapping[layoutType].filter((v) =>
    v.key != null && excludingColumnKeys != null ? !excludingColumnKeys.includes(v.key) : true
  )
}
