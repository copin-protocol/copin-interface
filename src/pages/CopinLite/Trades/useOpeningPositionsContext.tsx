import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { ApiListResponse } from 'apis/api'
import { getHlAccountInfo } from 'apis/hyperliquid'
import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import {
  convertPairHL,
  getHLCopyPositionIdentifyKey,
  parseHLCopyPositionData,
} from 'components/@position/helpers/hyperliquid'
import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSelectMultipleFactory from 'hooks/helpers/useSelectMultipleFactory'
import { useAuthContext } from 'hooks/web3/useAuth'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS } from 'utils/config/keys'

import { useLiteContext } from '../useCopinLiteContext'

export interface LiteOpeningPositionsContextValues {
  selectedTraders: string[] | null
  isSelectedAllTrader: boolean
  handleToggleTrader: (trader: string) => void
  handleToggleAllTrader: (isSelectedAll: boolean) => void
  openingPositions: ApiListResponse<CopyPositionData> | undefined
  isLoadingOpeningPositions: boolean
  refetchOpeningPositions: () => void
  reloadStuckPositions: () => void
  stuckPositions: CopyPositionData[] | undefined
}

export const Context = createContext({} as LiteOpeningPositionsContextValues)

export function LiteOpeningPositionProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { isAuthenticated } = useAuthContext()
  const { traderAddresses } = useLiteContext()
  const { embeddedWallet } = useCopyWalletContext()
  const [stuckPositions, setStuckPositions] = useState<CopyPositionData[] | undefined>()

  const {
    selectedSelections: selectedTraders,
    isSelectedAllSelection: isSelectedAllTrader,
    handleToggleSelection: handleToggleTrader,
    handleToggleAllSelection: handleToggleAllTrader,
  } = useSelectMultipleFactory({
    storageKey: STORAGE_KEYS.LITE_OPENING_POSITION_TRADERS,
    listSelection: traderAddresses,
  })
  const _queryParams: GetMyPositionsParams = {
    limit: 500,
    offset: 0,
    identifyKey: undefined,
    status: [PositionStatusEnum.OPEN],
    copyWalletId: embeddedWallet?.id,
  }
  const _queryBody: GetMyPositionRequestBody = {
    copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
    traders: !!selectedTraders ? selectedTraders : undefined,
  }

  const {
    data: openingPositions,
    isLoading: isLoadingOpeningPositions,
    refetch: refetchOpeningPositions,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      enabled: !!embeddedWallet?.id && !!isAuthenticated,
      retry: 0,
      keepPreviousData: true,
      refetchInterval: 5000,
    }
  )

  const [forceRefetchHLPositions, setForceRefetchHLPositions] = useState(1)
  const reloadStuckPositions = useCallback(() => setForceRefetchHLPositions((prev) => prev + 1), [])
  const { getSymbolByIndexToken } = useMarketsConfig()
  useEffect(() => {
    if (isLoadingOpeningPositions || openingPositions == null) return
    ;(async () => {
      try {
        const embeddedAccountInfo = await getHlAccountInfo({ user: embeddedWallet?.hyperliquid?.embeddedWallet || '' })
        const hlCopyPositions = parseHLCopyPositionData({ data: embeddedAccountInfo?.assetPositions })
        const _stuckPositions = hlCopyPositions.filter((hlPosition) => {
          if (openingPositions?.data?.length) {
            const hlPositionKey = getHLCopyPositionIdentifyKey(hlPosition)
            return !!openingPositions?.data?.every((copyPosition) => {
              const symbol = getSymbolByIndexToken?.({
                indexToken: copyPosition.indexToken,
                protocol: copyPosition.protocol,
              })
              const pair = copyPosition.pair ? copyPosition.pair : symbol ? convertPairHL(symbol) : undefined
              if (!pair) {
                const result: CopyPositionData = { ...copyPosition, openingPositionType: 'liveBoth' }
                return result
              }
              const copyPositionKey = getHLCopyPositionIdentifyKey({ ...copyPosition, pair })
              return hlPositionKey !== copyPositionKey
            })
          }
          return true
        })
        setStuckPositions(!!_stuckPositions?.length ? _stuckPositions : undefined)
      } catch {}
    })()
  }, [openingPositions, forceRefetchHLPositions, isLoadingOpeningPositions])

  const contextValue: LiteOpeningPositionsContextValues = useMemo(() => {
    return {
      stuckPositions,
      selectedTraders,
      isSelectedAllTrader,
      handleToggleTrader,
      handleToggleAllTrader,
      openingPositions,
      isLoadingOpeningPositions,
      refetchOpeningPositions,
      reloadStuckPositions,
    }
  }, [
    stuckPositions,
    openingPositions,
    isLoadingOpeningPositions,
    refetchOpeningPositions,
    handleToggleAllTrader,
    handleToggleTrader,
    isSelectedAllTrader,
    selectedTraders,
  ])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export const useLiteOpeningPositionsContext = () => {
  const context = useContext(Context)
  if (!Object.keys(context)?.length)
    throw new Error('useLiteOpeningPositionsContext needed to be used inside LiteOpeningPositionProvider')
  return context
}
