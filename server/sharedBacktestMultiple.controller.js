import { configs } from './configs.js'
import { renderHTML } from './utils.js'
import apiRequest from './apiRequest.js'

const getBacktestMultiple = async (req, res) => {
  const {id: backtestId, protocol} = req.params

  let numberOfTraders = 0
  try {
    const result = await apiRequest.get(`/share/${backtestId}`)
    numberOfTraders = result?.query.setting.accounts.length ?? 0
  } catch {}

  try {
    renderHTML({req, res, params: {
      title: `Backtesting ${numberOfTraders} traders - Copin Analyzer`,
      description: `Backtesting strategy on Copin`,
      thumbnail: `${configs.baseUrl}/backtest-cover.png`,
      url: `${configs.baseUrl}/${protocol}/shared-backtest/multiple/${backtestId}`,
    }})
  } catch {
    renderHTML({req, res})
  }
}

export { getBacktestMultiple }
