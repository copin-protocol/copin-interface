import { CopyPositionData } from 'entities/copyTrade'
import { GroupedFillsData } from 'entities/hyperliquid'
import { PositionData, ResponseTraderData, TraderData } from 'entities/trader'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'

export const usePnlWithFee = (
  item: PositionData | TraderData | CopyPositionData | GroupedFillsData | ResponseTraderData
): number | undefined => {
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)

  const calculatePnl = (pnl: number, fee: number, includeFee: boolean): number => {
    return includeFee ? pnl - fee : pnl
  }

  if ('realisedPnl' in item) {
    const realised = Number(item.realisedPnl ?? 0)
    const fee = Number('totalFee' in item ? item.totalFee ?? 0 : item.fee ?? 0)
    return calculatePnl(realised, fee, pnlWithFeeEnabled)
  }

  if ('totalRealisedPnl' in item) {
    const total = Number(item.totalRealisedPnl ?? 0)
    const fee = 'totalFee' in item ? Number(item.totalFee ?? 0) : 0
    return calculatePnl(total, fee, pnlWithFeeEnabled)
  }

  return undefined
}
