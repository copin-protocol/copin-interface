import { Trans } from '@lingui/macro'
import { useState } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import PaySubscriptionModal from 'components/@subscription/PaySubscriptionModal'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { useSubscriptionPlans } from 'hooks/features/subscription/useSubscriptionPlans'
import useSearchParams from 'hooks/router/useSearchParams'
import { useAuthContext } from 'hooks/web3/useAuth'
import PlanUpgradeModal from 'pages/Settings/UserSubscription/PlanUpgradeModal'
import SwitchInput from 'theme/SwitchInput'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { PRO_PLAN, PlanConfig } from 'utils/config/subscription'

import EnterprisePlan from './EnterprisePlan'
import FAQ from './FAQ'
import PlansComparison from './PlansComparison'
import PricingCards from './PricingCards'
import { SubscriptionColors, SubscriptionGrid, SubscriptionTitle } from './styled'

export default function SubscriptionPage() {
  const [yearly, setYearly] = useState(true)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [upgradingPlan, setUpgradingPlan] = useState<PlanConfig | null>(null)
  const { searchParams } = useSearchParams()
  const handleClickLogin = useClickLoginButton()

  const { profile } = useAuthContext()
  const subscriptionPlans = useSubscriptionPlans()
  const currentPlan = subscriptionPlans.find((plan) => plan.title === profile?.subscription?.plan)
  let targetPlan = PRO_PLAN
  if (searchParams?.['plan']) {
    const paramsPlan = subscriptionPlans.find((plan) => plan.title === searchParams['plan'] && plan.id >= PRO_PLAN.id)
    if (paramsPlan) {
      targetPlan = paramsPlan
    }
  }
  const highlightPlan =
    targetPlan && currentPlan ? (targetPlan.id > currentPlan.id ? targetPlan : currentPlan) : targetPlan

  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="Subscription Plans" />
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
        py={4}
        px={[2, 3]}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '650px', overflow: 'hidden' }}>
          <SubscriptionColors />
          <SubscriptionGrid />
        </Box>
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 1400, mx: 'auto' }}>
          <SubscriptionTitle>
            <Trans>Subscription</Trans>
          </SubscriptionTitle>
          <Type.Body>
            <Trans>We&apos;ve got a pricing plan that&apos;s perfect for you</Trans>
          </Type.Body>
          <Flex justifyContent="center" alignItems="center" sx={{ gap: 2, mt: 24 }}>
            <Type.LargeBold color={yearly ? 'neutral3' : 'neutral1'}>
              <Trans>Monthly</Trans>
            </Type.LargeBold>
            <SwitchInput defaultActive={yearly} onChange={() => setYearly(!yearly)} isManual />
            <Type.LargeBold color={yearly ? 'neutral1' : 'neutral3'}>
              <Trans>Yearly</Trans>
            </Type.LargeBold>
            <Type.CaptionBold sx={{ bg: yearly ? 'green1' : 'neutral3', px: 2, borderRadius: '8px' }} color="neutral8">
              <Trans>Save {Math.max(...subscriptionPlans.map((plan) => plan.yearlyDiscountPercent))}%</Trans>
            </Type.CaptionBold>
          </Flex>
          <Box width="100%" px={{ _: 2, xl: 64 }} mx="auto" py={4} alignItems="center">
            <PricingCards
              highlightPlan={highlightPlan?.title as SubscriptionPlanEnum}
              yearly={yearly}
              plans={subscriptionPlans}
              currentPlan={profile?.subscription?.plan}
              onUpgrade={(plan) => {
                if (!profile) {
                  handleClickLogin()
                  return
                }
                if (currentPlan && currentPlan.title !== SubscriptionPlanEnum.FREE && plan.id > currentPlan?.id) {
                  setIsUpgradeModalOpen(true)
                }
                setUpgradingPlan(plan)
              }}
            />
            <PlansComparison />
            <EnterprisePlan />
            <FAQ />
          </Box>
        </Box>
      </Box>
      {!!upgradingPlan && !isUpgradeModalOpen && (
        <PaySubscriptionModal plan={upgradingPlan} period={yearly ? 12 : 1} onDismiss={() => setUpgradingPlan(null)} />
      )}
      {currentPlan && upgradingPlan && (
        <PlanUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => {
            setUpgradingPlan(null)
            setIsUpgradeModalOpen(false)
          }}
          onConfirm={() => {
            setIsUpgradeModalOpen(false)
          }}
          expiredTime={profile?.subscription?.expiredTime}
          currentPlan={currentPlan}
          targetPlan={upgradingPlan}
        />
      )}
    </SafeComponentWrapper>
  )
}
