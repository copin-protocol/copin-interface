import React from 'react'

import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'

type PickerValue = string | number | boolean

interface PickerProps<T extends PickerValue> {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  itemSx?: any
}

function Picker<T extends PickerValue>({ options, value, onChange, size = 'sm', itemSx = {} }: PickerProps<T>) {
  const Text = size === 'sm' ? Type.Small : Type.Caption
  return (
    <Flex
      alignItems="center"
      sx={{ gap: '2px', p: '2px', border: 'small', borderColor: 'neutral5', borderRadius: '32px' }}
    >
      {options.map((opt) => (
        <Button
          key={String(opt.value)}
          type="button"
          variant="ghostActive"
          onClick={() => onChange(opt.value)}
          px={1}
          py="1px"
          sx={{
            borderRadius: '16px',
            color: value === opt.value ? 'neutral1' : 'neutral3',
            backgroundColor: value === opt.value ? 'neutral4' : 'transparent',
            ...itemSx,
          }}
        >
          <Text>{opt.label}</Text>
        </Button>
      ))}
    </Flex>
  )
}

export default Picker
