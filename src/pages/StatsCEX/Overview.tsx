import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getDepthCEXStatsApi } from 'apis/cexStatsApis'
import { exchangeOptions as copyTradeExchangeOptions } from 'components/@copyTrade/configs'
import Container from 'components/@ui/Container'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Market from 'components/@ui/MarketGroup/Market'
import TraderAddress from 'components/@ui/TraderAddress'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import { FormattedDepthPairData } from 'entities/cexStats'
import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { ALL_TOKEN_PARAM } from 'pages/TopOpenings/configs'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import Select from 'theme/Select'
import Table from 'theme/Table'
import { ColumnData, TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { CopyTradePlatformEnum, CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { TokenOptionProps } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

import DepthPairDetails from './DepthPairDetails'
import ExchangeFilter, { ExchangeFilterProps } from './ExchangeFilter'
import TraderFilter, { TraderFilterProps } from './TraderFilter'

type ExternalSource = {
  totalPairs: number
}

const ALLOW_DEPTH_HISTORIES = [CopyTradePlatformEnum.BINANCE, CopyTradePlatformEnum.BYBIT]
export default function Overview() {
  const { sm } = useResponsive()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPair, setCurrentPair] = useState<FormattedDepthPairData | undefined>()

  const { allCopyTrades } = useAllCopyTrades()
  const copyTraders = [
    ALL_TOKEN_PARAM,
    ...Array.from(
      new Set(
        allCopyTrades
          ?.filter((e) => e.status === CopyTradeStatusEnum.RUNNING)
          ?.flatMap((_c) => [_c.account, ...(_c.accounts || [])])
          ?.filter((e) => !!e)
      )
    ),
  ]
  const traderOptions: TraderFilterProps[] = copyTraders?.map((e) => {
    return {
      id: e,
      value: e,
      label: e === ALL_TOKEN_PARAM ? 'All Traders' : <TraderAddress address={e} />,
    }
  })
  const { currentOption: currentTrader, changeCurrentOption: changeTrader } = useOptionChange({
    optionName: URL_PARAM_KEYS.ACCOUNT,
    options: traderOptions,
  })

  const exchangeOptions: ExchangeFilterProps[] = copyTradeExchangeOptions.map((e) => {
    return {
      id: e.value,
      label: e.label,
      value: e.value,
    }
  })
  const { currentOption: currentExchange, changeCurrentOption: changeExchange } = useOptionChange({
    optionName: URL_PARAM_KEYS.CEX_STATS_DEPTH_EXCHANGE,
    options: exchangeOptions,
  })
  const { data } = useQuery(
    [QUERY_KEYS.GET_CEX_STATS, currentExchange?.id, currentTrader?.id],
    () =>
      getDepthCEXStatsApi({
        exchange: currentExchange.id,
        account: currentTrader?.id === ALL_TOKEN_PARAM ? undefined : currentTrader.id,
      }),
    {
      retry: 0,
      refetchInterval: 60000,
    }
  )

  const pairsOptions: TokenOptionProps[] = useMemo(
    () =>
      data
        ? Object.entries(data).map(([pair]) => {
            const symbol = getSymbolFromPair(pair)
            return {
              id: symbol,
              label: symbol,
              value: symbol,
            }
          })
        : [],
    [data]
  )
  const pairSelectOptions = [
    { id: ALL_TOKEN_PARAM, value: ALL_TOKEN_PARAM, label: 'All Pairs' },
    ...pairsOptions.map((option) => ({ id: option.id, value: option.id, label: <MarketItem symbol={option.id} /> })),
  ]
  const { currentOption: selectedPair, changeCurrentOption: changePairOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.CEX_STATS_DEPTH_PAIR,
    options: pairSelectOptions,
  })
  const [currentSort, setCurrentSort] = useState<TableSortProps<FormattedDepthPairData> | undefined>(() => {
    const initSortBy = '0.1'
    const initSortType = SortTypeEnum.DESC
    if (!initSortBy) return undefined
    return {
      sortBy: initSortBy as TableSortProps<FormattedDepthPairData>['sortBy'],
      sortType: initSortType as SortTypeEnum,
    }
  })

  const formattedData = useMemo(
    () =>
      data
        ? Object.entries(data)
            .map(([pair, pairData]) => {
              const { latestUpdatedAt, data, totalCopyVolume } = pairData
              const depthData = Object.entries(data).reduce((acc: any, [depth, volumeData]) => {
                acc[depth] = {
                  longVolume: volumeData.longVolume,
                  shortVolume: volumeData.shortVolume,
                }
                return acc
              }, {})
              const symbol = getSymbolFromPair(pair)

              return {
                latestUpdatedAt,
                pair,
                totalCopyVolume,
                symbol,
                ...depthData,
              } as FormattedDepthPairData
            })
            .filter((e) => (selectedPair.id === ALL_TOKEN_PARAM ? true : e.symbol === selectedPair.id))
        : undefined,
    [selectedPair.id, data]
  )

  let sortedData: FormattedDepthPairData[] | undefined = Array.isArray(formattedData) ? [] : undefined
  if (formattedData?.length) {
    sortedData = [...formattedData]
    if (sortedData && sortedData.length > 0 && !!currentSort) {
      sortedData.sort((a, b) => {
        let x
        let y
        if (currentSort.sortBy === 'totalCopyVolume') {
          x = a?.totalCopyVolume as any
          y = b?.totalCopyVolume as any
        } else {
          const field = Number(currentSort.sortBy)
          if (field < 0) {
            x = a?.[Math.abs(field)]?.shortVolume as any
            y = b?.[Math.abs(field)]?.shortVolume as any
          } else {
            x = a?.[Math.abs(field)]?.longVolume as any
            y = b?.[Math.abs(field)]?.longVolume as any
          }
        }
        if (currentSort.sortType === SortTypeEnum.ASC) {
          return x < y ? -1 : x > y ? 1 : 0
        } else {
          return x < y ? 1 : x > y ? -1 : 0
        }
      })
    }
  }

  const handleDismiss = () => {
    setOpenDrawer(false)
  }

  const columns = useMemo(() => {
    const result: ColumnData<FormattedDepthPairData, ExternalSource>[] = [
      {
        title: 'Pair',
        dataIndex: 'pair',
        key: 'pair',
        style: { minWidth: '150px' },
        render: (item) => (
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <MarketItem symbol={item.symbol} />
          </Flex>
        ),
      },
      {
        title: '-0.4% Depth',
        dataIndex: '-0.4',
        key: '-0.4',
        sortBy: '-0.4',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="right" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.4'].shortVolume)}>
              {formatNumber(item['0.4'].shortVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '-0.3% Depth',
        dataIndex: '-0.3',
        key: '-0.3',
        sortBy: '-0.3',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="right" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.3'].shortVolume)}>
              {formatNumber(item['0.3'].shortVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '-0.2% Depth',
        dataIndex: '-0.2',
        key: '-0.2',
        sortBy: '-0.2',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="right" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.2'].shortVolume)}>
              {formatNumber(item['0.2'].shortVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '-0.15% Depth',
        dataIndex: '-0.15',
        key: '-0.15',
        sortBy: '-0.15',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="right" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.15'].shortVolume)}>
              {formatNumber(item['0.15'].shortVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '-0.1% Depth',
        dataIndex: '-0.1',
        key: '-0.1',
        sortBy: '-0.1',
        style: { minWidth: '130px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="right" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.1'].shortVolume)}>
              {formatNumber(item['0.1'].shortVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: 'Total Copy Volume',
        dataIndex: 'totalCopyVolume',
        key: 'totalCopyVolume',
        sortBy: 'totalCopyVolume',
        style: { minWidth: '180px', textAlign: 'center', px: 3 },
        render: (item) => (
          <Flex alignItems="center" justifyContent="center" sx={{ gap: 2 }}>
            <Type.CaptionBold color="neutral1">{formatNumber(item.totalCopyVolume, 0)}</Type.CaptionBold>
          </Flex>
        ),
      },
      {
        title: '+0.1% Depth',
        dataIndex: '0.1',
        key: '0.1',
        sortBy: '0.1',
        style: { minWidth: '130px', textAlign: 'left' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.1'].longVolume)}>
              {formatNumber(item['0.1'].longVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '+0.15% Depth',
        dataIndex: '0.15',
        key: '0.15',
        sortBy: '0.15',
        style: { minWidth: '120px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.15'].longVolume)}>
              {formatNumber(item['0.15'].longVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '+0.2% Depth',
        dataIndex: '0.2',
        key: '0.2',
        sortBy: '0.2',
        style: { minWidth: '120px', textAlign: 'left' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.2'].longVolume)}>
              {formatNumber(item['0.2'].longVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '+0.3% Depth',
        dataIndex: '0.3',
        key: '0.3',
        sortBy: '0.3',
        style: { minWidth: '120px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.3'].longVolume)}>
              {formatNumber(item['0.3'].longVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
      {
        title: '+0.4% Depth',
        dataIndex: '0.4',
        key: '0.4',
        sortBy: '0.4',
        style: { minWidth: '120px' },
        render: (item) => (
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color={getRiskColor(item.totalCopyVolume, item['0.4'].longVolume)}>
              {formatNumber(item['0.4'].longVolume, 0)}
            </Type.Caption>
          </Flex>
        ),
      },
    ]
    return result
  }, [])

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Box>
        <Type.H5 color="neutral8" maxWidth="fit-content" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
          <Trans>CEX Depth</Trans>
        </Type.H5>
        <Flex
          mt={3}
          flexDirection={['column', 'row']}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{ gap: 3 }}
        >
          <Flex
            alignItems="center"
            flexWrap="wrap"
            sx={{
              gap: 3,
              '.select__control': {
                width: 140,
              },
            }}
          >
            <ExchangeFilter
              options={exchangeOptions}
              currentFilter={currentExchange}
              handleFilterChange={changeExchange}
            />
            <VerticalDivider />
            <Box
              sx={{
                '.select__control': {
                  width: 200,
                  input: { width: '80px !important', margin: '0 !important' },
                },
              }}
            >
              <Select
                value={selectedPair}
                options={pairSelectOptions}
                onChange={(newValue: any) => {
                  changePairOption(newValue as TokenOptionProps)
                }}
              />
            </Box>
            <VerticalDivider />
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Type.Caption color="neutral3">Latest Updated At:</Type.Caption>
              {!!formattedData?.length && (
                <Type.CaptionBold color="neutral1">
                  <LocalTimeText
                    date={formattedData[0].latestUpdatedAt}
                    format={DAYJS_FULL_DATE_FORMAT}
                    hasTooltip={false}
                  />
                </Type.CaptionBold>
              )}
            </Flex>
          </Flex>
          {!!allCopyTrades?.length && (
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Type.Caption color="neutral3">Your Copying Traders:</Type.Caption>
              <TraderFilter options={traderOptions} currentFilter={currentTrader} handleFilterChange={changeTrader} />
            </Flex>
          )}
        </Flex>
      </Box>
      <Box
        mt={3}
        sx={{
          flex: '1 0 0',
          overflowX: 'auto',
          border: 'small',
          borderColor: 'neutral4',
        }}
      >
        <Table
          restrictHeight
          isLoading={false}
          columns={columns}
          data={sortedData}
          tableBodySx={{ 'tr:hover': { '.table_icon': { color: 'neutral1' } } }}
          tableHeadSx={{
            th: {
              pt: 1,
            },
          }}
          currentSort={currentSort}
          changeCurrentSort={setCurrentSort}
          onClickRow={
            ALLOW_DEPTH_HISTORIES.includes(currentExchange.id)
              ? (data) => {
                  setOpenDrawer(true)
                  setCurrentPair(data)
                }
              : undefined
          }
        />
      </Box>
      {openDrawer && currentPair && (
        <Drawer
          isOpen={openDrawer}
          onDismiss={handleDismiss}
          mode="right"
          size={sm ? '75%' : '100%'}
          background="neutral6"
        >
          <Container sx={{ position: 'relative' }}>
            <IconButton
              icon={<XCircle size={24} />}
              variant="ghost"
              sx={{ position: 'absolute', right: 1, top: 3 }}
              onClick={handleDismiss}
            />
            <DepthPairDetails depthPair={currentPair} exchange={currentExchange.id} />
          </Container>
        </Drawer>
      )}
    </Flex>
  )
}

function MarketItem({ symbol }: { symbol: string }) {
  return (
    <Flex sx={{ gap: 1, alignItems: 'center' }}>
      <Flex
        width={24}
        height={24}
        sx={{
          borderRadius: 12,
          overflow: 'hidden',
          border: 'small',
          borderColor: 'neutral4',
          backgroundColor: 'neutral1',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Market symbol={symbol} size={24} />
      </Flex>
      <Type.Caption>{symbol}</Type.Caption>
    </Flex>
  )
}

function getRiskColor(totalCopyVolume: number, depthVolume: number) {
  if (totalCopyVolume > depthVolume) return 'red1'
  return 'neutral1'
}

function getSymbolFromPair(pair: string) {
  return pair.includes('-')
    ? pair.split('-')[0]
    : pair.includes('USDTM')
    ? pair.split('USDTM')[0]
    : pair.includes('USDCM')
    ? pair.split('USDCM')[0]
    : pair
}
