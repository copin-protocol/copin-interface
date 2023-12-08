// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import CopyButton from 'theme/Buttons/CopyButton'
import { Flex, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { PLATFORM_TRANS } from 'utils/config/translations'
import { addressShorten, formatNumber } from 'utils/helpers/format'

interface WalletInfoProps {
  data: CopyWalletData
  sx?: BoxProps
}
export default function WalletInfo({ data, sx }: WalletInfoProps & BoxProps) {
  return (
    <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 2, ...sx }}>
      {!!data.bingX && (
        <InfoItem
          width={['100%', '100%', 'calc(50% - 8px)']}
          label={<Trans>API Key</Trans>}
          value={
            <Flex sx={{ gap: 2 }} alignItems="center">
              <Type.CaptionBold>{data.bingX.apiKey ? addressShorten(data.bingX.apiKey, 8) : '-'}</Type.CaptionBold>
              {!!data.bingX.apiKey && (
                <CopyButton
                  variant="ghost"
                  size="xs"
                  value={data.bingX.apiKey}
                  iconSize={16}
                  sx={{
                    transition: 'none',
                    p: 0,
                  }}
                ></CopyButton>
              )}
            </Flex>
          }
        />
      )}
      <InfoItem
        width={['calc(50% - 4px)', 'calc(50% - 4px)', 'calc(25% - 4px)']}
        label={<Trans>Balance</Trans>}
        value={data.balance ? `$${formatNumber(data.balance)}` : '-'}
      />
      <InfoItem
        width={['calc(50% - 4px)', 'calc(50% - 4px)', 'calc(25% - 4px)']}
        label={<Trans>Platform</Trans>}
        value={<Type.CaptionBold>{PLATFORM_TRANS[data.exchange]}</Type.CaptionBold>}
      />
    </Flex>
  )
}

interface InfoItemProps {
  label: ReactNode
  value: ReactNode
  width?: string | string[]
}

function InfoItem({ label, value, width }: InfoItemProps) {
  return (
    <Flex width={width} flexDirection="column" sx={{ gap: 2 }}>
      <Type.Caption color="neutral3">{label}</Type.Caption>
      {typeof value === 'string' ? <Type.CaptionBold color="neutral1">{value}</Type.CaptionBold> : value}
    </Flex>
  )
}
