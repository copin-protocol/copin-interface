import { TradersContextData } from '../useTradersContext'

export interface ConditionFilterProps {
  filters: TradersContextData['filters']
  rankingFilters: TradersContextData['rankingFilters']
  changeFilters: TradersContextData['changeFilters']
  tab: TradersContextData['filterTab']
  onCancel?: () => void
  filtersExpanded?: boolean
  onClickTitle?: () => void
}
