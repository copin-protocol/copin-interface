import BacktestSingleResult from 'components/@backtest/BacktestSingleResult'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useGetSharedBacktest from 'hooks/features/backtest/useGetSharedBacktest'
import Loading from 'theme/Loading'
import { Box, Type } from 'theme/base'

export default function SharedBacktestSinglePage() {
  const {
    sharedBacktestSetting,
    isLoadingSharedSetting,
    getSharedBacktestSettingError,
    sharedBacktestResult,
    isLoadingSharedResult,
    getSharedBacktestResultError,
    protocol,
  } = useGetSharedBacktest({ key: 'single' })

  if (isLoadingSharedSetting || isLoadingSharedResult)
    return (
      <Box p={3} pt={5}>
        <Loading />
      </Box>
    )
  const error = getSharedBacktestSettingError || getSharedBacktestResultError
  if (error)
    return (
      <Box p={3} pt={5}>
        <Type.Body display="block" textAlign="center" fontWeight={700}>
          Something went wrong. Please come back later
        </Type.Body>
      </Box>
    )

  return sharedBacktestSetting && sharedBacktestResult && sharedBacktestResult.length === 1 ? (
    <SafeComponentWrapper>
      <CustomPageTitle title={`Backtesting ${sharedBacktestSetting.query.setting.accounts[0]}`} />
      <BacktestSingleResult
        protocol={protocol}
        results={sharedBacktestResult}
        settings={sharedBacktestSetting.query.setting}
        disabledShare
      />
    </SafeComponentWrapper>
  ) : null
}
