import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BlurMask from 'components/@ui/BlurMask'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useTabHandler from 'hooks/router/useTabHandler'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

import PositionMobileView from './PositionMobileView'
import ProtocolPermissionContainer from './ProtocolPermissionContainer'
import { TabEnum, noChartsTabConfigs, tabConfigs } from './tabConfigs'
import { LayoutProps } from './types'

const MobileLayout = (props: LayoutProps) => {
  const { tab, handleTab: setTab } = useTabHandler({ defaultTab: TabEnum.POSITIONS })
  const { isEnablePosition, requiredPlanToViewPosition } = useTraderProfilePermission({ protocol: props.protocol })
  return (
    <Flex sx={{ position: 'relative', pb: FOOTER_HEIGHT, height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      <Box
        width="100%"
        height={56}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          position: 'sticky',
          top: 0,
          bg: 'neutral7',
          zIndex: 99,
        }}
      >
        {props.protocolStats}
      </Box>
      {/* {!!props.protocol && (
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
          position: 'sticky',
          top: 56,
          bg: 'neutral7',
          zIndex: 98,
        }}
      >
        {props.traderInfo}
      </Box>
      <ProtocolPermissionContainer protocol={props.protocol}>
        {tab === TabEnum.STATS &&
          (props.protocol === ProtocolEnum.HYPERLIQUID && props.apiMode ? (
            <Flex flexDirection="column" flex="1 0 0" sx={{ overflow: 'auto' }}>
              {props.traderStatsSummary}
              <Box flex={1}>{props.hyperliquidApiMode}</Box>
            </Flex>
          ) : (
            <Box flex="1 0 0" sx={{ overflowY: 'auto' }}>
              {props.traderStatsSummary}
              <Box
                sx={{
                  height: 300,
                  overflow: 'hidden',
                  bg: 'neutral5',
                }}
              >
                {props.traderChartPnl}
              </Box>
              <Box sx={{ position: 'relative', overflow: 'auto' }}>
                <Box>{props.traderStats}</Box>
              </Box>
            </Box>
          ))}
        {tab === TabEnum.CHARTS && (
          <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
            <Box
              height={270}
              sx={{
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              {props.traderRanking}
            </Box>
            <Box height="max(calc(100% - 270px), 330px)" bg="neutral5">
              {props.traderChartPositions}
            </Box>
          </Box>
        )}
        {tab === TabEnum.POSITIONS && (
          <Box flex="1 0 0" sx={{ position: 'relative' }}>
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
            <PositionMobileView
              openingPositions={props.openingPositions}
              historyPositions={props.closedPositions}
              protocol={props.protocol}
              address={props.address}
            />
          </Box>
        )}
        <BottomWrapperMobile
          sx={{ position: 'fixed', bottom: FOOTER_HEIGHT, zIndex: 9, display: ['flex', 'flex', 'flex', 'none'] }}
        >
          <TabHeader
            configs={props.apiMode && props.protocol === ProtocolEnum.HYPERLIQUID ? noChartsTabConfigs : tabConfigs}
            isActiveFn={(config) => config.key === tab}
            onClickItem={(key) => setTab({ tab: key })}
          />
        </BottomWrapperMobile>
      </ProtocolPermissionContainer>
    </Flex>
  )
}

export default MobileLayout
