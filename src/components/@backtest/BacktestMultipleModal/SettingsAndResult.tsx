import { ArrowLeft } from '@phosphor-icons/react'
import { useState } from 'react'

import BacktestForm from 'components/@backtest/BacktestForm'
import { getFormValuesFromRequestData } from 'components/@backtest/helpers'
import useBacktestRequest from 'hooks/features/useBacktestRequest'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { TestInstanceData, useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import BacktestMultipleResultTable, { TableResultData } from '../BacktestMultipleResultTable'
import BacktestShareButton from '../BacktestShareButton'
import SettingTags from './SettingTags'

export default function SettingsAndResult({ data }: { data: TestInstanceData }) {
  const { myProfile } = useMyProfile()
  const { protocol } = useProtocolStore()
  const { currentHomeInstanceId, getCommonData, updateInstance, updateHomeInstance } = useSelectBacktestTraders()
  // if data.homeId === null => it is home
  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  const tradersMapping = currentHomeInstance?.tradersMapping ?? {}
  const { onSubmit } = useBacktestRequest(protocol, {
    onSuccess: ({ result }) => {
      for (const data of result) {
        delete data.simulatorPositions
      }
      updateInstance({ id: data.id, homeId: data.homeId, stage: 'simulated', backtestResult: result })
      updateHomeInstance({ homeId: data.homeId, data: { isTested: true } })
    },
    onError: () => {
      updateInstance({ id: data.id, homeId: data.homeId, stage: 'setting' })
    },
  })
  const selectedAddress = data.listTrader ?? []
  const handleSubmit = onSubmit({
    accounts: selectedAddress,
    callback: (requestData) => {
      updateInstance({ id: data.id, homeId: data.homeId, settings: requestData, stage: 'simulating' })

      logEvent({
        label: getUserForTracking(myProfile?.username),
        category: EventCategory.BACK_TEST,
        action: EVENT_ACTIONS[EventCategory.BACK_TEST].REQUEST_MULTIPLE,
      })
    },
  })

  const stage = data.stage
  const isTested = !!currentHomeInstance?.isTested
  const parentId = data.parentId
  const handleClickBack = () => {
    let prevStage: TestInstanceData['stage'] | null = null
    switch (stage) {
      case 'setting':
        prevStage = 'selecting'
        break
      case 'selecting':
        prevStage = null
        break
      default:
        prevStage = 'setting'
        break
    }
    if (!prevStage) return
    updateInstance({ id: data.id, homeId: data.homeId, stage: prevStage })
  }
  const [currentSort, setCurrentSort] = useState<TableSortProps<TableResultData>>()

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      {stage !== 'setting' && stage !== 'selecting' && (
        <Flex
          sx={{
            alignItems: 'center',
            gap: [2, 2, 4],
            position: 'sticky',
            top: 0,
            p: 2,
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            bg: 'neutral5',
            zIndex: 10,
          }}
        >
          <ButtonWithIcon
            variant="ghost"
            onClick={handleClickBack}
            icon={<ArrowLeft size={16} weight="bold" />}
            sx={{ p: 0 }}
          >
            <Type.Caption display={['none', 'none', 'block']}>Edit Strategy</Type.Caption>
          </ButtonWithIcon>

          {!!data.settings && (
            <>
              <Box flex="1">
                <SettingTags protocol={protocol} settings={data.settings} />
              </Box>
              <BacktestShareButton settings={data.settings} protocol={protocol} type="multiple" sort={currentSort} />
            </>
          )}
        </Flex>
      )}
      {stage === 'setting' && (
        <Box px={3} sx={{ flex: '1 0 0', overflow: 'auto' }}>
          <Box sx={{ py: 4 }}>
            <Box sx={{ maxWidth: 700, mx: 'auto' }}>
              <BacktestForm
                protocol={protocol}
                onSubmit={handleSubmit}
                isSubmitting={false}
                onCancel={parentId == null && !isTested ? handleClickBack : undefined}
                defaultValues={getFormValuesFromRequestData(data.settings)}
              />
            </Box>
          </Box>
        </Box>
      )}
      {stage === 'simulated' && data.backtestResult && (
        <Box className="setting_result" sx={{ flex: '1 0 0', overflow: 'hidden' }}>
          <BacktestMultipleResultTable
            tradersMapping={tradersMapping}
            instanceData={data}
            results={data.backtestResult}
            settings={data.settings}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
          />
        </Box>
      )}
      {stage === 'simulating' && (
        <Box sx={{ display: 'flex', width: '100%', height: 300, alignItems: 'center', justifyContent: 'center' }}>
          <Loading />
        </Box>
      )}
    </Flex>
  )
}
