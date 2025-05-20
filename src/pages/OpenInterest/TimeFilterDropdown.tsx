import { CrownSimple } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { ALL_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import useOIFilterPermission from 'hooks/features/subscription/useOIPermission'
import { getDropdownProps } from 'pages/Home/configs'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum, TimeFilterByEnum } from 'utils/config/enums'

import ItemWrapper from './FilterItemWrapper'
import FilterMenuWrapper from './FilterMenuWrapper'

export type TimeDropdownProps = {
  currentTimeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterByEnum) => void
  allowedFilter?: boolean
  planToFilter?: SubscriptionPlanEnum
}

export function TimeDropdown({ currentTimeOption, onChangeTime, allowedFilter, planToFilter }: TimeDropdownProps) {
  const { isEnabled } = useOIFilterPermission()
  const { sm } = useResponsive()
  return (
    <ItemWrapper allowedFilter={allowedFilter} planToFilter={planToFilter}>
      <Dropdown
        buttonVariant="ghostPrimary"
        inline
        {...getDropdownProps({ menuSx: isEnabled ? {} : { width: 250, transform: sm ? 0 : 'translateX(-40px)' } })}
        iconSize={allowedFilter ? undefined : 0}
        menu={
          <FilterMenuWrapper>
            {ALL_TIME_FILTER_OPTIONS.map((option) => (
              <CheckableDropdownItem
                key={option.id}
                selected={option.id === currentTimeOption.id}
                text={<Box as="span">{option.text}</Box>}
                onClick={() => {
                  onChangeTime(option.id)
                }}
              />
            ))}
          </FilterMenuWrapper>
        }
      >
        <Type.Caption sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box as="span">{currentTimeOption.text}</Box>
          {currentTimeOption.premiumFilter ? (
            <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
          ) : (
            ''
          )}
        </Type.Caption>
      </Dropdown>
    </ItemWrapper>
  )
}
