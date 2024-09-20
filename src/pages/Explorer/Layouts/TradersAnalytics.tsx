import { useResponsive } from 'ahooks'

import CustomPageTitle from 'components/@ui/CustomPageTitle'

import ConditionFilter, { ConditionFilterButton } from '../ConditionFilter'
import FilterTag from '../ConditionFilter/FilterTag'
import { FilterTabEnum } from '../ConditionFilter/configs'
import ListTradersSection from '../ListTradersSection'
import TimeFilterSection, { TimeFilterDropdown } from '../TimeFilterSection'
import useTradersContext from '../useTradersContext'
import AnalyticsLayoutDesktop from './AnalyticsLayoutDesktop'
import AnalyticsLayoutMobile from './AnalyticsLayoutMobile'
import SortTradersDropdown from './SortTradersDropdown'

export default function TradersAnalytics() {
  const contextValues = useTradersContext()

  const { filters, changeFilters, rankingFilters, changeRankingFilters, filterTab } = contextValues
  const _filters = filterTab === FilterTabEnum.RANKING ? rankingFilters : filters
  const { lg } = useResponsive()

  return (
    <>
      <CustomPageTitle />
      {lg ? (
        <AnalyticsLayoutDesktop
          timeFilterSection={<TimeFilterSection contextValues={contextValues} />}
          filterTag={<FilterTag filters={_filters} filterTab={filterTab} />}
          listTradersSection={<ListTradersSection contextValues={contextValues} />}
          conditionFilter={
            <ConditionFilter
              filters={filters}
              changeFilters={changeFilters}
              rankingFilters={rankingFilters}
              changeRankingFilters={changeRankingFilters}
              tab={filterTab}
            />
          }
        />
      ) : (
        <AnalyticsLayoutMobile
          filterTag={null}
          timeFilterSection={<TimeFilterDropdown contextValues={contextValues} />}
          listTradersSection={<ListTradersSection contextValues={contextValues} />}
          sortSection={
            <SortTradersDropdown
              currentSort={contextValues.currentSort}
              changeCurrentSort={contextValues.changeCurrentSort}
            />
          }
          conditionFilter={
            <ConditionFilterButton
              filters={filters}
              changeFilters={changeFilters}
              rankingFilters={rankingFilters}
              changeRankingFilters={changeRankingFilters}
              tab={filterTab}
            />
          }
        />
      )}
    </>
  )
}
