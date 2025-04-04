import { Trans } from '@lingui/macro'
import { Plus } from '@phosphor-icons/react'
import { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'

import { CreateWalletModal } from 'components/@wallet/CreateWalletAction'
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
  selectProps,
}: {
  platform: CopyTradePlatformEnum
  currentWalletId: string
  onChangeWallet: (walletId: string) => void
  disabledSelect: boolean
  selectProps?: Omit<ComponentProps<typeof Select>, 'value' | 'options' | 'onChange' | 'isDisabled'>
}) {
  const platformRef = useRef(platform)
  const { copyWallets, loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()
  const copyWalletsByExchange = useMemo(
    () => copyWallets?.filter((e) => e.exchange === platform),
    [copyWallets, platform]
  )

  useEffect(() => {
    if (currentWalletId && platform && (!platformRef.current || platform === platformRef.current)) return
    platformRef.current = platform
    onChangeWallet(copyWalletsByExchange?.[0]?.id ?? '')
  }, [copyWalletsByExchange, currentWalletId])

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
      {...selectProps}
    />
  ) : null
}

function NoWallet({
  platform,
  onCreateWalletSuccess,
}: {
  platform: CopyTradePlatformEnum
  onCreateWalletSuccess: (() => void) | undefined
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
    case CopyTradePlatformEnum.BYBIT:
      text = <Trans>Create Bybit wallet</Trans>
      break
    case CopyTradePlatformEnum.OKX:
      text = <Trans>Create OKX wallet</Trans>
      break
    case CopyTradePlatformEnum.GATE:
      text = <Trans>Create Gate wallet</Trans>
      break
    case CopyTradePlatformEnum.SYNTHETIX_V2:
      text = <Trans>Create Synthetix v2 wallet</Trans>
      break
    case CopyTradePlatformEnum.GNS_V8:
      text = <Trans>Create gTrade wallet</Trans>
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
          onCreateWalletSuccess?.()
          onDismissModal()
        }}
      />
    </Box>
  )
}
