import { Funnel, XCircle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import { DirectionSelect } from 'components/@dailyTrades/DirectionFilterIcon'
import { OrderActionSelect } from 'components/@dailyTrades/OrderActionFilterIcon'
import { ORDER_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import { MarketSelect } from 'components/@widgets/PairFilterIcon'
import { MobileRangeFilterButtons, MobileRangeFilterItem } from 'components/@widgets/TableFilter/MobileRangeFilter'
import useSearchParams from 'hooks/router/useSearchParams'
import { Button } from 'theme/Buttons'
import Label from 'theme/InputField/Label'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

import { DailyOrderContextValues, useDailyOrdersContext } from './useOrdersProvider'

export default function FilterOrderButton() {
  const [openModal, setOpenModal] = useState(false)
  const { setSearchParamsOnly } = useSearchParams()
  const { ranges, pairs, excludedPairs, action, changeFilters, direction } = useDailyOrdersContext()
  const [_rangesFilter, _setRangesFilter] = useState<Record<string, DailyOrderContextValues['ranges'][0]>>(() => {
    if (ranges.length) {
      return ranges.reduce((result, values) => {
        return { ...result, [values.field as any]: values }
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
  const [_pairs, _setPairs] = useState<{ pairs: string[]; excludedPairs: string[] }>({ pairs, excludedPairs })
  const _changePairs = (pairs: string[], excludedPairs: string[]) => {
    _setPairs({ pairs, excludedPairs })
  }
  useEffect(() => {
    _changePairs(pairs, excludedPairs)
  }, [pairs, excludedPairs])
  const [_action, _setAction] = useState(action)
  const [_direction, _setDirection] = useState(direction)

  const _onApply = () => {
    changeFilters({
      action: _action,
      pairs: _pairs.pairs,
      excludedPairs: _pairs.excludedPairs,
      ranges: Object.values(_rangesFilter),
      direction: _direction,
    })
    setOpenModal(false)
  }
  const _onReset = () => {
    setSearchParamsOnly({})
    _setRangesFilter({})
    setOpenModal(false)
  }

  const hasFilter = !!pairs?.length || !!action || !!ranges?.length

  return (
    <>
      <Button
        variant="ghost"
        sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'normal' }}
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
          <Flex height="100%" px={3} pt={3} sx={{ flexDirection: 'column' }}>
            <Flex mb={24} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Type.BodyBold>FILTERS</Type.BodyBold>
              <IconBox icon={<XCircle size={20} />} onClick={() => setOpenModal(false)} />
            </Flex>
            <Box flex="1 0 0" overflow="auto">
              <Label label="Status" labelColor="neutral1" />
              <OrderActionSelect currentFilter={_action} changeFilter={_setAction} />
              <Box mb={3} />
              <Label label="Direction" labelColor="neutral1" />
              <DirectionSelect direction={_direction} changeDirection={_setDirection} />
              <Box mb={3} />
              <MarketSelect
                key={openModal.toString()}
                pairs={_pairs.pairs}
                excludedPairs={_pairs.excludedPairs}
                onChange={_changePairs}
              />
              <Box mb={3} />
              <Label label="Others" labelColor="neutral1" />
              {Object.entries(ORDER_RANGE_CONFIG_MAPPING).map(([valueKey, configs]) => {
                const { gte, lte } = _rangesFilter[valueKey] ?? {}
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
            <MobileRangeFilterButtons onApply={_onApply} onReset={_onReset} />
          </Flex>
        </Modal>
      )}
    </>
  )
}
