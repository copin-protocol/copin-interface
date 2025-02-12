import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getSharedBacktestResultApi, getSharedBacktestSettingApi } from 'apis/shareApis'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function useGetSharedBacktest({ key }: { key: string }) {
  const { id: backtestId, protocol } = useParams<{ id: string; protocol: ProtocolEnum }>()
  const {
    data: sharedBacktestSetting,
    isLoading: isLoadingSharedSetting,
    error: getSharedBacktestSettingError,
  } = useQuery([QUERY_KEYS.GET_SHARED_BACKTEST_DATA, key, 'setting', backtestId], () =>
    getSharedBacktestSettingApi(backtestId)
  )
  const {
    data: sharedBacktestResult,
    isLoading: isLoadingSharedResult,
    error: getSharedBacktestResultError,
  } = useQuery([QUERY_KEYS.GET_SHARED_BACKTEST_DATA, key, 'result', backtestId], () =>
    getSharedBacktestResultApi(backtestId, protocol)
  )

  return {
    sharedBacktestSetting,
    isLoadingSharedSetting,
    getSharedBacktestSettingError,
    sharedBacktestResult,
    isLoadingSharedResult,
    getSharedBacktestResultError,
    protocol,
  }
}
