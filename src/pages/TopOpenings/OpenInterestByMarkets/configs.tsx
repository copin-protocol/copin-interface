import { DifferentialBar } from 'components/@ui/DifferentialBar'
import { ColumnData } from 'components/@ui/Table/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { OpenInterestMarketData } from 'entities/statistic'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { parseMarketImage } from 'utils/helpers/transform'

const renderMarket = (symbol: string) => {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      <Image src={parseMarketImage(symbol)} sx={{ width: 32, height: 32 }} />
      <Type.Caption color="neutral1">{symbol}</Type.Caption>
    </Flex>
  )
}
const renderPrice = (item: OpenInterestMarketData) => {
  return (
    <>
      {renderValueWithChange({
        current: item?.price,
        latest: item?.latestPrice,
        maxDigit: 2,
        minDigit: 2,
        isOnlyPercent: true,
      })}
    </>
  )
}
const renderTotalInterest = (item: OpenInterestMarketData) => {
  return (
    <>
      {renderValueWithChange({
        current: (item?.totalVolumeLong ?? 0) + (item?.totalVolumeShort ?? 0),
        latest: (item?.latestStat?.totalVolumeLong ?? 0) + (item?.latestStat?.totalVolumeShort ?? 0),
        maxDigit: 0,
        prefix: '$',
        isCompact: true,
      })}
    </>
  )
}
const renderLongTrades = (item: OpenInterestMarketData) => {
  return (
    <>
      {renderValueWithChange({
        current: item?.totalLong,
        latest: item?.latestStat?.totalLong,
      })}
    </>
  )
}
const renderShortTrades = (item: OpenInterestMarketData) => {
  return (
    <>
      {renderValueWithChange({
        current: item?.totalShort,
        latest: item?.latestStat?.totalShort,
      })}
    </>
  )
}
const renderLongVolume = (item: OpenInterestMarketData) => {
  return (
    <>
      {renderValueWithChange({
        current: item?.totalVolumeLong,
        latest: item?.latestStat?.totalVolumeLong,
        maxDigit: 0,
        prefix: '$',
        isCompact: true,
      })}
    </>
  )
}
const renderShortVolume = (item: OpenInterestMarketData) => {
  return (
    <>
      {renderValueWithChange({
        current: item?.totalVolumeShort,
        latest: item?.latestStat?.totalVolumeShort,
        maxDigit: 0,
        prefix: '$',
        isCompact: true,
      })}
    </>
  )
}

function calcLongShortRate(totalVolumeLong: number, totalVolumeShort: number) {
  const totalVolume = (totalVolumeLong ?? 0) + (totalVolumeShort ?? 0)
  const longRateMulti100 = totalVolume ? Math.round((totalVolumeLong / totalVolume) * 10000) : 0
  const shortRateMulti100 = 10000 - longRateMulti100
  const longRate = longRateMulti100 / 100
  const shortRate = shortRateMulti100 / 100
  return { longRate, shortRate }
}

const renderLongShortRate = (item: OpenInterestMarketData) => {
  if (!item?.totalVolumeLong && !item?.totalVolumeShort) return '--'
  const { longRate, shortRate } = calcLongShortRate(item?.totalVolumeLong, item?.totalVolumeShort)
  const { longRate: longRateLatest, shortRate: shortRateLatest } = calcLongShortRate(
    item?.latestStat?.totalVolumeLong,
    item?.latestStat?.totalVolumeShort
  )
  const diffLongRate = !!longRateLatest ? longRate - longRateLatest : 0
  const diffShortRate = !!shortRateLatest ? shortRate - shortRateLatest : 0
  return (
    <Flex flexDirection="column" sx={{ gap: 2 }}>
      <Box flex="1" sx={{ transform: 'translateY(1px)' }}>
        <DifferentialBar sourceRate={longRate} targetRate={shortRate} />
      </Box>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Type.Caption
          lineHeight="10px"
          color={longRate > shortRate ? 'neutral1' : 'neutral3'}
          sx={{ flexShrink: 0, textAlign: ['left', 'left', 'right'] }}
        >
          {formatNumber(longRate, 2, 2)}%
          {longRate > shortRate && !!diffLongRate && (
            <Type.Small px={1} fontSize="11px" color="green2" display={['none', 'inline-block']}>
              <Type.Small color="neutral3">(</Type.Small>
              {diffLongRate === 0 ? '--' : `${formatNumber(Math.abs(diffLongRate), 2, 2)}%`}
              <Type.Small color="neutral3">)</Type.Small>
            </Type.Small>
          )}
        </Type.Caption>
        <Type.Caption
          lineHeight="10px"
          color={shortRate > longRate ? 'neutral1' : 'neutral3'}
          sx={{ flexShrink: 0, textAlign: ['right', 'right', 'left'] }}
        >
          {shortRate > longRate && !!diffShortRate && (
            <Type.Small px={1} fontSize="11px" color="green2" display={['none', 'inline-block']}>
              <Type.Small color="neutral3">(</Type.Small>
              {diffShortRate === 0 ? '--' : `${formatNumber(Math.abs(diffShortRate), 2, 2)}%`}
              <Type.Small color="neutral3">)</Type.Small>
            </Type.Small>
          )}
          {formatNumber(shortRate, 2, 2)}%
        </Type.Caption>
      </Flex>
    </Flex>
  )
}

