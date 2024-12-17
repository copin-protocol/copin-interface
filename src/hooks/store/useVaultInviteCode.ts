import { useMemo } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { generateVaultInviteCode } from 'utils/helpers/transform'

type VaultInviteCode = Record<string, string>

interface VaultInviteCodeState {
  vaultInviteCode: VaultInviteCode
  setVaultInviteCode: (data: VaultInviteCode) => void
}

const useVaultInviteCodeStore = create<VaultInviteCodeState>()(
  persist(
    immer((set) => ({
      vaultInviteCode: {},
      setVaultInviteCode: (data) =>
        set((state) => {
          state.vaultInviteCode = data
        }),
    })),
    {
      name: 'vaultInviteCode',
      getStorage: () => localStorage,
    }
  )
)

const useVaultInviteCode = () => {
  const { vaultInviteCode, setVaultInviteCode } = useVaultInviteCodeStore()

  const currentInviteCode = useMemo(() => generateVaultInviteCode(), [])

  const saveVaultInviteCode = (address: string) => {
    if (!vaultInviteCode[address]) {
      setVaultInviteCode({
        ...vaultInviteCode,
        [address]: currentInviteCode,
      })
    }
  }

  return {
    currentInviteCode,
    vaultInviteCode,
    saveVaultInviteCode,
  }
}

export default useVaultInviteCode
