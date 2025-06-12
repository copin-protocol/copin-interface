import { Trans } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/macro'

import useUserUsage from 'hooks/features/subscription/useUserUsage'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Box, Flex, Type } from 'theme/base'
import { PLANS } from 'utils/config/subscription'
import { formatNumber } from 'utils/helpers/format'

import usePlanQuotas from './usePlanQuotas'

const Table = styled(Box)`
  width: 100%;
  min-width: fit-content;
  border-collapse: collapse;
  margin-top: 8px;
  font-variant-numeric: tabular-nums;
`

const Row = styled(Flex)`
  &:not(:last-child):not(:first-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral5};
  }
  padding: 12px 0;
  align-items: center;
`

const HeaderCell = styled(Type.CaptionBold)<{ width?: string; textAlign?: 'left' | 'right' }>`
  width: ${({ width }) => width || '100px'};
  text-align: ${({ textAlign }) => textAlign || 'right'};
`

const Cell = styled(Type.Caption)<{
  color?: string
  width?: string
  isHigher?: boolean
  isEqual?: boolean
  textAlign?: 'left' | 'right'
}>`
  text-align: ${({ textAlign }) => textAlign || 'right'};
  width: ${({ width }) => width || '100px'};
  color: ${({ theme, isHigher, isEqual, color }) =>
    color ? color : isHigher ? theme.colors.red2 : isEqual ? theme.colors.orange1 : color || theme.colors.neutral1};
`

const UsageTable = () => {
  const planQuotas = usePlanQuotas()
  const { usage } = useUserUsage()
  const { profile } = useAuthContext()
  const currentPlan = PLANS.find((p) => p.title === profile?.subscription?.plan)
  const higherPlans = currentPlan ? PLANS.filter((p) => p.id >= currentPlan?.id) : []
  return currentPlan ? (
    <Table>
      <Row>
        <HeaderCell width={higherPlans.length > 2 ? '150px' : '200px'} textAlign="left">
          <Trans>FEATURE</Trans>
        </HeaderCell>
        <HeaderCell flex={1}>
          <Trans>USED</Trans>
        </HeaderCell>
        <HeaderCell flex={1}>
          <Trans>CURRENT PLAN</Trans>
        </HeaderCell>
        {higherPlans.slice(1).map((p) => (
          <HeaderCell key={p.title} flex={1} color="neutral3">
            {p.title} PLAN
          </HeaderCell>
        ))}
      </Row>

      {planQuotas.map((row) => {
        const quotaValue = Number(row[currentPlan.title as keyof typeof row])
        const usageValue = usage?.[row.usageKey as keyof typeof usage]
        const remainingKeys = ['csvDownloads', 'monthlyAlerts']

        return (
          <Row key={row.name}>
            <Cell width={higherPlans.length > 2 ? '150px' : '200px'} textAlign="left">
              {row.name}
            </Cell>
            <Cell
              flex={1}
              isHigher={
                !!usageValue && quotaValue != null && !remainingKeys.includes(row.usageKey) && usageValue > quotaValue
              }
              isEqual={
                !!usageValue && quotaValue != null && !remainingKeys.includes(row.usageKey) && usageValue === quotaValue
              }
            >
              {usageValue != null ? formatNumber(usageValue) : '--'}
              {remainingKeys.includes(row.usageKey) && (
                <>
                  {' '}
                  <Trans>remaining</Trans>
                </>
              )}
            </Cell>
            {higherPlans.map((p, i) => (
              <Cell color={i !== 0 ? 'neutral3' : undefined} key={p.title} flex={1}>
                {formatNumber(Number(row[p.title as keyof typeof row]))}
              </Cell>
            ))}
          </Row>
        )
      })}
    </Table>
  ) : (
    <div></div>
  )
}

export default UsageTable
