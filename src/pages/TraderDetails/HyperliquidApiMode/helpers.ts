import dayjs from 'dayjs'

import { HlAccountSpotData, HlAccountSpotRawData, HlAccountVaultData, HlTokenMappingData } from 'entities/hyperliquid'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { TimeFilterByEnum } from 'utils/config/enums'

type PnlPoint = [number, string]

const PERP_KEY_MAP: Record<string, string> = {
  [TimeFilterByEnum.LAST_24H]: 'perpDay',
  [TimeFilterByEnum.S7_DAY]: 'perpWeek',
  [TimeFilterByEnum.S30_DAY]: 'perpMonth',
  [TimeFilterByEnum.ALL_TIME]: 'perpAllTime',
}

const COMBINED_KEY_MAP: Record<string, string> = {
  [TimeFilterByEnum.LAST_24H]: 'day',
  [TimeFilterByEnum.S7_DAY]: 'week',
  [TimeFilterByEnum.S30_DAY]: 'month',
  [TimeFilterByEnum.ALL_TIME]: 'allTime',
}

export function getPortfolioByTime(
  hlPortfolioData: any,
  timeOption: TimeFilterByEnum,
  isAccountValue: boolean,
  isCombined: boolean
) {
  if (!hlPortfolioData) return { historyData: [], totalVolume: 0 }

  const key = isCombined ? COMBINED_KEY_MAP[timeOption] : PERP_KEY_MAP[timeOption]
  const historyKey = isAccountValue ? 'accountValueHistory' : 'pnlHistory'
  const found = hlPortfolioData.find(([k]: [string, any]) => k === key)
  if (!found) return { historyData: [], totalVolume: 0 }

  const historyData: PnlPoint[] = found[1]?.[historyKey] || []
  const totalVolume = found[1]?.vlm ? Number(found[1].vlm) : 0

  return { historyData, totalVolume }
}

export function formatChartData(historyData?: PnlPoint[]) {
  if (!historyData) return []

  return historyData.map(([timestamp, pnl]) => ({
    fullDate: dayjs(Number(timestamp)).format(DAYJS_FULL_DATE_FORMAT),
    time: Number(timestamp),
    pnl: Number(pnl),
  }))
}

export function calculateMaxDrawdown(pnlHistory: PnlPoint[], accountValueHistory: PnlPoint[]): number {
  if (accountValueHistory.length !== pnlHistory.length || accountValueHistory.length === 0) return 0

  let maxDrawdown = 0

  for (let start = 0; start < pnlHistory.length; start++) {
    const pnlStart = Number(pnlHistory[start][1])
    const accountValueStart = Number(accountValueHistory[start][1])
    if (accountValueStart === 0) continue

    for (let end = start + 1; end < pnlHistory.length; end++) {
      const pnlEnd = Number(pnlHistory[end][1])
      const drawdown = (pnlEnd - pnlStart) / accountValueStart
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown
      }
    }
  }

  return Math.abs(maxDrawdown) * 100
}

export function calculateVaultEquities(vaults?: HlAccountVaultData[]): number {
  if (!vaults?.length) return 0
  return vaults.reduce((sum, current) => sum + Number(current.equity), 0)
}

export function parseHlSpotData(data?: HlAccountSpotRawData, hlSpotTokens?: HlTokenMappingData[]) {
  return data?.balances?.map((balance) => {
    const coin = balance.coin
    const price = coin === 'USDC' ? 1 : hlSpotTokens?.find((e) => e.baseToken.name === coin)?.price ?? 0
    const total = Number(balance.total)
    const entryValue = Number(balance.entryNtl)
    const currentValue = total * price
    const unrealizedPnl = coin === 'USDC' ? undefined : currentValue - entryValue
    return {
      coin,
      price,
      total,
      entryValue,
      currentValue,
      unrealizedPnl,
      roe: entryValue && unrealizedPnl ? (unrealizedPnl / entryValue) * 100 : 0,
      token: balance.token,
    } as HlAccountSpotData
  })
}

function filterTodayData(history: PnlPoint[]): PnlPoint[] {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  return history.filter(([ts, _]) => {
    const recordDate = new Date(Number(ts)).toISOString().slice(0, 10)
    return recordDate !== today
  })
}
