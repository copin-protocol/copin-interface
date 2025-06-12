import { Trans } from '@lingui/macro'
import { CheckCircle } from '@phosphor-icons/react'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { PlanConfig } from 'utils/config/subscription'
import { formatNumber } from 'utils/helpers/format'

const PeriodSelector = ({
  plan,
  isActive,
  period,
  onChange,
}: {
  plan: PlanConfig
  isActive: boolean
  period: number
  onChange: (period: number) => void
}) => {
  return (
    <Box
      flex="1"
      role="button"
      onClick={() => onChange(period)}
      variant="card"
      sx={{ border: 'small', borderColor: isActive ? 'primary1' : 'neutral4', borderRadius: 'xs', p: 2 }}
    >
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Type.Caption color="neutral3">
          <Trans>Pay</Trans> {period === 12 ? <Trans>Yearly</Trans> : <Trans>Monthly</Trans>}
        </Type.Caption>
        {isActive && <IconBox icon={<CheckCircle size={18} />} color="green1" />}
      </Flex>
      <Box mt={1}>
        <Type.CaptionBold>
          $
          {formatNumber(
            (plan.price * period * (1 - (plan.discountByPeriod?.[period] || 0) / 100)) / (period === 12 ? 1 : period)
          )}
          /{period === 12 ? <Trans>year</Trans> : <Trans>month</Trans>}
        </Type.CaptionBold>
        {!!plan.discountByPeriod?.[period] && plan.discountByPeriod[period] > 0 && (
          <Type.SmallBold
            sx={{
              bg: isActive ? 'green1' : 'neutral3',
              px: 2,
              borderRadius: '8px',
              ml: 2,
            }}
            color="neutral8"
          >
            <Trans>Save {plan.discountByPeriod[period]}%</Trans>
          </Type.SmallBold>
        )}
      </Box>
    </Box>
  )
}

export default PeriodSelector
