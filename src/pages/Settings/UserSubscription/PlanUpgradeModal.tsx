import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import React from 'react'

import BulletItem from 'components/@ui/BulletItem'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Image, Type } from 'theme/base'
import { PlanConfig } from 'utils/config/subscription'

import PlanInfoCard from './PlanInfoCard'
import { getRemainingDays } from './helpers'

interface PlanUpgradeModalProps {
  isOpen?: boolean
  onClose: () => void
  onConfirm: () => void
  currentPlan: PlanConfig
  targetPlan: PlanConfig
  expiredTime?: string
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen = false,
  onClose,
  onConfirm,
  currentPlan,
  targetPlan,
  expiredTime,
}) => {
  // Calculate remaining time on current plan

  // Calculate how much time will be added to the new plan
  const getNewPlanTime = (remainingDays: number) => {
    if (remainingDays <= 0) return 0

    // Calculate based on price ratio
    const ratio = currentPlan.price / targetPlan.price
    const newDays = Math.floor(remainingDays * ratio)

    return newDays
  }

  const remainingDays = getRemainingDays(expiredTime)
  const newPlanDays = getNewPlanTime(remainingDays)

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxWidth="550px">
      <Box p={3} textAlign="center">
        <Image height={90} src={`/images/subscriptions/${targetPlan.title}_FULL.png`} />

        <Type.H5 mb={1}>
          <Trans>UPGRADE SUBSCRIPTION</Trans>
        </Type.H5>

        <Type.Caption color="orange1" mb={4}>
          <Trans>You&apos;re upgrading your subscription before your current plan ends.</Trans>
        </Type.Caption>

        <BulletItem>
          <Trans>Your new plan starts immediately after upgrading.</Trans>
        </BulletItem>

        <BulletItem>
          <Trans>
            The remaining <b>value</b> of your current plan will be added to the new plan after successful payment
          </Trans>
        </BulletItem>

        {remainingDays > 0 && (
          <Flex sx={{ gap: 2, alignItems: 'center', mt: 3, mb: 4 }}>
            <PlanInfoCard plan={currentPlan} days={remainingDays} />

            <ArrowRight size={24} />

            <PlanInfoCard plan={targetPlan} days={newPlanDays} />
          </Flex>
        )}

        <Flex sx={{ gap: 16 }}>
          <Button block variant="outline" onClick={onClose}>
            <Trans>CANCEL</Trans>
          </Button>
          <Button block variant="primary" onClick={onConfirm}>
            <Trans>CONTINUE</Trans>
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}

export default PlanUpgradeModal
