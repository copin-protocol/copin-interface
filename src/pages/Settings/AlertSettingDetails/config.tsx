import React, { ReactNode } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { TraderAlertData } from 'entities/alert'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'

export const TraderAddress = ({ data }: { data: TraderAlertData }) => {
  return (
    <AccountInfo
      isOpenPosition={false}
      address={data.address}
      protocol={data.protocol}
      size={24}
      sx={{ color: 'neutral1' }}
    />
  )
}

export const TraderStatus = ({ data }: { data: TraderAlertData }) => {
  const tooltipId = `tt_${data.id}`
  return (
    <>
      <Box data-tip="React-tooltip" data-tooltip-id={tooltipId}>
        <SwitchInput checked disabled />
      </Box>
      <Tooltip id={tooltipId}>
        <Type.Caption color="neutral3">Coming Soon</Type.Caption>
      </Tooltip>
    </>
  )
}

export const TraderLastTradeAt = ({ data }: { data: TraderAlertData }) => {
  return (
    <Type.Caption color="neutral1">{data.lastTradeAt ? formatLocalRelativeDate(data.lastTradeAt) : 'N/A'}</Type.Caption>
  )
}

export const Trader24hTrades = ({ data }: { data: TraderAlertData }) => {
  return <Type.Caption color="neutral1">{data.trade24h ? formatNumber(data.trade24h) : 'N/A'}</Type.Caption>
}
export const Trader30dTrades = ({ data }: { data: TraderAlertData }) => {
  return <Type.Caption color="neutral1">{data.trade30D ? formatNumber(data.trade30D) : 'N/A'}</Type.Caption>
}

export function MobileRowItem({
  label,
  value,
  textColor = 'neutral1',
}: {
  label: ReactNode
  value: ReactNode
  textColor?: string
}) {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Type.Caption color="neutral3" display="block">
        {label}
      </Type.Caption>
      <Type.Caption color={textColor}>{value}</Type.Caption>
    </Flex>
  )
}
