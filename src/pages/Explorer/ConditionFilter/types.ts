import { TradersContextData } from '../useTradersContext'

export interface ConditionFilterProps {
  filters: TradersContextData['filters']
  rankingFilters: TradersContextData['rankingFilters']
  labelsFilters: TradersContextData['labelsFilters']
  ifLabelsFilters: TradersContextData['ifLabelsFilters']
  changeFilters: TradersContextData['changeFilters']
  changeLabels: TradersContextData['changeLabels']
  changeIFLabels: TradersContextData['changeIFLabels']
  tab: TradersContextData['filterTab']
  onCancel?: () => void
  filtersExpanded?: boolean
  onClickTitle?: () => void
}
