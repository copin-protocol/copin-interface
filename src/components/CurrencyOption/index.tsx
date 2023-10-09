import React from 'react'

import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { TokenOptionProps } from 'utils/config/trades'

export default function CurrencyOption({
  options,
  currentOption,
  handleChangeOption,
}: {
  options: TokenOptionProps[]
  currentOption: TokenOptionProps
  handleChangeOption: (option: TokenOptionProps) => void
}) {
  return (
    <Dropdown
      menuSx={{ py: 2, bg: 'neutral7', width: '80px', minWidth: 'auto', maxHeight: '236px', overflowY: 'auto' }}
      menu={
        <>
          {options.map((option, index: number) => (
            <div key={index}>
              <CheckableDropdownItem
                onClick={() => handleChangeOption(option)}
                selected={currentOption.id === option.id}
                text={option.text}
              />
            </div>
          ))}
        </>
      }
      buttonSx={{
        px: 2,
        py: 1,
        width: '80px',
      }}
      iconSize={16}
      placement="bottomRight"
    >
      {currentOption.text}
    </Dropdown>
  )
}
