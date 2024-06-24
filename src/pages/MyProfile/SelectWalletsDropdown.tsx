import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { GridProps } from 'styled-system'

import Divider from 'components/@ui/Divider'
import { CopyWalletData } from 'entities/copyWallet'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseWalletName } from 'utils/helpers/transform'

export default function SelectWalletsDropdown({
  allWallets,
  selectedWallets,
  handleToggleWallet,
  handleSelectAllWallets,
  menuSx = {},
  placement = 'bottomLeft',
}: {
  allWallets: CopyWalletData[]
  selectedWallets: CopyWalletData[]
  handleToggleWallet: (key: CopyWalletData) => void
  handleSelectAllWallets: (isSelectedAll: boolean) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}) {
  if (!allWallets.length) return <></>
  const isSelectedAll =
    !!allWallets.length &&
    allWallets.every((copyWalletId) => selectedWallets?.map((e) => e.id).includes(copyWalletId.id))

  return (
    <Dropdown
      menuSx={{
        width: ['100%', 400],
        height: 200,
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
                  handleSelectAllWallets(false)
                } else {
                  handleSelectAllWallets(true)
                }
              }}
            />
            <Type.CaptionBold color="neutral3">
              <Trans>Select all</Trans> (
              <Type.Caption>
                <Trans>Includes deleted data</Trans>
              </Type.Caption>
              )
            </Type.CaptionBold>
          </Flex>
          <Divider mt={2} />
          <Grid
            sx={{
              gridTemplateColumns: ['1fr', '1fr 1fr'],
              columnGap: 3,
              rowGap: 2,
            }}
          >
            {allWallets.map((item) => {
              const key = item.id
              if (key == null) return <></>
              const isChecked = selectedWallets.findIndex((e) => e.id === item.id) !== -1
              return (
                <Box py={2} key={key.toString()}>
                  <ControlledCheckbox
                    checked={isChecked}
                    label={
                      <Box
                        as="span"
                        sx={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          width: '100%',
                          maxWidth: 200,
                          ...overflowEllipsis(),
                        }}
                      >
                        {parseWalletName(item)}
                      </Box>
                    }
                    size={16}
                    onChange={() => handleToggleWallet(item)}
                  />
                </Box>
              )
            })}
          </Grid>
        </>
      }
      buttonSx={{
        border: 'none',
        alignItems: ['start', 'center'],
        '.icon_dropdown': { pt: ['3px', 0] },
      }}
      placement={placement}
    >
      {selectedWallets.length}/{allWallets.length} active {allWallets.length > 1 ? 'wallets' : 'wallet'}
    </Dropdown>
  )
}
