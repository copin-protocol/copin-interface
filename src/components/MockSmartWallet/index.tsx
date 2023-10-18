import React, { useState } from 'react'

import { useSmartAccountFactoryContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { OPTIMISM_GOERLI } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

enum StepEnum {
  Idle,
  VerifyChain,
  NewAccount,
}

const MockSmartWallet = () => {
  const [step, setStep] = useState(StepEnum.Idle)
  const factory = useSmartAccountFactoryContract(
    CONTRACT_ADDRESSES[OPTIMISM_GOERLI][CONTRACT_QUERY_KEYS.SMART_ACCOUNT_FACTORY],
    true
  )

  console.log(factory)

  const factoryMutation = useContractMutation(factory)

  const isValid = useRequiredChain({
    enabled: step === StepEnum.VerifyChain,
    onDismiss: () => setStep(StepEnum.Idle),
  })

  const createAccount = async () => {
    if (step === StepEnum.Idle) {
      setStep(StepEnum.VerifyChain)
    }
    if (!isValid) {
      return
    }
    const receipt = await factoryMutation.mutate({
      method: 'newAccount',
      params: ['0xaa346103FD9a4Cd8936a96B0DF9bE603470E34cD'],
    })
    console.log(receipt)
  }

  return (
    <>
      <Button variant="primary" onClick={createAccount}>
        Create Smart Wallet
      </Button>
    </>
  )
}

export default MockSmartWallet
