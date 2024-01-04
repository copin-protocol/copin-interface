import { useCallback, useReducer } from 'react'

import DirectionButton from 'components/@ui/DirectionButton'
import useMyProfile from 'hooks/store/useMyProfile'
import { Box, Flex, Grid } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { LayoutProps } from './types'

const DesktopLayout = (props: LayoutProps) => {
  const { positionFullExpanded, chartFullExpanded } = props
  const { myProfile } = useMyProfile()

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

  return (
    <Grid
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        gridTemplate: `
    "ACCOUNT ACCOUNT ACCOUNT" minmax(60px, 60px)
    "CHARTS STATS POSITIONS" minmax(0px, 1fr) / ${
      positionFullExpanded ? '400px 0px 1fr' : '400px 1fr 510px'
      // positionFullExpanded ? '400px 0px 1fr' : chartFullExpanded ? '1fr 0px 510px' : '400px 1fr 510px'
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
        {props.traderInfo}
      </Box>
      <Box
        id="STATS"
        sx={{
          gridArea: 'STATS / STATS',
          overflow: 'hidden',
        }}
      >
        {props.traderStats}
      </Box>

      <Box
        id="CHARTS"
        sx={{
          gridArea: 'CHARTS / CHARTS',
          // borderRight: chartFullExpanded ? 'none' : 'small',
          borderRight: 'small',
          borderColor: 'neutral4',
          overflow: 'hidden',
          display: 'grid',
          gridTemplate: `
            "RADAR" minmax(1fr, 260px)
            "CANDLESTICK" minmax(1fr, 1fr)
          `,
          // "RADAR" ${chartFullExpanded ? '0px' : 'minmax(1fr, 260px)'}
        }}
      >
        <Flex flexDirection="column" height="100%">
          <Box
            // height={chartFullExpanded ? 0 : 260}
            height={260}
            sx={{
              gridArea: 'RADAR',
              overflow: 'hidden',
            }}
          >
            {props.traderRanking}
          </Box>
          <Box
            sx={{
              gridArea: 'CANDLESTICK',
              borderTop: chartFullExpanded ? 'none' : 'small',
              borderColor: 'neutral4',
              // height: 'max(calc(100% - 120px - 260px),200px)',
              // '@media screen and (max-height: 800px)': {
              // height: chartFullExpanded ? '100%' : 'max(calc(100% - 260px),200px)',
              height: 'max(calc(100% - 260px),200px)',
              // },
              ...(chartFullExpanded
                ? {
                    position: 'absolute',
                    top: 60,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    bg: 'neutral8',
                    height: 'auto',
                    zIndex: 10,
                  }
                : {}),
            }}
          >
            {props.traderChartPositions}
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
          {props.openingPositions}
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
          {props.closedPositions}
        </Box>
      </Box>
    </Grid>
  )
}

export default DesktopLayout
