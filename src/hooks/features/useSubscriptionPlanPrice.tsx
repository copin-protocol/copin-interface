import { BigNumber } from '@ethersproject/bignumber'

import useContractQuery from 'hooks/web3/useContractQuery'
import { SubscriptionPlanEnum } from 'utils/config/enums'

import useSubscriptionContract from './useSubscriptionContract'

export default function useSubscriptionPlanPrice() {
  const subscriptionContract = useSubscriptionContract()
  const { data: premiumData } = useContractQuery(subscriptionContract, 'tiers', [SubscriptionPlanEnum.PREMIUM], {
    select(data: [string, BigNumber, BigNumber]) {
      return { name: data[0], price: data[1], quantity: data[2].toNumber() }
    },
  })
  const { data: vipData } = useContractQuery(subscriptionContract, 'tiers', [SubscriptionPlanEnum.VIP], {
    select(data: [string, BigNumber, BigNumber]) {
      return { name: data[0], price: data[1], quantity: data[2].toNumber() }
    },
  })

  return { [SubscriptionPlanEnum.PREMIUM]: premiumData, [SubscriptionPlanEnum.VIP]: vipData } as Record<
    SubscriptionPlanEnum,
    | {
        name: string
        price: BigNumber
        quantity: number
      }
    | undefined
  >
}
