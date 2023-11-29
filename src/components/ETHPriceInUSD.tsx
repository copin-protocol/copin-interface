import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'

import { useProtocolStore } from 'hooks/store/useProtocols'
import { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { Box } from 'theme/base'
import { TOKEN_ADDRESSES } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

export default function ETHPriceInUSD({ value }: { value: BigNumber | number | undefined }) {
  const { prices } = useRealtimeUsdPricesStore()
  const { protocol } = useProtocolStore()
  const ethIndex = TOKEN_ADDRESSES[protocol].ETH
  const ethPrice = prices[ethIndex]

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
