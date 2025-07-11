import { useResponsive } from 'ahooks'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import TraderLabels from 'components/@ui/TraderLabels'
import { Flex } from 'theme/base'

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

  const {
    filters,
    changeFilters,
    rankingFilters,
    filterTab,
    labelsFilters,
    ifLabelsFilters,
    changeLabels,
    changeIFLabels,
  } = contextValues
  const _filters = filterTab === FilterTabEnum.RANKING ? rankingFilters : filters
  const { lg } = useResponsive()

  return (
    <>
      <CustomPageTitle />
      {lg ? (
        <AnalyticsLayoutDesktop
          timeFilterSection={<TimeFilterSection contextValues={contextValues} />}
          filterTag={
            filterTab === FilterTabEnum.LABELS || filterTab === FilterTabEnum.IF_LABELS ? (
              <Flex sx={{ gap: 2, alignItems: 'center', mt: '2px' }}>
                <TraderLabels
                  labels={
                    filterTab === FilterTabEnum.LABELS
                      ? labelsFilters.map((value) => ({ key: value }))
                      : ifLabelsFilters.map((value) => ({ key: value, title: value }))
                  }
                  shouldShowTooltip={false}
                  showedItems={3}
                />
              </Flex>
            ) : (
              <FilterTag filters={_filters} filterTab={filterTab} />
            )
          }
          listTradersSection={<ListTradersSection contextValues={contextValues} />}
          conditionFilter={
            <ConditionFilter
              filters={filters}
              changeFilters={changeFilters}
              changeLabels={changeLabels}
              changeIFLabels={changeIFLabels}
              rankingFilters={rankingFilters}
              labelsFilters={labelsFilters}
              ifLabelsFilters={ifLabelsFilters}
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
              changeLabels={changeLabels}
              changeIFLabels={changeIFLabels}
              rankingFilters={rankingFilters}
              labelsFilters={labelsFilters}
              ifLabelsFilters={ifLabelsFilters}
              tab={filterTab}
            />
          }
        />
      )}
    </>
  )
}
