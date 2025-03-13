import { ReactNode } from 'react'

import { CopyTradeData } from 'entities/copyTrade'
import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import Checkbox from 'theme/Checkbox'
import { Type } from 'theme/base'

export default function SelectCopyTradeCheckbox({
  type,
  data,
  label,
}: {
  type: 'copyTrade' | 'all'
  data: CopyTradeData | undefined
  label?: ReactNode
}) {
  const { isSelectAll, isSelectedFn, toggleCopyTrade, toggleSelectAll } = useSelectCopyTrade()
  // const _listCopyTrade = listCopyTrade || prevListCopyTrade
  // const hasClear = !!_listCopyTrade.length && !isSelectAll
  // const disabled = !allIds?.length || data?.status === CopyTradeStatusEnum.STOPPED
  return type === 'copyTrade' && data ? (
    <Checkbox checked={isSelectedFn?.(data)} onChange={() => toggleCopyTrade(data)}>
      <Type.Caption>{label}</Type.Caption>
    </Checkbox>
  ) : (
    <Checkbox
      label={label}
      checked={isSelectAll}
      onChange={(e) => toggleSelectAll(e.target.checked)}
      // hasClear={hasClear}
    >
      <Type.Caption>{label}</Type.Caption>
    </Checkbox>
  )
}
