import { ReactNode, useRef } from 'react'
import { v4 as uuid } from 'uuid'

import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import TextWithEdit from 'components/@ui/TextWithEdit'
import { Flex, Type } from 'theme/base'

export default function QuickEditField({
  value,
  onSave,
  onValidate,
  label,
  unit,
  tooltipContent,
}: {
  value: number | undefined | null
  onSave: (value: string) => void
  onValidate: (value: string) => boolean | undefined
  label: ReactNode
  unit: ReactNode
  tooltipContent: ReactNode
}) {
  const tooltipId = useRef(uuid())
  return (
    <Flex alignItems="center" sx={{ gap: 2, color: 'primary1', width: '100%' }}>
      {tooltipContent ? (
        <LabelWithTooltip id={tooltipId.current} tooltip={tooltipContent} dashed>
          <Type.Caption color="neutral2">{label}</Type.Caption>
        </LabelWithTooltip>
      ) : (
        <Type.Caption color="neutral2">{label}</Type.Caption>
      )}
      <TextWithEdit
        allowEmpty
        key={value}
        defaultValue={value ?? '--'}
        onSave={onSave}
        onValidate={onValidate}
        unit={<Type.Caption color="inherit">{unit}</Type.Caption>}
      />
    </Flex>
  )
}
