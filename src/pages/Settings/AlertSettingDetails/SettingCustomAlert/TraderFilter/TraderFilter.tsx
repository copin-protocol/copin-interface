import { Trans } from '@lingui/macro'
import { ArrowLeft } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import isEqual from 'lodash/isEqual'
import React, { ReactNode, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { getProtocolOptions } from 'components/@copyTrade/configs'
import ToastBody from 'components/@ui/ToastBody'
import ConditionFilterForm from 'components/@widgets/ConditionFilterForm'
import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import ResultEstimated from 'pages/Explorer/ConditionFilter/ResultEstimated'
import { FilterTabEnum, getFilterOptions } from 'pages/Explorer/ConditionFilter/configs'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Label from 'theme/InputField/Label'
import Popconfirm from 'theme/Popconfirm'
import RadioGroup from 'theme/RadioGroup'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import { LIMIT_FILTER_TRADERS } from '../config'
import { convertRangesFromFormValues, normalizeCondition, transformFormValues } from '../helpers'
import { CustomAlertFormValues } from '../types'

// This file re-exports the refactored implementation

const TIMEFRAME_OPTIONS: { label: ReactNode; value: string }[] = [
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

interface TraderFilterProps {
  defaultValues?: CustomAlertFormValues
  onBack: () => void
  onApply: (filters: CustomAlertFormValues) => void
  matchingTraderCount: number
  setMatchingTraderCount: (value: number) => void
}

export default function TraderFilter({
  defaultValues,
  onBack,
  onApply,
  matchingTraderCount,
  setMatchingTraderCount,
}: TraderFilterProps) {
  const { lg } = useResponsive()
  const { pagePermission, userPermission } = useExplorerPermission()
  const fieldOptions = useMemo(
    () =>
      getFilterOptions({
        pagePermission,
        userPermission,
      }),
    [pagePermission, userPermission]
  )
  const isMobile = !lg
  const [conditionFormValues, setConditionFormValues] = useState<ConditionFormValues<TraderData>>(
    defaultValues?.condition || []
  )
  const [timeFrame, setTimeFrame] = useState<TimeFilterByEnum>(defaultValues?.type || TimeFilterByEnum.S30_DAY)
  const [protocols, setProtocols] = useState<'all' | string[]>(defaultValues?.protocols ?? 'all')
  const [pairs, setPairs] = useState<'all' | string[]>(defaultValues?.pairs ?? 'all')

  const hasChange = useMemo(() => {
    return !isEqual(
      {
        ...defaultValues,
        type: defaultValues?.type ?? TimeFilterByEnum.S30_DAY,
        condition: normalizeCondition(defaultValues?.condition),
      },
      {
        ...defaultValues,
        ...transformFormValues({
          protocols,
          pairs,
          type: timeFrame,
          condition: conditionFormValues,
        }),
      }
    )
  }, [conditionFormValues, defaultValues, pairs, protocols, timeFrame])

  const {
    allowedSelectProtocols,
    userPermission: userProtocolPermission,
    pagePermission: pageProtocolPermission,
  } = useProtocolPermission()
  const protocolOptions = useMemo(() => {
    return getProtocolOptions({
      userPermission: userProtocolPermission,
      pagePermission: pageProtocolPermission,
    })
  }, [userProtocolPermission, pageProtocolPermission])

  const _protocolOptions = useMemo(() => {
    const allOptions = [...protocolOptions]
    if (!allOptions?.length) return []
    allOptions.unshift({ value: 'all', label: <Trans>All Allowed Protocols</Trans>, isDisabled: false })
    return allOptions
  }, [protocolOptions])

  const { getListSymbolOptions } = useMarketsConfig()
  const pairOptions = useMemo(() => {
    const allOptions = getListSymbolOptions?.()
    if (!allOptions?.length) return []
    allOptions.unshift({ id: 'all', value: 'all', label: 'All Pairs' })
    return allOptions
  }, [getListSymbolOptions])

  const handleApplyFilter = () => {
    if (!protocols) {
      return
    }
    if (matchingTraderCount === 0 || matchingTraderCount > LIMIT_FILTER_TRADERS) {
      toast.error(
        <ToastBody
          title={<Trans>Warning</Trans>}
          message={
            <Trans>
              Please adjust your filter criteria to match less than {formatNumber(LIMIT_FILTER_TRADERS)} traders.
            </Trans>
          }
        />
      )
    } else {
      onApply(
        transformFormValues({
          protocols,
          pairs,
          type: timeFrame,
          condition: conditionFormValues,
        })
      )
    }
  }

  const handleResetFilter = () => {
    setConditionFormValues(defaultValues?.condition ?? [])
    setTimeFrame(defaultValues?.type || TimeFilterByEnum.S30_DAY)
    setProtocols(defaultValues?.protocols ?? 'all')
    setPairs(defaultValues?.pairs ?? 'all')
  }

  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'auto' }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={3}
        py={2}
        sx={{ borderBottom: 'small', borderColor: 'neutral4' }}
      >
        {hasChange ? (
          <Popconfirm
            action={<IconButton icon={<ArrowLeft size={20} />} size={20} variant="ghost" sx={{ p: 0 }}></IconButton>}
            title="Discard changes?"
            description="You have unsaved changes. Are you sure to discard them?"
            onConfirm={onBack}
            cancelAfterHide={false}
            confirmButtonProps={{ variant: 'ghostDanger' }}
          />
        ) : (
          <IconButton
            icon={<ArrowLeft size={20} />}
            size={20}
            variant="ghost"
            onClick={onBack}
            sx={{ p: 0 }}
          ></IconButton>
        )}
        <Type.Body>TRADER FILTER</Type.Body>
        <Box width={20} />
      </Flex>

      <Box p={3} sx={{ overflow: 'hidden' }}>
        <Flex flex={1} flexDirection="column" sx={{ overflow: 'auto', maxHeight: isMobile ? '90%' : '60svh' }}>
          <Type.Caption color="neutral2" mb={2}>
            Please adjust your filter criteria to match{' '}
            <Type.CaptionBold color="neutral1">
              less than {formatNumber(LIMIT_FILTER_TRADERS, 0)} traders.
            </Type.CaptionBold>
          </Type.Caption>
          <ResultEstimated
            ranges={convertRangesFromFormValues({ condition: conditionFormValues, pairs })}
            type={timeFrame}
            protocols={(protocols === 'all' ? allowedSelectProtocols : protocols) as ProtocolEnum[]}
            filterTab={FilterTabEnum.DEFAULT}
            onCountChange={setMatchingTraderCount}
            zIndex={0}
            sx={{ px: 0, height: 65, mb: 2 }}
          />

          <Flex flexDirection="column" sx={{ gap: 2 }}>
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

            {/* Market Filter */}
            <Flex flexDirection="column" alignItems="flex-start" sx={{ gap: isMobile ? 3 : 2 }}>
              <Flex flex={1} flexDirection="column" width="100%">
                <Label label="PROTOCOL" />
                <Select
                  closeMenuOnSelect={false}
                  className="select-container pad-right-0"
                  maxHeightSelectContainer={isMobile ? '40px' : '56px'}
                  maxMenuHeight={isMobile ? 100 : 150}
                  options={_protocolOptions}
                  defaultMenuIsOpen={false}
                  value={_protocolOptions.filter((option) => protocols.includes(option.value))}
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
                    Please select at least one protocol
                  </Type.Caption>
                )}
              </Flex>
              <Flex flex={1} flexDirection="column" width="100%">
                <Label label="MARKET" />
                <Select
                  closeMenuOnSelect={false}
                  className="select-container pad-right-0"
                  maxHeightSelectContainer={isMobile ? '40px' : '56px'}
                  maxMenuHeight={isMobile ? 100 : 150}
                  options={pairOptions}
                  value={pairOptions?.filter?.((option) => pairs.includes(option.value))}
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
                    Please select at least one pair
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
                fieldOptions={fieldOptions}
                onValuesChange={setConditionFormValues}
                wrapperSx={{ px: 0 }}
                labelColor="neutral2"
              />
            </Box>
          </Flex>
        </Flex>
        <Box>
          {matchingTraderCount > LIMIT_FILTER_TRADERS && (
            <Type.Caption color="red1">
              The filter matches too many traders ({formatNumber(matchingTraderCount, 0)}/
              {formatNumber(LIMIT_FILTER_TRADERS, 0)})
            </Type.Caption>
          )}
          <Flex justifyContent="flex-end" sx={{ gap: 2 }}>
            <Button variant="ghost" onClick={handleResetFilter} disabled={!hasChange}>
              <Trans>Reset</Trans>
            </Button>
            <Button
              variant="ghostPrimary"
              onClick={handleApplyFilter}
              disabled={
                !protocols?.length ||
                !pairs?.length ||
                !conditionFormValues?.length ||
                matchingTraderCount === 0 ||
                matchingTraderCount > LIMIT_FILTER_TRADERS ||
                !hasChange
              }
            >
              <Trans>Apply Filter</Trans>
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}
