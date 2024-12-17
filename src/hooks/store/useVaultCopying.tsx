import { memo, useEffect } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import useEnabledQueryByPaths from 'hooks/helpers/useEnabledQueryByPaths'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

import useVaultCopyTrades from '../features/useVaultCopyTrades'

type VaultCopying = Record<string, Record<string, string[]>>

interface VaultCopyingState {
  isLoading: boolean
  submitting: boolean
  vaultCopying: VaultCopying
  setLoading: (bool: boolean) => void
  setSubmitting: (bool: boolean) => void
  setVaultCopying: (data: VaultCopying) => void
}

const useVaultCopyingStore = create<VaultCopyingState>()(
  immer((set) => ({
    vaultCopying: {},
    isLoading: false,
    submitting: false,
    setLoading: (bool: boolean) => set({ isLoading: bool }),
    setSubmitting: (bool: boolean) => set({ submitting: bool }),
    setVaultCopying: (data: VaultCopying) => set({ vaultCopying: data }),
  }))
)

const EXCLUDING_PATH = [
  ROUTES.STATS.path,
  ROUTES.SUBSCRIPTION.path,
  ROUTES.WALLET_MANAGEMENT.path,
  ROUTES.USER_SUBSCRIPTION.path,
  ROUTES.REFERRAL.path,
  ROUTES.COMPARING_TRADERS.path,
]
const useInitVaultCopying = () => {
  const enabledQueryByPaths = useEnabledQueryByPaths(EXCLUDING_PATH)
  const { setVaultCopying, setLoading } = useVaultCopyingStore()
  const { allVaultCopyTrades } = useVaultCopyTrades({ enabled: enabledQueryByPaths })

  useEffect(() => {
    const copyingVault: VaultCopying | undefined = allVaultCopyTrades?.reduce((result, copyTrade) => {
      if (copyTrade.status === CopyTradeStatusEnum.RUNNING) {
        const accounts = (copyTrade.multipleCopy ? copyTrade.accounts ?? [] : [copyTrade.account]).filter((e) => !!e)
        accounts.forEach((account) => {
          if (!result[account]) {
            result[account] = {}
          }
          if (!result[account][copyTrade.protocol]) {
            result[account][copyTrade.protocol] = []
          }
          result[account][copyTrade.protocol] = Array.from(
            new Set([...result[account][copyTrade.protocol], copyTrade.copyWalletId])
          )
        })
      }
      return result
    }, {} as VaultCopying)
    if (!copyingVault) return
    setVaultCopying(copyingVault)
    setLoading(true)
  }, [allVaultCopyTrades])
}

export const InitVaultCopying = memo(function InitVaultCopyingMemo() {
  useInitVaultCopying()
  return null
})

const useVaultCopying = (account: string | undefined, protocol: ProtocolEnum | undefined) => {
  const { isLoading, vaultCopying, setVaultCopying } = useVaultCopyingStore()
  const isVaultCopying = account && protocol ? !!vaultCopying[account]?.[protocol]?.length : false

  const saveVaultCopying = (address: string, protocol: ProtocolEnum, copyWalletId: string) => {
    if (!vaultCopying[address]?.[protocol]?.length) {
      setVaultCopying({
        ...vaultCopying,
        [address]: {
          ...vaultCopying[address],
          [protocol]: Array.from(new Set([...(vaultCopying[address]?.[protocol] ?? []), copyWalletId])),
        },
      })
    }
  }
  const removeVaultCopying = (address: string, protocol: ProtocolEnum, copyWalletId: string) => {
    if (!!vaultCopying[address]?.[protocol]?.length) {
      const updatedProtocols = vaultCopying[address]?.[protocol]?.filter((id) => id !== copyWalletId) ?? []
      if (updatedProtocols.length === 0) {
        const { [protocol]: _, ...restProtocols } = vaultCopying[address] || {}
        setVaultCopying({
          ...vaultCopying,
          [address]: restProtocols,
        })
      } else {
        setVaultCopying({
          ...vaultCopying,
          [address]: {
            ...vaultCopying[address],
            [protocol]: updatedProtocols,
          },
        })
      }
    }
  }
  return {
    isVaultCopying,
    vaultCopying,
    isLoading,
    saveVaultCopying,
    removeVaultCopying,
  }
}

export default useVaultCopying
