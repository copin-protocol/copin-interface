import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { GridProps } from 'styled-system'

import InputSearchText from 'components/@ui/InputSearchText'
import NoDataFound from 'components/@ui/NoDataFound'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useDebounce from 'hooks/helpers/useDebounce'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Image, Type } from 'theme/base'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'

export default function SelectWallets({
  allWallets,
  selectedWallets,
  onChangeWallets,
}: {
  allWallets: CopyWalletData[]
  selectedWallets: CopyWalletData[]
  onChangeWallets: (wallets: CopyWalletData[]) => void
}) {
  const handleSelectAllWallets = (isSelectedAll: boolean) => {
    if (!allWallets?.length) return
    if (isSelectedAll) {
      onChangeWallets([])
    } else {
      onChangeWallets(allWallets)
    }
  }

  const handleToggleWallet = (wallet: CopyWalletData) => {
    const isSelected = selectedWallets.some((_wallet) => _wallet.id === wallet.id)
    if (isSelected) {
      onChangeWallets(selectedWallets.filter((_wallet) => _wallet.id !== wallet.id))
    } else {
      onChangeWallets([...selectedWallets, wallet])
    }
  }
  const { sm } = useResponsive()

  if (!allWallets?.length) return <></>

  return (
    <SelectWalletsDropdown
      menuSx={sm ? undefined : { transform: 'translateX(10px)' }}
      allWallets={allWallets}
      selectedWallets={selectedWallets ?? []}
      handleSelectAllWallets={handleSelectAllWallets}
      handleToggleWallet={handleToggleWallet}
    />
  )
}

export function SelectWalletsDropdown({
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
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)

  const options = useMemo(() => {
    return allWallets?.filter((option) => {
      const walletName = parseWalletName(option)
      return walletName?.toLowerCase()?.includes(debounceSearchText.toLowerCase())
    })
  }, [allWallets, debounceSearchText])

  const { vaultWallets } = useCopyWalletContext()
  if (!allWallets.length) return <></>
  const isSelectedAll =
    !!allWallets.length &&
    allWallets.every((copyWalletId) => selectedWallets?.map((e) => e.id).includes(copyWalletId.id))

  return (
    <Dropdown
      menuSx={{
        width: ['100%', 450],
        height: 350,
        overflow: 'auto',
        p: 2,
        ...menuSx,
      }}
      buttonVariant="ghost"
      dismissible={false}
      menuDismissible
      menu={
        <>
          <InputSearchText placeholder="SEARCH WALLET" searchText={searchText} setSearchText={setSearchText} />
          <Flex sx={{ gap: 2, alignItems: 'center', my: 2 }}>
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
            <Type.CaptionBold color="neutral2">
              <Trans>SELECT ALL</Trans>
              <Type.Caption color="neutral3" ml={1}>
                (<Trans>Includes deleted data</Trans>)
              </Type.Caption>
            </Type.CaptionBold>
          </Flex>

          {!options.length && <NoDataFound message={<Trans>No Wallet Found</Trans>} />}
          <Grid
            sx={{
              gridTemplateColumns: ['1fr', '1fr 1fr'],
              columnGap: 3,
              rowGap: 2,
            }}
          >
            {options.map((item) => {
              const key = item.id
              if (key == null) return <></>
              const isChecked = selectedWallets.findIndex((e) => e.id === item.id) !== -1
              return (
                <Box py={2} key={key.toString()}>
                  <ControlledCheckbox
                    checked={isChecked}
                    label={
                      <Flex key={item.id} sx={{ alignItems: 'center', gap: 1, width: '100%' }}>
                        <Image src={parseExchangeImage(item.exchange)} width={20} height={20} sx={{ flexShrink: 0 }} />
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
                        {vaultWallets?.some((_wallet) => _wallet.id === item.id) && (
                          <Type.Caption minWidth="fit-content">(Vault)</Type.Caption>
                        )}
                      </Flex>
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
        // textTransform: 'none',
        alignItems: ['start', 'center'],
        '.icon_dropdown': { pt: ['3px', 0] },
      }}
      placement={placement}
    >
      {selectedWallets.length}/{allWallets.length} Active {allWallets.length > 1 ? 'Wallets' : 'Wallet'}
    </Dropdown>
  )
}
