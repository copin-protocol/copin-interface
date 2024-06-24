// eslint-disable-next-line no-restricted-imports
import { Smiley, SmileyBlank, SmileySad } from '@phosphor-icons/react'
import React, { ReactNode, useMemo } from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import { Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { BoxProps } from 'theme/types'

interface ReferralStatusProps {
  data: CopyWalletData
  sx?: BoxProps
}
interface StatusProps {
  text: string
  color: string
  icon: ReactNode
}
export default function ReferralStatus({
  data,
  sx,
  hasText = true,
  size = 13,
}: ReferralStatusProps & BoxProps & { hasText?: boolean; size?: number }) {
  const status = useMemo(() => {
    switch (data?.isReferral) {
      case true:
        return {
          text: 'Ref',
          color: themeColors.primary1,
          icon: <Smiley size={size} color={themeColors.primary1} />,
        } as StatusProps
      case false:
        return {
          text: 'Non-Ref',
          color: themeColors.red2,
          icon: <SmileySad size={size} color={themeColors.red2} />,
        } as StatusProps
      default:
        return {
          text: 'Unknown',
          color: themeColors.orange1,
          icon: <SmileyBlank size={size} color={themeColors.orange1} />,
        } as StatusProps
    }
  }, [data?.isReferral, size])

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      sx={{
        gap: 1,
        py: '2px',
        borderRadius: '4px',
        backgroundColor: `${status.color}25`,
        flexShrink: 0,
        width: 80,
        ...sx,
      }}
    >
      <IconBox icon={status.icon} />
      {hasText && <Type.Caption color="neutral1">{status.text}</Type.Caption>}
    </Flex>
  )
}
