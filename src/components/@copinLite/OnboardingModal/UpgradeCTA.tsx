import { Lock } from '@phosphor-icons/react'
import React from 'react'

import UpgradeButton from 'components/@subscription/UpgradeButton'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import { Flex, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

const UpgradeCTA = () => {
  const { userPermission, pagePermission } = useProtocolPermission()
  const userProtocolsCount = userPermission?.protocolAllowed?.length
  const pageProtocolsCount = pagePermission?.ELITE?.protocolAllowed?.length
  if (!userProtocolsCount || !pageProtocolsCount || userProtocolsCount === pageProtocolsCount) return <></>
  return (
    <Flex
      flexDirection={['column', 'column', 'column', 'column', 'row']}
      mt={24}
      justifyContent="center"
      alignItems="center"
      sx={{ gap: 1 }}
    >
      <Flex sx={{ gap: 1 }} alignItems="center">
        <IconBox icon={<Lock size={12} />} />
        <Type.Caption>
          You&apos;re accessing {userProtocolsCount} of {pageProtocolsCount} protocols.
        </Type.Caption>
      </Flex>
      <Flex>
        <UpgradeButton requiredPlan={SubscriptionPlanEnum.ELITE} target="_blank" />
        <Type.Caption>to unlock full access to top traders</Type.Caption>
      </Flex>
    </Flex>
  )
}

export default UpgradeCTA
