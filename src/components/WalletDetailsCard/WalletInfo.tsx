// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { ArrowSquareRight } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { CopyWalletData } from 'entities/copyWallet'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import ROUTES from 'utils/config/routes'
import { PLATFORM_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'

interface WalletInfoProps {
  data: CopyWalletData
  sx?: BoxProps
}
export default function WalletInfo({ data, sx }: WalletInfoProps & BoxProps) {
  return (
    <Flex alignItems="center" sx={{ gap: 2, ...sx }}>
      <InfoItem label={<Trans>Balance</Trans>} value={data.balance ? `$${formatNumber(data.balance)}` : '-'} />
      <InfoItem
        label={<Trans>Copy Volume</Trans>}
        value={data.copyVolume ? `$${formatNumber(data.copyVolume)}` : '-'}
      />
      <InfoItem
        label={<Trans>Active Copy</Trans>}
        value={
          <Flex alignItems="center" sx={{ gap: 2 }}>
            {formatNumber(data.activeCopy)}
            <Link to={ROUTES.MY_MANAGEMENT.path}>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                icon={<ArrowSquareRight size={20} />}
                sx={{ p: 0 }}
              />
            </Link>
          </Flex>
        }
      />
      <InfoItem label={<Trans>Platform</Trans>} value={PLATFORM_TRANS[data.exchange]} />
    </Flex>
  )
}

interface InfoItemProps {
  label: ReactNode
  value: ReactNode
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Flex flex={1} flexDirection="column" sx={{ gap: 2 }}>
      <Type.Caption color="neutral3">{label}</Type.Caption>
      <Type.CaptionBold color="neutral1">{value}</Type.CaptionBold>
    </Flex>
  )
}
