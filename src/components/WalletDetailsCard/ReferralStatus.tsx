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
export default function ReferralStatus({ data, sx }: ReferralStatusProps & BoxProps) {
  const status = useMemo(() => {
    switch (data?.isReferral) {
      case true:
        return {
          text: 'Ref',
          color: themeColors.primary1,
          icon: <Smiley size={13} color={themeColors.primary1} />,
        } as StatusProps
      case false:
        return {
          text: 'Non-Ref',
          color: themeColors.red2,
          icon: <SmileySad size={13} color={themeColors.red2} />,
        } as StatusProps
      default:
        return {
          text: 'Unknown',
          color: themeColors.orange1,
          icon: <SmileyBlank size={13} color={themeColors.orange1} />,
        } as StatusProps
    }
  }, [data?.isReferral])

  return (
    <Flex
      width={80}
      alignItems="center"
      justifyContent="center"
      sx={{
        gap: 1,
        py: '2px',
        borderRadius: '4px',
        backgroundColor: `${status.color}25`,
        ...sx,
      }}
    >
      <IconBox icon={status.icon} />
      <Type.Caption color="neutral1">{status.text}</Type.Caption>
    </Flex>
  )
}
