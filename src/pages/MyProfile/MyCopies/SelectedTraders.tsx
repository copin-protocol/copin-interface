import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { Fragment } from 'react'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import { CopyTradeData } from 'entities/copyTrade'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import SwitchInput from 'theme/SwitchInput'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { renderTrader } from '../renderProps'

function SelectedTraders({
  traders,
  selectedTraders,
  handleToggleTrader,
  menuSx = {},
  placement = 'bottomLeft',
  allCopyTrades,
  handleSelectAllTraders,
}: {
  traders: string[]
  selectedTraders: string[]
  allCopyTrades: CopyTradeData[] | undefined
  handleToggleTrader: (key: string) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  handleSelectAllTraders: (isSelectedAll: boolean) => void
}) {
  const tradersByProtocol = allCopyTrades?.reduce((result, copyTrade) => {
    result[copyTrade.protocol] = [...(result[copyTrade.protocol] ?? []), copyTrade.account]
    return result
  }, {} as Record<ProtocolEnum, string[]>)
  if (tradersByProtocol) {
    Object.entries(tradersByProtocol).forEach(([protocol, values]) => {
      tradersByProtocol[protocol as ProtocolEnum] = Array.from(new Set(values)).filter((address) =>
        traders.includes(address)
      )
    })
  }
  if (!tradersByProtocol) return <></>
  return (
    <Dropdown
      menuSx={{
        width: 350,
        height: 350,
        overflow: 'auto',
        p: 2,
        ...menuSx,
      }}
      dismissable={false}
      menuDismissable
      menu={Object.entries(tradersByProtocol).map(([protocol, traderAddresses]) => {
        const isSelectedAll = traderAddresses.every((address) => selectedTraders.includes(address))
        return (
          <Fragment key={protocol}>
            <Flex sx={{ gap: 1, alignItems: 'center' }}>
              <SwitchInput
                defaultActive={isSelectedAll}
                isActive={isSelectedAll}
                onChange={(value) => {
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
            <Grid
              sx={{
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              {traderAddresses.map((item) => {
                const key = item
                if (key == null) return <></>
                const isChecked = selectedTraders.includes(key)
                return (
                  <Box py={2} key={key.toString()}>
                    <ControlledCheckbox
                      checked={isChecked}
                      label={renderTrader(item, protocol as ProtocolEnum)}
                      // labelSx={{ fontSize: 14, lineHeight: '20px' }}
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
      buttonSx={{
        border: 'none',
      }}
      placement={placement}
    >
      <Trans>{selectedTraders.length} traders</Trans>
    </Dropdown>
  )
}

export default SelectedTraders
