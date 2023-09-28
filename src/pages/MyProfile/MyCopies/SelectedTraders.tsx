import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { GridProps } from 'styled-system'

import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { Box, Grid } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import { renderTrader } from '../renderProps'

function SelectedTraders({
  traders,
  selectedTraders,
  protocol,
  handleToggleTrader,
  menuSx = {},
  placement = 'bottomLeft',
}: {
  traders: string[]
  selectedTraders: string[]
  protocol: ProtocolEnum
  handleToggleTrader: (key: string) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}) {
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
      menu={
        <Grid
          sx={{
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          {traders.map((item) => {
            const key = item
            if (key == null) return <></>
            const isChecked = selectedTraders.includes(key)
            return (
              <Box py={2} key={key.toString()}>
                <ControlledCheckbox
                  checked={isChecked}
                  label={renderTrader(item, protocol)}
                  // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                  size={16}
                  onChange={() => handleToggleTrader(key)}
                />
              </Box>
            )
          })}
        </Grid>
      }
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
