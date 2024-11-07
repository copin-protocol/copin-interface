import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'

import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'
import Dropdown from 'theme/Dropdown'
import Select from 'theme/Select'
import { Box, Flex, IconBox } from 'theme/base'

import { DirectionFilterEnum } from './configs'

export function OrderDirectionFilterTitle() {
  const { direction, changeDirection } = useDailyOrdersContext()
  return <DirectionFilterTitle direction={direction} changeDirection={changeDirection} />
}

export function DirectionFilterTitle({
  direction,
  changeDirection,
}: {
  direction: DirectionFilterEnum | undefined
  changeDirection: (direction: DirectionFilterEnum | undefined) => void
}) {
  return (
    <Flex sx={{ width: '100%', justifyContent: 'start', alignItems: 'center', gap: 1, position: 'relative' }}>
      <Box as="span">
        <Trans>DIRECTION</Trans>
      </Box>
      <Dropdown
        buttonSx={{ p: '0 4px', border: 'none' }}
        hasArrow={false}
        menu={
          <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
            {DIRECTION_OPTIONS.map((config) => {
              const isActive = config.value == direction
              return (
                <Box
                  role="button"
                  key={`${config.value}`}
                  sx={{
                    height: 32,
                    lineHeight: '32px',
                    px: 2,
                    bg: isActive ? 'neutral4' : 'transparent',
                    '&:hover': { bg: 'neutral5' },
                  }}
                  onClick={() => changeDirection(config.value)}
                >
                  {config.label}
                </Box>
              )
            })}
          </Flex>
        }
      >
        <IconBox
          role="button"
          icon={<Funnel size={16} weight={!!direction ? 'fill' : 'regular'} />}
          sx={{
            transform: 'translateY(-1.5px)',
            color: !!direction ? 'neutral2' : 'neutral3',
            '&:hover:': { color: 'neutral1' },
          }}
        />
      </Dropdown>
    </Flex>
  )
}
export const DIRECTION_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: DirectionFilterEnum.LONG, label: 'Long' },
  { value: DirectionFilterEnum.SHORT, label: 'Short' },
]

export function DirectionSelect({
  direction,
  changeDirection,
}: {
  direction: DirectionFilterEnum | undefined
  changeDirection: (filter: DirectionFilterEnum | undefined) => void
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
