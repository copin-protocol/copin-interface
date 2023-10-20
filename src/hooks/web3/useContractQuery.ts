import { Contract } from '@ethersproject/contracts'
import { UseQueryOptions, useQuery } from 'react-query'

const useContractQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  contract: Contract,
  method: string,
  params: any[],
  options?: UseQueryOptions<TQueryFnData, TError, TData, any[]>
) => {
  return useQuery([contract.address, method, ...params], async () => contract[method](...params), {
    ...options,
  })
}

export default useContractQuery
