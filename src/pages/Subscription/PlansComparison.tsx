import { CheckCircle, MinusCircle } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'
import styled from 'styled-components/macro'

import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { PLANS } from 'utils/config/subscription'

import { usePlanPermissions } from './usePlanPermissions'

const StyledTable = styled(Box)`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  min-width: 950px;
  overflow: auto;
`

const TableHeader = styled(Grid)`
  position: sticky;
  top: 0;
  width: 100%;
  text-align: left;
  z-index: 1;
`

const CategoryHeader = styled(Type.Large)`
  padding: 16px 0;
  display: block;
  text-align: left;
  background: ${({ theme }) => theme.colors.neutral7};
  color: ${({ theme }) => theme.colors.primary2};
`

const FeatureRow = styled(Grid)`
  &:hover {
    background: ${({ theme }) => theme.colors.neutral7};
  }
`

const PlanCell = styled(Flex)<{ color?: string }>`
  padding: 12px 16px;
  align-items: start;
  justify-content: start;
  text-align: left;
  color: ${({ color }) => color || 'inherit'};
`
const renderValue = (value: ReactNode) => {
  if (typeof value === 'boolean') {
    return value ? (
      <IconBox color="green1" icon={<CheckCircle size={20} />} />
    ) : (
      <IconBox color="neutral3" icon={<MinusCircle size={20} />} />
    )
  }

  return <Type.Body color="neutral1">{value}</Type.Body>
}

const PlansComparison: React.FC = () => {
  const permissions = usePlanPermissions()
  if (!permissions) return null
  const visiblePlans = PLANS.filter((e) => e.title !== SubscriptionPlanEnum.IF)
  return (
    <Box width="100%" overflowX="auto" mt={4}>
      <StyledTable>
        <TableHeader sx={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr' }}>
          <Box py={3}>
            <Type.LargeBold>FEATURES</Type.LargeBold>
          </Box>
          {visiblePlans.map((plan) => (
            <Type.LargeBold key={plan.title} color={plan.color} sx={{ p: 3 }}>
              {plan.title} PLAN
            </Type.LargeBold>
          ))}
        </TableHeader>

        {permissions.map((category) => (
          <Box key={category.category}>
            <CategoryHeader>{category.category}</CategoryHeader>
            <Box sx={{ '& > div:not(:last-child)': { borderBottom: 'small', borderColor: 'neutral5' } }}>
              {category.features.map((feature: any) => (
                <FeatureRow key={feature.name} display="grid" sx={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr' }}>
                  <Type.Body sx={{ py: 3, textAlign: 'left' }}>{feature.name}</Type.Body>
                  {visiblePlans.map((plan) => (
                    <PlanCell key={plan.title} color={plan.color}>
                      {renderValue(feature[plan.title])}
                    </PlanCell>
                  ))}
                </FeatureRow>
              ))}
            </Box>
          </Box>
        ))}
      </StyledTable>
    </Box>
  )
}

export default PlansComparison
