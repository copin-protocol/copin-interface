import { Trans } from '@lingui/macro'
import { BookOpenText, ChartLine, Notebook } from '@phosphor-icons/react'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BlurMask from 'components/@ui/BlurMask'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useTabHandler from 'hooks/router/useTabHandler'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'

import PositionMobileView from './PositionMobileView'
import ProtocolPermissionContainer from './ProtocolPermissionContainer'
import { LayoutProps } from './types'

enum TabEnum {
  STATS = 'stats',
  CHARTS = 'charts',
  POSITIONS = 'positions',
}

const tabConfigs = [
  {
    key: TabEnum.STATS,
    name: <Trans>Stats</Trans>,
    icon: <BookOpenText size={20} />,
    activeIcon: <BookOpenText size={20} weight="fill" />,
  },
  {
    key: TabEnum.CHARTS,
    name: <Trans>Charts</Trans>,
    icon: <ChartLine size={20} />,
    activeIcon: <ChartLine size={20} weight="fill" />,
  },
  {
    key: TabEnum.POSITIONS,
    name: <Trans>Positions</Trans>,
    icon: <Notebook size={20} />,
    activeIcon: <Notebook size={20} weight="fill" />,
  },
]

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
        {tab === TabEnum.STATS && (
          <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
            <Box
              sx={{
                height: 350,
                overflow: 'hidden',
                bg: 'neutral5',
              }}
            >
              {props.traderChartPnl}
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Box>{props.traderStats}</Box>
            </Box>
          </Box>
        )}
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
            configs={tabConfigs}
            isActiveFn={(config) => config.key === tab}
            onClickItem={(key) => setTab({ tab: key })}
          />
        </BottomWrapperMobile>
      </ProtocolPermissionContainer>
    </Flex>
  )
}

export default MobileLayout
