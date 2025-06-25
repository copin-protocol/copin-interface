import { Trans } from '@lingui/macro'
import { ArrowCircleDown, ArrowSquareOut, ClockClockwise, DotsThreeVertical, Wallet } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getSubscriptionPaymentHistoryApi } from 'apis/subscription'
import PaySubscriptionModal from 'components/@subscription/PaySubscriptionModal'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { useSubscriptionPlans } from 'hooks/features/subscription/useSubscriptionPlans'
import { useIsElite, useIsIF } from 'hooks/features/subscription/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import FAQ from 'pages/Subscription/FAQ'
import { SubscriptionColors, SubscriptionGrid, SubscriptionTitle } from 'pages/Subscription/styled'
import { Button } from 'theme/Buttons'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { LINKS } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { IF_PLAN, PLANS, PlanConfig } from 'utils/config/subscription'
import { formatDate, formatNumber } from 'utils/helpers/format'

import PlanDowngradeModal from './PlanDowngradeModal'
import UsageTable from './UsageTable'

const EXTEND_OPTIONS = [
  { label: '1 Month', value: 1 },
  { label: '3 Months', value: 3 },
  { label: '6 Months', value: 6 },
  { label: '1 Year', value: 12 },
]

const MenuItem = styled(DropdownItem)`
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
`

