import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'

import { DifferentialBar } from 'components/@ui/DifferentialBar'
import { ColumnData } from 'components/@ui/Table/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { OpenInterestMarketData } from 'entities/statistic'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'
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
  const diffPercent = !!item?.latestPrice ? (((item?.price ?? 0) - item.latestPrice) / item.latestPrice) * 100 : 0
  return (
    <Type.Caption color="neutral1" sx={{ display: 'flex', gap: '1ch', '& *': { display: 'inline-block', flex: 1 } }}>
      <Box as="span" textAlign="right">
        {formatNumber(item?.price, 2, 2)}
      </Box>
      <Box as="span" textAlign="left" color={diffPercent > 0 ? 'green2' : diffPercent < 0 ? 'red2' : 'inherit'}>
        ({formatNumber(diffPercent, 2, 2)}%)
      </Box>
    </Type.Caption>
  )
}
const renderTotalInterest = (item: OpenInterestMarketData) => {
  return <Type.Caption color="neutral1">{formatNumber((item?.totalLong ?? 0) + (item?.totalShort ?? 0))} </Type.Caption>
}
const renderLongTrades = (item: OpenInterestMarketData) => {
  return <Type.Caption color="neutral1">{formatNumber(item?.totalLong ?? 0)} </Type.Caption>
}
const renderShortTrades = (item: OpenInterestMarketData) => {
  return <Type.Caption color="neutral1">{formatNumber(item?.totalShort ?? 0)} </Type.Caption>
}
const renderLongVolume = (item: OpenInterestMarketData) => {
  return <Type.Caption color="neutral1">${formatNumber(item?.totalVolumeLong ?? 0, 0, 0)} </Type.Caption>
}
const renderShortVolume = (item: OpenInterestMarketData) => {
  return <Type.Caption color="neutral1">${formatNumber(item?.totalVolumeShort ?? 0, 0, 0)} </Type.Caption>
}
const renderLongShortRate = (item: OpenInterestMarketData) => {
  if (!item?.totalVolumeLong && !item?.totalVolumeShort) return '--'
  const totalVolume = (item.totalVolumeLong ?? 0) + (item.totalVolumeShort ?? 0)
  const longRateMulti100 = Math.round((item.totalVolumeLong / totalVolume) * 10000)
  const shortRateMulti100 = 10000 - longRateMulti100
  const longRate = longRateMulti100 / 100
  const shortRate = shortRateMulti100 / 100
  return (
    <Flex sx={{ alignItems: 'center', gap: 1 }}>
      <Type.Caption color={longRate > shortRate ? 'neutral1' : 'neutral3'} sx={{ flexShrink: 0 }}>
        {longRate}%
      </Type.Caption>
      <DifferentialBar sourceRate={longRate} targetRate={shortRate} />
      <Type.Caption color={shortRate > longRate ? 'neutral1' : 'neutral3'} sx={{ flexShrink: 0 }}>
        {shortRate}%
      </Type.Caption>
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
  longShortRate: 'Long/Short Rate',
}

export function getColumns({ protocol, timeOption }: { protocol: ProtocolEnum; timeOption: TimeFilterProps }) {
  const tokenTradeSupport = TOKEN_TRADE_SUPPORT[protocol]
  const columns: ColumnData<OpenInterestMarketData>[] = [
    {
      title: titlesMapping.market,
      dataIndex: 'indexToken',
      key: 'indexToken',
      style: { minWidth: '120px' },
      render: (item) => {
        const { symbol } = tokenTradeSupport?.[item.indexToken]
        return renderMarket(symbol)
      },
    },
    {
      title: (
        <Flex as="span" sx={{ width: '100%', gap: '1ch', '& *': { display: 'inline-block', flex: 1 } }}>
          <Box as="span" textAlign="right">
            Price
          </Box>
          <Box as="span" textAlign="left">
            <Trans>(24h change)</Trans>
          </Box>
        </Flex>
      ),
      dataIndex: 'price',
      key: 'price',
      style: { minWidth: '250px', textAlign: 'center' },
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
      style: { minWidth: '200px', maxWidth: '250px', textAlign: 'left', pl: 3 },
      render: renderLongShortRate,
    },
    {
      title: <Box sx={{ width: '40px' }}></Box>,
      dataIndex: undefined,
      key: undefined,
      style: { width: '40px', maxWidth: '40px', textAlign: 'right', pr: 3 },
      render: () => {
        return <IconBox className="table_icon" icon={<CaretRight size={16} />} />
      },
    },
  ]

  return columns
}
