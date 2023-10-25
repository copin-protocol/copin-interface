import dotenv from 'dotenv'
import express from 'express'
import { resolve } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPositionDetails } from './positionDetail.controller.js'
import { getBacktestMultiple } from './sharedBacktestMultiple.controller.js'
import { getBacktestSingle } from './sharedBacktestSingle.controller.js'
import { getSharedPositionDetails } from './sharedPositionDetail.controller.js'
import { getStats } from './stats.controller.js'
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

app.get('/:protocol/shared-backtest/single/:id', getBacktestSingle)
app.get('/:protocol/shared-backtest/multiple/:id', getBacktestMultiple)
app.get('/:protocol/trader/:address', getTraderDetail)
app.get('/:protocol/position/share/:sharedId', getSharedPositionDetails)
app.get('/:protocol/position', getPositionDetails)
app.get('/:protocol/top-openings', getTopOpenings)
app.get('/stats', getStats)
app.get('*', (req, res) => {
  renderHTML(req, res)
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log('Error during app startup', error)
  }
  console.log('listening on ' + PORT + '...')
})
