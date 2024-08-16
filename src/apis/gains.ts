import axios from 'axios'

export interface RewardsData {
  _id: string
  trader: string
  configId: string
  epoch: number
  timestamp: number
  amount: string
  proof: string[]
}

export async function getGainsRebateRewardsApi(account: string, week: number): Promise<RewardsData[]> {
  // requester.defaults.headers.get['Access-Control-Allow-Origin'] = '*'
  return axios
    .get(`https://arb-gain.copin.io/rewards/all/arbitrum-stip-1/${week}/${account.toLowerCase()}`)
    .then((res: any) => res.data)
}
