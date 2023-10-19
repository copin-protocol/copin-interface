import React, { useState } from 'react'

import { useAuthContext } from 'hooks/web3/useAuth'
import { useSmartAccountFactoryContract } from 'hooks/web3/useContract'
import useContractQuery from 'hooks/web3/useContractQuery'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Flex } from 'theme/base'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { OPTIMISM_GOERLI } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

import CreateSmartWallet from './CreateSmartWallet'
import DepositFundModal from './DepositFundModal'

const SmartWallet = () => {
  const [depositing, setDepositing] = useState(false)
  const { account } = useAuthContext()
  const factory = useSmartAccountFactoryContract(
    CONTRACT_ADDRESSES[OPTIMISM_GOERLI][CONTRACT_QUERY_KEYS.SMART_ACCOUNT_FACTORY],
    true
  )

  const { data, isLoading, refetch } = useContractQuery<string[]>(factory, 'getAccountsOwnedBy', [account?.address], {
    enabled: !!account?.address,
  })

  return (
    <div>
      {isLoading && <Loading />}
      {!!data && data[0] && (
        <Flex sx={{ gap: 2 }} alignItems="center">
          {data[0]}{' '}
          <Button variant="primary" onClick={() => setDepositing(true)}>
            Deposit Fund
          </Button>
        </Flex>
      )}
      {!!data && !data[0] && <CreateSmartWallet factory={factory} onCreated={() => refetch()} />}
      {depositing && !!account && !!data && !!data[0] && (
        <DepositFundModal
          account={account}
          smartAccount={data[0]}
          isOpen={depositing}
          onDismiss={() => setDepositing(false)}
        />
      )}
    </div>
  )
}

export default SmartWallet
