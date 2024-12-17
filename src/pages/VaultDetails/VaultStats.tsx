import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import CustomTag from 'components/@ui/CustomTag'
import useVaultDetailsContext from 'hooks/features/useVaultDetailsProvider'
import { GradientText } from 'pages/@layouts/Navbar/EventButton'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function VaultStats() {
  const { vault, vaultUserDetails, vaultApr, isLoading } =
    useVaultDetailsContext()

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr', '1fr 1fr 1fr 1fr'],
          gap: [0, 2, 2, 2, 2],
        }}
      >
        <StatsWrapper
          label={<Trans>TVL</Trans>}
          value={`${vault?.totalPooledToken ? `$${formatNumber(vault?.totalPooledToken, 2)}` : '--'}`}
          isLoading={isLoading}
        />
        <StatsWrapper
          label={<Trans>Past Month Return</Trans>}
          value={`${vaultApr?.apr ? `${formatNumber(vaultApr?.apr, 2, 2)}%` : '--'}`}
          others={<CustomTag width={45} text="APR" color="neutral1" />}
          isLoading={isLoading}
          hasGradient
        />
        <StatsWrapper
          label={<Trans>Your Balance</Trans>}
          value={`${vaultUserDetails?.userBalanceUsd ? `$${formatNumber(vaultUserDetails?.userBalanceUsd, 2)}` : '--'}`}
          isLoading={isLoading}
        />
        <StatsWrapper
          label={<Trans>Your Current PnL</Trans>}
          value={`${
            vaultUserDetails?.pnl
              ? `${vaultUserDetails.pnl > -0.001 ? '' : '-'}$${formatNumber(Math.abs(vaultUserDetails.pnl), 2)}`
              : '--'
          }`}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  )
}

function StatsWrapper({
  label,
  value,
  others,
  hasGradient,
  isLoading,
}: {
  label: ReactNode
  value: string | undefined
  others?: ReactNode
  hasGradient?: boolean
  isLoading?: boolean
}) {
  const valueText = value ? `${value}` : '--'
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          background: 'linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)',
        }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          top: '4px',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1,
          bg: 'neutral7',
        }}
      />
      <Box
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          borderTopLeftRadius: '4px 2px',
          borderTopRightRadius: '4px 2px',
          top: '4px',
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 2,
          background: 'linear-gradient(180.26deg, #272C43 0.23%, rgba(11, 13, 23, 0) 85.39%)',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          py: 4,
          px: 3,
          zIndex: 3,
        }}
      >
        <Flex width="100%" alignItems="center" sx={{ mb: 2, gap: 2 }}>
          <Type.Body color="neutral3" display="block" sx={{ textAlign: 'center' }}>
            {label}
          </Type.Body>
        </Flex>
        {isLoading ? (
          <Loading />
        ) : (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.H5 display="block">{hasGradient ? <GradientText>{valueText}</GradientText> : valueText}</Type.H5>
            {others}
          </Flex>
        )}
      </Box>
    </Box>
  )
}
