import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { TimeFilterByEnum } from 'utils/config/enums'

import { TimeFilterProps } from './type'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
  ignoreAllTime,
  menuSx = {},
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  ignoreAllTime?: boolean
  menuSx?: any
}) {
  const { timeFilterOptions } = useGetTimeFilterOptions()
  return (
    <Dropdown
      buttonVariant="ghost"
      inline
      menuSx={{
        width: '100px',
        minWidth: 'auto',
        ...menuSx,
      }}
      placement="bottom"
      menu={
        <>
          {timeFilterOptions
            .filter((option) => (ignoreAllTime ? option.id !== TimeFilterByEnum.ALL_TIME : true))
            .map((option) => (
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
