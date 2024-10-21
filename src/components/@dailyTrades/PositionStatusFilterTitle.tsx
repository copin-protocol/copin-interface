import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'

import { useDailyPositionsContext } from 'pages/DailyTrades/Positions/usePositionsProvider'
import Dropdown from 'theme/Dropdown'
import Select from 'theme/Select'
import { Box, Flex, IconBox } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'

export function PositionStatusFilterTitle() {
  const { status, changeStatus } = useDailyPositionsContext()

  return (
    <Flex sx={{ width: '100%', justifyContent: 'start', alignItems: 'center', gap: 1, position: 'relative' }}>
      <Box as="span">
        <Trans>STATUS</Trans>
      </Box>
      <Dropdown
        buttonSx={{ p: 0, border: 'none' }}
        hasArrow={false}
        menu={
          <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
            <PositionStatusFilter currentFilter={status} changeFilter={changeStatus} />
          </Flex>
        }
      >
        <IconBox
          role="button"
          icon={<Funnel size={16} weight={!!status ? 'fill' : 'regular'} />}
          sx={{
            transform: 'translateY(-1.5px)',
            color: !!status ? 'neutral2' : 'neutral3',
            '&:hover:': { color: 'neutral1' },
          }}
        />
      </Dropdown>
    </Flex>
  )
}
export const POSITION_STATUS_OPTIONS = [
  {
    label: 'All',
    value: undefined,
  },
  {
    label: 'Open',
    value: PositionStatusEnum.OPEN,
  },
  {
    label: 'Close',
    value: PositionStatusEnum.CLOSE,
  },
]

function PositionStatusFilter({
  currentFilter,
  changeFilter,
}: {
  currentFilter: PositionStatusEnum | undefined
  changeFilter: (filter: PositionStatusEnum | undefined) => void
}) {
  return (
    <>
      {POSITION_STATUS_OPTIONS.map((config) => {
        const isActive = config.label == currentFilter
        return (
          <Box
            role="button"
            key={`${config.label}`}
            sx={{
              height: 32,
              lineHeight: '32px',
              px: 2,
              bg: isActive ? 'neutral4' : 'transparent',
              '&:hover': { bg: 'neutral5' },
            }}
            onClick={() => changeFilter(config.value)}
          >
            {config.label}
          </Box>
        )
      })}
    </>
  )
}

export function PositionStatusSelect({
  currentFilter,
  changeFilter,
}: {
  currentFilter: PositionStatusEnum | undefined
  changeFilter: (filter: PositionStatusEnum | undefined) => void
}) {
  return (
    <>
      <Select
        options={POSITION_STATUS_OPTIONS}
        value={POSITION_STATUS_OPTIONS.filter((o) => currentFilter === o.value)}
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
