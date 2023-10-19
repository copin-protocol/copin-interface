import React from 'react'

import useRequiredChain from 'hooks/web3/useRequiredChain'

import SmartWallet from './SmartWallet'

const MockSmartWallet = () => {
  const { isValid, alert } = useRequiredChain()

  return (
    <div>
      {isValid && <SmartWallet />}
      {alert}
    </div>
  )
}

export default MockSmartWallet
