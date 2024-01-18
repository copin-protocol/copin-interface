import { TradersContextData } from '../useTradersContext'

export interface ConditionFilterProps {
  filters: TradersContextData['filters']
  changeFilters: TradersContextData['changeFilters']
  rankingFilters: TradersContextData['rankingFilters']
  changeRankingFilters: TradersContextData['changeRankingFilters']
  tab: TradersContextData['filterTab']
  onCancel?: () => void
  filtersExpanded?: boolean
  onClickTitle?: () => void
}
