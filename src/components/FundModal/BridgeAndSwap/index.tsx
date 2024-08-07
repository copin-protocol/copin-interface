import { Contract } from '@ethersproject/contracts'
import { formatEther } from '@ethersproject/units'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import ERC20_ABI from 'abis/ERC20.json'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Box } from 'theme/base'
import { OPTIMISM_SEPOLIA } from 'utils/web3/chains'

import EthToWeth from './EthToWeth'
import SethToSusd from './SethToSusd'
import WethToSeth from './WethToSeth'

const BridgeAndSwap = () => {
  const { isValid, alert } = useRequiredChain({
    chainId: OPTIMISM_SEPOLIA,
  })
  const { walletProvider, walletAccount, publicProvider } = useWeb3()
  const signer = useMemo(
    () => walletProvider?.getSigner(walletAccount?.address).connectUnchecked(),
    [walletAccount, walletProvider]
  )

  const sUSDContract = useMemo(
    () => new Contract('0xd7d674d80e79cf3a3b67d6a510ac1b0493df47cf', ERC20_ABI, publicProvider),
    [publicProvider]
  )

  const wETHContract = useMemo(
    () => new Contract('0x4200000000000000000000000000000000000006', ERC20_ABI, publicProvider),
    [publicProvider]
  )

  const sETHContract = useMemo(
    () => new Contract('0x2A080457783adDe06009f1959ca7309Bd40CC772', ERC20_ABI, publicProvider),
    [publicProvider]
  )

  const { data: ethBalance, refetch: refetchEthBalance } = useQuery(
    ['eth_balance'],
    () => (walletProvider && walletAccount ? walletProvider.getBalance(walletAccount.address) : undefined),
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return data ? Number(formatEther(data)) : undefined
      },
    }
  )
  // const { data: ethBalance, refetch: refetchEthBalance } = useQuery(
  //   ['eth_balance'],
  //   () => publicProvider.getBalance(walletAccount?.address || ''),
  //   {
  //     enabled: !!walletAccount?.address,
  //     select(data) {
  //       return Number(formatEther(data))
  //     },
  //   }
  // )

  const { data: sETHBalance, refetch: refetchsETHBalance } = useContractQuery<number>(
    sETHContract,
    'balanceOf',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  const { data: wETHBalance, refetch: refetchwETHBalance } = useContractQuery<number>(
    wETHContract,
    'balanceOf',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  const { data: sUSDBalance, refetch: refetchsUSDBalance } = useContractQuery<number>(
    sUSDContract,
    'balanceOf',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  return (
    <div>
      {isValid && walletProvider && (
        <>
          <EthToWeth
            signer={signer}
            ethBalance={ethBalance}
            wethBalance={wETHBalance}
            refetch={() => {
              refetchEthBalance()
              refetchwETHBalance()
            }}
          />
          {walletAccount?.address && (
            <WethToSeth
              account={walletAccount.address}
              signer={signer}
              wethBalance={wETHBalance}
              sethBalance={sETHBalance}
              refetch={() => {
                refetchwETHBalance()
                refetchsETHBalance()
              }}
            />
          )}
          <SethToSusd
            signer={signer}
            sethBalance={sETHBalance}
            susdBalance={sUSDBalance}
            refetch={() => {
              refetchsETHBalance()
              refetchsUSDBalance()
            }}
          />
        </>
      )}
      {!isValid && <Box my={3}>{alert}</Box>}
    </div>
  )
}

export default BridgeAndSwap
