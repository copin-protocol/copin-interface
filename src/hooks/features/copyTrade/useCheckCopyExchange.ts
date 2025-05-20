import useGetCopyExchangeStatus from '../systemConfig/useGetCopyExchangeStatus'

export default function useCheckCopyTradeExchange() {
  // TODO: check permission copy trade
  const { listExchangeDisabled } = useGetCopyExchangeStatus()
  return { disabledExchanges: listExchangeDisabled ?? [] }
}
