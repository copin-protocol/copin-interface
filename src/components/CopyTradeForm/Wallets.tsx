import { Trans } from '@lingui/macro'
import { Plus } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'

import CreateSmartWalletModal from 'components/CreateSmartWalletModal'
import CreateBingXWalletModal from 'components/Modal/CreateBingXWalletModal'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Select from 'theme/Select'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseWalletName } from 'utils/helpers/transform'

import CreateBinanceWalletModal from '../Modal/CreateBinanceWalletModal'
import CreateBitgetWalletModal from '../Modal/CreateBitgetWalletModal'

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
  let modalContent = null
  switch (platform) {
    case CopyTradePlatformEnum.BINGX:
      text = <Trans>Create BingX wallet</Trans>
      modalContent = (
        <CreateBingXWalletModal
          onDismiss={() => {
            onCreateWalletSuccess()
            onDismissModal()
          }}
        />
      )
      break
    case CopyTradePlatformEnum.BITGET:
      text = <Trans>Create Bitget wallet</Trans>
      modalContent = (
        <CreateBitgetWalletModal
          onDismiss={() => {
            onCreateWalletSuccess()
            onDismissModal()
          }}
        />
      )
      break
    case CopyTradePlatformEnum.BINANCE:
      text = <Trans>Create Binance wallet</Trans>
      modalContent = (
        <CreateBinanceWalletModal
          onDismiss={() => {
            onCreateWalletSuccess()
            onDismissModal()
          }}
        />
      )
      break
    case CopyTradePlatformEnum.SYNTHETIX:
      text = <Trans>Create smart wallet</Trans>
      modalContent = (
        <CreateSmartWalletModal
          onDismiss={() => {
            onCreateWalletSuccess()
            onDismissModal()
          }}
        />
      )
      break

    default:
      break
  }
  return (
    <Box>
      <ButtonWithIcon block icon={<Plus size={20} />} variant="outlinePrimary" onClick={handleOpenModal} height={42}>
        {text}
      </ButtonWithIcon>
      {openModal && modalContent}
    </Box>
  )
}
