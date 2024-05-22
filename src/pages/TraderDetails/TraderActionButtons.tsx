import { CirclesThreePlus, UniteSquare } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useMutation } from 'react-query'

import { requestTestMultiOrderApi } from 'apis/backTestApis'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TradeProtocolAction from 'components/@ui/TradeProtocol'
import SingleBackTestModal from 'components/BacktestModal/SingleBacktestModal'
import { initBacktestState, initialState, reducer } from 'components/BacktestModal/SingleBacktestModal/config'
import { RESET_BACKTEST_PARAMS, parseRequestData } from 'components/BacktestModal/helper'
import CopyTraderButton from 'components/CopyTraderButton'
import { useClickLoginButton } from 'components/LoginAction'
import { PositionData, TraderData } from 'entities/trader.d'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfileStore from 'hooks/store/useMyProfile'
// import useSearchParams from 'hooks/router/useSearchParams'
import { useAuthContext } from 'hooks/web3/useAuth'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { NAVBAR_HEIGHT } from 'utils/config/constants'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

import AlertAction from './AlertAction'
import BackTestAction from './BackTestAction'
import ExpandTraderRankingButton from './ExpandTraderRankingButton'

export interface PositionSortPros {
  sortBy: keyof PositionData
  sortType: SortTypeEnum
}
export default function TraderActionButtons({
  account,
  traderData,
  protocol,
  onCopyActionSuccess,
  timeOption,
  onChangeTime,
}: {
  traderData: TraderData | undefined
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  account: string
  protocol: ProtocolEnum
  onCopyActionSuccess: () => void
}) {
  const { lg } = useResponsive()
  return (
    <>
      {lg ? (
        <Box
          sx={{
            alignItems: 'center',
            borderBottom: ['small', 'small', 'small', 'none'],
            borderColor: ['neutral4', 'neutral4', 'neutral4', 'transparent'],
            width: [0, '100%', '100%', 'auto'],
            height: ['40px', '40px', '40px', 'auto'],
            display: ['none', 'flex', 'flex', 'flex'],
            position: [undefined, 'fixed', 'fixed', 'static'],
            top: [undefined, NAVBAR_HEIGHT + 71, NAVBAR_HEIGHT + 71, NAVBAR_HEIGHT + 71],
            zIndex: 10,
            bg: ['neutral7', 'neutral7', 'neutral7', undefined],
          }}
        >
          {/* <TradeProtocolAction protocol={protocol} /> */}
          <AlertAction protocol={protocol} account={account} />
          <ExpandTraderRankingButton traderData={traderData} timeOption={timeOption} onChangeTime={onChangeTime} />
          <BacktestButton key={protocol + account} protocol={protocol} account={account} />
          <CopyTraderButton
            protocol={protocol}
            account={account}
            onForceReload={onCopyActionSuccess}
            buttonSx={{
              px: 3,
              width: 'auto',
              bg: 'transparent !important',
              color: `${themeColors.primary1} !important`,
              '&:hover:not(:disabled)': { color: `${themeColors.primary2} !important` },
            }}
            buttonText={
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <UniteSquare size={20} />
                <Type.CaptionBold>Copy Trader</Type.CaptionBold>
              </Flex>
            }
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            // position: 'fixed',
            // top: NAVBAR_HEIGHT + 24,
            // right: 12,
            pr: 12,
            zIndex: 10,
          }}
        >
          <Dropdown
            hasArrow={false}
            menuSx={{
              bg: 'neutral7',
              width: 'max-content',
            }}
            menu={
              <>
                <Box height="40px">
                  <TradeProtocolAction protocol={protocol} />
                </Box>
                <Box height="40px">
                  <AlertAction account={account} protocol={protocol} />
                </Box>
                <Box height="40px">
                  <BacktestButton key={protocol + account} account={account} protocol={protocol} />
                </Box>
                <Box height="40px">
                  <CopyTraderButton account={account} protocol={protocol} onForceReload={onCopyActionSuccess} />
                </Box>
              </>
            }
            sx={{}}
            buttonSx={{
              border: 'none',
              height: '100%',
              p: 0,
            }}
            placement={'topRight'}
          >
            <IconButton
              size={24}
              type="button"
              icon={<CirclesThreePlus size={24} weight="fill" />}
              variant="ghost"
              sx={{
                color: 'neutral1',
              }}
            />
          </Dropdown>
        </Box>
      )}
    </>
  )
}
function BacktestButton({ account, protocol }: { account: string; protocol: ProtocolEnum }) {
  const { searchParams, setSearchParams } = useSearchParams()
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isForceOpenModal = searchParams[URL_PARAM_KEYS.OPEN_BACKTEST_MODAL] === '1' ? true : false
  const requestData = parseRequestData(searchParams, protocol)
  const hasRequestBacktestData = !!Object.keys(requestData).length
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

  return (
    <>
      <BackTestAction onClick={handleOpenBackTestModal} hadBacktest={hadBacktest} />
      <SingleBackTestModal
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
