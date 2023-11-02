import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

class Num {
  bn: BigNumber
  num: number
  str: string
  decimals: number

  constructor(bn: BigNumber, decimals = 18) {
    this.bn = bn
    this.str = formatUnits(bn, decimals)
    this.num = Number(this.str)
    this.decimals = decimals
  }
}

export default Num
