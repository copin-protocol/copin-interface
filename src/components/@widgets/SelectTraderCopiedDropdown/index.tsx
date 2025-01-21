import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import { ReactNode, useCallback } from 'react'
import { GridProps } from 'styled-system'

import TraderAddress from 'components/@ui/TraderAddress'
import SelectWithCheckbox from 'components/@widgets/SelectWithCheckbox'
import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'

export function SelectTradersCopiedDropdown({
  traderAddresses,
  selectedTraders,
  isSelectedAllTrader,
  deletedTraderAddresses,
  handleToggleTrader,
  handleSelectAllTraders,
  hasArrow = true,
  menuSx = {},
  placement = 'bottomLeft',
  buttonSx,
  children,
}: {
  traderAddresses: string[] // options to select
  deletedTraderAddresses?: string[]
  selectedTraders: string[] | null
  isSelectedAllTrader: boolean
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  buttonSx?: any
  hasArrow?: boolean
  children: ReactNode
}) {
  const filterOptionsBySearchFn = useCallback(({ searchText, option }: { searchText: string; option: string }) => {
    if (!searchText) return true
    return !!option.toLowerCase().includes(searchText.toLowerCase())
  }, [])
  const optionItemKeyFn = useCallback((option: string) => option, [])
  const optionItemSelectedFn = useCallback(
    (option: string) => selectedTraders == null || !!selectedTraders.includes(option),
    [selectedTraders]
  )
  const renderOptionLabel = useCallback(
    (option: string) => {
      const isDeleted = deletedTraderAddresses?.includes(option)
      return (
        <Box data-tooltip-id={'tt_list_trader_checkbox'} data-tooltip-delay-show={360} data-tooltip-content={option}>
          <TraderAddress
            address={option}
            options={{
              isLink: false,
              wrapperSx: { gap: [1, 2] },
              textSx: { minWidth: '71px', color: isDeleted ? 'neutral3' : 'neutral1' },
            }}
          />
        </Box>
      )
    },
    [deletedTraderAddresses]
  )

  return (
    <>
      <SelectWithCheckbox
        menuSx={menuSx}
        placement={placement}
        buttonSx={buttonSx}
        isSelectedAll={isSelectedAllTrader}
        options={traderAddresses}
        value={selectedTraders ?? []}
        onChangeValue={handleToggleTrader}
        onToggleSelectAll={handleSelectAllTraders}
        filterOptionsBySearchFn={filterOptionsBySearchFn}
        optionItemKeyFn={optionItemKeyFn}
        optionItemSelectedFn={optionItemSelectedFn}
        renderOptionLabel={renderOptionLabel}
        menuWrapperElement={MenuWrapper}
        hasArrow={hasArrow}
        notMatchSearchMessage={<Trans>No trader matched</Trans>}
      >
        {children}
      </SelectWithCheckbox>
    </>
  )
}
const MenuWrapper = ({ children }: { children: ReactNode }) => (
  <Box>
    {children}
    <Tooltip id="tt_list_trader_checkbox" render={({ content }) => <Type.Caption>{content}</Type.Caption>} />
  </Box>
)

export function SelectTraderIcon({ selectedTraders }: { selectedTraders: string[] | null }) {
  const hasFilter = selectedTraders != null
  return (
    <IconBox
      role="button"
      icon={<Funnel size={16} weight={hasFilter ? 'fill' : 'regular'} />}
      sx={{
        color: hasFilter ? 'neutral2' : 'neutral3',
        '&:hover:': { color: 'neutral1' },
        transform: 'translateY(-1px)',
      }}
    />
  )
}

export function SelectTraderLabel({
  selectedTraders,
  activeTraderAddresses,
  hasIcon,
}: {
  selectedTraders: string[] | null
  activeTraderAddresses: string[] | undefined
  hasIcon?: boolean
}) {
  const hasFilter = selectedTraders != null
  return (
    <span>
      {selectedTraders == null ? <Trans>All traders</Trans> : <Trans>{selectedTraders?.length || 0} traders</Trans>}{' '}
      {activeTraderAddresses?.length && (
        <Box as="span" color="neutral3">
          ({activeTraderAddresses?.length || 0} <Trans>Active</Trans>)
        </Box>
      )}
      {!!hasIcon && (
        <Funnel
          size={16}
          weight={hasFilter ? 'fill' : 'regular'}
          style={{ verticalAlign: 'middle', transform: 'translateY(-1px)' }}
        />
      )}
    </span>
  )
}
