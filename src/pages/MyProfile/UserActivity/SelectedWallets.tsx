import isEqual from 'lodash/isEqual'
import { useEffect, useRef } from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'

import SelectWalletsDropdown from '../SelectWalletsDropdown'
import { DispatchFilterActivities } from './useFilterActivities'

export default function SelectedWallets({
  allWallets,
  selectedWallets,
  dispatch,
  onChangeWallets,
}: {
  allWallets: CopyWalletData[]
  selectedWallets: CopyWalletData[]
  dispatch: DispatchFilterActivities
  onChangeWallets: () => void
}) {
  const { copyWallets } = useCopyWalletContext()

  const handleSelectAllWallets = (isSelectedAll: boolean) => {
    if (!copyWallets?.length) return
    if (isSelectedAll) {
      dispatch({ type: 'setWallets', payload: [] })
    } else {
      dispatch({ type: 'setAllWallets' })
    }
    onChangeWallets()
  }

  const handleToggleWallet = (wallet: CopyWalletData) => {
    dispatch({ type: 'toggleWallet', payload: wallet })
    onChangeWallets()
  }

  const prevAllWallets = useRef(allWallets)
  useEffect(() => {
    if (isEqual(prevAllWallets.current, copyWallets)) return
    prevAllWallets.current = copyWallets ?? []
    dispatch({
      type: 'setState',
      payload: {
        selectedWallets: copyWallets,
        allWallets: copyWallets,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!allWallets.length) return <></>

  return (
    <SelectWalletsDropdown
      allWallets={allWallets}
      selectedWallets={selectedWallets}
      handleSelectAllWallets={handleSelectAllWallets}
      handleToggleWallet={handleToggleWallet}
    />
  )
}
