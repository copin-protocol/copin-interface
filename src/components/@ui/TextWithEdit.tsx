import { PencilSimpleLine } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'
import { EditText } from 'react-edit-text'

import { Box, Flex } from 'theme/base'
import { themeColors } from 'theme/colors'

export function escapeSpecialRegExpChars(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
export const inputRegex = RegExp(`^(0|[1-9]\\d*)(?:\\\\[.])?\\d*$`)

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
  formatDisplayText,
  disabled,
  allowEmpty = false,
  unit,
  editButtonSize = 16,
}: {
  defaultValue: string | number
  onSave: (value: string) => void
  onValidate?: (value: string) => boolean | undefined
  formatDisplayText?: (value: string) => string
  disabled?: boolean
  allowEmpty?: boolean
  unit?: ReactNode
  editButtonSize?: number
}) {
  const [value, setValue] = useState(defaultValue.toString())

  const onChange = (e: any) => {
    if (typeof defaultValue === 'number' || (allowEmpty && (defaultValue === '--' || defaultValue === ''))) {
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
        '& input': { outline: 'none', border: 'small', borderColor: 'neutral4', borderRadius: '2px' },
        '& > *': { display: 'flex', alignItems: 'center' },
      }}
    >
      <EditText
        value={value}
        showEditButton
        editButtonContent={
          <Flex sx={{ alignItems: 'center', gap: '0.5ch', flexShrink: 0 }}>
            {!!unit && unit}
            <PencilSimpleLine size={editButtonSize} />
          </Flex>
        }
        editButtonProps={{
          style: {
            backgroundColor: 'transparent',
            color: themeColors.primary1,
            position: 'relative',
            flexShrink: 0,
          },
          disabled,
        }}
        // placeholder={'Enter wallet name'}
        style={{
          color: 'inherit',
          margin: 0,
          padding: '0px',
          fontSize: '12px',
          lineHeight: '18px !important',
          height: '24px',
          minHeight: '24px',
          backgroundColor: 'transparent',
          borderColor: themeColors.neutral4,
          borderWidth: '1px',
          maxWidth: 80,
          display: 'inline-flex',
          alignItems: 'center',
        }}
        formatDisplayText={formatDisplayText}
        onChange={(e) => onChange(e)}
        onSave={({ value, previousValue }) => {
          const trimValue = value.trim()
          if (allowEmpty || (!allowEmpty && !!trimValue && (!onValidate || onValidate(trimValue)))) {
            onSave(trimValue)
            if (allowEmpty && trimValue === '') {
              setValue('--')
            }
          } else {
            setValue(previousValue)
          }
          // setIsEdit(false)
        }}
        onBlur={() => {
          if (allowEmpty && value === '') {
            setValue('--')
          }
        }}
        onEditMode={() => {
          if (allowEmpty && value === '--') {
            setValue('')
          }
        }}
      />
    </Box>
  )
}
