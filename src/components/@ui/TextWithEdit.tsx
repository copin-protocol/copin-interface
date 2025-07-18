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
  onEditMode,
  formatDisplayText,
  disabled,
  allowEmpty = false,
  fullWidth = false,
  unit,
  editButtonSize = 16,
  maxLength,
  textSx,
}: {
  defaultValue: string | number
  onSave: (value: string) => void
  onValidate?: (value: string) => Promise<boolean | undefined> | boolean | undefined
  onEditMode?: (isEditMode: boolean) => void
  formatDisplayText?: (value: string) => string
  disabled?: boolean
  allowEmpty?: boolean
  fullWidth?: boolean
  unit?: ReactNode
  editButtonSize?: number
  maxLength?: number
  textSx?: any
}) {
  const [value, setValue] = useState(defaultValue.toString())

  const onChange = (e: any) => {
    if (maxLength && e.target.value.length > maxLength) {
      return
    }
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
      setValue(e.target.value)
    }
  }

  const handleSave = async ({ value, previousValue }: { value: string; previousValue: string }) => {
    const trimValue = value.trim()
    try {
      if (allowEmpty || (!allowEmpty && !!trimValue)) {
        const isValid = onValidate ? await onValidate(trimValue) : true
        if (isValid) {
          onSave(trimValue)
          if (allowEmpty && trimValue === '') {
            setValue('--')
          }
          return
        }
      }
      setValue(previousValue)
    } catch (error) {
      setValue(previousValue)
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
          maxWidth: fullWidth ? 'max-content' : 80,
          display: 'inline-flex',
          alignItems: 'center',
          ...textSx,
        }}
        formatDisplayText={formatDisplayText}
        onChange={onChange}
        onSave={(value) => {
          handleSave(value)
          onEditMode?.(false)
        }}
        onBlur={() => {
          if (allowEmpty && value === '') {
            setValue('--')
          }
          onEditMode?.(false)
        }}
        onEditMode={() => {
          if (allowEmpty && value === '--') {
            setValue('')
          }
          onEditMode?.(true)
        }}
      />
    </Box>
  )
}
