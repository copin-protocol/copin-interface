import React from 'react'
import styled from 'styled-components/macro'

import { Button } from 'theme/Buttons'
import { Box, Flex, Grid, Image, Type } from 'theme/base'
import { linearGradient1 } from 'theme/colors'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { PlanConfig } from 'utils/config/subscription'
import { formatNumber } from 'utils/helpers/format'

const PlanCardWrapper = styled(Box)<{ isActive?: boolean; borderColor?: string; gradientBorder?: boolean }>`
  position: relative;
  border-radius: 8px;
  padding: 1px; /* Space for gradient border */
  background: ${({ gradientBorder, borderColor, theme }) =>
    gradientBorder ? linearGradient1 : borderColor ? borderColor : theme.colors.neutral4};
  transition: all 0.2s ease-in-out;

  ${({ isActive }) =>
    isActive &&
    `
    box-shadow: 0px 0px 20px rgba(78, 174, 253, 0.2);
  `}

  &:hover {
    transform: translateY(-4px);
  }
`

const PlanCardContent = styled(Box)`
  border-radius: 7px; /* 1px less than wrapper for gradient border */
  background: ${({ theme }) => theme.colors.neutral7};
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const PricingPlan: React.FC<PlanConfig & { yearly: boolean; hasShowUpgrade: boolean; isHighlight: boolean }> = ({
  title,
  price,
  yearlyDiscountPercent,
  features,
  color,
  isActive,
  onUpgrade,
  yearly,
  hasShowUpgrade,
  isHighlight,
}) => {
  const yearlyPrice = Math.floor(price * 12 * (1 - yearlyDiscountPercent / 100))
  return (
    <PlanCardWrapper isActive={isActive} gradientBorder={isHighlight}>
      <PlanCardContent>
        <Flex sx={{ gap: 2, alignItems: 'center' }}>
          <Image height={24} src={`/images/subscriptions/${title}.png`} alt={`${title} plan`} />
          <Type.LargeBold color={color}>{title} PLAN</Type.LargeBold>
        </Flex>

        <Flex flexDirection="column" justifyContent="start" textAlign="left" width="fit-content" minHeight={120} pt={3}>
          <Flex sx={{ gap: 1, alignItems: 'center' }}>
            <Type.H2 color={color}>
              {price === 0 ? 'FREE' : `$${formatNumber(yearly ? yearlyPrice / 12 : price, 2)}`}
            </Type.H2>
            {price !== 0 && <Type.Body>/month</Type.Body>}
          </Flex>

          {yearlyDiscountPercent > 0 && yearly && (
            <Flex sx={{ gap: 1, alignItems: 'center', mt: 2 }}>
              <Type.Body sx={{ textDecoration: 'line-through' }} color="neutral3">
                ${formatNumber(price * 12, 2)}/year
              </Type.Body>
              <Type.BodyBold color={color}>${formatNumber(yearlyPrice, 2)}/year</Type.BodyBold>
            </Flex>
          )}
        </Flex>
        {isActive && (
          <Button variant="secondary" block sx={{ cursor: 'default' }}>
            <Type.BodyBold color="neutral1">CURRENT PLAN</Type.BodyBold>
          </Button>
        )}

        {price > 0 && hasShowUpgrade && !isActive && (
          <Button variant="primary" block onClick={onUpgrade}>
            <Type.BodyBold>UPGRADE</Type.BodyBold>
          </Button>
        )}

        {features.map((feature, index) => (
          <Type.Body textAlign="left" color="neutral2" key={index} sx={{ mt: 12 }}>
            {feature}
          </Type.Body>
        ))}
      </PlanCardContent>
    </PlanCardWrapper>
  )
}

const PricingCards: React.FC<{
  yearly: boolean
  plans: PlanConfig[]
  highlightPlan?: SubscriptionPlanEnum
  currentPlan?: SubscriptionPlanEnum
  onUpgrade?: (plan: PlanConfig) => void
}> = ({
  yearly,
  plans,
  highlightPlan = SubscriptionPlanEnum.PRO,
  currentPlan = SubscriptionPlanEnum.FREE,
  onUpgrade,
}) => {
  const planInfo = plans.find((plan) => plan.title === currentPlan)
  return (
    <Grid
      sx={{
        gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)'],
        gap: [24, 24],
        width: '100%',
      }}
    >
      {plans.map((plan) => (
        <PricingPlan
          key={plan.title}
          isHighlight={highlightPlan === plan.title}
          {...plan}
          yearly={yearly}
          isActive={currentPlan === plan.title}
          hasShowUpgrade={!planInfo?.id || planInfo.id < plan.id}
          onUpgrade={() => onUpgrade?.(plan)}
        />
      ))}
    </Grid>
  )
}

export default PricingCards
