import { Dispatch, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useGetTokensTraded from 'hooks/features/useGetTokensTraded'
import useSearchParams from 'hooks/router/useSearchParams'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex } from 'theme/base'
import { CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

import { stringifyRequestData } from '../helper'
import BacktestInstance from './BacktestInstance'
import TabHeader from './TabHeader'
import { ActionType, State } from './config'

export default function SingleBackTestModal({
  account,
  isOpen,
  onDismiss,
  state,
  dispatch,
}: {
  account: string
  isOpen: boolean
  onDismiss: () => void
  dispatch: Dispatch<ActionType>
  state: State
}) {
  const { setSearchParams } = useSearchParams()
  const { protocol } = useParams<{ protocol: ProtocolEnum }>()
  const currentInstanceData = state.instancesMapping[state.currentInstanceId ?? '']

  const { data: tokensTraded } = useGetTokensTraded({ account, protocol })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            accounts={[account]}
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
