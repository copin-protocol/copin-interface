import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { Fragment } from 'react'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { renderTrader } from './renderProps'

export type TradersByProtocolValuesData = { address: string; status: 'deleted' | 'copying' }
export type TradersByProtocolData = Record<ProtocolEnum, TradersByProtocolValuesData[]>

export default function SelectTradersDropdown({
  allTraders,
  selectedTraders,
  handleToggleTrader,
  handleSelectAllTraders,
  tradersByProtocol,
  menuSx = {},
  placement = 'bottomLeft',
  buttonSx,
}: {
  allTraders: string[] | undefined
  selectedTraders: string[]
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  tradersByProtocol: TradersByProtocolData
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  buttonSx?: any
}) {
  const isSelectedAll = !!allTraders?.length && allTraders.every((address) => selectedTraders.includes(address))
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
          <Divider mt={2} />
          <ListTraderCheckboxes
            addresses={activeTraderAddress}
            selectedTraders={selectedTraders}
            handleToggleTrader={handleToggleTrader}
          />
          <Box mb={2} />
          <ListTraderCheckboxes
            addresses={deletedTraderAddresses}
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
        ({activeTraderAddress.length} <Trans>Active</Trans>)
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
      {addresses.map((item) => {
        const key = item
        if (key == null) return <></>
        const isChecked = selectedTraders.includes(key)
        return (
          <Box py={2} key={key.toString()}>
            <ControlledCheckbox
              checked={isChecked}
              label={renderTrader(item, undefined, {
                sx: { gap: [1, 2] },
                textSx: { minWidth: '71px', color: isDeleted ? 'neutral3' : 'neutral1' },
              })}
              size={16}
              onChange={() => handleToggleTrader(key)}
            />
          </Box>
        )
      })}
    </Grid>
  )
}
