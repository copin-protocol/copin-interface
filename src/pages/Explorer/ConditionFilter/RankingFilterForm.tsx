import { useResponsive } from 'ahooks'

import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import { Box, Flex } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'

import useTradersContext from '../useTradersContext'
import FilterForm, { FilterFormProps } from './FilterForm'
import ResultEstimated from './ResultEstimated'
import { FilterTabEnum } from './configs'
import { useTraderCountState } from './useTraderCount'

export default function RankingFilterForm({
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
  const { timeOption, protocol } = useTradersContext()
  const { ranges, handleChangeRanges } = useTraderCountState({ defaultFormValues })

  const onChangeFormValues: FilterFormProps['onValuesChange'] = (values) => {
    handleChangeRanges(values)
  }
  const onApply: FilterFormProps['onApply'] = (formValues) => {
    handleChangeOption(formValues)
    handleClose && handleClose()
  }
  const onReset: FilterFormProps['onReset'] = (formValueFactory) => {
    if (formValueFactory) {
      const formValues = formValueFactory(['pnl', 'winRate'])
      handleChangeOption(formValues)
    }
    handleClose && handleClose()
  }

  const { sm } = useResponsive()

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Box sx={sm ? {} : { position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2 }}>
        <ResultEstimated
          ranges={ranges}
          protocol={protocol}
          timeOption={timeOption}
          filterTab={FilterTabEnum.RANKING}
        />
      </Box>

      <Box flex="1 0 0" sx={{ overflow: 'auto', '.select__menu': { minWidth: 'max-content' } }}>
        <FilterForm
          fieldOptions={rankingFieldOptions}
          initialFormValues={defaultFormValues}
          onApply={onApply}
          onReset={onReset}
          onValuesChange={onChangeFormValues}
          enabledApply={currentTab === FilterTabEnum.RANKING && lastFilterTab !== FilterTabEnum.RANKING}
          formType="ranking"
        />
      </Box>
    </Flex>
  )
}
