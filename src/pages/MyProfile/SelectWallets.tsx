import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { GridProps } from 'styled-system'

import SelectWithCheckbox from 'components/@widgets/SelectWithCheckbox'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Box, Flex, Image, Type } from 'theme/base'
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
      onChangeWallets(allWallets)
    } else {
      onChangeWallets([])
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

function SelectWalletsDropdown({
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
  const { vaultWallets } = useCopyWalletContext()
  if (!allWallets.length) return <></>
  const isSelectedAll = allWallets.length === selectedWallets.length

  const filterOptionsBySearchFn = ({ searchText, option }: { searchText: string; option: CopyWalletData }) => {
    if (!searchText) return true
    const walletName = parseWalletName(option)
    return walletName?.toLowerCase()?.includes(searchText.toLowerCase())
  }
  const optionItemKeyFn = (option: CopyWalletData) => option.id
  const optionItemSelectedFn = (option: CopyWalletData) => selectedWallets.findIndex((o) => o.id === option.id) !== -1
  const renderOptionLabel = (option: CopyWalletData) => {
    return (
      <Flex key={option.id} sx={{ alignItems: 'center', gap: 1, width: '100%' }}>
        <Image src={parseExchangeImage(option.exchange)} width={20} height={20} sx={{ flexShrink: 0 }} />
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
          {parseWalletName(option)}
        </Box>
        {vaultWallets?.some((_wallet) => _wallet.id === option.id) && (
          <Type.Caption minWidth="fit-content">(Vault)</Type.Caption>
        )}
      </Flex>
    )
  }

  return (
    <SelectWithCheckbox
      menuSx={menuSx}
      placement={placement}
      isSelectedAll={isSelectedAll}
      options={allWallets}
      selectAllLabel={
        <>
          <Trans>Select all</Trans> (
          <Type.Caption>
            <Trans>Includes deleted data</Trans>
          </Type.Caption>
          )
        </>
      }
      value={selectedWallets}
      onChangeValue={handleToggleWallet}
      onToggleSelectAll={handleSelectAllWallets}
      filterOptionsBySearchFn={filterOptionsBySearchFn}
      optionItemKeyFn={optionItemKeyFn}
      optionItemSelectedFn={optionItemSelectedFn}
      renderOptionLabel={renderOptionLabel}
      buttonSx={{ padding: '0 8px' }}
    >
      {selectedWallets.length}/{allWallets.length} active {allWallets.length > 1 ? 'wallets' : 'wallet'}
    </SelectWithCheckbox>
  )
}
