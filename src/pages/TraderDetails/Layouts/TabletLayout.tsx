import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BlurMask from 'components/@ui/BlurMask'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useTabHandler from 'hooks/router/useTabHandler'
import { TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import ProtocolPermissionContainer from './ProtocolPermissionContainer'
import { TabEnum, noPositionsTabConfigs } from './tabConfigs'
import { LayoutProps } from './types'

const TabletLayout = (props: LayoutProps) => {
  const { tab, handleTab: setTab } = useTabHandler({ defaultTab: TabEnum.STATS })
  const { isEnablePosition, requiredPlanToViewPosition } = useTraderProfilePermission({ protocol: props.protocol })
  return (
    <Flex flexDirection="column" height="100%" sx={{ minHeight: 0, overflow: 'hidden' }}>
      <Box
        width="100%"
        height={56}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {props.protocolStats}
      </Box>
      {/* {props.protocol && (
        <>
          <TraderDetailsAlertBanner protocol={props.protocol} />
          <Divider />
        </>
      )} */}
      <Box
        width="100%"
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {props.traderInfo}
      </Box>

      <ProtocolPermissionContainer protocol={props.protocol}>
        <Flex
          sx={{
            borderBottom: 'small',
            borderColor: 'neutral4',
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box
            flex="1"
            sx={{
              borderRight: 'small',
              borderColor: 'neutral4',
              minHeight: 0,
            }}
          >
            <Box height="100%">
              {props.apiMode && props.protocol === ProtocolEnum.HYPERLIQUID ? (
                <Flex flexDirection="column" height="100%" sx={{ overflow: 'hidden' }}>
                  {props.traderStatsSummary}
                  <Box flex="1" sx={{ overflowY: 'auto' }}>
                    {props.hyperliquidApiMode}
                  </Box>
                </Flex>
              ) : (
                <Box height="100%">
                  <Flex
                    sx={{
                      width: '100%',
                      height: '100%',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                  >
                    {props.traderStatsSummary}
                    <TabHeader
                      sx={{ py: '3px' }}
                      configs={noPositionsTabConfigs}
                      isActiveFn={(config) => config.key === tab}
                      onClickItem={(key) => setTab({ tab: key })}
                    />

                    <Box height={253}>{tab === TabEnum.CHARTS ? props.traderRanking : props.traderChartPnl}</Box>
                    <Box flex={1} sx={{ overflowY: 'auto', minHeight: 0, maxHeight: '100%' }}>
                      <Flex flexDirection="column" width="100%" height="100%">
                        {tab === TabEnum.CHARTS ? (
                          <Box height="100%" sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
                            {props.traderChartPositions}
                          </Box>
                        ) : (
                          <Box sx={{ pb: 3 }}>{props.traderStats}</Box>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              )}
            </Box>
          </Box>
          <Box flex="1" sx={{ position: 'relative', minHeight: 0 }}>
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
            <Flex flexDirection="column" height="100%" sx={{ minHeight: 0 }}>
              <Box
                height={300}
                sx={{
                  borderBottom: 'small',
                  borderColor: 'neutral4',
                }}
              >
                {props.openingPositions}
              </Box>
              <Box sx={{ position: 'relative' }} flex="1">
                {props.closedPositions}
              </Box>
            </Flex>
          </Box>
        </Flex>
      </ProtocolPermissionContainer>
    </Flex>
  )
}

export default TabletLayout
