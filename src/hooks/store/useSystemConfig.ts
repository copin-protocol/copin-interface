import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { SystemConfigData } from 'entities/systemConfig.d'

interface SystemConfigState {
  systemConfig: SystemConfigData | null
  setSystemConfig: (systemConfigs: SystemConfigData) => void
}

const useSystemConfigStore = create<SystemConfigState>()(
  immer((set) => ({
    systemConfig: null,
    setSystemConfig: (data: SystemConfigData) => set({ systemConfig: data }),
  }))
)

export default useSystemConfigStore
