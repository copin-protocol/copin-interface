import { Dispatch, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getTokenTradesByTraderApi } from 'apis/positionApis'
import useSearchParams from 'hooks/router/useSearchParams'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex } from 'theme/base'
import { CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import { stringifyRequestData } from '../helper'
import BacktestInstance from './BacktestInstance'
import TabHeader from './TabHeader'
import { ActionType, State } from './config'

export default function SingleBackTestModal({
  accounts,
  isOpen,
  onDismiss,
  state,
  dispatch,
}: {
  accounts: string[]
  isOpen: boolean
  onDismiss: () => void
  dispatch: Dispatch<ActionType>
  state: State
}) {
  const { setSearchParams } = useSearchParams()
  const { protocol } = useParams<{ protocol: ProtocolEnum }>()
  const currentInstanceData = state.instancesMapping[state.currentInstanceId ?? '']

  const { data: tokensTraded } = useQuery(
    [QUERY_KEYS.GET_TOKEN_TRADES_BY_TRADER, accounts, protocol],
    () => getTokenTradesByTraderApi({ protocol, account: accounts[0] }),
    { enabled: protocol && accounts && accounts.length > 0, retry: 0 }
  )

  useEffect(() => {
    if (!currentInstanceData) return
    if (currentInstanceData.settings) {
      setSearchParams({
        [URL_PARAM_KEYS.BACKTEST_DATA]: stringifyRequestData(
          {
            ...currentInstanceData.settings,
            testingType: CopyTradeTypeEnum.FULL_ORDER,
          },
          protocol
        ),
      })
    } else {
      setSearchParams({ [URL_PARAM_KEYS.BACKTEST_DATA]: null })
    }
  }, [currentInstanceData.status, state.currentInstanceId])

  if (!currentInstanceData) return <></>
  return (
    <Drawer size="calc(100vh - 80px)" mode="bottom" isOpen={isOpen} onDismiss={onDismiss} background="neutral7">
      <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
        {/* Header */}
        <TabHeader
          state={state}
          onSelectItem={(id) => {
            dispatch({ type: 'setCurrentInstance', payload: id })
          }}
          onAddNewItem={() => {
            dispatch({ type: 'addNewInstance' })
          }}
          onDeleteItem={(id) => {
            dispatch({ type: 'removeInstance', payload: id })
          }}
          onMinimize={onDismiss}
        />
        {/* Body */}
        <Box flex="1 0 0" overflow="hidden">
          <BacktestInstance
            protocol={protocol}
            accounts={accounts}
            tokensTraded={tokensTraded}
            instanceData={currentInstanceData}
            onSimulate={(settings) => {
              dispatch({ type: 'setStatus', payload: 'testing' })
              dispatch({ type: 'setSetting', payload: settings })
            }}
            onSimulateError={() => {
              dispatch({ type: 'setStatus', payload: 'setting' })
            }}
            onSimulateSuccess={(resultData) => {
              dispatch({ type: 'setStatus', payload: 'tested' })
              dispatch({ type: 'setResult', payload: resultData })
            }}
            onBackToSetting={() => dispatch({ type: 'setStatus', payload: 'setting' })}
          />
        </Box>
      </Flex>
    </Drawer>
  )
}
