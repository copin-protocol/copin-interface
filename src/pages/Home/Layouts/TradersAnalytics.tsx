import { useResponsive } from 'ahooks'

import CustomPageTitle from 'components/@ui/CustomPageTitle'

import ConditionFilter from '../ConditionFilter'
import FilterTag from '../ConditionFilter/FilterTag'
import { FilterTabEnum } from '../ConditionFilter/configs'
import ListTradersSection from '../ListTradersSection'
import TimeFilterSection from '../TimeFilterSection'
import TopOpeningsSection from '../TopOpeningsSection'
import useTradersContext from '../useTradersContext'
import AnalyticsLayoutDesktop from './AnalyticsLayoutDesktop'
import AnalyticsLayoutMobile from './AnalyticsLayoutMobile'

export default function TradersAnalytics() {
  const contextValues = useTradersContext()
  const { filters, changeFilters, rankingFilters, changeRankingFilters, filterTab } = contextValues
  const _filters = filterTab === FilterTabEnum.RANKING ? rankingFilters : filters

  const { lg } = useResponsive()
  const Layout = lg ? AnalyticsLayoutDesktop : AnalyticsLayoutMobile

  return (
    <>
      <CustomPageTitle />
      <Layout
        timeFilterSection={<TimeFilterSection contextValues={contextValues} />}
        filterTag={<FilterTag filters={_filters} filterTab={filterTab} />}
        listTradersSection={<ListTradersSection contextValues={contextValues} />}
        topOpeningsSection={<TopOpeningsSection protocol={contextValues.protocol} />}
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
    </>
  )
}
