import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import React, { Fragment, useMemo, useState } from 'react'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import InputSearchText from 'components/@ui/InputSearchText'
import TraderAddress from 'components/@ui/TraderAddress'
import { CopyTradeData } from 'entities/copyTrade'
import useDebounce from 'hooks/helpers/useDebounce'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Grid, Type } from 'theme/base'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

import { getTradersByProtocolFromCopyTrade } from './helpers'

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
      menuSx={sm ? undefined : { transform: 'translateX(10px)' }}
      allTraders={allTraders}
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
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)

  const options = useMemo(() => {
    return allTraders?.filter((option) => {
      return option?.toLowerCase()?.includes(debounceSearchText.toLowerCase())
    })
  }, [allTraders, debounceSearchText])

  const activeTraderOptions = useMemo(() => {
    return activeTraderAddresses?.filter((option) => {
      return option?.toLowerCase()?.includes(debounceSearchText.toLowerCase())
    })
  }, [activeTraderAddresses, debounceSearchText])

  const deletedTraderOptions = useMemo(() => {
    return deletedTraderAddresses?.filter((option) => {
      return option?.toLowerCase()?.includes(debounceSearchText.toLowerCase())
    })
  }, [deletedTraderAddresses, debounceSearchText])

  const isSelectedAll = !!allTraders?.length && allTraders.every((address) => selectedTraders.includes(address))

  return (
    <Dropdown
      menuSx={{
        width: [350, 400],
        height: 350,
        overflow: 'auto',
        p: 2,
        ...menuSx,
      }}
      dismissible={false}
      menuDismissible
      menu={
        <>
          <Flex sx={{ gap: 1, alignItems: 'center' }}>
            <SwitchInput
              checked={isSelectedAll}
              onChange={(event) => {
                const value = event.target.checked
                if (value) {
                  handleSelectAllTraders(false)
                } else {
                  handleSelectAllTraders(true)
                }
              }}
            />
            <Type.CaptionBold color="neutral3">
              <Trans>Select all</Trans>
            </Type.CaptionBold>
          </Flex>
          <Divider my={2} />
          <InputSearchText placeholder="Search traders..." searchText={searchText} setSearchText={setSearchText} />
          <Divider mt={2} />
          <ListTraderCheckboxes
            addresses={activeTraderOptions}
            selectedTraders={selectedTraders}
            handleToggleTrader={handleToggleTrader}
          />
          <Box mb={2} />
          <ListTraderCheckboxes
            addresses={deletedTraderOptions}
            selectedTraders={selectedTraders}
            handleToggleTrader={handleToggleTrader}
            isDeleted
          />
        </>
      }
      buttonSx={{
        border: 'none',
        alignItems: 'start',
        '.icon_dropdown': { pt: '3px' },
        ...(!allTraders?.length ? { '&[disabled]': { color: 'neutral3' } } : {}),
        ...(buttonSx || {}),
      }}
      disabled={!allTraders?.length}
      placement={placement}
    >
      <Trans>{selectedTraders.length} traders</Trans>{' '}
      <Box as="span" color="neutral3">
        ({activeTraderAddresses.length} <Trans>Active</Trans>)
      </Box>
    </Dropdown>
  )
}

function ListTraderCheckboxes({
  addresses,
  selectedTraders,
  handleToggleTrader,
  isDeleted,
}: {
  addresses: string[]
  selectedTraders: string[]
  handleToggleTrader: (address: string) => void
  isDeleted?: boolean
}) {
  return (
    <Grid
      sx={{
        gridTemplateColumns: '1fr 1fr',
        columnGap: 3,
        rowGap: 2,
      }}
    >
      {addresses.map((address) => {
        const key = address
        if (key == null) return <></>
        const isChecked = selectedTraders.includes(key)
        const tooltipId = `tt_${key}`
        return (
          <Box py={2} key={key.toString()}>
            <ControlledCheckbox
              checked={isChecked}
              label={
                <>
                  <Box data-tip="React-tooltip" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
                    <TraderAddress
                      address={address}
                      options={{
                        isLink: false,
                        wrapperSx: { gap: [1, 2] },
                        textSx: { minWidth: '71px', color: isDeleted ? 'neutral3' : 'neutral1' },
                      }}
                    />
                  </Box>
                  <Tooltip id={tooltipId} place="top" type="dark" effect="solid">
                    <Type.Caption>{address}</Type.Caption>
                  </Tooltip>
                </>
              }
              size={16}
              onChange={() => handleToggleTrader(key)}
            />
          </Box>
        )
      })}
    </Grid>
  )
}
