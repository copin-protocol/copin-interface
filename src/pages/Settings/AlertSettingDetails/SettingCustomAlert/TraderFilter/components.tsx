import { Trans } from '@lingui/macro'
import React, { useState } from 'react'

import ConditionFilterForm from 'components/@widgets/ConditionFilterForm'
import { IGNORED_FITLER_FORM_FIELDS } from 'components/@widgets/ConditionFilterForm/helpers'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import ResultEstimated from 'pages/Explorer/ConditionFilter/ResultEstimated'
import { FilterTabEnum, defaultFieldOptions } from 'pages/Explorer/ConditionFilter/configs'
import { Button } from 'theme/Buttons'
import Label from 'theme/InputField/Label'
import RadioGroup from 'theme/RadioGroup'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { AlertCustomType, ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import BasicInfoModal from '../BasicInfoModal'
import { convertRangesFromFormValues, transformFormValues } from '../helpers'
import { LIMIT_TRADERS } from './constants'
import { TimeframeOption, TraderFilterFooterProps, TraderFilterFormProps } from './types'

export const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  {
    label: <Trans>7 days</Trans>,
    value: TimeFilterByEnum.S7_DAY,
  },
  {
    label: <Trans>14 days</Trans>,
    value: TimeFilterByEnum.S14_DAY,
  },
  {
    label: <Trans>30 days</Trans>,
    value: TimeFilterByEnum.S30_DAY,
  },
  {
    label: <Trans>60 days</Trans>,
    value: TimeFilterByEnum.S60_DAY,
  },
]

/**
 * Form component for TraderFilter settings
 */
export const TraderFilterForm: React.FC<TraderFilterFormProps> = ({
  isMobile,
  timeFrame,
  setTimeFrame,
  protocols,
  setProtocols,
  pairs,
  setPairs,
  protocolOptions,
  pairOptions,
  conditionFormValues,
  setConditionFormValues,
  matchingTraderCount,
  setMatchingTraderCount,
}) => {
  const { allowedSelectProtocols } = useProtocolPermission()
  return (
    <Flex flex={1} flexDirection="column" sx={{ overflow: 'auto', maxHeight: isMobile ? '90%' : '60svh' }}>
      <Type.Caption color="neutral2" mb={2}>
        <Trans>
          Please adjust your filter criteria to match{' '}
          <Type.CaptionBold color="neutral1">less than {formatNumber(LIMIT_TRADERS, 0)} traders.</Type.CaptionBold>
        </Trans>
      </Type.Caption>
      <ResultEstimated
        ranges={convertRangesFromFormValues({ condition: conditionFormValues, pairs })}
        type={timeFrame}
        protocols={(protocols === 'all' ? allowedSelectProtocols : protocols) as ProtocolEnum[]}
        filterTab={FilterTabEnum.DEFAULT}
        onCountChange={setMatchingTraderCount} // This will be handled by the parent component
        zIndex={0}
        sx={{ px: 0, height: 65, mb: 2 }}
      />

      <Flex flexDirection="column" sx={{ gap: 2 }}>
        {/* Time Frame */}
        <Box>
          <Type.Caption mb={2} color="neutral2">
            <Trans>TIME FRAME</Trans>
          </Type.Caption>
          <RadioGroup
            value={timeFrame}
            onChange={(value) => setTimeFrame(value as TimeFilterByEnum)}
            options={TIMEFRAME_OPTIONS}
            sxChildren={{ textTransform: 'uppercase' }}
            sx={{ gap: isMobile ? 2 : 3 }}
          />
        </Box>

        {/* Protocol Filter */}
        <Flex flexDirection="column" alignItems="flex-start" sx={{ gap: isMobile ? 3 : 2 }}>
          <Flex flex={1} flexDirection="column" width="100%">
            <Label label="PROTOCOL" />
            <Select
              closeMenuOnSelect={false}
              className="select-container pad-right-0"
              maxHeightSelectContainer={isMobile ? '40px' : '56px'}
              maxMenuHeight={isMobile ? 100 : 150}
              options={protocolOptions}
              defaultMenuIsOpen={false}
              value={protocolOptions.filter((option) => protocols.includes(option.value))}
              onChange={(newValue: any) => {
                const values = newValue?.map((data: any) => data.value)
                if (protocols === 'all') {
                  setProtocols(values.filter((v: any) => v !== 'all'))
                } else {
                  if (values.includes('all')) {
                    setProtocols('all')
                  } else {
                    setProtocols(values)
                  }
                }
              }}
              isSearchable
              isMulti
            />
            {!protocols?.length && (
              <Type.Caption mt={1} color="red1">
                <Trans>Please select at least one protocol</Trans>
              </Type.Caption>
            )}
          </Flex>

          {/* Market Filter */}
          <Flex flex={1} flexDirection="column" width="100%">
            <Label label="MARKET" />
            <Select
              closeMenuOnSelect={false}
              className="select-container pad-right-0"
              maxHeightSelectContainer={isMobile ? '40px' : '56px'}
              maxMenuHeight={isMobile ? 100 : 150}
              options={pairOptions}
              value={pairOptions.filter((option) => pairs.includes(option.value))}
              onChange={(newValue: any) => {
                const values = newValue?.map((data: any) => data.value)
                if (pairs === 'all') {
                  setPairs(values.filter((v: any) => v !== 'all'))
                } else {
                  if (values.includes('all')) {
                    setPairs('all')
                  } else {
                    setPairs(values)
                  }
                }
              }}
              isSearchable
              isMulti
            />
            {!pairs?.length && (
              <Type.Caption mt={1} color="red1">
                <Trans>Please select at least one pair</Trans>
              </Type.Caption>
            )}
          </Flex>
        </Flex>

        {/* Condition Filter Form */}
        <Box>
          <ConditionFilterForm
            type="default"
            formValues={conditionFormValues}
            setFormValues={setConditionFormValues}
            fieldOptions={defaultFieldOptions.filter((e) => !IGNORED_FITLER_FORM_FIELDS.includes(e.value))}
            onValuesChange={setConditionFormValues}
            wrapperSx={{ px: 0 }}
            labelColor="neutral2"
          />
        </Box>
      </Flex>
    </Flex>
  )
}

