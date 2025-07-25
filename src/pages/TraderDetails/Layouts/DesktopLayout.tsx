import { Trans } from '@lingui/macro'
import { useSize } from 'ahooks'
import { useCallback, useReducer } from 'react'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BlurMask from 'components/@ui/BlurMask'
import DirectionButton from 'components/@ui/DirectionButton'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useMyProfile from 'hooks/store/useMyProfile'
import { Box, Flex, Grid } from 'theme/base'
import { PROFILE_BREAKPOINT_XL } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import ProtocolPermissionContainer from './ProtocolPermissionContainer'
import { LayoutProps } from './types'

const DesktopLayout = (props: LayoutProps) => {
  const size = useSize(document.body)
  const { openingPositionFullExpanded, positionFullExpanded, chartFullExpanded } = props
  const { myProfile } = useMyProfile()
  const { isEnablePosition, requiredPlanToViewPosition } = useTraderProfilePermission({ protocol: props.protocol })

  const [positionTopExpanded, toggleTopExpand] = useReducer((state) => !state, false)
  const rowOneMaxHeight = 250
  const rowOneHeight = `max(33%, ${rowOneMaxHeight}px)`
  const rowPostionHeight = `max(calc(33% + 40px), ${rowOneMaxHeight + 40}px)`

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
    <Flex sx={{ height: '100%', width: '100%', flexDirection: 'column', minHeight: 640 }}>
      <Box sx={{ flexShrink: 0, height: 56, borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        {props.protocolStats}
      </Box>
      {/* {!!props.protocol && (
        <>
          <TraderDetailsAlertBanner protocol={props.protocol} />
          <Divider />
        </>
      )} */}
      <Box
        sx={{ flexShrink: 0, borderBottom: 'small', borderBottomColor: 'neutral4', position: 'relative', zIndex: 10 }}
      >
        {props.traderInfo}
      </Box>
      <ProtocolPermissionContainer protocol={props.protocol}>
        <Box flex="1 0 0" overflow="hidden">
          <Grid
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              gridTemplate: `
              "MAIN POSITIONS" minmax(0px, 1fr) / ${
                openingPositionFullExpanded || positionFullExpanded
                  ? '0px 1fr'
                  : `1fr ${size && size?.width > PROFILE_BREAKPOINT_XL ? '918px' : '525px'}`
              }
            `,
            }}
          >
            <Box
              id="MAIN"
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                gridArea: 'MAIN / MAIN',
              }}
            >
              <Box width="100%">{props.traderStatsSummary}</Box>
              {props.protocol === ProtocolEnum.HYPERLIQUID && props.apiMode ? (
                <Flex
                  sx={{
                    width: '100%',
                    height: ['100%', '100%', '100%', '100%', 'calc(100% - 40px)'],
                    overflow: 'hidden',
                    gridArea: 'STATS / CHARTS',
                  }}
                >
                  <Box
                    id="CHARTS"
                    sx={{
                      minWidth: 350,
                      maxWidth: 350,
                      gridArea: 'CHARTS / CHARTS',
                      overflow: 'hidden',
                      display: 'grid',
                      gridTemplate: `
            "RADAR" minmax(1fr, ${rowOneHeight})
            "CANDLESTICK" minmax(1fr, 1fr)
          `,
                    }}
                  >
                    <Flex flexDirection="column" height="100%">
                      <Box
                        height={rowOneHeight}
                        maxHeight={rowOneMaxHeight}
                        sx={{
                          gridArea: 'RADAR',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {props.hlPerformance}
                        <Box
                          sx={{
                            height: '100%',
                            width: '1px',
                            bg: 'neutral4',
                            position: 'absolute',
                            right: 0,
                            top: 0,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          gridArea: 'CANDLESTICK',
                          overflow: 'hidden',
                          borderRight: 'small',
                          borderTop: 'smallDashed',
                          borderColor: 'neutral4',
                          flex: '1 0 0',
                        }}
                      >
                        <Box height="100%">{props.hlOverview}</Box>
                      </Box>
                    </Flex>
                  </Box>

                  <Box
                    width="100%"
                    id="STATS"
                    sx={{
                      gridArea: 'STATS / STATS',
                      overflow: 'hidden',
                    }}
                  >
                    {
                      <Box height="100%" sx={{ flexDirection: 'column', display: 'flex' }}>
                        <Flex
                          sx={{
                            width: '100%',
                            height: rowOneHeight,
                            flexDirection: 'column',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <Box flex="1 0 0">{props.hlChartPnl}</Box>
                        </Flex>
                        <Box
                          overflow="auto"
                          flex="1 0 0"
                          mr={'-1px'}
                          sx={{ position: 'relative', borderTop: 'smallDashed', borderColor: 'neutral4' }}
                        >
                          <Box height="100%">{props.hlPortfolio}</Box>
                        </Box>
                      </Box>
                    }
                  </Box>
                </Flex>
              ) : (
                <Flex
                  sx={{
                    width: '100%',
                    height: ['100%', '100%', '100%', '100%', 'calc(100% - 40px)'],
                    overflow: 'hidden',
                    gridArea: 'STATS / CHARTS',
                  }}
                >
                  <Box
                    id="CHARTS"
                    sx={{
                      minWidth: 350,
                      maxWidth: 350,
                      gridArea: 'CHARTS / CHARTS',
                      overflow: 'hidden',
                      display: 'grid',
                      gridTemplate: `
            "RADAR" minmax(1fr, ${rowOneHeight})
            "CANDLESTICK" minmax(1fr, 1fr)
          `,
                    }}
                  >
                    <Flex flexDirection="column" height="100%">
                      <Box
                        height={rowOneHeight}
                        sx={{
                          gridArea: 'RADAR',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {props.traderRanking}
                        <Box
                          sx={{
                            height: 'calc(100% - 72px)',
                            width: '1px',
                            bg: 'neutral4',
                            position: 'absolute',
                            right: 0,
                            top: 56,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          gridArea: 'CANDLESTICK',
                          borderRight: 'small',
                          borderTop: chartFullExpanded ? 'none' : 'small',
                          borderColor: 'neutral4',
                          height: `max(calc(100% - ${rowOneHeight}),200px)`,
                          ...(chartFullExpanded
                            ? {
                                position: 'absolute',
                                top: 0,
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
                    </Flex>
                  </Box>

                  <Box
                    width="100%"
                    id="STATS"
                    sx={{
                      gridArea: 'STATS / STATS',
                      overflow: 'hidden',
                    }}
                  >
                    {
                      <Box height="100%" sx={{ flexDirection: 'column', display: 'flex' }}>
                        <Flex
                          sx={{
                            width: '100%',
                            height: rowOneHeight,
                            flexDirection: 'column',
                            overflow: 'hidden',
                            // bg: 'neutral5',
                            flexShrink: 0,
                          }}
                        >
                          <Box flex="1 0 0">{props.traderChartPnl}</Box>
                        </Flex>
                        <Box overflow="auto" flex="1 0 0" mr={'-1px'} sx={{ position: 'relative' }}>
                          <Box height="100%">{props.traderStats}</Box>
                        </Box>
                      </Box>
                    }
                  </Box>
                </Flex>
              )}
            </Box>
            <Box
              id="POSITIONS"
              sx={{
                gridArea: 'POSITIONS / POSITIONS',
                borderLeft: openingPositionFullExpanded || positionFullExpanded ? 'none' : 'small',
                borderColor: 'neutral4',
                overflow: 'hidden',
                display: 'grid',
                gridTemplate: `
                "OPENINGS" ${
                  openingPositionFullExpanded
                    ? 'minmax(0px, 1fr)'
                    : positionFullExpanded || positionTopExpanded
                    ? '0px'
                    : `${rowPostionHeight}`
                }
                "HISTORY" ${openingPositionFullExpanded ? '0px' : 'minmax(0px, 1fr)'}
              `,
                position: 'relative',
              }}
            >
              <BlurMask isBlur={!isEnablePosition}>
                <PlanUpgradePrompt
                  requiredPlan={requiredPlanToViewPosition}
                  noLoginTitle={<Trans>Login to view more information</Trans>}
                  noLoginDescription={<Trans>View positions and more trader insights.</Trans>}
                  showTitleIcon
                  showNoLoginTitleIcon
                  requiredLogin
                />
              </BlurMask>
              <Box
                sx={{
                  gridArea: 'OPENINGS',
                  overflow: 'hidden',
                  borderBottom:
                    openingPositionFullExpanded || positionFullExpanded || positionTopExpanded ? 'none' : 'small',
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
                    display: openingPositionFullExpanded || positionFullExpanded ? 'none' : 'block',
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
        </Box>
      </ProtocolPermissionContainer>
    </Flex>
  )
}

export default DesktopLayout
