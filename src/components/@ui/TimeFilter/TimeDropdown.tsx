import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { TimeFilterByEnum } from 'utils/config/enums'

import { TIME_FILTER_OPTIONS } from './constants'
import { TimeFilterProps } from './type'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
  ignoreAllTime,
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  ignoreAllTime?: boolean
}) {
  return (
    <Dropdown
      buttonSx={{
        border: 'none',
        py: 0,
        px: 0,
      }}
      menuSx={{
        width: '100px',
        minWidth: 'auto',
      }}
      placement="bottom"
      menu={
        <>
          {TIME_FILTER_OPTIONS.filter((option) => (ignoreAllTime ? option.id !== TimeFilterByEnum.ALL_TIME : true)).map(
            (option) => (
              <CheckableDropdownItem
                key={option.id}
                selected={option.id === timeOption.id}
                text={option.text}
                onClick={() => onChangeTime(option)}
              />
            )
          )}
        </>
      }
    >
      {timeOption.text}
    </Dropdown>
  )
}
