import { useHistory } from 'react-router-dom'

import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import HorizontalScroll from 'components/@ui/HorizontalScroll'
import { ResponseTraderExchangeStatistic, TraderExchangeStatistic } from 'entities/trader'
import useGetProtocolOptions, { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { compactNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import ProtocolBetaWarning from './ProtocolBetaWarning'

export default function ProtocolStats({
  page,
  exchangeStats,
  address,
  protocol,
}: {
  page: 'details' | 'stats'
  exchangeStats: ResponseTraderExchangeStatistic
  address: string
  protocol: ProtocolEnum
}) {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const history = useHistory()
  const currentProtocol = protocolOptionsMapping[protocol?.toUpperCase?.() as ProtocolEnum] && protocol?.toUpperCase?.()

  // const paramProtocol = protocol.toLocaleLowerCase() as unknown as ProtocolEnum
  const onChangeSelection = (protocol: ProtocolEnum) => {
    const _paramProtocol = protocol.toLocaleLowerCase() as unknown as ProtocolEnum
    history.push(generateTraderMultiExchangeRoute({ address, protocol: _paramProtocol }))
  }
  // const Icon = page === 'details' ? GridFour : Stack
  // const tooltipId = 'tt_trader_detail_multiple_exchange'
  // const tooltipContent = page === 'details' ? 'Exchanges Compare' : 'Back to details'
  // const onClickChangePage = () => {
  //   page === 'details'
  //     ? history.push(
  //         generateTraderExchangesStatsRoute({
  //           address,
  //           protocol: paramProtocol,
  //           params: searchParams,
  //         })
  //       )
  //     : history.push(
  //         generateTraderMultiExchangeRoute({
  //           address,
  //           protocol: paramProtocol,
  //           params: searchParams,
  //         })
  //       )
  // }
  const protocolOptions = useGetProtocolOptions()
  const orderedStats = exchangeStats
    ? Object.values(exchangeStats)?.filter((e) => protocolOptions.map((e) => e.id)?.includes(e.protocol))
    : []
  orderedStats.sort((x, y) => (y?.lastTradeAtTs ?? 0) - (x?.lastTradeAtTs ?? 0))
  const currentPage = orderedStats.findIndex((s) => s.protocol === currentProtocol)

  return (
    <Box
      sx={{
        '.no-scroll': {
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        },
      }}
    >
      <HorizontalScroll defaultItem={currentPage}>
        {orderedStats.map((values) => {
          return (
            <StatsItem
              key={values.id}
              data={values}
              onChangeSelection={onChangeSelection}
              isActive={currentProtocol === values.protocol}
            />
          )
        })}
      </HorizontalScroll>
    </Box>
  )
}

function StatsItem({
  data,
  isActive,
  onChangeSelection,
}: {
  data: TraderExchangeStatistic
  isActive: boolean
  onChangeSelection: (protocol: ProtocolEnum) => void
}) {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const protocolOption = protocolOptionsMapping[data.protocol]
  return (
    <Flex
      role="button"
      sx={{ position: 'relative', width: 'max-content', height: '100%', px: 3, py: 2, alignItems: 'center', gap: 12 }}
      onClick={() => onChangeSelection(data.protocol)}
    >
      <Box>
        <Image src={getProtocolStatsImage({ protocol: protocolOption.id, isActive })} width={32} height={32} />
      </Box>
      <Box>
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.Body display="block" color={isActive ? 'primary1' : 'neutral3'} sx={{ textTransform: 'uppercase' }}>
            {protocolOption?.text}
          </Type.Body>
          <ProtocolBetaWarning protocol={data.protocol} />
        </Flex>
        <Type.Caption sx={{ display: 'flex', alignItems: 'center', gap: '1ch', textTransform: 'uppercase' }}>
          <Box as="span" color={isActive ? 'neutral1' : 'neutral3'}>
            {compactNumber(data.totalVolume, 2)}{' '}
          </Box>
          <Box as="span" color="neutral3">
            -
          </Box>
          <Box as="span" color="neutral3">
            <RelativeTimeText date={data.lastTradeAt} tooltipLabel="Last Trade: " hasTooltip={false} />
          </Box>
        </Type.Caption>
      </Box>
      {isActive && (
        <Box sx={{ width: '100%', height: '2px', bg: 'primary1', position: 'absolute', bottom: '-0px', left: 0 }} />
      )}
    </Flex>
  )
}

function getProtocolStatsImage({ protocol, isActive }: { protocol: ProtocolEnum; isActive: boolean }) {
  return `/images/protocols_with_status/${protocol}-${isActive ? 'active' : 'inactive'}.png`
}
