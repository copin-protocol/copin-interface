import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import React from 'react'

import BulletItem from 'components/@ui/BulletItem'
import Divider from 'components/@ui/Divider'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Image, Type } from 'theme/base'
import { PLANS, PlanConfig } from 'utils/config/subscription'

import PlanInfoCard from './PlanInfoCard'
import { getRemainingDays } from './helpers'

interface PlanDowngradeModalProps {
  isOpen?: boolean
  onClose: () => void
  onConfirm: () => void
  currentPlan: PlanConfig
  expiredTime?: string
}

const PlanDowngradeModal: React.FC<PlanDowngradeModalProps> = ({
  isOpen = false,
  onClose,
  onConfirm,
  currentPlan,
  expiredTime,
}) => {
  const remainingDays = getRemainingDays(expiredTime)
  const targetPlan = PLANS.find((plan) => plan.id === currentPlan.id - 1)
  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxWidth="550px">
      <Box p={3} textAlign="center">
        <Image height={90} src={`/images/subscriptions/STARTER_FULL.png`} sx={{ filter: 'grayscale(1)' }} />

        <Type.H5 mb={3}>
          <Trans>DOWNGRADE SUBSCRIPTION</Trans>
        </Type.H5>

        <Type.Body color="red1" mb={4}>
          <Trans>You&apos;re about to downgrade your subscription.</Trans>
        </Type.Body>

        <BulletItem>
          <Trans>Your new plan starts immediately after downgrading.</Trans>
        </BulletItem>

        <BulletItem>
          <Trans>
            The remaining <b>days</b> of your current plan will be added to the new plan after successful payment
          </Trans>
        </BulletItem>
        {remainingDays > 0 && targetPlan && (
          <Flex sx={{ gap: 2, alignItems: 'center', mt: 3, mb: 4 }}>
            <PlanInfoCard plan={currentPlan} days={remainingDays} />

            <ArrowRight size={24} />

            <PlanInfoCard plan={targetPlan} days={remainingDays} />
          </Flex>
        )}
        <Divider my={3} />
        <Type.Caption display="block" mt={3} mb={4} textAlign="left" color="neutral3">
          <Trans>Some features or data from your current plan may no longer be available after downgrading.</Trans>
        </Type.Caption>

        <Flex sx={{ gap: 16 }}>
          <Button block variant="outline" onClick={onClose}>
            <Trans>CANCEL</Trans>
          </Button>
          <Button block variant="danger" onClick={onConfirm}>
            <Trans>CONTINUE</Trans>
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}

export default PlanDowngradeModal
