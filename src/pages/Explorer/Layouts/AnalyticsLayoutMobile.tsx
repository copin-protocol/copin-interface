import { useResponsive } from 'ahooks'

import { HomeSwitchProtocols } from 'components/SwitchProtocols'
import { Box, Flex } from 'theme/base'

import { AnalyticsLayoutComponents } from './types'

export default function AnalyticsLayoutMobile({
  timeFilterSection,
  listTradersSection,
  conditionFilter,
}: AnalyticsLayoutComponents) {
  const { md, lg } = useResponsive()
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, px: 3, gap: 2 }}>
          {timeFilterSection}
          {conditionFilter}
        </Flex>
        {md && !lg ? (
          <Box height={40} />
        ) : (
          <HomeSwitchProtocols buttonSx={{ borderBottom: 'none', borderRight: 'none' }} />
        )}
      </Flex>
      <Box sx={{ flex: '1 0 0' }}>{listTradersSection}</Box>
    </Flex>
  )
}
