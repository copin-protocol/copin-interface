import { BigNumber } from '@ethersproject/bignumber'

import useContractQuery from 'hooks/web3/useContractQuery'
import { SubscriptionPlanEnum } from 'utils/config/enums'

import useSubscriptionContract from './useSubscriptionContract'

export default function useSubscriptionPlanPrice() {
  const subscriptionContract = useSubscriptionContract()
  const { data } = useContractQuery(subscriptionContract, 'tiers', [SubscriptionPlanEnum.PREMIUM], {
    select(data: [string, BigNumber, BigNumber]) {
      return { name: data[0], price: data[1], quantity: data[2].toNumber() }
    },
  })
  return data
}
