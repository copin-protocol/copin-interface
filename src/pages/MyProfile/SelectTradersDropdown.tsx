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
  allTraders: string[]
  selectedTraders: string[]
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  tradersByProtocol: TradersByProtocolData
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  buttonSx?: any
}) {
  if (!allTraders.length) return <></>
  const isSelectedAll = !!allTraders.length && allTraders.every((address) => selectedTraders.includes(address))
  let activeTradersCount = 0
  Object.entries(tradersByProtocol).forEach(([_, traderData]) => {
    traderData.forEach((data) => {
      if (data.status === 'copying') activeTradersCount += 1
    })
  })

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
          {Object.entries(tradersByProtocol).map(([protocol, traderAddresses], index) => {
            if (!traderAddresses.length) return <></>
            return (
              <Fragment key={protocol}>
                <Grid
                  sx={{
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: 3,
                    rowGap: 2,
                  }}
                  mb={index === 0 ? 2 : 0}
                >
                  {traderAddresses.map((item) => {
                    const key = item.address
                    if (key == null) return <></>
                    const isChecked = selectedTraders.includes(key)
                    return (
                      <Box py={2} key={key.toString()}>
                        <ControlledCheckbox
                          checked={isChecked}
                          label={renderTrader(item.address, protocol as ProtocolEnum, {
                            sx: { gap: [1, 2] },
                            textSx: { minWidth: '71px', color: item.status === 'deleted' ? 'neutral3' : 'neutral1' },
                          })}
                          size={16}
                          onChange={() => handleToggleTrader(key)}
                        />
                      </Box>
                    )
                  })}
                </Grid>
              </Fragment>
            )
          })}
        </>
      }
      buttonSx={{
        border: 'none',
        ...(buttonSx || {}),
      }}
      placement={placement}
    >
      <Trans>{selectedTraders.length} traders</Trans>{' '}
      <Box as="span" color="neutral3">
        ({activeTradersCount} <Trans>Active</Trans>)
      </Box>
    </Dropdown>
  )
}
