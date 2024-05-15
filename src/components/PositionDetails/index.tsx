import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPositionDetailByIdApi } from 'apis/positionApis'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfileStore from 'hooks/store/useMyProfile'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Loading from 'theme/Loading'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum, TraderStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import ChartProfit from './ChartProfit'
import ListOrderTable from './ListOrderTable'
import PositionStats from './PositionStats'
import { getOrderData } from './helper'

export default function PositionDetails({
  protocol,
  id,
  isShow,
  isDrawer = true,
}: {
  protocol: ProtocolEnum
  id: string
  isShow?: boolean
  isDrawer?: boolean
}) {
  const { searchParams } = useSearchParams()
  const highlightTxHash = searchParams?.[URL_PARAM_KEYS.HIGHLIGHT_TX_HASH] as string | undefined

  const myProfile = useMyProfileStore((_s) => _s.myProfile)
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_POSITION_DETAIL, id, protocol, myProfile?.id],
    () => getPositionDetailByIdApi({ protocol, id }),
    {
      enabled: !!id,
      retry: 0,
      select(data) {
        const orders = getOrderData({
          isOpening: data.status === PositionStatusEnum.OPEN,
          protocol: data.protocol,
          orderData: data.orders,
        })
        return { ...data, orders }
      },
    }
  )

  const { isCopying } = useTraderCopying(data?.account, data?.protocol)

  const explorerUrl = data && data.protocol ? PROTOCOL_PROVIDER[data.protocol]?.explorerUrl : LINKS.arbitrumExplorer

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && !data && <NoDataFound />}
      {data && (
        <Box pb={0} sx={{ border: 'small', borderTop: 'none', borderColor: isDrawer ? 'transparent' : 'neutral4' }}>
          <Flex p={12} alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 2 }}>
            <Flex alignItems="center" sx={{ gap: 12 }}>
              <AddressAvatar address={data.account} size={40} />
              <Link to={generateTraderMultiExchangeRoute({ protocol, address: data.account })}>
                <Button type="button" variant="ghost" sx={{ p: 0 }}>
                  <Flex flexDirection="column" textAlign="left">
                    <Type.BodyBold>{addressShorten(data.account)}</Type.BodyBold>
                    <Type.Caption color="neutral3">
                      <BalanceText protocol={data.protocol} account={data.account} />
                    </Type.Caption>
                  </Flex>
                </Button>
              </Link>
              <CopyButton
                type="button"
                variant="ghost"
                value={data.account}
                size="sm"
                sx={{ color: 'neutral3', p: 0 }}
              ></CopyButton>
              <ExplorerLogo protocol={data.protocol} explorerUrl={`${explorerUrl}/address/${data.account}`} />
              {isCopying && <Tag width={70} status={TraderStatusEnum.COPYING} />}
            </Flex>
            {!isDrawer && <ProtocolLogo size={24} protocol={data.protocol} textSx={{ fontSize: '14px' }} />}
          </Flex>
          <Box
            bg="neutral7"
            mb={3}
            mx={3}
            px={isDrawer ? 12 : 0}
            sx={{
              borderRadius: '2px',
              border: isDrawer ? 'small' : 'none',
              borderTop: 'small',
              borderColor: 'neutral4',
            }}
          >
            <PositionStats data={data} />
            {data && <ChartProfit data={data} protocol={protocol} isShow={isShow} />}
          </Box>

          <Box width="100%" overflow="hidden" sx={{ pt: 12 }}>
            {data.orders && data.orders.length > 0 && (
              <ListOrderTable
                protocol={data.protocol}
                data={data.orders}
                isLoading={isLoading}
                highlightTxHash={highlightTxHash}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  )
}
