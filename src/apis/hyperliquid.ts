import axios from 'axios'

import { HYPERLIQUID_BUILDER_CODE } from 'utils/config/constants'

export async function checkUserApproveBuilderFees(user: string) {
  // requester.defaults.headers.get['Access-Control-Allow-Origin'] = '*'
  return axios
    .post(`https://api.hyperliquid.xyz/info`, {
      type: 'maxBuilderFee',
      builder: HYPERLIQUID_BUILDER_CODE,
      user,
    })
    .then((res: any) => res.data)
}
