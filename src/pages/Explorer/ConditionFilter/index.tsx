import { Trans } from '@lingui/macro'
import { ChartBar, Funnel } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, IconBox } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

import DefaultFilterForm from './DefaultFilterForm'
// import FilterSuggestion from './FilterSuggestion'
import RankingFilterForm from './RankingFilterForm'
import { FilterTabEnum } from './configs'
import { ConditionFilterProps } from './types'

export default function ConditionFilter({
  filters,
  changeFilters,
  rankingFilters,
  tab,
  onCancel,
  onClickTitle,
  filtersExpanded,
}: ConditionFilterProps) {
  const [filterTab, setFilterTab] = useState(tab) // reduce render
  const filterKey = useMemo(
    () =>
      filters
        ?.map((values) => {
          return Object.values(values).join('_')
        })
        .join('_'),
    [filters]
  )
  const rankingKey = useMemo(
    () =>
      rankingFilters
        ?.map((values) => {
          return Object.values(values).join('_')
        })
        .join('_'),
    [rankingFilters]
  )

  const { isEnableRankingFilter, planToFilterRanking } = useExplorerPermission()

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Box onClick={() => onClickTitle?.()}>
        <TabHeader
          configs={[
            {
              key: FilterTabEnum.DEFAULT as unknown as string,
              name: <Trans>DEFAULT FILTER</Trans>,
              icon: <Funnel size={20} />,
            },
            {
              key: FilterTabEnum.RANKING as unknown as string,
              name: (
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <Trans>PERCENTILE FILTER</Trans>{' '}
                  {!!planToFilterRanking && <PlanUpgradeIndicator requiredPlan={planToFilterRanking} useLockIcon />}
                </Flex>
              ),
              icon: <ChartBar size={20} />,
            },
          ]}
          isActiveFn={(config: TabConfig) => config.key === (filterTab as unknown as string)}
          onClickItem={(key: string) => setFilterTab(key as unknown as FilterTabEnum)}
          sx={{
            borderBottom: 'small',
            borderBottomColor: 'neutral5',
          }}
        />
      </Box>

      {/* {filterTab === FilterTabEnum.DEFAULT ? (
        <Box px={3}>
          <FilterSuggestion changeFilters={changeFilters} />
        </Box>
      ) : null} */}
      <Box flex="1 0 0">
        <Box display={filterTab === FilterTabEnum.DEFAULT ? 'block' : 'none'} width="100%" height="100%">
          <DefaultFilterForm
            key={filterKey}
            defaultFormValues={filters}
            handleChangeOption={(filters) => changeFilters({ filters, filterTab: FilterTabEnum.DEFAULT })}
            handleClose={onCancel}
            currentTab={filterTab}
            lastFilterTab={tab}
          />
        </Box>
        <Box display={filterTab === FilterTabEnum.RANKING ? 'block' : 'none'} width="100%" height="100%">
          {isEnableRankingFilter ? (
            <RankingFilterForm
              key={rankingKey}
              defaultFormValues={rankingFilters}
              handleChangeOption={(filters) => changeFilters({ filters, filterTab: FilterTabEnum.RANKING })}
              handleClose={onCancel}
              currentTab={filterTab}
              lastFilterTab={tab}
            />
          ) : planToFilterRanking ? (
            <Box px={2}>
              <Box mb={24} />
              <PlanUpgradePrompt
                requiredPlan={planToFilterRanking}
                title={
                  <Trans>
                    This features is available from {SUBSCRIPTION_PLAN_TRANSLATION[planToFilterRanking]} plan
                  </Trans>
                }
                description={<Trans>Unlock powerful filters to enhance your copy trading decisions</Trans>}
                showTitleIcon
                showLearnMoreButton
                useLockIcon
                learnMoreSection={SubscriptionFeatureEnum.TRADER_EXPLORER}
              />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Flex>
  )
}

export function ConditionFilterButton(props: ConditionFilterProps & { hasText?: boolean }) {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <Button
        variant="ghost"
        sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'normal' }}
        onClick={() => setOpenModal(true)}
      >
        <IconBox icon={<Funnel size={20} />} color="neutral3" />
        {props.hasText && (
          <Box as="span">
            <Trans>Filters</Trans>
          </Box>
        )}
        <Box
          sx={{
            width: 16,
            height: 16,
            textAlign: 'center',
            bg: 'primary1',
            color: 'neutral8',
            borderRadius: '50%',
            fontSize: '11px',
          }}
        >
          {props.filters.length}
        </Box>
      </Button>
      {openModal && (
        <Modal isOpen minHeight="80svh" mode="bottom" maxHeight="80svh" onDismiss={() => setOpenModal(false)}>
          <ConditionFilter {...props} filtersExpanded onCancel={() => setOpenModal(false)} />
        </Modal>
      )}
    </>
  )
}
