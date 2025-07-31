import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Flex, Type } from 'theme/base'

import { TableFilterConfig } from './types'

export function MobileRangeFilterItem({
  configs,
  gte,
  lte,
  onChangeGte,
  onChangeLte,
  label,
}: {
  configs: TableFilterConfig
  gte: number | string | undefined
  lte: number | string | undefined
  onChangeGte: (v: number | undefined) => void
  onChangeLte: (v: number | undefined) => void
  label?: string
}) {
  return (
    <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, '& > *': { flex: 1 } }}>
      <Type.Caption>{label || configs.label}</Type.Caption>
      <Input
        type="number"
        value={gte}
        suffix={configs.unit}
        affix={'>='}
        block
        sx={{ p: 1 }}
        onChange={(e) => onChangeGte(e.target.value === '' ? undefined : Number(e.target.value))}
      />
      <Input
        type="number"
        value={lte}
        suffix={configs.unit}
        affix={'<='}
        block
        sx={{ p: 1 }}
        onChange={(e) => onChangeLte(e.target.value === '' ? undefined : Number(e.target.value))}
      />
    </Flex>
  )
}

export function MobileRangeFilterButtons({ onApply, onReset }: { onApply: () => void; onReset: () => void }) {
  return (
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
      <Button variant="ghost" sx={{ fontWeight: 400, p: 0 }} onClick={onReset}>
        Reset
      </Button>

      <Button variant="ghostPrimary" sx={{ fontWeight: 400, p: 0 }} onClick={onApply}>
        Apply
      </Button>
    </Flex>
  )
}
