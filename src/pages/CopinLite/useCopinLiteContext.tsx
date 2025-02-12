import { createContext, useContext, useMemo } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi } from 'apis/copyTradeApis'
import { CopyTradeData } from 'entities/copyTrade'
import useCopyTraderAddresses from 'hooks/features/copyTrade/useCopyTraderAddresses'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { QUERY_KEYS } from 'utils/config/keys'

interface ContextValues {
  copyTrades: CopyTradeData[] | undefined
  isLoadingCopyTrades: boolean
  traderAddresses: string[]
  allTrader: string[] // include deleted trader address, but stopped == deleted, only use for display, not logic
  activeTraderAddresses: string[]
  deletedTraderAddresses: string[]
}

export const LiteContext = createContext({} as ContextValues)

export function LiteContextProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { embeddedWallet } = useCopyWalletContext()
  const queryCopyTradeParams = useMemo(
    () => ({
      copyWalletId: embeddedWallet?.id,
      accounts: undefined,
      status: undefined,
    }),
    [embeddedWallet]
  )
  const { data: copyTrades, isFetching: isLoadingCopyTrades } = useQuery(
    [QUERY_KEYS.GET_EMBEDDED_COPY_TRADES, queryCopyTradeParams],

    () => getCopyTradeSettingsListApi(queryCopyTradeParams),
    {
      enabled: !!embeddedWallet?.id,
      retry: 0,
      keepPreviousData: true,
    }
  )
  const { activeTraderAddresses, deletedTraderAddresses } = useCopyTraderAddresses({
    copyWalletIds: [embeddedWallet?.id ?? ''],
    enabled: !!embeddedWallet?.id,
  })

  const contextValue: ContextValues = useMemo(() => {
    const traderAddresses: (string | string[])[] = []
    copyTrades?.forEach((copyTrade) => {
      traderAddresses.push(copyTrade.account ?? '')
      traderAddresses.push(copyTrade.accounts ?? [])
    })
    return {
      traderAddresses: Array.from(new Set(traderAddresses.flat().filter((v) => !!v))),
      copyTrades,
      isLoadingCopyTrades,
      allTrader: [...activeTraderAddresses, ...deletedTraderAddresses],
      activeTraderAddresses,
      deletedTraderAddresses,
    }
  }, [activeTraderAddresses, copyTrades, deletedTraderAddresses, isLoadingCopyTrades])

  return <LiteContext.Provider value={contextValue}>{children}</LiteContext.Provider>
}

export const useLiteContext = () => {
  const context = useContext(LiteContext)
  if (!Object.keys(context)?.length) throw new Error('useLiteContext needed to be used inside LiteContextProvider')
  return context
}
