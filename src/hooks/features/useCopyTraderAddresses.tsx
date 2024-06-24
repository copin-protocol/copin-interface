import { useMemo } from 'react'

import useGetAllCopyTrades from './useGetAllCopyTrades'

export default function useCopyTraderAddresses(params?: { copyWalletIds: string[] | undefined }) {
  const { copiedTraders } = useGetAllCopyTrades({ copyWalletIds: params?.copyWalletIds })
  const listTraderAddresses = useMemo(
    () => [...(copiedTraders?.copyingTraders ?? []), ...(copiedTraders?.deletedTraders ?? [])],
    [copiedTraders]
  )
  const deletedTraderAddresses = useMemo(() => [...(copiedTraders?.deletedTraders ?? [])], [copiedTraders])
  const activeTraderAddresses = useMemo(() => [...(copiedTraders?.copyingTraders ?? [])], [copiedTraders])

  return { listTraderAddresses, activeTraderAddresses, deletedTraderAddresses }
}
