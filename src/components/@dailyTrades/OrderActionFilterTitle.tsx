import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'

import { useDailyOrdersContext } from 'pages/DailyTrades/Orders/useOrdersProvider'
import Dropdown from 'theme/Dropdown'
import Select from 'theme/Select'
import { Box, Flex, IconBox } from 'theme/base'
import { OrderTypeEnum } from 'utils/config/enums'

export function OrderActionFilterTitle() {
  const { action, changeAction } = useDailyOrdersContext()

  return (
    <Flex sx={{ width: '100%', justifyContent: 'start', alignItems: 'center', gap: 1, position: 'relative' }}>
      <Box as="span">
        <Trans>ACTION</Trans>
      </Box>
      <Dropdown
        buttonSx={{ p: '0 4px', border: 'none' }}
        hasArrow={false}
        menu={
          <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
            {ORDER_ACTION_OPTIONS.map((config) => {
              const isActive = config.value == action
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
                  onClick={() => changeAction(config.value)}
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
          icon={<Funnel size={16} weight={!!action ? 'fill' : 'regular'} />}
          sx={{
            transform: 'translateY(-1.5px)',
            color: !!action ? 'neutral2' : 'neutral3',
            '&:hover:': { color: 'neutral1' },
          }}
        />
      </Dropdown>
    </Flex>
  )
}
export const ORDER_ACTION_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: OrderTypeEnum.OPEN, label: 'Open' },
  { value: OrderTypeEnum.INCREASE, label: 'Increase' },
  { value: OrderTypeEnum.DECREASE, label: 'Decrease' },
  { value: OrderTypeEnum.CLOSE, label: 'Close' },
]

export function OrderActionSelect({
  currentFilter,
  changeFilter,
}: {
  currentFilter: OrderTypeEnum | undefined
  changeFilter: (filter: OrderTypeEnum | undefined) => void
}) {
  return (
    <>
      <Select
        options={ORDER_ACTION_OPTIONS}
        value={ORDER_ACTION_OPTIONS.filter((o) => currentFilter === o.value)}
        onChange={(newValue: any) => {
          changeFilter(newValue.value)
        }}
        components={{
          DropdownIndicator: () => <div></div>,
        }}
        isSearchable={false}
      />
    </>
  )
}
