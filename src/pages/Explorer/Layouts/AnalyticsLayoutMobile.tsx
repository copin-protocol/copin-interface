import { useResponsive } from 'ahooks'

import { RouteSwitchProtocol } from 'components/@widgets/SwitchProtocols'
import { Box, Flex } from 'theme/base'

import { AnalyticsLayoutComponents } from './types'

export default function AnalyticsLayoutMobile({
  timeFilterSection,
  listTradersSection,
  conditionFilter,
  sortSection,
}: AnalyticsLayoutComponents) {
  const { md } = useResponsive()
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4', height: 40, px: 3 }}>
        <Flex sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 2 }}>
          {timeFilterSection}
          <Flex sx={{ height: '100%', gap: 3 }}>
            {conditionFilter}
            <Flex sx={{ alignItems: 'center', borderLeft: 'small', borderLeftColor: 'neutral4' }}>{sortSection}</Flex>
          </Flex>
        </Flex>
        {!md && (
          <RouteSwitchProtocol
            componentProps={{
              buttonSx: { height: 40, px: '8px !important', borderLeft: 'small', borderLeftColor: 'neutral4' },
              showIcon: true,
            }}
            keepSearch={false}
          />
        )}
      </Flex>
      <Box sx={{ flex: '1 0 0' }}>{listTradersSection}</Box>
    </Flex>
  )
}
