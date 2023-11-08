import { cloneElement, useReducer } from 'react'

import DirectionButton from 'components/@ui/DirectionButton'
import { Box, Flex } from 'theme/base'

import { ConditionFilterProps } from '../ConditionFilter/types'
import SwitchProtocols from '../SwitchProtocols'
import { TimeFilterSectionProps } from '../TimeFilterSection'
import { RowConfig, RowState, mobileConfigs as configs } from './layoutConfigs'
import { AnalyticsLayoutComponents } from './types'

export default function AnalyticsLayoutTablet({
  timeFilterSection,
  filterTag,
  listTradersSection,
  conditionFilter,
}: AnalyticsLayoutComponents) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { FILTERS, CHART, LIST } = state
  const filtersExpanded = FILTERS.state === RowState.EXPANDED_TOP
  const expandFilters = () => dispatch(ButtonName.FILTERS)
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          width: '100%',
          height: '100%',
          gridTemplate: `
      "${GridAreas.CHART}" minmax(${CHART.minHeight}px, ${
            CHART.maxHeight ? CHART.maxHeight + 'px' : CHART.ratioHeight + 'fr'
          })
      "${GridAreas.LIST}" minmax(${LIST.minHeight}px, ${LIST.ratioHeight}fr)
      "${GridAreas.FILTERS}" minmax(${FILTERS.minHeight}px, ${
            FILTERS.maxHeight ? FILTERS.maxHeight + 'px' : FILTERS.ratioHeight + 'fr'
          })
    `,
        }}
      >
        <Box sx={{ gridArea: GridAreas.CHART }}>
          <Flex alignItems="center">
            {cloneElement<TimeFilterSectionProps>(timeFilterSection, { triggerResize: LIST.state.toString() })}
            <SwitchProtocols isMobile />
          </Flex>
        </Box>
        <Box
          sx={{
            gridArea: GridAreas.LIST,
            position: 'relative',
            borderTop: 'small',
            borderTopColor: 'neutral4',
          }}
        >
          {listTradersSection}
        </Box>
        <Box
          sx={{
            gridArea: GridAreas.FILTERS,
            position: 'relative',
            borderTop: filtersExpanded ? 'none' : 'small',
            borderColor: 'neutral4',
            bg: 'neutral7',
          }}
        >
          <DirectionButton
            onClick={expandFilters}
            buttonSx={{ top: filtersExpanded ? '0px' : '-15px', right: 8 }}
            direction={filtersExpanded ? 'bottom' : 'top'}
          />
          <Box
            display={filtersExpanded ? 'none' : 'block'}
            sx={{ position: 'absolute', top: 8, right: 12, cursor: 'pointer' }}
            onClick={expandFilters}
          >
            {filterTag}
          </Box>
          {cloneElement<ConditionFilterProps>(conditionFilter, {
            onCancel: expandFilters,
            onClickTitle: () => !filtersExpanded && expandFilters(),
            filtersExpanded,
          })}
        </Box>
      </Box>
    </Box>
  )
}

enum GridAreas {
  CHART = 'CHART',
  LIST = 'LIST',
  FILTERS = 'HOME_FILTERS',
}
enum ButtonName {
  MAIN = 'MAIN',
  FILTERS = 'FILTERS',
  LIST = 'LIST',
}

interface LayoutState {
  CHART: RowConfig
  LIST: RowConfig
  FILTERS: RowConfig
}

const initialState: LayoutState = {
  CHART: {
    minHeight: configs.CHART_MIN_HEIGHT,
    maxHeight: configs.CHART_MAX_HEIGHT,
    ratioHeight: configs.CHART_HEIGHT_RATIO,
    state: RowState.DEFAULT,
  },
  LIST: {
    minHeight: configs.LIST_MIN_HEIGHT,
    ratioHeight: configs.LIST_HEIGHT_RATIO,
    state: RowState.DEFAULT,
  },

  FILTERS: {
    minHeight: configs.FILTERS_MIN_HEIGHT,
    maxHeight: configs.FILTERS_MAX_HEIGHT,
    ratioHeight: configs.FILTERS_HEIGHT_RATIO,
    state: RowState.DEFAULT,
  },
}

function reducer(state: LayoutState, buttonName: ButtonName): LayoutState {
  let newState = state
  switch (buttonName) {
    case ButtonName.FILTERS:
      if (state.FILTERS.state === RowState.EXPANDED_TOP) {
        newState = initialState
        break
      }
      if (state.FILTERS.state === RowState.DEFAULT) {
        newState = {
          ...state,
          CHART: {
            ...state.CHART,
            minHeight: 0,
            maxHeight: 0,
            ratioHeight: 0,
          },
          LIST: {
            ...state.LIST,
            minHeight: 0,
            ratioHeight: 0,
          },
          FILTERS: {
            ...state.FILTERS,
            maxHeight: undefined,
            state: RowState.EXPANDED_TOP,
          },
        }
        break
      }
      break
    default:
      break
  }
  return newState
}
