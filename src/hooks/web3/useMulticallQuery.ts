import { Interface } from '@ethersproject/abi'
import { CallOverrides } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useCallback } from 'react'
import { UseQueryOptions, useQuery } from 'react-query'

import { getMulticallContract } from 'utils/web3/contracts'

import useChain from './useChain'
import useWeb3 from './useWeb3'

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

export interface MulticallOptions extends CallOverrides {
  requireSuccess?: boolean
}

export const useMulticall = async <T = any>(chainId?: number) => {
  const { walletAccount, walletProvider, publicProvider } = useWeb3({ chainId })
  const { chain } = useChain()
  return useCallback(
    async (abi: any[], calls: Call[]): Promise<T> => {
      const multi = getMulticallContract(
        Number(chain.id),
        walletProvider ? walletProvider.getSigner(walletAccount?.address) : publicProvider
      )
      const itf = new Interface(abi)

      const calldata = calls.map((call) => ({
        target: call.address.toLowerCase(),
        callData: itf.encodeFunctionData(call.name, call.params),
      }))
      const { returnData } = await multi.aggregate(calldata)

      const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call))

      return res as any
    },
    [chain, publicProvider, walletAccount, walletProvider]
  )
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const useMulticallv2 = async <T = any>(chainId?: number) => {
  const { walletAccount, walletProvider, publicProvider } = useWeb3({ chainId })
  const { chain } = useChain()
  return useCallback(
    async (abi: any[], calls: Call[], options?: MulticallOptions): Promise<T> => {
      const { requireSuccess = true, ...overrides } = options || {}
      const multi = getMulticallContract(
        Number(chain.id),
        walletProvider ? walletProvider.getSigner(walletAccount?.address) : publicProvider
      )
      const itf = new Interface(abi)

      const calldata = calls.map((call) => ({
        target: call.address.toLowerCase(),
        callData: itf.encodeFunctionData(call.name, call.params),
      }))

      const returnData = await multi.tryAggregate(requireSuccess, calldata, overrides)
      const res = returnData.map((call: any, i: number) => {
        const [result, data] = call
        return result ? itf.decodeFunctionResult(calls[i].name, data) : null
      })

      return res as any
    },
    [chain, publicProvider, walletAccount, walletProvider]
  )
}

export const useCustomMulticall = <T = any>({
  chainId,
  account,
  provider,
}: {
  chainId: number
  account?: string
  provider: JsonRpcProvider
}) => {
  return useCallback(
    async (abi: any[], calls: Call[]): Promise<T> => {
      const multi = getMulticallContract(chainId, account ? provider.getSigner(account) : provider)
      if (account) {
        multi.connect(account)
      }
      const itf = new Interface(abi)

      const calldata = calls.map((call) => ({
        target: call.address.toLowerCase(),
        callData: itf.encodeFunctionData(call.name, call.params),
      }))
      const { returnData } = await multi.aggregate(calldata)

      const res = returnData.map((call: any, i: number) => itf.decodeFunctionResult(calls[i].name, call))
      return res as any
    },
    [account, chainId, provider]
  )
}

export const useCustomMulticallQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  abi: any[],
  calls: { address: string; name: string; params: any[] }[],
  chainId: number,
  provider: JsonRpcProvider,
  account?: string,
  options?: UseQueryOptions<TQueryFnData, TError, TData, any[]>
) => {
  const multicall = useCustomMulticall({ chainId, account, provider })
  const keys = calls.map((call) => `${call.address}.${call.name}(${call.params.join(',')})`)
  return useQuery(['multicall', ...keys, `chainId:${chainId}`, account], async () => (await multicall)(abi, calls), {
    ...options,
  })
}

const useMulticallQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  abi: any[],
  calls: { address: string; name: string; params: any[] }[],
  chainId?: number,
  options?: UseQueryOptions<TQueryFnData, TError, TData, any[]>
) => {
  const multicall = useMulticall(chainId)
  const keys = calls.map((call) => `${call.address}.${call.name}(${call.params.join(',')})`)
  return useQuery(['multicall', ...keys, `chainId:${chainId}`], async () => (await multicall)(abi, calls), {
    ...options,
  })
}

export default useMulticallQuery
