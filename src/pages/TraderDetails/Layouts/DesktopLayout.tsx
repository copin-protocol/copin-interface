import { cloneElement, useCallback, useEffect, useReducer } from 'react'

import DirectionButton from 'components/@ui/DirectionButton'
import { ChartPositionsProps } from 'components/Charts/ChartPositions/types'
import { HistoryTableProps, fullHistoryColumns, historyColumns } from 'components/Tables/HistoryTable'
import useMyProfile from 'hooks/store/useMyProfile'
import { Box, Flex, Grid } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { LayoutProps } from './types'

const DesktopLayout = ({ children, resetSort }: LayoutProps) => {
  const { myProfile } = useMyProfile()
  const [positionFullExpanded, toggleFullExpand] = useReducer((state) => !state, false)
  const [chartFullExpanded, toggleChartFullExpand] = useReducer((state) => !state, false)

  useEffect(() => {
    if (!positionFullExpanded) resetSort && resetSort()
  }, [positionFullExpanded])

  const [positionTopExpanded, toggleTopExpand] = useReducer((state) => !state, false)

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

  const handleFullExpand = () => {
    if (chartFullExpanded) {
      toggleChartFullExpand()
    }
    toggleFullExpand()
    logEventLayout(
      positionFullExpanded
        ? EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_POSITION_FULL
        : EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_POSITION_FULL
    )
  }

  const handleChartFullExpand = () => {
    if (positionFullExpanded) {
      toggleFullExpand()
    }
    toggleChartFullExpand()
    logEventLayout(
      chartFullExpanded
        ? EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_CHART_POSITION_FULL
        : EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_CHART_POSITION_FULL
    )
  }

  return (
    <Grid
      sx={{
        overflow: 'hidden',
        height: '100%',
        gridTemplate: `
    "ACCOUNT ACCOUNT ACCOUNT" minmax(60px, 60px)
    "CHARTS STATS POSITIONS" minmax(0px, 1fr) / ${
      positionFullExpanded ? '400px 0px 1fr' : chartFullExpanded ? '1fr 0px 510px' : '400px 1fr 510px'
    }
    `,
      }}
    >
      <Box
        id="ACCOUNT"
        sx={{
          gridArea: 'ACCOUNT / ACCOUNT',
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {children[0]}
      </Box>

      {/* <Box
        id="TIME_FILTER"
        px={3}
        py={2}
        sx={{ borderBottom: 'small', borderColor: 'neutral4', gridArea: 'TIME_FILTER / TIME_FILTER / TIME_FILTER' }}
      >
        {children[1]}
      </Box> */}
      <Box
        id="STATS"
        sx={{
          gridArea: 'STATS / STATS',
          overflow: 'hidden',
        }}
      >
        {children[1]}
      </Box>

      <Box
        id="CHARTS"
        sx={{
          gridArea: 'CHARTS / CHARTS',
          borderRight: chartFullExpanded ? 'none' : 'small',
          borderColor: 'neutral4',
          overflow: 'hidden',
          display: 'grid',
          gridTemplate: `
    "RADAR" ${chartFullExpanded ? '0px' : 'minmax(1fr, 260px)'}
    "CANDLESTICK" minmax(1fr, 1fr)
    `,
        }}
      >
        <Flex flexDirection="column" height="100%">
          <Box
            height={chartFullExpanded ? 0 : 260}
            sx={{
              gridArea: 'RADAR',
              overflow: 'hidden',
            }}
          >
            {children[2]}
          </Box>
          <Box
            sx={{
              gridArea: 'CANDLESTICK',
              borderTop: chartFullExpanded ? 'none' : 'small',
              borderColor: 'neutral4',
              // height: 'max(calc(100% - 120px - 260px),200px)',
              // '@media screen and (max-height: 800px)': {
              height: chartFullExpanded ? '100%' : 'max(calc(100% - 260px),200px)',
              // },
            }}
          >
            {/*{children[3]}*/}
            {chartFullExpanded
              ? cloneElement<ChartPositionsProps>(children[3], {
                  isExpanded: true,
                  toggleExpand: handleChartFullExpand,
                })
              : cloneElement<ChartPositionsProps>(children[3], {
                  isExpanded: false,
                  toggleExpand: handleChartFullExpand,
                })}
          </Box>

          {/* <Box
            px={12}
            pt={12}
            height="120px"
            sx={{
              borderTop: 'small',
              borderColor: 'neutral4',
              '@media screen and (max-height: 800px)': {
                display: 'none',
              },
            }}
          >
            {children[4]}
          </Box> */}
        </Flex>
      </Box>
      <Box
        id="POSITIONS"
        sx={{
          gridArea: 'POSITIONS / POSITIONS',
          borderLeft: positionFullExpanded ? 'none' : 'small',
          borderColor: 'neutral4',
          overflow: 'hidden',
          display: 'grid',
          gridTemplate: `
    "OPENINGS" ${positionFullExpanded || positionTopExpanded ? '0px' : 'minmax(261px, 261px)'}
    "HISTORY" minmax(0px, 1fr)
    `,
        }}
      >
        <Box
          sx={{
            gridArea: 'OPENINGS',
            overflow: 'hidden',
            borderBottom: positionFullExpanded || positionTopExpanded ? 'none' : 'small',
            borderBottomColor: 'neutral4',
          }}
        >
          {children[5]}
        </Box>
        <Box sx={{ gridArea: 'HISTORY', position: 'relative' }}>
          <DirectionButton
            onClick={() => {
              toggleTopExpand()

              if (positionTopExpanded) {
                logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_POSITION_TOP)
              } else {
                logEventLayout(EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_POSITION_TOP)
              }
            }}
            buttonSx={{
              display: positionFullExpanded ? 'none' : 'block',
              top: positionTopExpanded ? '0px' : '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            direction={positionTopExpanded ? 'bottom' : 'top'}
          />
          {positionFullExpanded
            ? cloneElement<HistoryTableProps>(children[6], {
                isExpanded: true,
                toggleExpand: handleFullExpand,
                tableSettings: fullHistoryColumns,
              })
            : cloneElement<HistoryTableProps>(children[6], {
                isExpanded: false,
                toggleExpand: handleFullExpand,
                tableSettings: historyColumns,
                currentSort: undefined,
                changeCurrentSort: undefined,
              })}
        </Box>
      </Box>
    </Grid>
  )
}

export default DesktopLayout
