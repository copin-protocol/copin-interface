import { Trans } from '@lingui/macro'
import { Plus } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'

import { CreateWalletModal } from 'components/CreateWalletAction'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Select from 'theme/Select'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseWalletName } from 'utils/helpers/transform'

export default function Wallets({
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
  const { copyWallets, loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()
  const copyWalletsByExchange = useMemo(
    () => copyWallets?.filter((e) => e.exchange === platform),
    [copyWallets, platform]
  )

  useEffect(() => {
    if (currentWalletId) return
    onChangeWallet(copyWalletsByExchange?.[0]?.id ?? '')
  }, [copyWalletsByExchange])

  if (loadingCopyWallets) return <Loading />

  const walletOptions = copyWalletsByExchange?.map((walletData) => {
    return {
      label: parseWalletName(walletData),
      value: walletData.id,
    }
  })

  if (!walletOptions?.length) return <NoWallet platform={platform} onCreateWalletSuccess={reloadCopyWallets} />

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

function NoWallet({
  platform,
  onCreateWalletSuccess,
}: {
  platform: CopyTradePlatformEnum
  onCreateWalletSuccess: () => void
}) {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const onDismissModal = () => setOpenModal(false)
  let text = null
  switch (platform) {
    case CopyTradePlatformEnum.BINGX:
      text = <Trans>Create BingX wallet</Trans>
      break
    case CopyTradePlatformEnum.BITGET:
      text = <Trans>Create Bitget wallet</Trans>
      break
    case CopyTradePlatformEnum.BINANCE:
      text = <Trans>Create Binance wallet</Trans>
      break
    case CopyTradePlatformEnum.SYNTHETIX:
      text = <Trans>Create smart wallet</Trans>
      break

    default:
      break
  }
  return (
    <Box>
      <ButtonWithIcon block icon={<Plus size={20} />} variant="outlinePrimary" onClick={handleOpenModal} height={42}>
        {text}
      </ButtonWithIcon>
      <CreateWalletModal
        exchange={platform}
        isOpen={openModal}
        onDismiss={() => {
          onCreateWalletSuccess()
          onDismissModal()
        }}
      />
    </Box>
  )
}
