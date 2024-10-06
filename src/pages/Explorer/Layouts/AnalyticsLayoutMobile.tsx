import { useResponsive } from 'ahooks'

import { ProtocolFilter } from 'components/@ui/ProtocolFilter'
import { RouteSwitchProtocol } from 'components/@widgets/SwitchProtocols'
import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { Box, Flex } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'

import useTradersContext from '../useTradersContext'
import { AnalyticsLayoutComponents } from './types'

export default function AnalyticsLayoutMobile({
  timeFilterSection,
  listTradersSection,
  conditionFilter,
  sortSection,
}: AnalyticsLayoutComponents) {
  const { selectedProtocols, checkIsProtocolChecked, handleToggleProtocol, setSelectedProtocols } = useTradersContext()
  const { md } = useResponsive()
  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS
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
          <ProtocolFilter
            selectedProtocols={selectedProtocols}
            checkIsProtocolChecked={checkIsProtocolChecked}
            handleToggleProtocol={handleToggleProtocol}
            setSelectedProtocols={setSelectedProtocols}
            allowList={allowList}
          />
        )}
      </Flex>
      <Box sx={{ flex: '1 0 0' }}>{listTradersSection}</Box>
    </Flex>
  )
}
