import { TimeFilterProps } from 'components/@ui/TimeFilter'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'

import { getDropdownProps } from './configs'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
}) {
  const { timeFilterOptions } = useGetTimeFilterOptions()

  return (
    <Dropdown
      buttonVariant="ghostPrimary"
      inline
      {...getDropdownProps({ menuSx: { width: 100 } })}
      menu={
        <>
          {timeFilterOptions.slice(0, timeFilterOptions.length - 1).map((option) => (
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