const MySubscriptionPage = () => {
  const [extendOption, setExtendOption] = useState(EXTEND_OPTIONS[EXTEND_OPTIONS.length - 1])

  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false)
  const [nextPlan, setNextPlan] = useState<PlanConfig | null>(null)

  const { profile } = useAuthContext()
  const isEliteUser = useIsElite()
  const isIFUser = useIsIF()

  const { data: fungiesSubscriptions } = useQuery([QUERY_KEYS.GET_SUBSCRIPTION_PAYMENT_HISTORY], () =>
    getSubscriptionPaymentHistoryApi({
      page: 1,
      limit: 1,
      paymentProvider: 'FUNGIES',
    })
  )

  const subscriptionPlans = useSubscriptionPlans()
  const currentPlan = isIFUser
    ? IF_PLAN
    : subscriptionPlans.find((plan) => plan.title === profile?.subscription?.plan) || PLANS[0]

  const discountPercent = currentPlan.discountByPeriod?.[extendOption.value.toString()]

  const extendPrice = extendOption.value * currentPlan.price * (discountPercent ? 1 - discountPercent / 100 : 1)
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="My Subscription" />
      <Box
        sx={{
          width: '100%',
          maxWidth: [800, 800, 800, 800, 1400],
          mx: 'auto',
          mt: 40,
          px: 3,
        }}
      >
        <Box display={['block', 'block', 'block', 'block', 'flex']}>
          <Box
            variant="cardBorder"
            sx={{
              position: 'relative',
              maxWidth: [undefined, undefined, undefined, undefined, 500],
              width: '100%',
              overflow: 'hidden',
              height: 'fit-content',
            }}
          >
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '650px', overflow: 'hidden' }}>
              <SubscriptionColors />
              <SubscriptionGrid />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto', textAlign: 'left' }}>
              <Flex justifyContent="space-between" alignItems="center" sx={{ height: 48 }}>
                <SubscriptionTitle as={Type.H4}>
                  <Trans>My Subscription</Trans>
                </SubscriptionTitle>
                <Dropdown
                  inline
                  menu={
                    <Box py={1}>
                      {!!fungiesSubscriptions?.data?.length && (
                        <a href={LINKS.fungiesSubscriptionManagement} target="_blank" rel="noreferrer">
                          <MenuItem>
                            <IconBox color="neutral3" icon={<Wallet size={16} />} />
                            <Type.Caption>
                              <Trans>Subscription Management</Trans>
                            </Type.Caption>
                            <IconBox icon={<ArrowSquareOut size={12} />} />
                          </MenuItem>
                        </a>
                      )}
                      <Link to={ROUTES.USER_SUBSCRIPTION_PAYMENT_HISTORY.path}>
                        <MenuItem>
                          <IconBox color="neutral3" icon={<ClockClockwise size={16} />} />
                          <Type.Caption>
                            <Trans>Payment History</Trans>
                          </Type.Caption>
                        </MenuItem>
                      </Link>
                      <Divider my={1} />
                      {![SubscriptionPlanEnum.FREE, SubscriptionPlanEnum.STARTER].includes(
                        currentPlan.title as SubscriptionPlanEnum
                      ) && (
                        <MenuItem
                          onClick={() => {
                            const nextPlan = subscriptionPlans.find((plan) => plan.id === currentPlan.id - 1)
                            if (!nextPlan) return
                            setNextPlan(nextPlan)
                            setIsDowngradeModalOpen(true)
                          }}
                        >
                          <IconBox color="neutral3" icon={<ArrowCircleDown size={16} />} />
                          <Type.Caption>
                            <Trans>Downgrade</Trans>
                          </Type.Caption>
                        </MenuItem>
                      )}
                    </Box>
                  }
                  buttonVariant="ghost"
                  hasArrow={false}
                >
                  <DotsThreeVertical size={24} />
                </Dropdown>
              </Flex>
              <Box
                sx={{
                  pt: 3,
                  background: `linear-gradient(180deg, ${themeColors.neutral8}00 0%,${themeColors.neutral8} 20%,${themeColors.neutral8} 80%, ${themeColors.neutral8}00 100%)`,
                }}
              >
                <Flex
                  flexWrap="wrap"
                  sx={{
                    pr: [0, 3],
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    height={90}
                    src={`/images/subscriptions/${currentPlan.title}_FULL.png`}
                    alt={`${currentPlan.title} plan`}
                  />
                  <Box flex="1">
                    <Type.LargeBold color={currentPlan.color} mr={1} display="block">
                      {currentPlan.title} PLAN
                    </Type.LargeBold>
                    {currentPlan.title !== SubscriptionPlanEnum.FREE ? (
                      <>
                        <Type.Large color="neutral3">(${currentPlan.price}/month)</Type.Large>

                        {profile?.subscription?.expiredTime && (
                          <Type.Caption display="block" mt={2}>
                            <Trans>Expires: {formatDate(profile?.subscription?.expiredTime)}</Trans>
                          </Type.Caption>
                        )}
                      </>
                    ) : (
                      <Type.Caption>
                        <Trans>Explore Copin&apos;s basic features. Upgrade to unlock more powerful tools.</Trans>
                      </Type.Caption>
                    )}
                  </Box>
                  {!isEliteUser && (
                    <Box as={Link} width={['100%', 120]} to={ROUTES.SUBSCRIPTION.path}>
                      <Button variant="primary" block>
                        <Trans>Upgrade Plan</Trans>
                      </Button>
                    </Box>
                  )}
                </Flex>
              </Box>
              {currentPlan.title !== SubscriptionPlanEnum.FREE && !isIFUser && (
                <>
                  <Divider my={3} />
                  <Type.BodyBold display="block">
                    <Trans>EXTEND PLAN</Trans>
                  </Type.BodyBold>
                  <Type.Caption display="block" mt={1} color="neutral2">
                    <Trans>You can extend your usage, with a discounted fee compared to the original price</Trans>
                  </Type.Caption>
                  <Flex
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{
                      gap: 2,
                      py: 3,
                      pr: [0, 3],
                      background: `linear-gradient(180deg, ${themeColors.neutral8}00 0%,${themeColors.neutral8} 20%,${themeColors.neutral8} 80%, ${themeColors.neutral8}00 100%)`,
                    }}
                  >
                    <Dropdown
                      buttonVariant="ghost"
                      inline
                      menu={
                        <Box py={2}>
                          {EXTEND_OPTIONS.map((option) => (
                            <DropdownItem key={option.value} onClick={() => setExtendOption(option)}>
                              {option.label}
                            </DropdownItem>
                          ))}
                        </Box>
                      }
                    >
                      {extendOption.label}
                    </Dropdown>
                    <Flex flex="1" alignItems="center" sx={{ gap: 2 }}>
                      <Type.LargeBold>${formatNumber(extendPrice, 2)}</Type.LargeBold>
                      {!!discountPercent && discountPercent > 0 && (
                        <Type.CaptionBold
                          sx={{ bg: 'green1', px: 2, borderRadius: '8px' }}
                          color="neutral8"
                          display="block"
                        >
                          <Trans>Save {discountPercent}%</Trans>
                        </Type.CaptionBold>
                      )}
                    </Flex>
                    <Button
                      variant="outline"
                      width={['100%', 120]}
                      mt={[2, 0]}
                      onClick={() => {
                        setNextPlan(currentPlan)
                      }}
                    >
                      <Trans>Extend</Trans>
                    </Button>
                  </Flex>
                </>
              )}
            </Box>
          </Box>
          <Box flex="1" pl={[0, 0, 0, 0, 4]} mt={[4, 4, 4, 4, 0]}>
            <Type.H4>
              <Trans>Usage</Trans>
            </Type.H4>
            <Box sx={{ overflowX: 'auto' }}>
              <UsageTable />
            </Box>
          </Box>
        </Box>

        <FAQ displayCase="MY_SUBSCRIPTION" />
      </Box>

      {!!nextPlan && !isDowngradeModalOpen && (
        <PaySubscriptionModal
          plan={nextPlan}
          period={nextPlan.title === currentPlan.title ? extendOption.value : 12}
          onDismiss={() => setNextPlan(null)}
          isExtend={nextPlan.title === currentPlan.title}
        />
      )}

      <PlanDowngradeModal
        isOpen={isDowngradeModalOpen}
        currentPlan={currentPlan}
        expiredTime={profile?.subscription?.expiredTime}
        onClose={() => {
          setNextPlan(null)
          setIsDowngradeModalOpen(false)
        }}
        onConfirm={() => {
          setIsDowngradeModalOpen(false)
        }}
      />
    </SafeComponentWrapper>
  )
}

export default MySubscriptionPage
