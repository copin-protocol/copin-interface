import { useResponsive } from 'ahooks'

import { ConditionFormValues } from 'components/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import useMyProfile from 'hooks/store/useMyProfile'
import { Box, Flex } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import useTradersContext from '../useTradersContext'
import FilterForm, { FilterFormProps } from './FilterForm'
import ResultEstimated from './ResultEstimated'
import { FilterTabEnum, defaultFieldOptions } from './configs'
import { useTraderCountState } from './useTraderCount'

export default function DefaultFilterForm({
  defaultFormValues,
  handleClose,
  handleChangeOption,
  currentTab,
  lastFilterTab,
}: {
  handleClose?: () => void
  handleChangeOption: (option: ConditionFormValues<TraderData>) => void
  defaultFormValues: ConditionFormValues<TraderData>
  currentTab: FilterTabEnum
  lastFilterTab: FilterTabEnum
}) {
  const { myProfile } = useMyProfile()
  const { timeOption, protocol, setCurrentSuggestion } = useTradersContext()
  const { ranges, handleChangeRanges } = useTraderCountState({ defaultFormValues })

  const onChangeFormValues: FilterFormProps['onValuesChange'] = (values) => {
    handleChangeRanges(values)
  }

  const onApply: FilterFormProps['onApply'] = (formValues) => {
    handleChangeOption(formValues)
    handleClose && handleClose()
    setCurrentSuggestion(undefined)

    logEvent(
      {
        category: EventCategory.FILTER,
        action: EVENT_ACTIONS[EventCategory.FILTER].NORMAL,
        label: getUserForTracking(myProfile?.username),
      },
      { protocol, data: JSON.stringify(formValues) }
    )
  }
  const onReset: FilterFormProps['onReset'] = (formValueFactory) => {
    if (formValueFactory) {
      const formValues = formValueFactory(['pnl', 'winRate'])
      handleChangeOption(formValues)
    }
    handleClose && handleClose()
    setCurrentSuggestion(undefined)

    logEvent(
      {
        category: EventCategory.FILTER,
        action: EVENT_ACTIONS[EventCategory.FILTER].RESET_DEFAULT,
        label: getUserForTracking(myProfile?.username),
      },
      { protocol }
    )
  }

  const { sm } = useResponsive()

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box sx={sm ? {} : { position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2 }}>
        <ResultEstimated ranges={ranges} protocol={protocol} timeOption={timeOption} />
      </Box>

      <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
        <FilterForm
          fieldOptions={defaultFieldOptions}
          initialFormValues={defaultFormValues}
          onApply={onApply}
          onReset={onReset}
          onValuesChange={onChangeFormValues}
          enabledApply={currentTab === FilterTabEnum.DEFAULT && lastFilterTab !== FilterTabEnum.DEFAULT}
        />
      </Box>
    </Flex>
  )
}
