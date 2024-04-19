import { useHistory } from 'react-router-dom'

import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolWithChainIcon from 'components/@ui/ProtocolWithChainIcon'
import { ResponseTraderExchangeStatistic, TraderExchangeStatistic } from 'entities/trader'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS, PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { compactNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

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
  // const { searchParams } = useSearchParams()
  const history = useHistory()
  const currentProtocol =
    PROTOCOL_OPTIONS_MAPPING[protocol?.toUpperCase?.() as ProtocolEnum] && protocol?.toUpperCase?.()

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
  const orderedStats = exchangeStats
    ? Object.values(exchangeStats)?.filter((e) => PROTOCOL_OPTIONS.map((e) => e.id)?.includes(e.protocol))
    : []
  orderedStats.sort((x, y) => (y?.lastTradeAtTs ?? 0) - (x?.lastTradeAtTs ?? 0))
  return (
    <Flex
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& > *': { flexShrink: 0 },
      }}
    >
      <Flex
        sx={{ height: '100%', flex: '1', overflow: 'auto hidden', alignItems: 'center', '& > *': { flexShrink: 0 } }}
      >
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
      </Flex>
      {/* <IconBox
        role="button"
        color="neutral3"
        icon={<Icon size={20} />}
        onClick={onClickChangePage}
        sx={{
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          borderLeft: 'small',
          borderLeftColor: 'neutral4',
        }}
        data-tooltip-id={tooltipId}
      />
      <Tooltip id={tooltipId} place="bottom">
        {tooltipContent}
      </Tooltip> */}
    </Flex>
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
  const protocolOption = PROTOCOL_OPTIONS_MAPPING[data.protocol]
  return (
    <Flex
      role="button"
      sx={{ position: 'relative', width: 'max-content', height: '100%', px: 3, alignItems: 'center', gap: 12 }}
      onClick={() => onChangeSelection(data.protocol)}
    >
      <Box sx={{ filter: isActive ? 'none' : 'grayscale(100%)' }}>
        <ProtocolWithChainIcon protocol={data.protocol} />
      </Box>
      <Box>
        <Type.Caption display="block" color={isActive ? 'primary1' : 'neutral3'}>
          {protocolOption?.text}
        </Type.Caption>
        <Type.Small sx={{ display: 'flex', alignItems: 'center', gap: '1ch' }}>
          <Box as="span" color={isActive ? 'neutral1' : 'neutral3'}>
            {compactNumber(data.totalVolume, 2)}{' '}
          </Box>
          <Box as="span" color="neutral3">
            -
          </Box>
          <Box as="span" color="neutral3">
            <RelativeTimeText date={data.lastTradeAt} tooltipLabel="Last Trade: " hasTooltip={false} />
          </Box>
        </Type.Small>
      </Box>
      {isActive && (
        <Box sx={{ width: '100%', height: '2px', bg: 'primary1', position: 'absolute', bottom: '-0px', left: 0 }} />
      )}
    </Flex>
  )
}
