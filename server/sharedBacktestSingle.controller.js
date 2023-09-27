import { configs } from './configs.js'
import { addressShorten, renderHTML } from './utils.js'
import apiRequest from './apiRequest.js'

const getBacktestSingle = async (req, res) => {
  const {id: backtestId, protocol} = req.params

  let backtestTrader = ''
  try {
    const result = await apiRequest.get(`/share/${backtestId}`)
    backtestTrader = result?.query.setting.accounts[0] ?? ''
  } catch {}

  try {
    renderHTML({req, res, params: {
      title: `Backtesting ${addressShorten(backtestTrader)} - Copin Analyzer`,
      description: `Backtesting strategy on Copin`,
      thumbnail: `${configs.baseUrl}/backtest-cover.png`,
      url: `${configs.baseUrl}/${protocol}/shared-backtest/single/${backtestId}`,
    }})
  } catch {
    renderHTML({req, res})
  }
}

export { getBacktestSingle }
