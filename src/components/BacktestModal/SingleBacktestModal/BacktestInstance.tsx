import { ArrowLeft } from '@phosphor-icons/react'

import BacktestForm from 'components/BacktestForm'
import { getFormValuesFromRequestData } from 'components/BacktestForm/helper'
import SingleBacktestResult from 'components/BacktestResult/SingleBacktestResult'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest'
import useBacktestRequest from 'hooks/features/useBacktestRequest'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { InstanceData } from './config'

export interface BacktestInstanceProps {
  protocol: ProtocolEnum
  accounts: string[]
  tokensTraded?: string[]
  instanceData: InstanceData
  onSimulate: (settings: RequestBackTestData) => void
  onSimulateSuccess: (resultData: BackTestResultData) => void
  onBackToSetting: () => void
  onSimulateError: () => void
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

  return (
    <Box sx={{ px: 0, borderRadius: 'sm', height: '100%', bg: 'neutral5' }}>
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
      {instanceData.status === 'tested' && instanceData.settings && instanceData.result && (
        <Box height="calc(100% - 40px)">
          <SingleBacktestResult protocol={protocol} settings={instanceData.settings} results={[instanceData.result]} />
        </Box>
      )}
    </Box>
  )
}
