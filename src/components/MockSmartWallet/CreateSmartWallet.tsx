import { Contract } from '@ethersproject/contracts'
import React from 'react'

import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

const CreateSmartWallet = ({
  factory,
  chainId,
  onCreated,
}: {
  factory: Contract
  chainId: number
  onCreated: () => void
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId,
  })
  const factoryMutation = useContractMutation(factory)

  const createAccount = async () => {
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
    <div>
      {isValid ? (
        <Button
          variant="primary"
          onClick={createAccount}
          isLoading={factoryMutation.isLoading}
          disabled={factoryMutation.isLoading}
        >
          Create Smart Wallet
        </Button>
      ) : (
        alert
      )}
    </div>
  )
}

export default CreateSmartWallet
