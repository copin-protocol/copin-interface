import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'

interface Store {
  config: SubscriptionFeatureEnum | null | undefined
  requiredPlan: SubscriptionPlanEnum | null | undefined
  target: any | null | undefined
  setConfig: (
    config: SubscriptionFeatureEnum | null | undefined,
    requiredPlan?: SubscriptionPlanEnum,
    target?: any
  ) => void
}

const useBenefitModalStore = create<Store>()(
  immer((set) => ({
    config: null,
    requiredPlan: null,
    target: null,
    setConfig: (config, requiredPlan, target) =>
      set((state) => {
        state.config = config
        state.requiredPlan = requiredPlan
        state.target = target
      }),
  }))
)
export default useBenefitModalStore