/**
 * Footer component with action buttons
 */
export const TraderFilterFooter: React.FC<TraderFilterFooterProps> = ({
  hasChange,
  name,
  description,
  timeFrame,
  protocols,
  pairs,
  conditionFormValues,
  matchingTraderCount,
  limitFilterTraders,
  handleResetFilter,
  handleApplyFilter,
  submitting,
  isNew,
}) => {
  const [openModal, setOpenModal] = useState(false)

  const onSubmit = () => {
    if (isNew) {
      setOpenModal(true)
    } else {
      handleApplyFilter()
    }
  }

  return (
    <Box>
      {matchingTraderCount > limitFilterTraders && (
        <Type.Caption color="red1">
          <Trans>
            The filter matches too many traders ({formatNumber(matchingTraderCount, 0)}/
            {formatNumber(limitFilterTraders, 0)})
          </Trans>
        </Type.Caption>
      )}
      <Flex justifyContent="flex-end" sx={{ gap: 2 }}>
        <Button variant="ghost" onClick={handleResetFilter} disabled={!hasChange || submitting}>
          <Trans>Reset</Trans>
        </Button>
        <Button
          variant="ghostPrimary"
          onClick={onSubmit}
          isLoading={submitting}
          disabled={
            submitting ||
            !protocols?.length ||
            !pairs?.length ||
            !conditionFormValues?.length ||
            matchingTraderCount === 0 ||
            matchingTraderCount > limitFilterTraders ||
            !hasChange
          }
        >
          <Trans>Save</Trans>
        </Button>
      </Flex>
      {openModal && timeFrame && protocols && pairs && conditionFormValues && (
        <BasicInfoModal
          isOpen
          defaultValues={{
            name,
            description,
            customType: AlertCustomType.TRADER_FILTER,
            ...transformFormValues({
              protocols,
              pairs,
              type: timeFrame,
              condition: conditionFormValues,
            }),
          }}
          submitting={submitting}
          onSubmit={handleApplyFilter}
          onDismiss={() => setOpenModal(false)}
        />
      )}
    </Box>
  )
}
