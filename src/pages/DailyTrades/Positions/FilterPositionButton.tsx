import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'
import { Fragment, useEffect, useState } from 'react'

import { PositionStatusSelect } from 'components/@dailyTrades/PositionStatusFilterIcon'
import { POSITION_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import { MarketSelect } from 'components/@widgets/PairFilterIcon'
import { MobileRangeFilterButtons, MobileRangeFilterItem } from 'components/@widgets/TableFilter/MobileRangeFilter'
import { PositionData } from 'entities/trader'
import useLiveTradesPermission from 'hooks/features/subscription/useLiveTradesPermission'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Label from 'theme/InputField/Label'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

import { DaliPositionsContextValues, useDailyPositionsContext } from './usePositionsProvider'

export default function FilterPositionButton() {
  const { isEnabledFilterPosition, planToFilterPosition, positionFieldsAllowed } = useLiveTradesPermission()

  const [openModal, setOpenModal] = useState(false)
  const { setSearchParamsOnly } = useSearchParams()
  const { ranges, pairs, excludedPairs, status, changeFilters } = useDailyPositionsContext()
  const [_rangesFilter, _setRangesFilter] = useState<Record<string, DaliPositionsContextValues['ranges'][0]>>(() => {
    if (ranges.length) {
      return ranges.reduce((result, values) => {
        const newValues = { ...values }
        return { ...result, [values.field as any]: newValues }
      }, {})
    }
    return {}
  })
  const _onChangeRangeValue = ({
    valueKey,
    gte,
    lte,
    isGte,
    isLte,
  }: {
    valueKey: string
    gte?: number
    lte?: number
    isGte?: boolean
    isLte?: boolean
  }) => {
    _setRangesFilter((prev) => {
      const newValues = { ...(prev[valueKey] ?? {}), field: valueKey as any }
      if (isGte) newValues.gte = gte
      if (isLte) newValues.lte = lte
      return { ...prev, [valueKey]: newValues }
    })
  }
  const [_pairs, _setPairs] = useState<string[]>(pairs)
  const [_excludedPairs, _setExcludedPairs] = useState<string[]>(excludedPairs)
  const _changePairs = (pairs: string[], excludedPairs: string[]) => {
    _setPairs(pairs)
    _setExcludedPairs(excludedPairs)
  }
  useEffect(() => {
    _changePairs(pairs, excludedPairs)
  }, [pairs, excludedPairs])

  const [_status, _setStatus] = useState(status)

  const _onApply = () => {
    changeFilters({ status: _status, pairs: _pairs, ranges: Object.values(_rangesFilter) })
    setOpenModal(false)
  }
  const _onReset = () => {
    setSearchParamsOnly({})
    setOpenModal(false)
  }
  const hasFilter = !!pairs?.length || !!status || !!ranges?.length

  return (
    <>
      <Button
        variant="ghost"
        sx={{ p: 0, px: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'normal' }}
        onClick={() => setOpenModal(true)}
      >
        <IconBox icon={<Funnel size={20} weight="fill" />} color={hasFilter ? 'neutral1' : 'neutral3'} />
      </Button>
      {openModal && (
        <Modal
          isOpen={openModal}
          minHeight="80svh"
          mode="bottom"
          maxHeight="80svh"
          onDismiss={() => setOpenModal(false)}
        >
          {isEnabledFilterPosition ? (
            <Flex height="100%" sx={{ flexDirection: 'column' }}>
              <Flex px={3} pt={3} mb={24} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Type.BodyBold>FILTERS</Type.BodyBold>
                {/* <IconBox icon={<XCircle size={20} />} onClick={() => setOpenModal(false)} /> */}
              </Flex>
              <Box flex="1 0 0" overflow="auto">
                <Box px={3} pb={3}>
                  <Label label="Status" labelColor="neutral1" />
                  <PositionStatusSelect currentFilter={_status} changeFilter={_setStatus} />
                  <Box mb={3} />
                  <MarketSelect
                    key={openModal.toString()}
                    pairs={_pairs}
                    excludedPairs={_excludedPairs}
                    onChange={_changePairs}
                  />
                  <Box mb={3} />
                  <Label label="Others" labelColor="neutral1" />
                  {Object.entries(POSITION_RANGE_CONFIG_MAPPING).map(([valueKey, configs]) => {
                    const { gte, lte } = _rangesFilter[valueKey] ?? {}
                    if (
                      positionFieldsAllowed != null &&
                      !positionFieldsAllowed.includes(valueKey as keyof PositionData)
                    )
                      return <Fragment key={valueKey}></Fragment>
                    return (
                      <Box key={valueKey} mb={2}>
                        <MobileRangeFilterItem
                          configs={configs}
                          gte={gte}
                          lte={lte}
                          onChangeGte={(e) => _onChangeRangeValue({ valueKey, isGte: true, gte: e })}
                          onChangeLte={(e) => _onChangeRangeValue({ valueKey, isLte: true, lte: e })}
                        />
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <MobileRangeFilterButtons onApply={_onApply} onReset={_onReset} />
            </Flex>
          ) : (
            <PlanUpgradePrompt
              requiredPlan={planToFilterPosition}
              title={
                <Trans>
                  This features is available from {SUBSCRIPTION_PLAN_TRANSLATION[planToFilterPosition]} plan
                </Trans>
              }
              showTitleIcon
              showLearnMoreButton
              learnMoreSection={SubscriptionFeatureEnum.LIVE_TRADES}
            />
          )}
        </Modal>
      )}
    </>
  )
}