const renderValueWithChange = ({
  current,
  latest,
  maxDigit,
  minDigit,
  prefix = '',
  suffix = '',
  isOnlyPercent,
  isCompact,
}: {
  current?: number
  latest?: number
  maxDigit?: number
  minDigit?: number
  prefix?: string
  suffix?: string
  isOnlyPercent?: boolean
  isCompact?: boolean
}) => {
  const diff = (current ?? 0) - (latest ?? 0)
  const diffPercent = !!latest ? (diff / latest) * 100 : diff === 0 ? 0 : 100
  return (
    <Flex flexDirection="column" justifyContent="flex-end">
      <Type.Caption color="neutral1">
        {prefix}
        {formatNumber(current, maxDigit, minDigit)}
        {suffix}
      </Type.Caption>
      <Flex alignItems="center" sx={{ gap: 1 }} justifyContent="flex-end">
        {!isOnlyPercent && (
          <Type.Small
            fontSize="11px"
            color={diff > 0 ? 'green2' : diff < 0 ? 'red1' : 'neutral3'}
            display={['none', 'block']}
          >
            {diff > 0 ? '+' : diff < 0 ? '-' : ''}
            {prefix && !!diff ? prefix : ''}
            {diff === 0
              ? '--'
              : isCompact
              ? compactNumber(Math.abs(diff), 1)
              : formatNumber(Math.abs(diff), maxDigit, minDigit)}
          </Type.Small>
        )}
        {!!diffPercent && (
          <Type.Small
            fontSize="11px"
            color={diffPercent > 0 ? 'green2' : diffPercent < 0 ? 'red1' : 'neutral3'}
            display={['none', 'block']}
          >
            {!isOnlyPercent && <Type.Small color="neutral3">(</Type.Small>}
            {diffPercent === 0 ? '--' : `${formatNumber(Math.abs(diffPercent), 2, 2)}%`}
            {!isOnlyPercent && <Type.Small color="neutral3">)</Type.Small>}
          </Type.Small>
        )}
      </Flex>
    </Flex>
  )
}

export function getRenderProps() {
  return {
    renderMarket,
    renderPrice,
    renderTotalInterest,
    renderLongTrades,
    renderShortTrades,
    renderLongVolume,
    renderShortVolume,
    renderLongShortRate,
  }
}

export const titlesMapping = {
  market: 'Market',
  total: 'Total Interest',
  longTrades: 'Long Trades',
  shortTrades: 'Short Trades',
  longVol: 'Long Volume',
  shortVol: 'Short Volume',
  longShortRate: 'Skew',
}

export function getColumns({ protocol, timeOption }: { protocol: ProtocolEnum; timeOption: TimeFilterProps }) {
  const tokenTradeSupport = TOKEN_TRADE_SUPPORT[protocol]
  const columns: ColumnData<OpenInterestMarketData>[] = [
    {
      title: <Box pl={2}>{titlesMapping.market}</Box>,
      dataIndex: 'indexToken',
      key: 'indexToken',
      style: { minWidth: '120px' },
      render: (item) => {
        const { symbol } = tokenTradeSupport?.[item.indexToken] ?? {}
        if (!symbol) return <></>
        return <Box pl={2}>{renderMarket(symbol)}</Box>
      },
    },
    {
      title: (
        <Flex as="span" justifyContent="flex-end" pr={2}>
          <Box as="span" textAlign="right">
            Price
          </Box>
        </Flex>
      ),
      dataIndex: 'price',
      key: 'price',
      style: { minWidth: '120px', textAlign: 'right' },
      render: renderPrice,
    },
    {
      title: titlesMapping.total,
      dataIndex: undefined,
      key: undefined,
      sortBy: 'totalInterest',
      style: { minWidth: '120px', textAlign: 'right' },
      render: renderTotalInterest,
    },
    {
      title: titlesMapping.longTrades,
      dataIndex: 'totalLong',
      key: 'totalLong',
      sortBy: 'totalLong',
      style: { minWidth: '120px', textAlign: 'right' },
      render: renderLongTrades,
    },
    {
      title: titlesMapping.shortTrades,
      dataIndex: 'totalShort',
      key: 'totalShort',
      sortBy: 'totalShort',
      style: { minWidth: '120px', textAlign: 'right' },
      render: renderShortTrades,
    },
    {
      title: titlesMapping.longVol,
      dataIndex: 'totalVolumeLong',
      key: 'totalVolumeLong',
      sortBy: 'totalVolumeLong',
      style: { minWidth: '120px', textAlign: 'right' },
      render: renderLongVolume,
    },
    {
      title: titlesMapping.shortVol,
      dataIndex: 'totalVolumeShort',
      key: 'totalVolumeShort',
      sortBy: 'totalVolumeShort',
      style: { minWidth: '120px', textAlign: 'right' },
      render: renderShortVolume,
    },
    {
      title: titlesMapping.longShortRate,
      dataIndex: undefined,
      key: undefined,
      style: { minWidth: '200px', maxWidth: '250px', textAlign: 'left', px: 3 },
      render: renderLongShortRate,
    },
    // {
    //   title: <Box sx={{ width: '40px' }}></Box>,
    //   dataIndex: undefined,
    //   key: undefined,
    //   style: { width: '40px', maxWidth: '40px', textAlign: 'right', pr: 3 },
    //   render: () => {
    //     return <IconBox className="table_icon" icon={<CaretRight size={16} />} />
    //   },
    // },
  ]

  return columns
}
