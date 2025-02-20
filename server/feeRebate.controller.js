import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getFeeRebate = async (req, res) => {
  const thumbnail = `${configs.apiUrl}/storage/image/cover__fee-rebate-cover`

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Earn 10,000 ARB in Fee Rebates with Copin's Decentralized Copy-Trading | Copin Analyzer`,
        description: `Save on trading fees with Copin's Decentralized Copy-Trading (DCP) Fee Rebate Program. Earn a share of 10,000 ARB in rebates by using the DCP feature through gTrade. Join now and start saving while you copy-trade!`,
        thumbnail,
        url: `${configs.baseUrl}/fee-rebate`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getFeeRebate }
