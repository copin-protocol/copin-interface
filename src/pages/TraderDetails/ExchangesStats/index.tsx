import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getTraderExchangeStatistic, getTraderMultiExchangeStatistic, getTraderStatisticApi } from 'apis/traderApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import MarketGroup from 'components/@ui/MarketGroup'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import ChartTraderPnL from 'components/Charts/ChartTraderPnL'
import { parsePnLStatsData } from 'components/Charts/ChartTraderPnL/helpers'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import Loading from 'theme/Loading'
import { Box, Flex, Grid, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { isAddress } from 'utils/web3/contracts'

import ProtocolStats from '../ProtocolStats'
import TraderActionButtons from '../TraderActionButtons'
import TraderInfo from '../TraderInfo'

// use as page
export default function ExchangesStats() {
  const { address: _address, protocol: _protocol } = useParams<{ address: string; protocol: ProtocolEnum }>()
  const address = isAddress(_address)
  const protocol = _protocol.split('-')[0].toUpperCase() as ProtocolEnum
  const myProfile = useMyProfileStore((state) => state.myProfile)

  const { isPremiumUser, checkIsPremium } = useIsPremiumAndAction()
  const timeFilterOptions = TIME_FILTER_OPTIONS.filter((e) => e.id !== TimeFilterByEnum.ALL_TIME)
  const { currentOption: timeOption, changeCurrentOption } = useOptionChange({
    optionName: URL_PARAM_KEYS.EXPLORER_TIME_FILTER,
    options: timeFilterOptions,
    defaultOption: timeFilterOptions[1].id as unknown as string,
  })

  const setTimeOption = (option: TimeFilterProps) => {
    if (option.id === TimeFilterByEnum.ALL_TIME && !checkIsPremium()) return
    changeCurrentOption(option)
  }

  const { data: traderData, isLoading: isLoadingTraderData } = useQuery(
    [QUERY_KEYS.GET_TRADER_DETAIL, address, protocol, isPremiumUser],
    () => getTraderStatisticApi({ protocol, account: address }),
    {
      keepPreviousData: true,
      enabled: !!address,
      retry: 0,
      select: (data) =>
        timeFilterOptions
          .map((option) => {
            return data[option.id]
          })
          .reverse(),
    }
  )

  const currentTraderData = traderData?.find((item) => (item?.type as string) === (timeOption.id as unknown as string))

  const { data: exchangeStats, isLoading: isLoadingExchangeStats } = useQuery(
    [QUERY_KEYS.GET_TRADER_EXCHANGE_STATISTIC, address],
    () => getTraderExchangeStatistic({ account: address }),
    { keepPreviousData: true }
  )

  const { data: multiExchangeStats, isLoading: isLoadingMultiExchangeStats } = useQuery(
    [QUERY_KEYS.GET_TRADER_MULTI_EXCHANGE_STATISTIC, address, timeOption.id, myProfile?.id],
    () => getTraderMultiExchangeStatistic({ account: address, params: { statisticType: timeOption.id } }),
    { keepPreviousData: true }
  )

  const comparedData =
    exchangeStats && multiExchangeStats
      ? Object.values(exchangeStats).map((stats) => {
          return { ...(multiExchangeStats[stats.protocol] ?? {}), protocol: stats.protocol }
        })
      : undefined

  const refetchQueries = useRefetchQueries()
  const [, setForceReload] = useState(1)
  const onForceReload = () => {
    refetchQueries([QUERY_KEYS.USE_GET_ALL_COPY_TRADES])
    setForceReload((prev) => prev + 1)
  }

  const { isLastViewed, addTraderLastViewed } = useTraderLastViewed(protocol, address)
  useEffect(() => {
    if (address && protocol && !isLastViewed) {
      addTraderLastViewed(protocol, address)
    }
  }, [address, protocol, isLastViewed])

  return (
    <Box>
      <Box
        sx={{
          flexShrink: 0,
          height: 56,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bg: 'neutral7',
        }}
      >
        {isLoadingExchangeStats && <Loading />}
        {!isLoadingExchangeStats && exchangeStats && (
          <ProtocolStats address={address} protocol={protocol} page="stats" exchangeStats={exchangeStats} />
        )}
      </Box>
      <Flex
        sx={{
          width: '100%',
          alignItems: 'center',
          flexShrink: 0,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 56,
          zIndex: 100,
          bg: 'neutral7',
        }}
      >
        <TraderInfo address={address} protocol={protocol} timeOption={timeOption} traderStats={traderData} />
        <TraderActionButtons
          traderData={currentTraderData}
          timeOption={timeOption}
          onChangeTime={setTimeOption}
          account={address}
          protocol={protocol}
          onCopyActionSuccess={onForceReload}
        />
      </Flex>
      <Box>
        <Flex sx={{ alignItems: 'center', height: 40, px: 3 }}>
          <TimeDropdown timeOption={timeOption} onChangeTime={setTimeOption} ignoreAllTime />
        </Flex>
        {isLoadingMultiExchangeStats && <Loading />}
        {!isLoadingMultiExchangeStats && comparedData && (
          <Grid
            sx={{
              gap: 2,
              px: 3,
              pb: 4,
              gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
            }}
          >
            {comparedData?.map((data, index) => {
              return (
                <Box key={index} sx={{ p: 24, bg: 'neutral5', border: 'small', borderColor: 'neutral4' }}>
                  <Box sx={{ width: 'max-content' }}>
                    <ProtocolLogo protocol={data?.protocol} />
                  </Box>
                  <Box my={12} height={50}>
                    {data?.pnlStatistics ? (
                      <ChartTraderPnL
                        data={parsePnLStatsData(data.pnlStatistics)}
                        dayCount={timeOption.value}
                        height={50}
                      />
                    ) : (
                      <Box sx={{ bg: `${themeColors.neutral4}50` }} height={50} />
                    )}
                  </Box>
                  <Grid sx={{ gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                    <Type.Caption color="neutral3">PnL</Type.Caption>
                    <SignedText value={data?.pnl} maxDigit={1} minDigit={1} />
                    <Type.Caption color="neutral3">ROI</Type.Caption>
                    <SignedText value={data?.avgRoi} maxDigit={1} minDigit={1} />
                    <Type.Caption color="neutral3">Win/Trades</Type.Caption>
                    <Type.Caption>{data ? `${data.totalWin ?? '--'}/${data.totalTrade ?? '--'}` : '--'}</Type.Caption>
                    <Type.Caption color="neutral3">Last Trade</Type.Caption>
                    <Type.Caption>
                      {data?.lastTradeAt ? <RelativeTimeText date={data.lastTradeAt} /> : '--'}
                    </Type.Caption>
                    <Type.Caption color="neutral3">Tokens</Type.Caption>
                    <Type.Caption>
                      {data?.protocol && data?.indexTokens ? (
                        <MarketGroup protocol={data.protocol} indexTokens={data.indexTokens} />
                      ) : (
                        '--'
                      )}
                    </Type.Caption>
                  </Grid>
                </Box>
              )
            })}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
