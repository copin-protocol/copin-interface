import { Funnel, XCircle } from '@phosphor-icons/react'
import { useState } from 'react'

import { OrderActionSelect } from 'components/@dailyTrades/OrderActionFilterTitle'
import { MarketSelect } from 'components/@dailyTrades/PairFilterTitle'
import { ORDER_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import Label from 'theme/InputField/Label'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

import { DailyOrderContextValues, useDailyOrdersContext } from './useOrdersProvider'

export default function FilterOrderButton() {
  const [openModal, setOpenModal] = useState(false)
  const { ranges, pairs, action, changeFilters } = useDailyOrdersContext()
  const [_rangesFilter, _setRangesFilter] = useState<Record<string, DailyOrderContextValues['ranges'][0]>>(() => {
    if (ranges.length) {
      return ranges.reduce((result, values) => {
        const newValues = { ...values }
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
  const [_pairs, _setPairs] = useState(pairs)
  const [_action, _setAction] = useState(action)

  const _onApply = () => {
    changeFilters({ action: _action, pairs: _pairs, ranges: Object.values(_rangesFilter) })
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
      <Modal isOpen={openModal} minHeight="80svh" mode="bottom" maxHeight="80svh" onDismiss={() => setOpenModal(false)}>
        <Flex height="100%" p={3} sx={{ flexDirection: 'column' }}>
          <Flex mb={24} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Type.BodyBold>Filters</Type.BodyBold>
            <IconBox icon={<XCircle size={20} />} onClick={() => setOpenModal(false)} />
          </Flex>
          <Box flex="1 0 0" overflow="auto">
            <Label label="Status" labelColor="neutral1" />
            <OrderActionSelect currentFilter={_action} changeFilter={_setAction} />
            <Box mb={3} />
            <MarketSelect pairs={_pairs} onChange={_setPairs} />
            <Box mb={3} />
            <Label label="Others" labelColor="neutral1" />
            {Object.entries(ORDER_RANGE_CONFIG_MAPPING).map(([valueKey, configs]) => {
              const { gte, lte } = _rangesFilter[valueKey] ?? {}
              return (
                <Flex mb={2} sx={{ width: '100%', alignItems: 'center', gap: 3, '& > *': { flex: 1 } }} key={valueKey}>
                  <Type.Caption>{configs.title}</Type.Caption>
                  <Input
                    type="number"
                    value={gte}
                    suffix={configs.unit}
                    affix={'>='}
                    block
                    sx={{ p: 1 }}
                    onChange={(e) => _onChangeRangeValue({ valueKey, isGte: true, gte: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    value={lte}
                    suffix={configs.unit}
                    affix={'<='}
                    block
                    sx={{ p: 1 }}
                    onChange={(e) => _onChangeRangeValue({ valueKey, isLte: true, lte: Number(e.target.value) })}
                  />
                </Flex>
              )
            })}
          </Box>
          <Flex
            sx={{
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 2,
              width: '100%',
              '& > *': { flex: 1 },
              borderTop: 'small',
              borderTopColor: 'neutral4',
            }}
          >
            <Button variant="ghost" onClick={() => 1} sx={{ fontWeight: 400, p: 0 }}>
              Reset
            </Button>
            <Button variant="ghostPrimary" sx={{ fontWeight: 400, p: 0 }} onClick={_onApply}>
              Apply
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  )
}
