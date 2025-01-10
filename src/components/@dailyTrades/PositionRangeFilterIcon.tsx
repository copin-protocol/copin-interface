import { Funnel } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import TableRangeFilter, { Values } from 'components/@widgets/TableRangeFilter'
import { useDailyPositionsContext } from 'pages/DailyTrades/Positions/usePositionsProvider'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, IconBox } from 'theme/base'

import { POSITION_RANGE_CONFIG_MAPPING, PositionRangeFields } from './configs'

export function PositionRangeFilterIcon({ valueKey }: { valueKey: PositionRangeFields }) {
  //@ts-ignore
  const config = POSITION_RANGE_CONFIG_MAPPING[valueKey]
  const { getFilterRangeValues, changeFilterRange, resetFilterRange } = useDailyPositionsContext()
  const { gte, lte } = getFilterRangeValues({ valueKey })
  const changeFilter = (filter: Values) => {
    changeFilterRange({ filter, valueKey })
    setVisible(false)
  }
  const resetFilter = () => {
    resetFilterRange({ valueKey })
    setVisible(false)
  }
  const defaultValues = useMemo(() => {
    return { gte, lte }
  }, [gte, lte])
  const hasFilter = gte != null || lte != null
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(uuid())
  const _setVisible = (visible: boolean) => {
    setVisible(visible)
    setKey(uuid())
  }

  return (
    <Flex sx={{ justifyContent: 'start', alignItems: 'center', gap: 1, position: 'relative' }}>
      {/* <Box as="span">{title}</Box> */}
      <Dropdown
        buttonVariant="ghostInactive"
        inline
        menuDismissible
        dismissible={false}
        visible={visible}
        setVisible={_setVisible as any}
        hasArrow={false}
        menu={
          <Box sx={{ p: 3, width: '350px' }}>
            <TableRangeFilter
              key={key}
              defaultValues={defaultValues}
              onApply={changeFilter}
              onReset={resetFilter}
              unit={config.unit}
            />
          </Box>
        }
      >
        <IconBox
          role="button"
          icon={<Funnel size={16} weight={!!hasFilter ? 'fill' : 'regular'} />}
          sx={{
            transform: 'translateY(-1.5px)',
          }}
        />
      </Dropdown>
    </Flex>
  )
}
