import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'

import Num from 'entities/Num'
import { Box, Type } from 'theme/base'

export default function PlanPrice({ planPrice }: { planPrice: BigNumber | undefined }) {
  const price = planPrice ? new Num(planPrice) : undefined
  return (
    <Type.H3>
      {price ? (
        <>
          <Box as="span" sx={{ fontSize: '13px', fontWeight: 400 }} color="neutral1">
            <Trans>Only</Trans>
          </Box>{' '}
          <Box as="span" color="orange1">
            {price.str}
          </Box>
          <Box as="span" sx={{ fontSize: '24px', ml: '0.3ch' }} color="orange1">
            ETH
          </Box>
          <Box as="span" sx={{ fontSize: '13px', fontWeight: 400 }} color="neutral1">
            {' '}
            / 30days
          </Box>
        </>
      ) : (
        '--'
      )}
    </Type.H3>
  )
}
