import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'

import ETHPriceInUSD from 'components/ETHPriceInUSD'
import { Box, Type } from 'theme/base'

export default function PlanPrice({ planPrice }: { planPrice: BigNumber | undefined }) {
  return (
    <Type.H3>
      <Box as="span" sx={{ fontSize: '13px', fontWeight: 400 }} color="neutral1">
        <Trans>Only</Trans>
      </Box>{' '}
      <Box as="span" color="orange1">
        <ETHPriceInUSD value={planPrice} />
      </Box>
      <Box as="span" sx={{ fontSize: '24px' }} color="orange1">
        $
      </Box>
      <Box as="span" sx={{ fontSize: '13px', fontWeight: 400 }} color="neutral1">
        {' '}
        / 30days
      </Box>
    </Type.H3>
  )
}
