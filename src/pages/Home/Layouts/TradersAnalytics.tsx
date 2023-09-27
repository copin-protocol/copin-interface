import { useResponsive } from 'ahooks'

import ConditionFilter from '../ConditionFilter'
import FilterTag from '../ConditionFilter/FilterTag'
import ListTradersSection from '../ListTradersSection'
import TimeFilterSection from '../TimeFilterSection'
import TopOpeningsSection from '../TopOpeningsSection'
import useTradersContext from '../useTradersContext'
import AnalyticsLayoutDesktop from './AnalyticsLayoutDesktop'
import AnalyticsLayoutMobile from './AnalyticsLayoutMobile'

export default function TradersAnalytics() {
  const contextValues = useTradersContext()
  const { filters, changeFilters } = contextValues
  const { lg } = useResponsive()
  const Layout = lg ? AnalyticsLayoutDesktop : AnalyticsLayoutMobile

  return (
    <Layout
      timeFilterSection={<TimeFilterSection contextValues={contextValues} />}
      filterTag={<FilterTag filters={filters} />}
      listTradersSection={<ListTradersSection contextValues={contextValues} />}
      topOpeningsSection={<TopOpeningsSection protocol={contextValues.protocol} />}
      conditionFilter={<ConditionFilter filters={filters} changeFilters={changeFilters} />}
    />
  )
}
