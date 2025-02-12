import { ArrowLeft } from '@phosphor-icons/react'
import { useMemo } from 'react'

import BacktestForm from 'components/@backtest/BacktestForm'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest'
import useBacktestRequest from 'hooks/features/backtest/useBacktestRequest'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import BacktestSingleResult from '../BacktestSingleResult'
import { getFormValuesFromRequestData } from '../helpers'
import { BacktestInstanceData } from '../types'

export interface BacktestInstanceProps {
  protocol: ProtocolEnum
  accounts: string[]
  tokensTraded?: string[]
  instanceData: BacktestInstanceData
  onSimulate: (settings: RequestBackTestData) => void
  onSimulateSuccess: (resultData: BackTestResultData) => void
  onBackToSetting: () => void
  onSimulateError: () => void
  isModalOpen?: boolean
}

export default function BacktestInstance({
  protocol,
  accounts,
  tokensTraded,
  instanceData,
  onSimulate,
  onSimulateSuccess,
  onSimulateError,
  onBackToSetting,
  isModalOpen,
}: BacktestInstanceProps) {
  const { myProfile } = useMyProfile()
  const { onSubmit } = useBacktestRequest(protocol, {
    onSuccess: ({ result }) => {
      onSimulateSuccess(result[0])

      logEvent({
        label: getUserForTracking(myProfile?.username),
        category: EventCategory.BACK_TEST,
        action: EVENT_ACTIONS[EventCategory.BACK_TEST].REQUEST_SINGLE,
      })
    },
    onError: onSimulateError,
  })
  const backtestResult = useMemo(() => {
    return instanceData.result && [instanceData.result]
  }, [instanceData.result])

  return (
    <Box sx={{ px: 0, borderRadius: 'sm', height: '100%', bg: '#000' }}>
      {instanceData.status === 'testing' && (
        <Box pt={4}>
          <Loading />
        </Box>
      )}
      {instanceData.status === 'tested' && (
        <ButtonWithIcon
          variant="ghost"
          onClick={onBackToSetting}
          icon={<ArrowLeft size={16} weight="bold" />}
          sx={{ p: 3 }}
        >
          <Type.Caption>Edit Strategy</Type.Caption>
        </ButtonWithIcon>
      )}
      {instanceData.status === 'setting' && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden auto !important',
          }}
        >
          <Box
            sx={{
              px: [3, 3, 3, 0],
              pb: 3,
              pt: 24,
              width: '100%',
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            <BacktestForm
              isModalOpen={isModalOpen}
              protocol={protocol}
              onSubmit={onSubmit({
                accounts,
                isReturnPositions: true,
                callback: (requestData) => onSimulate(requestData),
              })}
              isSubmitting={false}
              defaultValues={getFormValuesFromRequestData(instanceData.settings)}
              tokensTraded={tokensTraded}
            />
          </Box>
        </Box>
      )}
      {instanceData.status === 'tested' && instanceData.settings && backtestResult && (
        <Box height="calc(100% - 40px)" sx={{ borderTop: `small`, borderTopColor: 'neutral4' }}>
          <BacktestSingleResult protocol={protocol} settings={instanceData.settings} results={backtestResult} />
        </Box>
      )}
    </Box>
  )
}
