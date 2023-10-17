import { Trans } from '@lingui/macro'
import { ChartBar, Funnel } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

import { Box, Flex, Type } from 'theme/base'

import DefaultFilterForm from './DefaultFilterForm'
import FilterSuggestion from './FilterSuggestion'
import RankingFilterForm from './RankingFilterForm'
import { FilterTabEnum } from './configs'
import { ConditionFilterProps } from './types'

export default function ConditionFilter({
  filters,
  changeFilters,
  rankingFilters,
  changeRankingFilters,
  tab,
  onCancel,
  onClickTitle,
}: ConditionFilterProps) {
  const [filterTab, setFilterTab] = useState(tab) // reduce render
  const prevTab = useRef(filterTab)
  useEffect(() => {
    prevTab.current = filterTab
  }, [filterTab])
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Flex
        sx={{
          alignItems: 'center',
          gap: 4,
          px: [2, 2, 2, 3],
          pt: [2, 2, 2, 3],
          pb: [2, 2, 2, 12],
          borderBottom: 'small',
          borderBottomColor: 'neutral5',
          color: 'neutral2',
          cursor: onClickTitle ? 'pointer' : 'default',
        }}
        onClick={onClickTitle}
      >
        <Flex
          alignItems="center"
          sx={{ gap: 2 }}
          color={filterTab === FilterTabEnum.DEFAULT ? 'neutral1' : 'neutral3'}
          onClick={() => setFilterTab(FilterTabEnum.DEFAULT)}
          role="button"
        >
          <Funnel size={20} />
          <Type.BodyBold fontSize={[14, 14, 16]}>
            <Trans>Default Filter</Trans>
          </Type.BodyBold>
        </Flex>
        <Flex
          alignItems="center"
          sx={{ gap: 2 }}
          color={filterTab === FilterTabEnum.RANKING ? 'neutral1' : 'neutral3'}
          onClick={() => setFilterTab(FilterTabEnum.RANKING)}
          role="button"
        >
          <ChartBar size={20} />
          <Type.BodyBold fontSize={[14, 14, 16]}>
            <Trans>Ranking Filter</Trans>
          </Type.BodyBold>
        </Flex>
      </Flex>

      {filterTab === FilterTabEnum.DEFAULT ? (
        <Box px={3}>
          <FilterSuggestion changeFilters={changeFilters} />
        </Box>
      ) : null}
      <Box flex="1 0 0">
        {filterTab === FilterTabEnum.DEFAULT ? (
          <DefaultFilterForm
            key={Object.keys(filters).join('')}
            defaultFormValues={filters}
            handleChangeOption={changeFilters}
            handleClose={onCancel}
            prevTab={prevTab.current}
            lastFilterTab={tab}
          />
        ) : (
          <RankingFilterForm
            key={Object.keys(rankingFilters).join('')}
            defaultFormValues={rankingFilters}
            handleChangeOption={changeRankingFilters}
            handleClose={onCancel}
            prevTab={prevTab.current}
            lastFilterTab={tab}
          />
        )}
      </Box>
    </Flex>
  )
}
