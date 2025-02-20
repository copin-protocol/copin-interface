import apiRequest from './apiRequest.js'
import { configs } from './configs.js'
import { renderHTML } from './utils.js'

const getBacktestMultiple = async (req, res) => {
  const { id: backtestId, protocol } = req.params

  let numberOfTraders = 0
  try {
    const result = await apiRequest.get(`/share/${backtestId}`)
    numberOfTraders = result?.query.setting.accounts.length ?? 0
  } catch {}

  try {
    renderHTML({
      req,
      res,
      params: {
        title: `Backtesting ${numberOfTraders} traders | Copin Analyzer`,
        thumbnail: `${configs.apiUrl}/storage/image/cover__backtest-cover`,
        url: `${configs.baseUrl}/${protocol}/shared-backtest/multiple/${backtestId}`,
      },
    })
  } catch {
    renderHTML({ req, res })
  }
}

export { getBacktestMultiple }
