import { cloneElement, useCallback, useReducer } from 'react'

import DirectionButton from 'components/@ui/DirectionButton'
// import { useIsPremium } from 'hooks/features/useSubscriptionRestrict'
import useMyProfile from 'hooks/store/useMyProfile'
import { Box } from 'theme/base'
import { STORAGE_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { TimeFilterSectionProps } from '../TimeFilterSection'
import { ColumnConfig, ColumnState, RowConfig, RowState, desktopConfigs as configs } from './layoutConfigs'
import { AnalyticsLayoutComponents } from './types'

export default function AnalyticsLayoutDesktop({
  timeFilterSection,
  filterTag,
  listTradersSection,
  conditionFilter,
}: AnalyticsLayoutComponents) {
  const { myProfile } = useMyProfile()
  // const isPremiumUser = useIsPremium()
  const [state, dispatch] = useReducer(reducer, initialState, initState)
  const { MAIN, COL_RIGHT, FILTERS, CHART, LIST } = state
  const mainExpanded = MAIN.state === ColumnState.EXPANDED_RIGHT
  // const listExpanded = LIST.state === RowState.EXPANDED_TOP

  const logEventLayout = useCallback(
    (action: string) => {
      logEvent({
        label: getUserForTracking(myProfile?.username),
        category: EventCategory.LAYOUT,
        action,
      })
    },
    [myProfile?.username]
  )

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        height: '100%',
        display: 'grid',
        gridTemplate: `
      "${GridAreas.MAIN} ${GridAreas.COL_RIGHT}" 100% / minmax(${MAIN.minWidth}px, ${MAIN.ratioWidth}fr) minmax(${
          COL_RIGHT.minWidth
        }px, ${COL_RIGHT.maxWidth ? COL_RIGHT.maxWidth + 'px' : COL_RIGHT.ratioWidth + 'fr'})
    `,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          gridArea: GridAreas.MAIN,
          display: 'grid',
          width: '100%',
          height: '100%',
          borderRight: 'small',
          borderRightColor: 'neutral4',
          gridTemplate: `
            "${GridAreas.CHART}" 40px
            "${GridAreas.LIST}" minmax(${LIST.minHeight}px, ${LIST.ratioHeight}fr)
          `,
        }}
      >
        <DirectionButton
          onClick={() => {
            dispatch(ButtonName.MAIN)
            if (mainExpanded) {
              logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_EXPLORER_MAIN)
            } else {
              logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_EXPLORER_MAIN)
            }
          }}
          buttonSx={{ top: '-1px', right: mainExpanded ? '0px' : '-16px', border: 'small', height: 42 }}
          direction={mainExpanded ? 'left' : 'right'}
        />
        <Box sx={{ gridArea: GridAreas.CHART, position: 'relative' }}>
          {cloneElement<TimeFilterSectionProps>(timeFilterSection, {
            triggerResize: MAIN.state + LIST.state,
          })}
          ,
          {mainExpanded ? (
            <Box
              sx={{ position: 'absolute', top: 9, right: 24, cursor: 'pointer' }}
              onClick={() => {
                dispatch(ButtonName.MAIN)
                if (mainExpanded) {
                  logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_EXPLORER_MAIN)
                } else {
                  logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_EXPLORER_MAIN)
                }
              }}
            >
              {filterTag}
            </Box>
          ) : null}
        </Box>
        <Box sx={{ gridArea: GridAreas.LIST, position: 'relative', borderTop: 'small', borderColor: 'neutral4' }}>
          {/* {isPremiumUser && (
            <DirectionButton
              onClick={() => {
                dispatch(ButtonName.LIST)
                if (listExpanded) {
                  logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_EXPLORER_LIST)
                } else {
                  logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_EXPLORER_LIST)
                }
              }}
              buttonSx={{ top: listExpanded ? '0px' : '-16px', left: 8 }}
              direction={listExpanded ? 'bottom' : 'top'}
            />
          )} */}
          {listTradersSection}
        </Box>
      </Box>
      <Box
        sx={{
          overflow: 'hidden',
          gridArea: GridAreas.COL_RIGHT,
          display: 'grid',
          width: '100%',
          height: '100%',
          gridTemplate: `
      
      "${GridAreas.FILTERS}" minmax(${FILTERS.minHeight}px, ${FILTERS.ratioHeight}fr)
      `,
        }}
      >
        <Box
          sx={{
            gridArea: GridAreas.FILTERS,
            position: 'relative',
          }}
        >
          {conditionFilter}
        </Box>
      </Box>
    </Box>
  )
}

