import { TradersContextData } from '../useTradersContext'

export interface ConditionFilterProps {
  filters: TradersContextData['filters']
  rankingFilters: TradersContextData['rankingFilters']
  labelsFilters: TradersContextData['labelsFilters']
  changeFilters: TradersContextData['changeFilters']
  changeLabels: TradersContextData['changeLabels']
  tab: TradersContextData['filterTab']
  onCancel?: () => void
  filtersExpanded?: boolean
  onClickTitle?: () => void
}
