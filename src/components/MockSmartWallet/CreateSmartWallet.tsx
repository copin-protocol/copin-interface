import { Contract } from '@ethersproject/contracts'
import React, { useState } from 'react'

import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

enum StepEnum {
  Idle,
  VerifyChain,
  NewAccount,
}

const CreateSmartWallet = ({ factory, onCreated }: { factory: Contract; onCreated: () => void }) => {
  const [step, setStep] = useState(StepEnum.Idle)
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
    await factoryMutation.mutate(
      {
        method: 'newAccount',
        params: [CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_QUERY_KEYS.DELEGATE]],
      },
      {
        onSuccess: () => onCreated(),
      }
    )
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={createAccount}
        isLoading={factoryMutation.isLoading}
        disabled={factoryMutation.isLoading}
      >
        Create Smart Wallet
      </Button>
    </>
  )
}

export default CreateSmartWallet
