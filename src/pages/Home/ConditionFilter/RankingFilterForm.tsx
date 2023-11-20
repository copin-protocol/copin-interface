import { useResponsive } from 'ahooks'

import { ConditionFormValues } from 'components/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { Box, Flex } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'

import useTradersContext from '../useTradersContext'
import FilterForm, { FilterFormProps } from './FilterForm'
import ResultEstimated from './ResultEstimated'
import { FilterTabEnum } from './configs'
import useTradersCount from './useTraderCount'

export default function RankingFilterForm({
  defaultFormValues,
  handleClose,
  handleChangeOption,
  prevTab,
  lastFilterTab,
}: {
  handleClose?: () => void
  handleChangeOption: (option: ConditionFormValues<TraderData>) => void
  defaultFormValues: ConditionFormValues<TraderData>
  prevTab: FilterTabEnum
  lastFilterTab: FilterTabEnum
}) {
  const { timeOption, protocol } = useTradersContext()
  const effectDays = getDurationFromTimeFilter(timeOption.id)
  const { handleCallAPi, tradersCount, isFetching } = useTradersCount({
    defaultFormValues,
    timeOption,
    protocol,
    filterTab: FilterTabEnum.RANKING,
  })
  const onChangeFormValues: FilterFormProps['onValuesChange'] = (values) => {
    handleCallAPi(values)
  }
  const onApply: FilterFormProps['onApply'] = (formValues) => {
    handleChangeOption(formValues)
    handleClose && handleClose()
  }
  const onReset: FilterFormProps['onReset'] = (formValueFactory) => {
    if (formValueFactory) {
      const formValues = formValueFactory(['profit', 'winRate'])
      handleChangeOption(formValues)
    }
    handleClose && handleClose()
  }

  const { sm } = useResponsive()

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box sx={sm ? {} : { position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2 }}>
        <ResultEstimated data={tradersCount} loading={isFetching} effectDays={effectDays} />
      </Box>

      <Box flex="1 0 0" sx={{ overflow: 'auto', '.select__menu': { minWidth: 'max-content' } }}>
        <FilterForm
          fieldOptions={rankingFieldOptions}
          initialFormValues={defaultFormValues}
          onApply={onApply}
          onReset={onReset}
          onValuesChange={onChangeFormValues}
          enabledApply={prevTab !== FilterTabEnum.RANKING && lastFilterTab !== FilterTabEnum.RANKING}
          formType="ranking"
        />
      </Box>
    </Flex>
  )
}
