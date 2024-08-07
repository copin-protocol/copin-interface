import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'

export const calculateAcceptablePrice = (marketPrice: BigNumber, deltaPos: boolean) => {
  const oneBN = parseEther('1')
  const priceImpactDecimalPct = oneBN.div(100)
  return deltaPos
    ? marketPrice.mul(priceImpactDecimalPct.add(oneBN)).div(oneBN)
    : marketPrice.mul(oneBN.sub(priceImpactDecimalPct)).div(oneBN)
}
