import { Funnel, XCircle } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'

import { MobileRangeFilterButtons, MobileRangeFilterItem } from 'components/@widgets/TableFilter/MobileRangeFilter'
import { RangeFilterValues } from 'components/@widgets/TableFilter/types'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

import { TOP_POSITION_RANGE_CONFIG_MAPPING } from '../configs'
import useGetFilterRange from './useGetFilterRange'

export default function FilterPositionButton() {
  const [openModal, setOpenModal] = useState(false)
  const { ranges, setSearchParams, setSearchParamsOnly } = useGetFilterRange()
  const [_rangesFilter, _setRangesFilter] = useState<Record<string, RangeFilterValues>>(() => {
    if (ranges.length) {
      return ranges.reduce((result, values) => {
        return { ...result, [values.field]: values }
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

  const changeFilters = useCallback(() => {
    const params: Record<string, string | undefined> = { ['page']: '1' }
    Object.entries(_rangesFilter).forEach(([key, values]) => {
      const gte = values?.gte
      const lte = values?.lte
      params[`${values.field}g`] = gte ? gte.toString() : undefined
      params[`${values.field}l`] = lte ? lte.toString() : undefined
    })
    setSearchParams(params)
  }, [setSearchParams, _rangesFilter])

  const _onApply = () => {
    changeFilters()
    setOpenModal(false)
  }
  const _onReset = () => {
    setSearchParamsOnly({})
    _setRangesFilter({})
    setOpenModal(false)
  }
  const hasFilter = !!ranges?.length

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
          minHeight="50svh"
          mode="bottom"
          maxHeight="50svh"
          onDismiss={() => setOpenModal(false)}
        >
          <Flex height="100%" px={3} pt={3} sx={{ flexDirection: 'column' }}>
            <Flex mb={24} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <Type.BodyBold>FILTERS</Type.BodyBold>
              <IconBox icon={<XCircle size={20} />} onClick={() => setOpenModal(false)} />
            </Flex>
            <Box flex="1 0 0" overflow="auto">
              {Object.entries(TOP_POSITION_RANGE_CONFIG_MAPPING).map(([valueKey, configs]) => {
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
            <Box />
          </Flex>
        </Modal>
      )}
    </>
  )
}
