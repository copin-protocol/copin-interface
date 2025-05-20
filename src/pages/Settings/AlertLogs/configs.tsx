import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ReverseTag from 'components/@ui/ReverseTag'
import TraderAddress from 'components/@ui/TraderAddress'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { AlertLogData } from 'entities/alertLog'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import CopyButton from 'theme/Buttons/CopyButton'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Image, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { ChannelTypeEnum } from 'utils/config/enums'
import { ALERT_CUSTOM_TYPE_TRANS, ORDER_TYPE_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseExchangeImage } from 'utils/helpers/transform'

import { getChannelByType } from './helpers'

export type ExternalSource = {
  handleSelectCopyItem?: (data: CopyPositionData) => void
  copyWallets?: CopyWalletData[] | undefined
  isMobile?: boolean
}
type AlertLogColumnData = ColumnData<AlertLogData, ExternalSource>

export const renderProps: Record<string, AlertLogColumnData['render']> = {
  time: (item, index, externalSource) => {
    const isMobile = externalSource?.isMobile
    return (
      <Box sx={{ position: 'relative' }}>
        {item.data.isReverse && <ReverseTag sx={{ top: isMobile ? '-45px' : '-12px', left: '-16px' }} />}
        <Type.Caption color="neutral1">
          <LocalTimeText date={item.createdAt} format={DAYJS_FULL_DATE_FORMAT} hasTooltip={false} />
        </Type.Caption>
      </Box>
    )
  },
  copyTitle: (item) => (
    <Type.CaptionBold
      color="neutral1"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      {item.data?.copyTradeTitle ?? item.name}
    </Type.CaptionBold>
  ),
  type: (item) => (
    <Type.CaptionBold
      color="neutral1"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      {ALERT_CUSTOM_TYPE_TRANS[item.alertType]}
    </Type.CaptionBold>
  ),
  name: (item) => (
    <Type.CaptionBold
      color="neutral1"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      {item.name}
    </Type.CaptionBold>
  ),
  sourceTrader: (item) => (
    <TraderAddress address={item.data.account} protocol={item.data.protocol} options={{ size: 24 }} />
  ),
  sourceAction: (item) => {
    const isQuotaReached = !!item.errorMsg && !!item.data?.isNeedUpgrade
    return (
      <Type.Caption color="neutral1" sx={isQuotaReached ? { filter: 'blur(4px)' } : {}}>
        {item.data.type ? ORDER_TYPE_TRANS[item.data.type] : '--'}
      </Type.Caption>
    )
  },
  sourceDetails: (item) => {
    const isQuotaReached = !!item.errorMsg && !!item.data?.isNeedUpgrade
    return (
      <Flex
        sx={{
          gap: 1,
          alignItems: 'center',
          color: 'neutral1',
          ...(isQuotaReached ? { filter: 'blur(4px)' } : {}),
        }}
      >
        <Type.Caption width={8} color={item.data.isLong ? 'green1' : 'red2'}>
          {item.data.isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
        </Type.Caption>
        <VerticalDivider />
        <Type.Caption>{item.data.token}</Type.Caption>
        <VerticalDivider />
        <Type.Caption>
          {item.data.price ? PriceTokenText({ value: item.data.price, maxDigit: 2, minDigit: 2 }) : '--'}
        </Type.Caption>
      </Flex>
    )
  },
  targetWallet: (item, _) => {
    const isQuotaReached = !!item.errorMsg && !!item.data?.isNeedUpgrade
    return (
      <Flex sx={{ alignItems: 'center', gap: 2, ...(isQuotaReached ? { filter: 'blur(4px)' } : {}) }}>
        <Type.Caption
          color="neutral1"
          sx={{ maxWidth: '122px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {item.data.walletName ?? '--'}
        </Type.Caption>
        <VerticalDivider />
        <Image src={parseExchangeImage(item.data.exchange)} width={20} height={20} />
      </Flex>
    )
  },
  targetAction: (item, _) => {
    const parseErrMsg =
      item.data?.errorMsg && item.data.errorMsg.startsWith('"') && item.data.errorMsg.endsWith('"')
        ? JSON.parse(item.data.errorMsg)
        : item.data.errorMsg

    const isLong = (item.data.isLong ? 1 : -1) * (item.data.isReverse ? -1 : 1) === 1
    const isQuotaReached = !!item.errorMsg && !!item.data?.isNeedUpgrade

    return item.data.isSuccess || item.data.isProcessing ? (
      <Flex
        sx={{
          gap: 1,
          alignItems: 'center',
          color: 'neutral1',
          ...(isQuotaReached ? { filter: 'blur(4px)' } : {}),
        }}
      >
        <Type.Caption width={8} color={isLong ? 'green1' : 'red2'}>
          {isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
        </Type.Caption>
        <VerticalDivider />
        <Type.Caption>{item.data.token}</Type.Caption>
        <VerticalDivider />
        <Type.Caption>
          {item.data.price ? PriceTokenText({ value: item.data.price, maxDigit: 2, minDigit: 2 }) : '--'}
        </Type.Caption>
      </Flex>
    ) : (
      <Type.Caption
        color="neutral3"
        sx={{ whiteSpace: 'pre-line', ...(isQuotaReached ? { filter: 'blur(4px)' } : {}) }}
      >
        {parseErrMsg ?? <Trans>Error while place order</Trans>}
      </Type.Caption>
    )
  },
  channel: (item) => (
    <Type.CaptionBold
      color="neutral1"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      {getChannelByType(item.alertChannel, item.data?.chatId)}
    </Type.CaptionBold>
  ),
  channelName: (item) => {
    const isWebhook = item.alertChannel === ChannelTypeEnum.WEBHOOK
    const isGroup = item.alertChannel === ChannelTypeEnum.TELEGRAM && item.data.chatId && Number(item.data.chatId) < 0
    return (isGroup || isWebhook) && !item.data.channelName ? (
      <Type.Caption>--</Type.Caption>
    ) : (
      <LabelWithTooltip
        id={item.alertChannel + item.data.channelName + item.alertType + item.data.chatId + item.data.webhookUrl}
        tooltipClickable
        tooltip={
          <CopyButton
            type="button"
            variant="ghost"
            value={isWebhook ? item.data.webhookUrl ?? '' : item.data.chatId ?? ''}
            size="sm"
            sx={{ color: 'neutral3', px: 1, py: 0 }}
            iconSize={18}
          >
            <Type.Caption color="neutral2" textAlign="left">
              {isWebhook ? `Webhook Url: ${item.data.webhookUrl}` : `Telegram Chat ID: ${item.data.chatId}`}
            </Type.Caption>
          </CopyButton>
        }
        sx={{ ...overflowEllipsis(), color: 'neutral1' }}
      >
        {isGroup || isWebhook ? item.data.channelName ?? '--' : item.data.chatId}
      </LabelWithTooltip>
    )
  },
  status: (item) => (
    <Type.Caption color={item.isSuccess ? 'green2' : 'red1'}>
      {item.isSuccess ? <Trans>Success</Trans> : <Trans>Failed</Trans>}
    </Type.Caption>
  ),
  reason: (item) => {
    return item.isSuccess ? (
      <Type.Caption>--</Type.Caption>
    ) : (
      <Type.Caption>{item.errorMsg ?? 'Unknown Error'}</Type.Caption>
    )
  },
}

export const alertLogTitles = {
  time: <Trans>TIME</Trans>,
  copyTitle: <Trans>COPY</Trans>,
  type: <Trans>TYPE</Trans>,
  sourceTrader: <Trans>TRADER</Trans>,
  sourceDetails: <Trans>DETAILS</Trans>,
  sourceAction: <Trans>ACTION</Trans>,
  targetWallet: <Trans>TARGET WALLET</Trans>,
  targetAction: <Trans>TARGET ACTION</Trans>,
  channel: <Trans>CHANNEL</Trans>,
  channelName: <Trans>CHANNEL NAME</Trans>,
  status: <Trans>STATUS</Trans>,
  reason: <Trans>REASON</Trans>,
}

const commonStyles = {
  pl: 0,
  pr: 0,
}
const rightAlignStyle = { textAlign: 'right' }

export const copyLogColumns: AlertLogColumnData[] = [
  {
    title: alertLogTitles.time,
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { ...commonStyles, minWidth: 150, width: 150 },
    render: renderProps.time,
  },
  {
    title: alertLogTitles.channel,
    dataIndex: 'alertChannel',
    key: 'alertChannel',
    sortBy: 'alertChannel',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.channel,
  },
  {
    title: alertLogTitles.channelName,
    dataIndex: 'channelName',
    key: 'channelName',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.channelName,
  },
  {
    title: alertLogTitles.copyTitle,
    key: 'data',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.copyTitle,
  },
  {
    title: alertLogTitles.sourceTrader,
    key: 'data',
    style: { ...commonStyles, minWidth: 150, width: 150 },
    render: renderProps.sourceTrader,
  },
  {
    title: alertLogTitles.sourceAction,
    key: 'data',
    style: { ...commonStyles, minWidth: 90, width: 90 },
    render: renderProps.sourceAction,
  },
  {
    title: alertLogTitles.targetWallet,
    key: 'data',
    style: { ...commonStyles, minWidth: 180, width: 180 },
    render: renderProps.targetWallet,
  },
  {
    title: alertLogTitles.targetAction,
    key: 'data',
    style: { ...commonStyles, minWidth: 400, width: 400 },
    render: renderProps.targetAction,
  },
  {
    title: alertLogTitles.reason,
    dataIndex: 'errorMsg',
    key: 'errorMsg',
    sortBy: 'errorMsg',
    style: { ...commonStyles, minWidth: 300, width: 300, maxWidth: 300 },
    render: renderProps.reason,
  },
  {
    title: alertLogTitles.status,
    dataIndex: 'isSuccess',
    key: 'isSuccess',
    sortBy: 'isSuccess',
    style: { ...commonStyles, ...rightAlignStyle, minWidth: 100, width: 100 },
    render: renderProps.status,
  },
]

export const watchlistLogColumns: AlertLogColumnData[] = [
  {
    title: alertLogTitles.time,
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { ...commonStyles, minWidth: 150, width: 150 },
    render: renderProps.time,
  },
  {
    title: alertLogTitles.channel,
    dataIndex: 'alertChannel',
    key: 'alertChannel',
    sortBy: 'alertChannel',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.channel,
  },
  {
    title: alertLogTitles.channelName,
    dataIndex: 'data',
    key: 'data',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.channelName,
  },
  {
    title: alertLogTitles.sourceTrader,
    key: 'data',
    style: { ...commonStyles, minWidth: 150, width: 150 },
    render: renderProps.sourceTrader,
  },
  {
    title: alertLogTitles.sourceAction,
    key: 'data',
    style: { ...commonStyles, minWidth: 90, width: 90 },
    render: renderProps.sourceAction,
  },
  {
    title: alertLogTitles.sourceDetails,
    key: 'data',
    style: { ...commonStyles, minWidth: 200, width: 200 },
    render: renderProps.sourceDetails,
  },
  {
    title: alertLogTitles.reason,
    dataIndex: 'errorMsg',
    key: 'errorMsg',
    sortBy: 'errorMsg',
    style: { ...commonStyles, minWidth: 300, width: 300, maxWidth: 300 },
    render: renderProps.reason,
  },
  {
    title: alertLogTitles.status,
    dataIndex: 'isSuccess',
    key: 'isSuccess',
    sortBy: 'isSuccess',
    style: { ...rightAlignStyle, minWidth: 80, width: 80 },
    render: renderProps.status,
  },
]

export const customLogColumns: AlertLogColumnData[] = [
  {
    title: alertLogTitles.time,
    dataIndex: 'createdAt',
    key: 'createdAt',
    sortBy: 'createdAt',
    style: { ...commonStyles, minWidth: 150, width: 150 },
    render: renderProps.time,
  },
  {
    title: alertLogTitles.channel,
    dataIndex: 'alertChannel',
    key: 'alertChannel',
    sortBy: 'alertChannel',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.channel,
  },
  {
    title: alertLogTitles.channelName,
    dataIndex: 'data',
    key: 'data',
    style: { ...commonStyles, minWidth: 120, width: 120 },
    render: renderProps.channelName,
  },
  {
    title: alertLogTitles.sourceTrader,
    key: 'data',
    style: { ...commonStyles, minWidth: 180, width: 180 },
    render: renderProps.sourceTrader,
  },
  {
    title: alertLogTitles.sourceAction,
    key: 'data',
    style: { ...commonStyles, minWidth: 90, width: 90 },
    render: renderProps.sourceAction,
  },
  {
    title: alertLogTitles.sourceDetails,
    key: 'data',
    style: { ...commonStyles, minWidth: 200, width: 200 },
    render: renderProps.sourceDetails,
  },
  {
    title: alertLogTitles.reason,
    dataIndex: 'errorMsg',
    key: 'errorMsg',
    sortBy: 'errorMsg',
    style: { ...commonStyles, minWidth: 300, width: 300, maxWidth: 300 },
    render: renderProps.reason,
  },
  {
    title: alertLogTitles.status,
    dataIndex: 'isSuccess',
    key: 'isSuccess',
    sortBy: 'isSuccess',
    style: { ...rightAlignStyle, minWidth: 80, width: 80 },
    render: renderProps.status,
  },
]

export function Property({ label, value, sx }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Box sx={sx}>
      <Type.Caption color="neutral3" mb={2} display="block">
        {label}
      </Type.Caption>
      {value}
    </Box>
  )
}
