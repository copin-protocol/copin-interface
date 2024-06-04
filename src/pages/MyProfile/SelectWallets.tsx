import { useResponsive } from 'ahooks'

import { CopyWalletData } from 'entities/copyWallet'

import SelectWalletsDropdown from './SelectWalletsDropdown'

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
