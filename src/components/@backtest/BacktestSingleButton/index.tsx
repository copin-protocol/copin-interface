import { ArrowElbowUpLeft } from '@phosphor-icons/react'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useMutation } from 'react-query'

import { requestTestMultiOrderApi } from 'apis/backTestApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import BacktestSingleModal from 'components/@backtest/BacktestSingleModal'
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex } from 'theme/base'
import { ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent, logEventLite } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { initBacktestState, initialState, reducer } from '../BacktestSingleModal/config'
import { RESET_BACKTEST_PARAMS } from '../configs'
import { parseRequestData } from '../helpers'

export default function BacktestSingleButton({
  account,
  protocol,
  eventCategory,
}: {
  account: string
  protocol: ProtocolEnum
  eventCategory?: EventCategory
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isForceOpenModal = searchParams[URL_PARAM_KEYS.OPEN_BACKTEST_MODAL] === '1' ? true : false
  const requestData = parseRequestData(searchParams, protocol)
  const hasRequestBacktestData = !!Object.keys(requestData).length

  const { isAllowedProtocol, isEnableBackTest, requiredPlanToBacktest } = useTraderProfilePermission({ protocol })

  const { mutate: requestBacktest } = useMutation(requestTestMultiOrderApi, {
    onSuccess: (data, variables) => {
      const currentInstanceId = backtestState.currentInstanceId
      if (!currentInstanceId || backtestState.instanceIds.length !== 1) return
      const backtestInstance = backtestState.instancesMapping[currentInstanceId]
      if (!!backtestInstance.result) return
      dispatch({ type: 'setSetting', payload: variables.data })
      dispatch({ type: 'setResult', payload: data[0] })
      dispatch({ type: 'setStatus', payload: 'tested' })
      if (isForceOpenModal) {
        dispatch({ type: 'toggleFocusBacktest', payload: true })
        setSearchParams({ [URL_PARAM_KEYS.OPEN_BACKTEST_MODAL]: null, ...RESET_BACKTEST_PARAMS })
      }
    },
  })

  const requestedBacktest = useRef(false)
  useEffect(() => {
    if (!myProfile || !hasRequestBacktestData || requestedBacktest.current) return
    requestBacktest({ protocol, data: { ...requestData, isReturnPositions: true } })
    requestedBacktest.current = true
  }, [myProfile])

  const [backtestState, dispatch] = useReducer(reducer, initialState, () =>
    initBacktestState({
      isFocusBacktest: isForceOpenModal,
      status: hasRequestBacktestData ? 'testing' : undefined,
      settings: hasRequestBacktestData ? requestData : undefined,
    })
  )
  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const handleOpenBackTestModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    dispatch({ type: 'toggleFocusBacktest' })
  }
  const handleDismissBackTestModal = useCallback(() => {
    dispatch({ type: 'toggleFocusBacktest' })
  }, [])
  const currentBacktestId = backtestState.currentInstanceId
  const currentBacktestInstance = currentBacktestId && backtestState.instancesMapping[currentBacktestId]
  const hadBacktest =
    !!Object.values(requestData).length || (!!currentBacktestInstance && !!currentBacktestInstance.result)

  const logEventBacktest = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.BACK_TEST,
      action,
    })
  }

  return (
    <>
      <Flex alignItems="center" px={3} width={['100%', '100%', '100%', 'auto']} sx={{ gap: 1 }}>
        <ButtonWithIcon
          width="100%"
          variant={hadBacktest ? 'ghostSuccess' : 'ghost'}
          icon={<ArrowElbowUpLeft size={20} />}
          onClick={() => {
            handleOpenBackTestModal()
            eventCategory !== EventCategory.LITE
              ? logEventBacktest(
                  hadBacktest
                    ? EVENT_ACTIONS[EventCategory.BACK_TEST].VIEW_RESULT
                    : EVENT_ACTIONS[EventCategory.BACK_TEST].OPEN_SINGLE
                )
              : logEventLite({
                  event: EVENT_ACTIONS[EventCategory.LITE].LITE_BACKTEST_TRADER,
                  username: getUserForTracking(myProfile?.username),
                })
          }}
          sx={{
            gap: 1,
            px: 0,
            borderRadius: 0,
            height: '100%',
            color: 'neutral2',
            '&:hover:not(:disabled)': { color: 'neutral1' },
          }}
          disabled={!isEnableBackTest || !isAllowedProtocol}
        >
          {hadBacktest ? 'Backtest Result' : 'Backtest'}
        </ButtonWithIcon>
        {!isEnableBackTest && (
          <PlanUpgradeIndicator
            requiredPlan={requiredPlanToBacktest}
            learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
          />
        )}
      </Flex>
      <BacktestSingleModal
        isForceOpen={isForceOpenModal}
        account={account}
        protocol={protocol}
        isOpen={backtestState.isFocusBacktest}
        onDismiss={handleDismissBackTestModal}
        state={backtestState}
        dispatch={dispatch}
      />
    </>
  )
}
