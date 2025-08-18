import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { GridProps } from 'styled-system'

import { getTradersByProtocolFromCopyTrade } from 'components/@copyTrade/helpers'
import TraderAddress from 'components/@ui/TraderAddress'
import SelectWithCheckbox from 'components/@widgets/SelectWithCheckbox'
import { CopyTradeData } from 'entities/copyTrade'
import Tooltip from 'theme/Tooltip'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

export default function SelectTradersCopied({
  allTraders,
  selectedTraders,
  handleToggleTrader,
  handleSelectAllTraders,
  allCopyTrades,
  buttonSx,
}: {
  allTraders: string[] // to check two request has same addresses
  selectedTraders: string[]
  allCopyTrades: CopyTradeData[] | undefined
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  buttonSx?: any
}) {
  const tradersByProtocol = getTradersByProtocolFromCopyTrade(allCopyTrades, allTraders)
  const { sm } = useResponsive()

  if (!tradersByProtocol || !allTraders.length) return <></>

  let activeTraderAddress: string[] = []
  let deletedTraderAddresses: string[] = []
  Object.entries(tradersByProtocol).forEach(([_, traderData]) => {
    traderData.forEach((data) => {
      if (data.status === 'copying') activeTraderAddress.push(data.address)
      if (data.status === 'deleted') deletedTraderAddresses.push(data.address)
    })
  })
  activeTraderAddress = Array.from(new Set(activeTraderAddress))
  deletedTraderAddresses = Array.from(new Set(deletedTraderAddresses))

  return (
    <SelectTradersCopiedDropdown
      allTraders={allTraders}
      menuSx={sm ? undefined : { transform: 'translateX(10px)' }}
      selectedTraders={selectedTraders}
      activeTraderAddresses={activeTraderAddress}
      deletedTraderAddresses={deletedTraderAddresses}
      handleSelectAllTraders={handleSelectAllTraders}
      handleToggleTrader={handleToggleTrader}
      buttonSx={buttonSx}
    />
  )
}

export type TradersByProtocolValuesData = { address: string; status: 'deleted' | 'copying' }
export type TradersByProtocolData = Record<ProtocolEnum, TradersByProtocolValuesData[]>

export function SelectTradersCopiedDropdown({
  allTraders,
  selectedTraders,
  activeTraderAddresses,
  deletedTraderAddresses,
  handleToggleTrader,
  handleSelectAllTraders,
  menuSx = {},
  placement = 'bottomLeft',
  buttonSx,
}: {
  allTraders: string[] | undefined
  selectedTraders: string[]
  activeTraderAddresses: string[]
  deletedTraderAddresses: string[]
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  buttonSx?: any
}) {
  const isSelectedAll = !!allTraders?.length && allTraders.every((address) => selectedTraders.includes(address))

  const filterOptionsBySearchFn = ({ searchText, option }: { searchText: string; option: string }) => {
    if (!searchText) return true
    return !!option.toLowerCase().includes(searchText.toLowerCase())
  }
  const optionItemKeyFn = (option: string) => option
  const optionItemSelectedFn = (option: string) => selectedTraders.includes(option)
  const renderOptionLabel = (option: string) => {
    const isDeleted = deletedTraderAddresses.includes(option)
    return (
      <Box>
        <TraderAddress
          address={option}
          wrapperSx={{ gap: [1, 2] }}
          textSx={{ minWidth: '71px', color: isDeleted ? 'neutral3' : 'neutral1' }}
        />
      </Box>
    )
  }

  const MenuWrapper = ({ children }: { children: ReactNode }) => (
    <Box>
      {children}
      <Tooltip id="tt_list_trader_checkbox" render={({ content }) => <Type.Caption>{content}</Type.Caption>} />
    </Box>
  )

  return (
    <>
      <SelectWithCheckbox
        menuSx={menuSx}
        placement={placement}
        buttonSx={buttonSx}
        isSelectedAll={isSelectedAll}
        options={[...activeTraderAddresses, ...deletedTraderAddresses]}
        value={selectedTraders}
        onChangeValue={handleToggleTrader}
        onToggleSelectAll={handleSelectAllTraders}
        filterOptionsBySearchFn={filterOptionsBySearchFn}
        optionItemKeyFn={optionItemKeyFn}
        optionItemSelectedFn={optionItemSelectedFn}
        renderOptionLabel={renderOptionLabel}
        menuWrapperElement={MenuWrapper}
        notMatchSearchMessage={<Trans>No trader matched</Trans>}
      >
        <Trans>{selectedTraders.length} traders</Trans>{' '}
        <Box as="span" color="neutral3">
          ({activeTraderAddresses.length} <Trans>Active</Trans>)
        </Box>
      </SelectWithCheckbox>
    </>
  )
}
