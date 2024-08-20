import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { OpenInterestMarketData } from 'entities/statistic'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { TableProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeSupport } from 'utils/config/trades'

import { NoMarketFound } from '../OpenInterestByMarket'
import { getColumns, getRenderProps, titlesMapping } from './configs'

type ListMarketsProps = {
  protocol: ProtocolEnum
  symbol: string | undefined
  timeOption: TimeFilterProps
  isFetching: boolean
  data: OpenInterestMarketData[] | undefined
  currentSort: TableProps<OpenInterestMarketData, any>['currentSort']
  changeCurrentSort: TableProps<OpenInterestMarketData, any>['changeCurrentSort']
}

export function TableForm({
  data,
  isFetching,
  protocol,
  timeOption,
  currentSort,
  changeCurrentSort,
}: ListMarketsProps) {
  const columns = getColumns({ protocol, timeOption })
  // const tokensMapping = TOKEN_TRADE_SUPPORT[protocol]
  // const history = useHistory()
  return (
    <Table
      isLoading={isFetching}
      columns={columns}
      data={data}
      restrictHeight
      tableBodySx={{ 'tr:hover': { '.table_icon': { color: 'neutral1' } } }}
      tableHeadSx={{
        th: {
          pt: 1,
        },
      }}
      currentSort={currentSort}
      changeCurrentSort={changeCurrentSort}
      // onClickRow={(data) => {
      //   const { symbol } = tokensMapping[data.indexToken]
      //   history.push(generateOIByMarketRoute({ protocol, symbol, params: { time: timeOption.id.toString() } }))
      // }}
    />
  )
}

export function ListForm({ data, isFetching, protocol, timeOption, symbol }: ListMarketsProps) {
  const renders = getRenderProps()
  const tokensMapping = getTokenTradeSupport(protocol)
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', '& > *:last-child': { borderBottom: 'none' } },
      }}
    >
      {!isFetching && !data?.length && (
        <NoMarketFound message={symbol && <Trans>{symbol} market data was not found</Trans>} />
      )}
      {isFetching && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      {data?.map((marketData) => {
        const token = tokensMapping[marketData.indexToken]
        if (!token) return null
        const symbol = token.symbol
        return (
          <Box sx={{ p: 3 }} key={marketData.indexToken}>
            <Flex mb={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              {renders.renderMarket(symbol)}
              <Flex sx={{ alignItems: 'center', gap: '0.5ch' }}>
                <Type.Caption color="neutral3">{titlesMapping.total}:</Type.Caption>
                {renders.renderTotalInterest(marketData)}
              </Flex>
            </Flex>
            <FlexBetween mb={1} color="neutral3">
              <Type.Caption>{titlesMapping.longTrades}</Type.Caption>
              <Type.Caption>{titlesMapping.shortTrades}</Type.Caption>
            </FlexBetween>
            <FlexBetween mb={2}>
              <Type.Caption>{renders.renderLongTrades(marketData)}</Type.Caption>
              <Type.Caption>{renders.renderShortTrades(marketData)}</Type.Caption>
            </FlexBetween>
            <FlexBetween mb={1} color="neutral3">
              <Type.Caption>{titlesMapping.longVol}</Type.Caption>
              <Type.Caption>{titlesMapping.shortVol}</Type.Caption>
            </FlexBetween>
            <FlexBetween mb={2}>
              <Type.Caption>{renders.renderLongVolume(marketData)}</Type.Caption>
              <Type.Caption>{renders.renderShortVolume(marketData)}</Type.Caption>
            </FlexBetween>
            <Type.Caption mb={1} color="neutral3">
              {titlesMapping.longShortRate}
            </Type.Caption>
            <Box>{renders.renderLongShortRate(marketData)}</Box>
          </Box>
        )
      })}
    </Flex>
  )
}
const FlexBetween = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`
