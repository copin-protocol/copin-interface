import useGetCopyExchangeStatus from '../systemConfig/useGetCopyExchangeStatus'

export default function useCheckCopyTradeExchange() {
  const { listExchangeDisabled } = useGetCopyExchangeStatus()
  return { disabledExchanges: listExchangeDisabled ?? [] }
}
