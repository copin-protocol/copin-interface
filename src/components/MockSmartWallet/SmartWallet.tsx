import { Contract } from '@ethersproject/contracts'
import React, { useMemo, useState } from 'react'

import useChain from 'hooks/web3/useChain'
import useContractQuery from 'hooks/web3/useContractQuery'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Flex } from 'theme/base'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { DEFAULT_CHAIN_ID, OPTIMISM_GOERLI } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { rpcProvider } from 'utils/web3/providers'

import FundModal from './FundModal'

const SmartWallet = () => {
  const [depositing, setDepositing] = useState(false)
  const { walletAccount, walletProvider } = useWeb3()
  const { chain } = useChain()
  const defaultChainProvider = useMemo(() => rpcProvider(DEFAULT_CHAIN_ID), [])

  const chainId = Number(chain.id)

  const factory = useMemo(
    () =>
      new Contract(
        CONTRACT_ADDRESSES[OPTIMISM_GOERLI][CONTRACT_QUERY_KEYS.SMART_ACCOUNT_FACTORY],
        CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_ACCOUNT_FACTORY],
        Number(chain.id) === DEFAULT_CHAIN_ID && walletProvider ? walletProvider : defaultChainProvider
      ),
    [chain.id, walletProvider, defaultChainProvider]
  )
  const { data, isLoading, refetch } = useContractQuery<string[]>(
    factory,
    'getAccountsOwnedBy',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
    }
  )

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
      {/* {!!data && !data[0] && <CreateSmartWallet chainId={chainId} factory={factory} onCreated={() => refetch()} />} */}
      {depositing && !!walletAccount && !!data && !!data[0] && (
        <FundModal
          account={walletAccount}
          smartAccount={data[0]}
          chainId={chainId}
          defaultChainProvider={defaultChainProvider}
          isOpen={depositing}
          onDismiss={() => setDepositing(false)}
        />
      )}
    </div>
  )
}

export default SmartWallet
