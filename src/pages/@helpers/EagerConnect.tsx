import { memo } from 'react'

import useEagerConnect from 'hooks/web3/useEagerConnect'

const EagerConnect = memo(function EagerConnectMemo() {
  useEagerConnect()
  return null
})

export default EagerConnect
