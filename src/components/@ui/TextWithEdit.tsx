import { PencilSimpleLine } from '@phosphor-icons/react'
import { useState } from 'react'
import { EditText } from 'react-edit-text'

import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'

function escapeSpecialRegExpChars(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const inputRegex = RegExp(`^(0|[1-9]\\d*)(?:\\\\[.])?\\d*$`)

export function parseInputValue(value: number | string | undefined) {
  try {
    const pValue = Number(value || '0')
    if (isNaN(pValue)) return 0
    return pValue
  } catch {
    return 0
  }
}

export default function TextWithEdit({
  defaultValue,
  onSave,
  onValidate,
  disabled,
}: {
  defaultValue: string | number
  onSave: (value: string) => void
  onValidate?: (value: string) => boolean | undefined
  disabled?: boolean
}) {
  const [value, setValue] = useState(defaultValue.toString())

  const onChange = (e: any) => {
    if (typeof defaultValue === 'number') {
      let newValue = e.target.value.replace(/,/g, '.')
      if (newValue === '.') {
        newValue = '0.'
      }

      if (newValue === '' || inputRegex.test(escapeSpecialRegExpChars(newValue))) {
        e.target.value = newValue
      } else {
        e.target.value = value
      }
      setValue(e.target.value)
    } else {
      setValue(defaultValue.toString())
    }
  }
  return (
    <Box
      sx={{
        lineHeight: 0,
        '& button svg': { verticalAlign: 'middle' },
      }}
    >
      <EditText
        value={value}
        showEditButton
        editButtonContent={<PencilSimpleLine size={16} />}
        editButtonProps={{
          style: { padding: '2px', backgroundColor: 'transparent', color: themeColors.primary1 },
          disabled,
        }}
        // placeholder={'Enter wallet name'}
        style={{
          color: 'inherit',
          margin: 0,
          padding: '0px',
          fontSize: '13px',
          lineHeight: '16px !important',
          height: '22px',
          minHeight: '22px',
          verticalAlign: 'middle',
          backgroundColor: 'transparent',
          borderColor: themeColors.neutral4,
          borderWidth: '1px',
          maxWidth: 50,
          display: 'inline-flex',
          alignItems: 'center',
        }}
        onChange={(e) => onChange(e)}
        onSave={({ value, previousValue }) => {
          const trimValue = value.trim()
          if (!!trimValue && (!onValidate || onValidate(trimValue))) {
            onSave(trimValue)
          } else {
            setValue(previousValue)
          }
          // setIsEdit(false)
        }}
        // onBlur={() => setIsEdit(false)}
        // onEditMode={() => setIsEdit(true)}
      />
    </Box>
  )
}
