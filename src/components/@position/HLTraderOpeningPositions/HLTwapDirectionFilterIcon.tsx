import { Funnel } from '@phosphor-icons/react'

import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Select from 'theme/Select'
import { Flex, IconBox } from 'theme/base'
import { HlDirectionEnum } from 'utils/config/enums'

import { useOrderTwapContext } from './useOrderTwapContext'

export function HLTwapDirectionFilterIcon() {
  const { direction, changeDirection } = useOrderTwapContext()
  return <DirectionFilterIcon direction={direction} changeDirection={changeDirection} />
}

export function DirectionFilterIcon({
  direction,
  changeDirection,
}: {
  direction: HlDirectionEnum | undefined
  changeDirection: (direction: HlDirectionEnum | undefined) => void
}) {
  return (
    <Dropdown
      inline
      buttonVariant="ghostInactive"
      // buttonSx={{ p: '0 4px', border: 'none' }}
      hasArrow={false}
      menu={
        <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
          {DIRECTION_OPTIONS.map((config) => {
            const isActive = config.value == direction
            return (
              <DropdownItem key={`${config.value}`} isActive={isActive} onClick={() => changeDirection(config.value)}>
                {config.label}
              </DropdownItem>
            )
          })}
        </Flex>
      }
    >
      <IconBox
        icon={<Funnel size={16} weight={!!direction ? 'fill' : 'regular'} />}
        sx={{
          transform: 'translateY(-1.5px)',
        }}
      />
    </Dropdown>
  )
}
export const DIRECTION_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: HlDirectionEnum.OPEN_LONG, label: 'Open Long' },
  { value: HlDirectionEnum.OPEN_SHORT, label: 'Open Short' },
  { value: HlDirectionEnum.CLOSE_LONG, label: 'Close Long' },
  { value: HlDirectionEnum.CLOSE_SHORT, label: 'Close Short' },
]

export function DirectionSelect({
  direction,
  changeDirection,
}: {
  direction: HlDirectionEnum | undefined
  changeDirection: (filter: HlDirectionEnum | undefined) => void
}) {
  return (
    <>
      <Select
        options={DIRECTION_OPTIONS}
        value={DIRECTION_OPTIONS.filter((o) => direction === o.value)}
        onChange={(newValue: any) => {
          changeDirection(newValue.value)
        }}
        components={{
          DropdownIndicator: () => <div></div>,
        }}
        isSearchable={false}
      />
    </>
  )
}
