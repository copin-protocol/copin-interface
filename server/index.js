import dotenv from 'dotenv'
import express from 'express'
import { resolve } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

import { getCopierRanking } from './copierRanking.controller.js'
import { getEventDetails } from './eventDetails.controller.js'
import { getEvents } from './events.controller.js'
import { getFeeRebate } from './feeRebate.controller.js'
import { getLeaderboard } from './leaderboard.controller.js'
import { getLiveTrades } from './liveTrades.controller.js'
import { getOpenInterestMarket } from './oiMarket.controller.js'
import { getOpenInterestPositions } from './oiPositions.controller.js'
import { getPerpDexsExplorer } from './perpDexsExplorer.controller.js'
import { getPositionDetails } from './positionDetail.controller.js'
import { getReferralProgram } from './referralProgram.controller.js'
import { getBacktestMultiple } from './sharedBacktestMultiple.controller.js'
import { getBacktestSingle } from './sharedBacktestSingle.controller.js'
import { getSharedPositionDetails } from './sharedPositionDetail.controller.js'
import { getStats } from './stats.controller.js'
import { getSubscription } from './subscription.controller.js'
import { getTopOpenings } from './topOpening.controller.js'
import { getTraderDetail } from './traderDetail.controller.js'
import { renderHTML } from './utils.js'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  renderHTML(req, res)
})
app.use(express.static(resolve(__dirname, '..', 'build'), { maxAge: '30d' }))

app.get('/fee-rebate', getFeeRebate)
app.get('/events', getEvents)
app.get('/event/:id', getEventDetails)
app.get('/:protocol/shared-backtest/single/:id', getBacktestSingle)
app.get('/:protocol/shared-backtest/multiple/:id', getBacktestMultiple)
app.get('/:protocol/trader/:address', getTraderDetail)
app.get('/trader/:address/:protocol', getTraderDetail)
app.get('/:protocol/position/share/:sharedId', getSharedPositionDetails)
app.get('/:protocol/position/:id', getPositionDetails)
app.get('/open-interest/positions', getOpenInterestPositions)
app.get('/open-interest/market', getOpenInterestMarket)
app.get('/:protocol/top-openings', getTopOpenings)
app.get('/subscription', getSubscription)
app.get('/stats', getStats)
app.get('/referral', getReferralProgram)
app.get('/live-trades*', getLiveTrades)
app.get('/:protocol/trader-board', getLeaderboard)
app.get('/copier-ranking', getCopierRanking)
app.get('/perp-explorer*', getPerpDexsExplorer)

app.get('*', (req, res) => {
  renderHTML(req, res)
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log('Error during app startup', error)
  }
  console.log('listening on ' + PORT + '...')
})
