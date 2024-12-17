import { useEffect, useMemo, useRef } from 'react'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import Loading from 'theme/Loading'
import Select from 'theme/Select'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseWalletName } from 'utils/helpers/transform'

export default function VaultWallets({
  platform,
  currentWalletId,
  onChangeWallet,
  disabledSelect,
}: {
  platform: CopyTradePlatformEnum
  currentWalletId: string
  onChangeWallet: (walletId: string) => void
  disabledSelect: boolean
}) {
  const platformRef = useRef(platform)
  const { vaultWallets, loadingVaultCopyWallets } = useCopyWalletContext()
  const copyWalletsByExchange = useMemo(
    () => vaultWallets?.filter((e) => e.exchange === platform),
    [vaultWallets, platform]
  )

  useEffect(() => {
    if (currentWalletId && platform && (!platformRef.current || platform === platformRef.current)) return
    platformRef.current = platform
    onChangeWallet(copyWalletsByExchange?.[0]?.id ?? '')
  }, [copyWalletsByExchange, currentWalletId])

  if (loadingVaultCopyWallets) return <Loading />

  const walletOptions = copyWalletsByExchange?.map((walletData) => {
    return {
      label: parseWalletName(walletData),
      value: walletData.id,
    }
  })

  if (!walletOptions?.length) return <></>

  const currentOption = walletOptions.find((option) => option.value === currentWalletId) ?? walletOptions[0]
  return !!currentWalletId ? (
    <Select
      value={currentOption}
      options={walletOptions}
      onChange={(newValue: any) => onChangeWallet(newValue.value)}
      isDisabled={disabledSelect}
    />
  ) : null
}
