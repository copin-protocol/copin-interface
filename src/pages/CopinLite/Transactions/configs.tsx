import { Trans } from '@lingui/macro'

import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { LITE_ACTION_STATUS, LITE_TRANSACTION_TYPE, LiteTransactionData } from 'entities/lite'
import { ColumnData } from 'theme/Table/types'
import { Flex, Type } from 'theme/base'
import { Color } from 'theme/types'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

type LiteTransactionColumnData = ColumnData<LiteTransactionData, ExternalSource>

type ExternalSource = {
  isMobile?: boolean
}

const getColor = (type: string): Color => {
  switch (type) {
    case LITE_TRANSACTION_TYPE.DEPOSIT:
    case LITE_ACTION_STATUS.SUCCESSFUL:
    case LITE_ACTION_STATUS.WITHDRAWN:
      return 'green1'
    case LITE_TRANSACTION_TYPE.WITHDRAW:
    case LITE_ACTION_STATUS.FAILURE:
      return 'red2'
    case LITE_ACTION_STATUS.IN_PROCESSING:
      return 'primary1'
    case LITE_ACTION_STATUS.ON_HOLD:
      return 'orange1'
    default:
      return 'neutral1'
  }
}

export const renderProps: Record<string, LiteTransactionColumnData['render']> = {
  time: (item) => {
    return (
      <Flex sx={{ position: 'relative', gap: 1 }}>
        <Type.Caption color="neutral1">
          <LocalTimeText date={item.createdAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
        </Type.Caption>
        {item.type === LITE_TRANSACTION_TYPE.DEPOSIT && item.data.requestTxHash && (
          <ExplorerLogo
            protocol={ProtocolEnum.GNS}
            explorerUrl={`${PROTOCOL_PROVIDER[ProtocolEnum.GNS]?.explorerUrl}/tx/${item.data.requestTxHash}`}
          />
        )}
        {item.type === LITE_TRANSACTION_TYPE.WITHDRAW && item.data.txHash && (
          <ExplorerLogo
            protocol={ProtocolEnum.GNS}
            explorerUrl={`${PROTOCOL_PROVIDER[ProtocolEnum.GNS]?.explorerUrl}/tx/${item.data.txHash}`}
          />
        )}
      </Flex>
    )
  },
  action: (item) => (
    <Type.Caption color="neutral1" sx={{ textTransform: 'capitalize' }}>
      {item.type.split('_').join(' ').toLowerCase()}
    </Type.Caption>
  ),
  accountValueChange: (item) => (
    <Type.Caption color={getColor(item.type)}>
      {item.type === LITE_TRANSACTION_TYPE.DEPOSIT && '+'}
      {item.type === LITE_TRANSACTION_TYPE.WITHDRAW && '-'}${formatNumber(item.data.amount, 2, 2)}
    </Type.Caption>
  ),
  estimatedFinish: (item) => {
    return item.estimatedFinishTime ? (
      <Type.Caption color="neutral1">
        <LocalTimeText date={item.estimatedFinishTime} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
      </Type.Caption>
    ) : (
      '--'
    )
  },
  fee: (item) => (
    <Type.Caption color={getColor('FEE')}>
      $
      {formatNumber(
        (item.data.hyperliquidTransferFeeAmount || 0) +
          (item.data.hyperliquidWithdrawFeeAmount || 0) +
          (item.data.feeAmount || 0),
        2,
        2
      )}
    </Type.Caption>
  ),
  status: (item) => (
    <Type.Caption
      color={getColor(item.status)}
      sx={{
        mr: -2,
        borderRadius: '16px',
        width: 'fit-content',
        textAlign: 'right',
        lineHeight: '24px',
        px: 2,
        bg: 'neutral7',
        textTransform: 'capitalize',
      }}
    >
      {item.status.split('_').join(' ').toLowerCase()}
    </Type.Caption>
  ),
}

export const transactionTitles = {
  time: <Trans>Time</Trans>,
  action: <Trans>Action</Trans>,
  accountValueChange: <Trans>Account Value Change</Trans>,
  fee: <Trans>Fee</Trans>,
  status: <Trans>Status</Trans>,
  estimatedFinishTime: <Trans>Estimated Finish</Trans>,
}

export const transactionColumns: ColumnData<LiteTransactionData, ExternalSource>[] = [
  {
    title: transactionTitles.time,
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { minWidth: 200, width: 200, pl: '16px !important' },
    render: renderProps.time,
  },
  {
    title: transactionTitles.action,
    dataIndex: 'type',
    key: 'type',
    sortBy: 'type',
    style: { minWidth: 100, width: 100 },
    render: renderProps.action,
  },
  {
    title: transactionTitles.estimatedFinishTime,
    dataIndex: 'estimatedFinishTime',
    key: 'estimatedFinishTime',
    sortBy: 'estimatedFinishTime',
    style: { minWidth: 150, width: 150 },
    render: renderProps.estimatedFinish,
  },
  {
    title: transactionTitles.accountValueChange,
    dataIndex: 'embeddedWallet',
    key: 'embeddedWallet',
    sortBy: 'embeddedWallet',
    style: { minWidth: 150, width: 150, textAlign: 'right' },
    render: renderProps.accountValueChange,
  },
  {
    title: transactionTitles.fee,
    dataIndex: 'data',
    key: 'data',
    sortBy: 'data',
    style: { minWidth: 80, width: 80, textAlign: 'right' },
    render: renderProps.fee,
  },
  {
    title: transactionTitles.status,
    dataIndex: 'status',
    key: 'status',
    sortBy: 'status',
    style: { minWidth: 120, width: 120, textAlign: 'right', pr: '16px !important' },
    render: renderProps.status,
  },
]
