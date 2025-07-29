import { TradersContextData } from '../useTradersContext'

export interface ConditionFilterProps {
  filters: TradersContextData['filters']
  rankingFilters: TradersContextData['rankingFilters']
  labelsFilters: TradersContextData['labelsFilters']
  ifFilters: TradersContextData['ifFilters']
  changeFilters: TradersContextData['changeFilters']
  changeLabels: TradersContextData['changeLabels']
  changeIFFilters: TradersContextData['changeIFFilters']
  tab: TradersContextData['filterTab']
  onCancel?: () => void
  filtersExpanded?: boolean
  onClickTitle?: () => void
}

export interface IFFilterParams {
  ifLabels?: string[]
  ifGoodMarkets?: string[]
  ifBadMarkets?: string[]
}
