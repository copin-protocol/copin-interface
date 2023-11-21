import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import { TraderAlertData } from 'entities/alert'
import IconButton from 'theme/Buttons/IconButton'
import AlertOffIcon from 'theme/Icons/AlerOffIcon'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { formatLocalRelativeDate } from 'utils/helpers/format'

export default function AlertListMobile({
  data,
  isLoading,
  submitting,
  onSelect,
}: {
  data?: TraderAlertData[]
  isLoading?: boolean
  submitting?: boolean
  onSelect: (data?: TraderAlertData) => void
}) {
  if (isLoading) return <Loading />
  if (!data) return <></>
  return (
    <Flex
      pb={40}
      minHeight="calc(100vh - 230px)"
      sx={{ width: '100%', height: '100%', overflow: 'auto', flexDirection: 'column', gap: 3 }}
    >
      {data.map((value, index) => (
        <MobileItem key={index} data={value} onSelect={onSelect} submitting={submitting} />
      ))}
    </Flex>
  )
}

export function MobileItem({
  submitting,
  data,
  onSelect,
}: {
  submitting?: boolean
  data: TraderAlertData
  onSelect: (data?: TraderAlertData) => void
}) {
  return (
    <Box sx={{ p: 3, bg: 'neutral6' }}>
      <Flex justifyContent="space-between" sx={{ gap: 2 }}>
        <Property
          label={<Trans>Wallet Address</Trans>}
          value={<AccountWithProtocol protocol={data.protocol} address={data.address} size={32} />}
        />
        <Property
          label={
            <IconButton
              type="button"
              variant="ghostDanger"
              icon={<AlertOffIcon />}
              size={24}
              sx={{ p: 0 }}
              isLoading={submitting}
              disabled={submitting}
              onClick={() => onSelect(data)}
            />
          }
          value={formatLocalRelativeDate(data.createdAt)}
          sx={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'column' }}
        />
      </Flex>
    </Box>
  )
}

function Property({ label, value, sx }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Box sx={sx}>
      <Type.Caption color="neutral3" mb={2} display="block">
        {label}
      </Type.Caption>
      <Type.Caption>{value}</Type.Caption>
    </Box>
  )
}
