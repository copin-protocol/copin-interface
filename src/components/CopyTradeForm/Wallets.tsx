import { Trans } from '@lingui/macro'
import { Wallet } from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'

import CreateSmartWalletModal from 'components/CreateSmartWalletModal'
import CreateBingXWalletModal from 'components/Modal/CreateBingXWalletModal'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import Label from 'theme/InputField/Label'
import Loading from 'theme/Loading'
import Select from 'theme/Select'
import { Box, Flex, IconBox, Type } from 'theme/base'
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
    <>
      <Label label={<Trans>Wallet</Trans>} />
      <Select
        value={currentOption}
        options={walletOptions}
        onChange={(newValue: any) => onChangeWallet(newValue.value)}
        isDisabled={disabledSelect}
      />
    </>
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
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          bg: 'neutral6',
          px: 3,
          py: 2,
          borderRadius: '4px',
        }}
      >
        <Box>
          <Flex mb={'2px'} sx={{ alignItems: 'center', gap: 2 }}>
            <Flex
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                bg: 'neutral5',
              }}
            >
              <IconBox icon={<Wallet size={18} />} color="neutral3" />
            </Flex>
            <Type.CaptionBold>
              <Trans>Wallet</Trans>
            </Type.CaptionBold>
          </Flex>
          <Type.Caption color="neutral3">
            <Trans>You don’t have any wallet yet </Trans>
          </Type.Caption>
        </Box>
        <Box role="button" onClick={handleOpenModal} sx={{ color: 'primary1', '&:hover': { color: 'primary2' } }}>
          <Type.Caption>{text}</Type.Caption>
        </Box>
      </Flex>
      {openModal && modalContent}
    </Box>
  )
}
