import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BlurMask from 'components/@ui/BlurMask'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import ProtocolPermissionContainer from './ProtocolPermissionContainer'
import { LayoutProps } from './types'

const TabletLayout = (props: LayoutProps) => {
  const { isEnablePosition, requiredPlanToViewPosition } = useTraderProfilePermission({ protocol: props.protocol })
  return (
    <>
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
          }}
        >
          <Box
            flex="1"
            sx={{
              borderRight: 'small',
              borderColor: 'neutral4',
            }}
          >
            <Box>
              {props.apiMode && props.protocol === ProtocolEnum.HYPERLIQUID ? (
                <Box height="100%">
                  {props.traderStatsSummary}
                  {props.hyperliquidApiMode}
                </Box>
              ) : (
                <Box height="100%">
                  <Flex
                    sx={{
                      width: '100%',
                      height: 300,
                      flexDirection: 'column',
                      overflow: 'hidden',
                      bg: 'neutral5',
                      flexShrink: 0,
                    }}
                  >
                    {props.traderStatsSummary}
                    <Box flex="1 0 0">{props.traderChartPnl}</Box>
                  </Flex>
                  <Box overflow="auto" flex="1 0 0" sx={{ position: 'relative' }} maxHeight={500}>
                    <Box height="100%">{props.traderStats}</Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          <Box flex="1" minHeight={700} sx={{ position: 'relative' }}>
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
            <Flex flexDirection="column" height="100%">
              <Box
                height={300}
                sx={{
                  borderBottom: 'small',
                  borderColor: 'neutral4',
                }}
              >
                {props.openingPositions}
              </Box>
              <Box sx={{ position: 'relative' }} flex="1" maxHeight={500}>
                {props.closedPositions}
              </Box>
            </Flex>
          </Box>
        </Flex>
        {!props.apiMode && (
          <Flex width="100%" height="300px">
            <Flex
              width="400px"
              alignItems="center"
              sx={{
                borderRight: 'small',
                borderColor: 'neutral4',
                flexShrink: 0,
              }}
            >
              {props.traderRanking}
            </Flex>
            <Box width="calc(100% - 350px)">{props.traderChartPositions}</Box>
          </Flex>
        )}
      </ProtocolPermissionContainer>
    </>
  )
}

export default TabletLayout
