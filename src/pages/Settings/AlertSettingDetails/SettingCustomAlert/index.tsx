import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { CaretRight, Siren, UsersThree } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import isEqual from 'lodash/isEqual'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import { normalizeTraderPayload } from 'apis/traderApis'
import { RangeFilter } from 'apis/types'
import SectionTitle from 'components/@ui/SectionTitle'
import { getFiltersFromFormValues } from 'components/@widgets/ConditionFilterForm/helpers'
import { BotAlertData, CustomAlertRequestData } from 'entities/alert'
import useCustomAlerts from 'hooks/features/alert/useCustomAlerts'
import FilterPairTag from 'pages/DailyTrades/FilterTags/FilterPairTag'
import FilterTag from 'pages/Explorer/ConditionFilter/FilterTag'
import { FilterTabEnum } from 'pages/Explorer/ConditionFilter/configs'
import useTradersCount from 'pages/Explorer/ConditionFilter/useTraderCount'
import { Button } from 'theme/Buttons'
import InputField, { TextareaField } from 'theme/InputField'
import { Flex, IconBox, Type } from 'theme/base'
import { AlertCategoryEnum, ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'
import { getPairFromSymbol, getSymbolFromPair } from 'utils/helpers/transform'

import FilterProtocolTag from './FilterProtocolTag'
import FilterTimeframeTag from './FilterTimeframeTag'
import TraderFilter from './TraderFilter'
import { LIMIT_FILTER_TRADERS } from './config'
import {
  convertConfigToConditionValues,
  convertRangesFromFormValues,
  normalizeCondition,
  transformFormValues,
} from './helpers'
import { CustomAlertFormValues } from './types'
import { customSchema } from './yupSchemas'

interface SettingCustomAlertProps {
  botAlert?: BotAlertData
}

enum CustomAlertStep {
  BASIC_INFO = 'BASIC_INFO',
  TRADER_FILTER = 'TRADER_FILTER',
}

export default function SettingCustomAlert({ botAlert }: SettingCustomAlertProps) {
  const isNew = botAlert?.id === 'new'
  const defaultValues = useMemo(() => {
    return {
      name: !isNew ? botAlert?.name : undefined,
      description: botAlert?.description,
      type: botAlert?.config?.type ?? TimeFilterByEnum.S30_DAY,
      protocols: botAlert?.config?.['protocol']?.in,
      pairs: botAlert?.config?.['pairs']?.in?.map((pair) => getSymbolFromPair(pair)),
      condition: convertConfigToConditionValues(botAlert?.config),
    } as CustomAlertFormValues
  }, [botAlert?.config, botAlert?.description, botAlert?.name, isNew])

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<CustomAlertFormValues>({
    mode: 'onChange',
    resolver: yupResolver(customSchema),
    defaultValues,
  })
  const name = watch('name')
  const description = watch('description')
  const type = watch('type')
  const protocols = watch('protocols')
  const pairs = watch('pairs')
  const condition = watch('condition')

  const isShowAction = !!protocols?.length || !!pairs?.length || !!condition?.length

  const [customStep, setCustomStep] = useState(CustomAlertStep.BASIC_INFO)
  const [matchingTraderCount, setMatchingTraderCount] = useState(0)
  const [showAnnotation, setShowAnnotation] = useState(false)

  const hasChange = useMemo(() => {
    return !isEqual(
      { ...defaultValues, condition: normalizeCondition(defaultValues?.condition) },
      {
        name,
        description,
        ...transformFormValues({
          protocols,
          pairs,
          type,
          condition: normalizeCondition(condition),
        }),
      }
    )
  }, [condition, defaultValues, description, name, pairs, protocols, type])

  const { refetch: reloadMatchingTraders } = useTradersCount({
    ranges: convertRangesFromFormValues({ condition, pairs }),
    type: type ?? TimeFilterByEnum.S30_DAY,
    protocols: protocols as ProtocolEnum[],
    filterTab: FilterTabEnum.DEFAULT,
    onSuccess: (data) => {
      const count = data?.at?.(-1)?.counter ?? 0
      setMatchingTraderCount(count)
    },
  })

  const history = useHistory()
  const onSuccess = (data?: BotAlertData) => {
    if (data && data.id) {
      history.replace(generateAlertSettingDetailsRoute({ id: data.id, type: AlertCategoryEnum.CUSTOM }))
    }
  }
  const { createCustomAlert, updateCustomAlert } = useCustomAlerts({ onSuccess })

  const handleSaveCustomAlert = (values: CustomAlertFormValues) => {
    const { name, description, type, protocols, pairs, condition } = values
    if (!type && !protocols?.length && !pairs?.length && !condition?.length) {
      return
    }
    clearErrors()
    const parsedCondition = condition ? getFiltersFromFormValues(condition) : []
    const ranges: RangeFilter[] = []
    if (!!protocols?.length) {
      ranges.push({
        fieldName: 'protocol',
        in: protocols,
      })
    }
    if (!!pairs?.length) {
      ranges.push({
        fieldName: 'pairs',
        in: pairs.map((e) => getPairFromSymbol(e)),
      })
    }
    const { ranges: normalizeCondition } = normalizeTraderPayload({ ranges: parsedCondition })
    const requestData = {
      name,
      description,
      queries: [{ fieldName: 'type', value: type }],
      ranges: [...ranges, ...(normalizeCondition ?? [])],
    } as CustomAlertRequestData
    if (!botAlert?.id || botAlert?.id === 'new') {
      createCustomAlert(requestData)
    } else {
      updateCustomAlert({ id: botAlert?.id, data: requestData })
    }
  }

  const handleTraderFilterChange = (filters: CustomAlertFormValues) => {
    setValue('type', filters.type)
    setValue('protocols', filters.protocols)
    setValue('pairs', filters.pairs)
    setValue('condition', filters.condition)
    setCustomStep(CustomAlertStep.BASIC_INFO)
    clearErrors()
  }

  const { lg } = useResponsive()

  if (customStep === CustomAlertStep.TRADER_FILTER) {
    return (
      <TraderFilter
        matchingTraderCount={matchingTraderCount}
        setMatchingTraderCount={setMatchingTraderCount}
        defaultValues={{ name, description, type, protocols, pairs, condition }}
        onBack={() => {
          setCustomStep(CustomAlertStep.BASIC_INFO)
          reloadMatchingTraders()
        }}
        onApply={handleTraderFilterChange}
      />
    )
  }

  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <SectionTitle icon={Siren} title={<Trans>CUSTOM ALERT</Trans>} sx={{ mb: 0 }} />
      </Flex>

      <Flex flexDirection="column" flex={1} p={3}>
        <form style={{ height: '100%' }} onSubmit={handleSubmit(handleSaveCustomAlert)}>
          <Flex flexDirection="column" flex={1} sx={{ gap: 3, overflow: 'auto' }}>
            <InputField
              required
              block
              annotation={showAnnotation}
              label={<Trans>Alert Name (Required)</Trans>}
              defaultValue={name}
              placeholder="Input alert name"
              {...register('name', {
                required: { value: true, message: 'This field is required' },
                onChange: () => {
                  if (!showAnnotation) {
                    setShowAnnotation(true)
                  }
                },
              })}
              maxLength={20}
              error={errors?.name?.message}
            />

            <TextareaField
              block
              label={<Trans>Description</Trans>}
              placeholder="Input alert description"
              rows={3}
              {...register('description')}
              error={errors?.description?.message}
              sx={{ textarea: { fontSize: 12 } }}
            />

            <Flex flexDirection="column">
              <Type.Caption mb={2} color="neutral2">
                <Trans>Choose Object</Trans>
              </Type.Caption>
              <Button
                variant="outline"
                sx={{ color: 'neutral1', textTransform: 'initial' }}
                onClick={() => setCustomStep(CustomAlertStep.TRADER_FILTER)}
              >
                <Flex flexDirection="column" alignItems="flex-start" sx={{ gap: 1 }}>
                  <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
                    <Flex alignItems="center" sx={{ gap: 2 }}>
                      <IconBox icon={<UsersThree size={20} />} size={20} />
                      <Type.CaptionBold>
                        <Trans>Trader</Trans>
                        {isShowAction && ':'}
                      </Type.CaptionBold>
                      {isShowAction && (
                        <Type.Caption color="neutral1">
                          {formatNumber(matchingTraderCount, 0)} traders matching filters
                        </Type.Caption>
                      )}
                    </Flex>
                    <Flex alignItems="center" sx={{ gap: 2 }}>
                      {!isShowAction && matchingTraderCount === 0 && (
                        <Type.Caption color="orange1">
                          <Trans>No Filter</Trans>
                        </Type.Caption>
                      )}
                      <IconBox icon={<CaretRight />} />
                    </Flex>
                  </Flex>
                  {isShowAction && (
                    <Flex alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                      <FilterProtocolTag
                        protocols={!!protocols?.length ? (protocols as ProtocolEnum[]) : undefined}
                        tagSx={{ color: 'neutral2' }}
                      />
                      <FilterPairTag
                        pairs={!!pairs?.length ? pairs : undefined}
                        tagSx={{ color: 'neutral2' }}
                        textColor="primary1"
                        hasLabel
                      />
                      {type && <FilterTimeframeTag type={type} tagSx={{ color: 'neutral2' }} />}
                      {condition && (
                        <FilterTag
                          filters={condition}
                          filterTab={FilterTabEnum.DEFAULT}
                          limit={lg ? 10 : 5}
                          tagSx={{
                            color: 'neutral2',
                            display: 'inline',
                          }}
                        />
                      )}
                    </Flex>
                  )}
                </Flex>
              </Button>
              {errors?.type?.message && (
                <Type.Caption mt={1} color="red1">
                  You must have completed at least one filter
                </Type.Caption>
              )}
              {matchingTraderCount > LIMIT_FILTER_TRADERS && (
                <Type.Caption mt={1} color="red1">
                  The filter matches too many traders ({formatNumber(matchingTraderCount, 0)}/
                  {formatNumber(LIMIT_FILTER_TRADERS, 0)})
                </Type.Caption>
              )}
            </Flex>
          </Flex>
          <Flex
            sx={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Button
              type="submit"
              px={0}
              variant="ghostPrimary"
              disabled={
                !name ||
                matchingTraderCount === 0 ||
                matchingTraderCount > LIMIT_FILTER_TRADERS ||
                !!errors.type ||
                !hasChange
              }
            >
              Save Alert
            </Button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  )
}
