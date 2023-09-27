import { ReactNode } from 'react'

import Checkbox from 'theme/Checkbox'
import { Type } from 'theme/base'

export default function MenuCheckbox({
  title,
  checked,
  onChange,
  color,
}: {
  checked: boolean
  onChange: () => void
  title: ReactNode
  color: string
}) {
  return (
    <Checkbox checked={checked} onChange={onChange}>
      <Type.Caption color={color}>{title}</Type.Caption>
    </Checkbox>
  )
}
