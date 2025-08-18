import { memo } from 'react'

import ChainAccountInfo from 'components/@ui/AccountInfo/ChainAccountInfo'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useTraderCopying from 'hooks/store/useTraderCopying'
import StatusTag from 'theme/Tag/StatusTag'
import { Box, Flex } from 'theme/base'
import { TraderStatusEnum } from 'utils/config/enums'

import HLChartPositionComponent from './HLChartPositionComponent'
import HLPositionStats from './HLPositionStats'
import ListHLOrderTable from './ListHLOrderTable'

const HLTraderPositionDetails = memo(function HLPositionDetailsMemo({
  data,
  orders,
  isDrawer = true,
}: {
  data: PositionData | undefined
  orders?: HlOrderData[]
  isDrawer?: boolean
}) {
  const { isCopying } = useTraderCopying(data?.account, data?.protocol)
  return (
    <>
      {!data && <NoDataFound />}
      {data && (
        <Box pb={0} sx={{ border: 'small', borderTop: 'none', borderColor: isDrawer ? 'transparent' : 'neutral4' }}>
          <Flex p={12} alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 2 }}>
            <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 12 }}>
              <ChainAccountInfo address={data.account} protocol={data.protocol} />
              {isCopying && <StatusTag width={70} status={TraderStatusEnum.COPYING} />}
            </Flex>
            {!isDrawer && <ProtocolLogo size={24} protocol={data.protocol} textSx={{ fontSize: '14px' }} />}
          </Flex>
          <Box mb={3} mx={3}>
            {data && <HLPositionStats data={data} />}
            <Divider isDashed />
            {data && <HLChartPositionComponent data={data} orders={orders} />}
          </Box>

          <Box width="100%" overflow="hidden" sx={{ pt: 12 }}>
            {orders && orders.length > 0 && <ListHLOrderTable data={orders} />}
          </Box>
        </Box>
      )}
    </>
  )
})

export default HLTraderPositionDetails
