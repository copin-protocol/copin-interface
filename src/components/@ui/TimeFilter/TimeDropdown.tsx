import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'

import { TIME_FILTER_OPTIONS } from './constants'
import { TimeFilterProps } from './type'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
}) {
  return (
    <Dropdown
      buttonSx={{
        border: 'none',
        py: 0,
        px: 0,
      }}
      menuSx={{
        width: '80px',
        minWidth: 'auto',
      }}
      placement="bottom"
      menu={
        <>
          {TIME_FILTER_OPTIONS.map((option) => (
            <CheckableDropdownItem
              key={option.id}
              selected={option.id === timeOption.id}
              text={option.text}
              onClick={() => onChangeTime(option)}
            />
          ))}
        </>
      }
    >
      {timeOption.text}
    </Dropdown>
  )
}
