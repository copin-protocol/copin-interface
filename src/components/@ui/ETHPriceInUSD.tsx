import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'

import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function ETHPriceInUSD({ value }: { value: BigNumber | number | undefined }) {
  const { prices } = useGetUsdPrices()
  const ethPrice = prices['ETH'] ?? 0

  if (!ethPrice || value == null) return <Box as="span">--</Box>
  let result = '--'
  try {
    if (typeof value === 'number') {
      result = formatNumber(value * ethPrice)
    } else {
      const _value = Number(formatEther(value))
      if (!isNaN(_value)) {
        result = formatNumber(_value * ethPrice)
      }
    }
  } catch {}
  return <Box as="span">{result}</Box>
}
