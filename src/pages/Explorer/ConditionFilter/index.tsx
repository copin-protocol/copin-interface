import { Trans } from '@lingui/macro'
import { ChartBar, Funnel } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

import DefaultFilterForm from './DefaultFilterForm'
// import FilterSuggestion from './FilterSuggestion'
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
        <Box
          alignItems="center"
          sx={{
            gap: 2,
            color: [
              !filtersExpanded ? 'neutral1' : filterTab === FilterTabEnum.DEFAULT ? 'neutral1' : 'neutral3',
              !filtersExpanded ? 'neutral1' : filterTab === FilterTabEnum.DEFAULT ? 'neutral1' : 'neutral3',
              filterTab === FilterTabEnum.DEFAULT ? 'neutral1' : 'neutral3',
            ],
          }}
          onClick={() => setFilterTab(FilterTabEnum.DEFAULT)}
          role="button"
          display={{ _: tab !== FilterTabEnum.DEFAULT && !filtersExpanded ? 'none' : 'flex', md: 'flex' }}
        >
          <Funnel size={20} />
          <Type.BodyBold fontSize={[14, 14, 16]}>
            <Trans>Default Filter</Trans>
          </Type.BodyBold>
        </Box>
        <Box
          alignItems="center"
          sx={{
            gap: 2,
            color: [
              !filtersExpanded ? 'neutral1' : filterTab === FilterTabEnum.RANKING ? 'neutral1' : 'neutral3',
              !filtersExpanded ? 'neutral1' : filterTab === FilterTabEnum.RANKING ? 'neutral1' : 'neutral3',
              filterTab === FilterTabEnum.RANKING ? 'neutral1' : 'neutral3',
            ],
          }}
          onClick={() => setFilterTab(FilterTabEnum.RANKING)}
          role="button"
          display={{ _: tab !== FilterTabEnum.RANKING && !filtersExpanded ? 'none' : 'flex', md: 'flex' }}
        >
          <ChartBar size={20} />
          <Type.BodyBold fontSize={[14, 14, 16]}>
            <Trans>Percentile Filter</Trans>
          </Type.BodyBold>
        </Box>
      </Flex>

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
            handleChangeOption={changeFilters}
            handleClose={onCancel}
            currentTab={filterTab}
            lastFilterTab={tab}
          />
        </Box>
        <Box display={filterTab === FilterTabEnum.RANKING ? 'block' : 'none'} width="100%" height="100%">
          <RankingFilterForm
            key={rankingKey}
            defaultFormValues={rankingFilters}
            handleChangeOption={changeRankingFilters}
            handleClose={onCancel}
            currentTab={filterTab}
            lastFilterTab={tab}
          />
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
