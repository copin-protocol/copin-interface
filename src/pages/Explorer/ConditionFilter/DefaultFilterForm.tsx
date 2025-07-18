import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'

import Divider from 'components/@ui/Divider'
import { IGNORED_FITLER_FORM_FIELDS } from 'components/@widgets/ConditionFilterForm/helpers'
import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { useIsElite } from 'hooks/features/subscription/useSubscriptionRestrict'
import useMyProfile from 'hooks/store/useMyProfile'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import { Box, Flex } from 'theme/base'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import useTradersContext from '../useTradersContext'
import FilterForm, { FilterFormProps } from './FilterForm'
import FilterMarket from './FilterMarket'
import ResultEstimated from './ResultEstimated'
import { FilterTabEnum, getFilterOptions } from './configs'
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
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const [formValues, setFormValues] = useState(defaultFormValues)
  const { myProfile } = useMyProfile()
  const { timeOption, setCurrentSuggestion } = useTradersContext()
  const { ranges, handleChangeRanges } = useTraderCountState({ defaultFormValues })
  const [enableApply, setEnableApply] = useState(false)
  const { fieldsAllowed, pagePermission, userPermission } = useExplorerPermission()
  const { sm } = useResponsive()
  const isEliteUser = useIsElite()

  const fieldOptions = useMemo(
    () =>
      getFilterOptions({
        pagePermission,
        userPermission,
      }),
    [pagePermission, userPermission]
  )

  // useEffect(() => {
  //   setFormValues((formValues) => {
  //     const newValues = formValues.filter((e) => e.key !== 'indexTokens' && fieldsAllowed.includes(e.key))
  //     return newValues
  //   })
  // }, [fieldsAllowed])

  const onChangeFormValues: FilterFormProps['onValuesChange'] = (values) => {
    // let newValues = [...values]
    // const marketValues = formValues.find((e) => e.key === 'indexTokens')
    // if (marketValues) {
    //   newValues = [...values, marketValues]
    // }

    setFormValues(values)
    handleChangeRanges(values)
    setEnableApply(true)
  }

  const onChangeMarketFormValues: FilterFormProps['onValuesChange'] = (values) => {
    setFormValues(values)
    handleChangeRanges(values)
    setEnableApply(true)
  }

  const onApply: FilterFormProps['onApply'] = (_formValues) => {
    handleChangeOption(formValues)
    handleClose && handleClose()
    setCurrentSuggestion(undefined)

    logEvent(
      {
        category: EventCategory.FILTER,
        action: EVENT_ACTIONS[EventCategory.FILTER].NORMAL,
        label: getUserForTracking(myProfile?.username),
      },
      { selectedProtocols: selectedProtocols?.join('-'), data: JSON.stringify(formValues) }
    )
  }

  const onReset: FilterFormProps['onReset'] = (formValueFactory) => {
    if (formValueFactory) {
      // const formValues = formValueFactory(['pnl'])
      const formValues = formValueFactory([])
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
      { selectedProtocols: selectedProtocols?.join('-') }
    )
  }

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box sx={sm ? {} : { position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2 }}>
        <ResultEstimated
          ranges={ranges}
          protocols={selectedProtocols ?? []}
          type={timeOption.id}
          filterTab={FilterTabEnum.DEFAULT}
        />
      </Box>

      {fieldsAllowed.includes('indexTokens') && (
        <>
          <FilterMarket filters={formValues} changeFilters={onChangeMarketFormValues} />
          <Divider my={1} color="neutral5" />
        </>
      )}
      <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
        <FilterForm
          key={formValues.map((e) => e.key).join('-')}
          formType="default"
          fieldOptions={fieldOptions}
          maxFilterFields={userPermission?.maxFilterFields}
          initialFormValues={formValues}
          invalidFormValues={defaultFormValues.filter(
            (e, i) =>
              !IGNORED_FITLER_FORM_FIELDS.includes(e.key) &&
              (!fieldsAllowed?.includes(e.key) || i >= (userPermission?.maxFilterFields ?? Infinity))
          )}
          onApply={onApply}
          onReset={onReset}
          onValuesChange={onChangeFormValues}
          enabledApply={
            enableApply || (currentTab === FilterTabEnum.DEFAULT && lastFilterTab !== FilterTabEnum.DEFAULT)
          }
          showUpgradeWarning={!isEliteUser}
        />
      </Box>
    </Flex>
  )
}
