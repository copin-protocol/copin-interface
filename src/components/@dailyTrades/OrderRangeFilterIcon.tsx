import { Funnel } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import TableRangeFilter, { Values } from 'components/@widgets/TableRangeFilter'
import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'
import Dropdown from 'theme/Dropdown'
import { Box, IconBox } from 'theme/base'

import { ORDER_RANGE_CONFIG_MAPPING, OrderRangeFields } from './configs'

export default function OrderRangeFilterIcon({ valueKey }: { valueKey: OrderRangeFields }) {
  //@ts-ignore
  const config = ORDER_RANGE_CONFIG_MAPPING[valueKey]
  const { getFilterRangeValues, changeFilterRange, resetFilterRange } = useDailyOrdersContext()
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
    <Dropdown
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={_setVisible as any}
      buttonSx={{ p: 0, border: 'none', transform: 'translateY(-1.5px)' }}
      hasArrow={false}
      menu={
        <Box sx={{ p: 3, width: '300px' }}>
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
        sx={{ color: !!hasFilter ? 'neutral2' : 'neutral3', '&:hover:': { color: 'neutral1' } }}
      />
    </Dropdown>
  )
}
