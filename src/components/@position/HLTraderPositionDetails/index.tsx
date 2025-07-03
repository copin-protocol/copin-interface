import { memo } from 'react'
import { Link } from 'react-router-dom'

import AddressAvatar from 'components/@ui/AddressAvatar'
import Divider from 'components/@ui/Divider'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { useEnsName } from 'hooks/useEnsName'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Tag from 'theme/Tag'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum, TraderStatusEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten, shortenEnsName } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

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

  const { ensName } = useEnsName(data?.account)

  const explorerUrl = data && data.protocol ? PROTOCOL_PROVIDER[data.protocol]?.explorerUrl : LINKS.arbitrumExplorer

  return (
    <>
      {!data && <NoDataFound />}
      {data && (
        <Box pb={0} sx={{ border: 'small', borderTop: 'none', borderColor: isDrawer ? 'transparent' : 'neutral4' }}>
          <Flex p={12} alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 2 }}>
            <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 12 }}>
              {data.account && <AddressAvatar address={data.account} size={40} />}
              {data.account && (
                <Link
                  to={generateTraderMultiExchangeRoute({ protocol: ProtocolEnum.HYPERLIQUID, address: data.account })}
                >
                  <Button type="button" variant="ghost" sx={{ p: 0 }}>
                    <Flex flexDirection="column" textAlign="left">
                      <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
                        <Type.BodyBold>
                          {ensName ? shortenEnsName(ensName) : addressShorten(data.account)}
                        </Type.BodyBold>
                        <ProtocolLogo
                          protocol={data.protocol}
                          size={24}
                          hasText={false}
                          data-tip="React-tooltip"
                          data-tooltip-id={`tt_protocol_${data.protocol}`}
                          data-tooltip-offset={0}
                        />
                        <Tooltip id={`tt_protocol_${data.protocol}`} clickable={false}>
                          <ProtocolLogo protocol={data.protocol} />
                        </Tooltip>

                        <CopyButton
                          type="button"
                          variant="ghost"
                          value={data.account}
                          size="sm"
                          sx={{ color: 'neutral3', p: 0 }}
                        />
                        <ExplorerLogo protocol={data.protocol} explorerUrl={`${explorerUrl}/address/${data.account}`} />
                      </Flex>
                    </Flex>
                  </Button>
                </Link>
              )}

              {isCopying && <Tag width={70} status={TraderStatusEnum.COPYING} />}
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
