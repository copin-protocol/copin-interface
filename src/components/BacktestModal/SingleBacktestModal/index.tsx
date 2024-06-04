import { Dispatch } from 'react'

import useGetTokensTraded from 'hooks/features/useGetTokensTraded'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import BacktestInstance from './BacktestInstance'
import TabHeader from './TabHeader'
import { ActionType, State } from './config'

export default function SingleBackTestModal({
  account,
  protocol,
  isOpen,
  onDismiss,
  state,
  dispatch,
  isForceOpen = false,
}: {
  protocol: ProtocolEnum
  account: string
  isOpen: boolean
  onDismiss: () => void
  dispatch: Dispatch<ActionType>
  state: State
  isForceOpen?: boolean
}) {
  const currentInstanceData = state.instancesMapping[state.currentInstanceId ?? '']

  const { data: tokensTraded } = useGetTokensTraded({ account, protocol }, { enabled: isOpen })

  if (!currentInstanceData) return <></>
  return (
    <RcDrawer
      open={isOpen}
      onClose={onDismiss}
      placement="bottom"
      styles={{ wrapper: { height: 'calc(100% - 80px)' } }}
    >
      <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'auto', bg: 'neutral7' }}>
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
    </RcDrawer>
  )
}
