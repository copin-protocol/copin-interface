import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'

import { getDropdownProps } from './configs'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
}) {
  return (
    <Dropdown
      buttonVariant="ghostPrimary"
      inline
      {...getDropdownProps({ menuSx: { width: 100 } })}
      menu={
        <>
          {TIME_FILTER_OPTIONS.slice(0, 4).map((option) => (
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
