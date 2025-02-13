import { memo } from 'react'

import useChainRestrict from 'hooks/web3/useChainRestrict'

const ChainRestrict = memo(function ChainRestrictMemo() {
  useChainRestrict()
  return null
})

export default ChainRestrict