enum GridAreas {
  MAIN = 'HOME_MAIN',
  COL_RIGHT = 'COL_RIGHT',
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
  MAIN: ColumnConfig
  COL_RIGHT: ColumnConfig
  CHART: RowConfig
  LIST: RowConfig
  FILTERS: RowConfig
}
const initialState: LayoutState = {
  MAIN: {
    minWidth: configs.MAIN_MIN_WIDTH,
    ratioWidth: configs.MAIN_WIDTH_RATIO,
    state: ColumnState.DEFAULT,
  },
  COL_RIGHT: {
    minWidth: configs.COLUMN_RIGHT_MIN_WIDTH,
    maxWidth: configs.COLUMN_RIGHT_MAX_WIDTH,
    ratioWidth: configs.COLUMN_RIGHT_WIDTH_RATIO,
    state: ColumnState.DEFAULT,
  },
  // in main
  CHART: {
    minHeight: configs.CHART_MIN_HEIGHT,
    ratioHeight: configs.CHART_HEIGHT_RATIO,
    state: RowState.DEFAULT,
  },
  LIST: {
    minHeight: configs.LIST_MIN_HEIGHT,
    ratioHeight: configs.LIST_HEIGHT_RATIO,
    state: RowState.DEFAULT,
  },
  // in col right
  FILTERS: {
    minHeight: configs.FILTERS_MIN_HEIGHT,
    ratioHeight: configs.FILTERS_HEIGHT_RATIO,
    state: RowState.DEFAULT,
  },
}
function initState(state: LayoutState) {
  let newState = state
  try {
    const storageLayout = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOME_DESKTOP_LAYOUT) ?? '')
    if (typeof storageLayout !== 'object') return newState
    if ((storageLayout?.version ?? 0) < 1) return newState
    if (Object.keys(storageLayout?.state ?? {}).length === Object.keys(initialState).length)
      newState = storageLayout.state as LayoutState
  } catch {}
  return newState
}

function saveLayout(state: LayoutState) {
  localStorage.setItem(STORAGE_KEYS.HOME_DESKTOP_LAYOUT, JSON.stringify({ version: 1, state }))
}

function reducer(state: LayoutState, buttonName: ButtonName): LayoutState {
  let newState = state
  switch (buttonName) {
    case ButtonName.MAIN:
      if (state.MAIN.state === ColumnState.EXPANDED_RIGHT) {
        newState = {
          ...state,
          COL_RIGHT: {
            ...state.COL_RIGHT,
            minWidth: configs.COLUMN_RIGHT_MIN_WIDTH,
            maxWidth: configs.COLUMN_RIGHT_MAX_WIDTH,
            ratioWidth: configs.COLUMN_RIGHT_WIDTH_RATIO,
          },
          MAIN: {
            ...state.MAIN,
            state: ColumnState.DEFAULT,
          },
        }
        break
      }
      if (state.MAIN.state === ColumnState.DEFAULT) {
        newState = {
          ...state,
          COL_RIGHT: {
            ...state.COL_RIGHT,
            minWidth: 0,
            maxWidth: 0,
            ratioWidth: 0,
          },
          MAIN: {
            ...state.MAIN,
            state: ColumnState.EXPANDED_RIGHT,
          },
        }
        break
      }
      break
    case ButtonName.LIST:
      if (state.LIST.state === RowState.EXPANDED_TOP) {
        newState = {
          ...state,
          CHART: {
            ...state.CHART,
            minHeight: configs.CHART_MIN_HEIGHT,
            maxHeight: undefined,
            ratioHeight: configs.CHART_HEIGHT_RATIO,
          },
          LIST: {
            ...state.LIST,
            state: RowState.DEFAULT,
          },
        }
        break
      }
      if (state.LIST.state === RowState.DEFAULT) {
        newState = {
          ...state,
          CHART: {
            ...state.CHART,
            minHeight: 39,
            maxHeight: 39,
          },
          LIST: {
            ...state.LIST,
            state: RowState.EXPANDED_TOP,
          },
        }
        break
      }
      break
    default:
      break
  }
  saveLayout(newState)
  return newState
}
