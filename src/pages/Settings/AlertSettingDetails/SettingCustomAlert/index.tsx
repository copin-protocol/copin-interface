import { Trans } from '@lingui/macro'
import { CaretRight, Funnel, Siren, UsersThree } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import SectionTitle from 'components/@ui/SectionTitle'
import { BotAlertData } from 'entities/alert'
import { useAlertSettingDetailsContext } from 'hooks/features/alert/useAlertDetailsContext'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import { useCustomAlertForm } from 'hooks/features/alert/useCustomAlertForm'
import useCheckFeature from 'hooks/features/subscription/useCheckFeature'
import { FilterTabEnum } from 'pages/Explorer/ConditionFilter/configs'
import useTradersCount from 'pages/Explorer/ConditionFilter/useTraderCount'
import { getAlertQuotaRequiredPlan } from 'pages/Settings/helpers'
import { Button } from 'theme/Buttons'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { AlertCategoryEnum, AlertCustomType, ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { generateAlertSettingDetailsRoute } from 'utils/helpers/generateRoute'

import DisplayFilter from './DisplayFilters'
import TraderFilter from './TraderFilter'
import TraderGroup from './TraderGroup'
import TradersTag from './TradersTag'
import { convertRangesFromFormValues } from './helpers'
import { CustomAlertFormValues } from './types'

interface SettingCustomAlertProps {
  botAlert?: BotAlertData
}

enum CustomAlertStep {
  BASIC_INFO = 'BASIC_INFO',
  TRADER_FILTER = 'TRADER_FILTER',
  TRADER_GROUP = 'TRADER_GROUP',
}

export default function SettingCustomAlert({ botAlert }: SettingCustomAlertProps) {
  const { groupTraders, isCreatingCustomAlert, maxTraderAlert } = useAlertSettingDetailsContext()

  const history = useHistory()
  const onSuccess = (data?: BotAlertData) => {
    if (data && data.id) {
      history.replace(generateAlertSettingDetailsRoute({ id: data.id, type: AlertCategoryEnum.CUSTOM }))
      if (customType === AlertCustomType.TRADER_GROUP) {
        methods.setValue('traderGroupAdd', [])
        methods.setValue('traderGroupUpdate', [])
        methods.setValue('traderGroupRemove', [])
      }
    }
    setCustomStep(CustomAlertStep.BASIC_INFO)
  }

  const {
    methods,
    defaultValues,
    name,
    description,
    customType,
    traderFilter,
    traderGroup,
    handleApplyTraderFilter,
    handleApplyTraderGroup,
    onSubmit,
    submitting,
  } = useCustomAlertForm({
    botAlert,
    onSuccess,
  })

  const [customStep, setCustomStep] = useState<CustomAlertStep>(CustomAlertStep.BASIC_INFO)
  const [matchingTraderCount, setMatchingTraderCount] = useState<number>(0)
  const totalTraderGroup: number = groupTraders?.data?.filter((e) => e.enableAlert)?.length ?? 0
  const safeMaxTraderAlert: number = maxTraderAlert ?? 0

  const { refetch } = useTradersCount({
    ranges: convertRangesFromFormValues({ condition: traderFilter.condition, pairs: traderFilter.pairs }),
    type: traderFilter.type ?? TimeFilterByEnum.S30_DAY,
    protocols: traderFilter.protocols as ProtocolEnum[],
    filterTab: FilterTabEnum.DEFAULT,
    onSuccess: (data) => {
      const count = data?.at?.(-1)?.counter ?? 0
      setMatchingTraderCount(count)
    },
  })

  const reloadMatchingTraders = refetch

  const onApply = (form: CustomAlertFormValues) => {
    switch (customStep) {
      case CustomAlertStep.TRADER_FILTER:
        handleApplyTraderFilter(form)
        break
      case CustomAlertStep.TRADER_GROUP:
        handleApplyTraderGroup(form)
        break
    }
    onSubmit(form)
  }

  const onRequestEdit = () => {
    switch (customType) {
      case AlertCustomType.TRADER_FILTER:
        setCustomStep(CustomAlertStep.TRADER_FILTER)
        break
      case AlertCustomType.TRADER_GROUP:
        setCustomStep(CustomAlertStep.TRADER_GROUP)
        break
    }
  }

  return (
    <>
      {customStep === CustomAlertStep.TRADER_GROUP ? (
        <TraderGroup
          isNew={isCreatingCustomAlert}
          matchingTraderCount={matchingTraderCount}
          setMatchingTraderCount={setMatchingTraderCount}
          defaultValues={{ ...defaultValues, ...traderGroup }}
          groupTraders={groupTraders}
          onBack={() => setCustomStep(CustomAlertStep.BASIC_INFO)}
          onApply={onApply}
          submitting={submitting}
        />
      ) : customStep === CustomAlertStep.TRADER_FILTER ? (
        <TraderFilter
          isNew={isCreatingCustomAlert}
          matchingTraderCount={matchingTraderCount}
          setMatchingTraderCount={setMatchingTraderCount}
          defaultValues={{ ...defaultValues, ...traderFilter }}
          onBack={() => {
            setCustomStep(CustomAlertStep.BASIC_INFO)
            reloadMatchingTraders()
          }}
          onApply={onApply}
          submitting={submitting}
        />
      ) : (
        <AlertBasicInfo
          isCreatingCustomAlert={isCreatingCustomAlert}
          name={name}
          description={description}
          customType={customType}
          traderFilter={traderFilter}
          totalTraderGroup={totalTraderGroup}
          maxTraderAlert={safeMaxTraderAlert}
          matchingTraderCount={matchingTraderCount}
          groupTraders={groupTraders}
          methods={methods}
          onSubmit={onSubmit}
          onRequestEdit={onRequestEdit}
          setCustomStep={setCustomStep}
        />
      )}
    </>
  )
}

interface AlertBasicInfoProps {
  isCreatingCustomAlert: boolean
  name?: string
  description?: string
  customType?: AlertCustomType
  traderFilter: any
  totalTraderGroup: number
  maxTraderAlert: number
  matchingTraderCount: number
  groupTraders: any
  methods: any
  onSubmit: (form: CustomAlertFormValues) => void
  onRequestEdit: () => void
  setCustomStep: (step: CustomAlertStep) => void
}

function AlertBasicInfo({
  isCreatingCustomAlert,
  name,
  description,
  customType,
  traderFilter,
  totalTraderGroup,
  maxTraderAlert,
  matchingTraderCount,
  groupTraders,
  methods,
  onSubmit,
  onRequestEdit,
  setCustomStep,
}: AlertBasicInfoProps) {
  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <AlertHeader
        isCreatingCustomAlert={isCreatingCustomAlert}
        name={name}
        customType={customType}
        totalTraderGroup={totalTraderGroup}
        maxTraderAlert={maxTraderAlert}
        matchingTraderCount={matchingTraderCount}
        methods={methods}
        onSubmit={onSubmit}
      />

      <Flex flexDirection="column" flex={1} px={3} pt={3} pb={1}>
        <Flex flexDirection="column" flex={1} sx={{ gap: 3, overflow: 'auto' }}>
          {!isCreatingCustomAlert ? (
            <ExistingAlertInfo
              description={description}
              customType={customType}
              traderFilter={traderFilter}
              totalTraderGroup={totalTraderGroup}
              groupTraders={groupTraders}
              methods={methods}
              onSubmit={onSubmit}
            />
          ) : (
            <NewAlertOptions customType={customType} setCustomStep={setCustomStep} />
          )}
        </Flex>
        <Flex
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            mt: 2,
          }}
        >
          <Button type="button" px={0} variant="ghostPrimary" onClick={onRequestEdit} disabled={isCreatingCustomAlert}>
            {isCreatingCustomAlert ? 'Save Alert' : 'Edit Alert'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

interface AlertHeaderProps {
  isCreatingCustomAlert: boolean
  name?: string
  customType?: AlertCustomType
  totalTraderGroup: number
  maxTraderAlert: number
  matchingTraderCount: number
  methods: any
  onSubmit: (form: CustomAlertFormValues) => void
}

function AlertHeader({
  isCreatingCustomAlert,
  name,
  customType,
  totalTraderGroup,
  maxTraderAlert,
  matchingTraderCount,
  methods,
  onSubmit,
}: AlertHeaderProps) {
  const { pagePermission } = useBotAlertContext()
  const requiredPlan = getAlertQuotaRequiredPlan({ section: 'customPersonalQuota', alertPermission: pagePermission })
  const { userNextPlan } = useCheckFeature({ requiredPlan })
  return (
    <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      <SectionTitle
        icon={Siren}
        title={
          <Flex alignItems="center" sx={{ gap: 2 }}>
            {isCreatingCustomAlert ? <Trans>CUSTOM ALERT</Trans> : name}
            {customType && (
              <BadgeWithLimit
                total={customType === AlertCustomType.TRADER_FILTER ? matchingTraderCount : totalTraderGroup}
                limit={customType !== AlertCustomType.TRADER_FILTER ? maxTraderAlert : undefined}
                tooltipContent={
                  userNextPlan && (
                    <PlanUpgradePrompt
                      requiredPlan={userNextPlan}
                      title={<Trans>You have exceeded your trader limit for the current plan.</Trans>}
                      confirmButtonVariant="textPrimary"
                      titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
                    />
                  )
                }
                clickableTooltip
              />
            )}
          </Flex>
        }
        sx={{ mb: 0, textTransform: 'uppercase' }}
      />
    </Flex>
  )
}

interface ExistingAlertInfoProps {
  description?: string
  customType?: AlertCustomType
  traderFilter: any
  totalTraderGroup: number
  groupTraders: any
  methods: any
  onSubmit: (form: CustomAlertFormValues) => void
}

function ExistingAlertInfo({
  description,
  customType,
  traderFilter,
  totalTraderGroup,
  groupTraders,
  methods,
  onSubmit,
}: ExistingAlertInfoProps) {
  return (
    <Flex flexDirection="column" sx={{ gap: 3 }}>
      {!!description && <Type.Caption color="neutral1">{description}</Type.Caption>}
      {customType === AlertCustomType.TRADER_FILTER && (
        <Flex flexDirection="column" alignItems="flex-start" sx={{ gap: 1 }}>
          <DisplayFilter {...traderFilter} />
        </Flex>
      )}
      {customType === AlertCustomType.TRADER_GROUP && (
        <Flex alignItems="center">
          <TradersTag
            title={
              <Type.Caption color="neutral1">{formatNumber(totalTraderGroup)} active traders in group</Type.Caption>
            }
            traders={groupTraders?.data ?? []}
            tagSx={{ color: 'neutral1', textTransform: 'initial' }}
          />
        </Flex>
      )}
    </Flex>
  )
}

interface NewAlertOptionsProps {
  customType?: AlertCustomType
  setCustomStep: (step: CustomAlertStep) => void
}

function NewAlertOptions({ customType, setCustomStep }: NewAlertOptionsProps) {
  return (
    <Flex flexDirection="column">
      <Type.Caption mb={2} color="neutral2">
        <Trans>Choose Object</Trans>
      </Type.Caption>
      {(!customType || customType === AlertCustomType.TRADER_FILTER) && (
        <Box>
          <Button
            variant="outline"
            sx={{ color: 'neutral1', textTransform: 'initial', width: '100%' }}
            onClick={() => setCustomStep(CustomAlertStep.TRADER_FILTER)}
          >
            <Flex flexDirection="column" alignItems="flex-start" sx={{ gap: 1 }}>
              <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <IconBox icon={<Funnel size={20} />} size={20} />
                  <Type.CaptionBold>
                    <Trans>Trader Filter</Trans>
                  </Type.CaptionBold>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <IconBox icon={<CaretRight />} />
                </Flex>
              </Flex>
            </Flex>
          </Button>
        </Box>
      )}

      {(!customType || customType === AlertCustomType.TRADER_GROUP) && (
        <Button
          mt={2}
          type="button"
          variant="outline"
          sx={{ color: 'neutral1', textTransform: 'initial' }}
          onClick={() => setCustomStep(CustomAlertStep.TRADER_GROUP)}
        >
          <Flex flexDirection="column" alignItems="flex-start" sx={{ gap: 1 }}>
            <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <IconBox icon={<UsersThree size={20} />} size={20} />
                <Type.CaptionBold>
                  <Trans>Trader Group</Trans>
                </Type.CaptionBold>
              </Flex>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <IconBox icon={<CaretRight />} />
              </Flex>
            </Flex>
          </Flex>
        </Button>
      )}
    </Flex>
  )
}
