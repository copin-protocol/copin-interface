import { Trans } from '@lingui/macro'
import { ArrowSquareOut, HandWaving, Wallet } from '@phosphor-icons/react'
import { useState } from 'react'
import { useQuery } from 'react-query'

import { getAllCopyWalletsApi } from 'apis/copyWalletApis'
import Divider from 'components/@ui/Divider'
import CreateBingXWalletModal from 'components/Modal/CreateBingXWalletModal'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import Label from 'theme/InputField/Label'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import Select from 'theme/Select'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
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
  const { myProfile } = useMyProfile()

  const {
    data: copyWallets,
    isLoading: loadingCopyWallets,
    refetch: refetchWallets,
  } = useQuery([QUERY_KEYS.GET_COPY_WALLETS_LIST], () => getAllCopyWalletsApi(), {
    enabled: !!myProfile,
    retry: 0,
    onSuccess(data) {
      if (currentWalletId) return
      onChangeWallet(data[0]?.id)
    },
  })
  if (loadingCopyWallets) return <Loading />

  const walletOptions = copyWallets
    ?.filter((data) => {
      return data.exchange === platform
    })
    .map((walletData) => {
      return {
        label: parseWalletName(walletData),
        value: walletData.id,
      }
    })

  if (!walletOptions?.length) return <NoWallet platform={platform} onCreateWalletSuccess={refetchWallets} />

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
      modalContent = <CreateSmartWalletModal />
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

function CreateSmartWalletModal() {
  return (
    <Modal isOpen>
      <Box sx={{ p: 3 }}>
        <Flex mb={2} sx={{ alignItems: 'center', gap: 2 }}>
          <IconBox color="primary1" icon={<HandWaving size={32} />} />
          <Type.Caption color="primary2">
            <Trans>Hi! Copier</Trans>
          </Type.Caption>
        </Flex>
        <Type.BodyBold mb={2}>
          <Trans>To start, you need to create a smart wallet.</Trans>
        </Type.BodyBold>
        <Type.Caption color="neutral2">
          <Trans>The process of creating a wallet is quick and only costs a small amount in gas fees.</Trans>
        </Type.Caption>
        <Divider my={20} />
        <Flex mb={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Type.CaptionBold>
            <Trans>What is smart wallet?</Trans>
          </Type.CaptionBold>
          <Flex as="a" href={'#'} target="_blank" sx={{ alignItems: 'center', gap: 2 }}>
            <Type.Caption>
              <Trans>View more</Trans>
            </Type.Caption>
            <IconBox icon={<ArrowSquareOut size={20} />} />
          </Flex>
        </Flex>
        <Type.Caption mb={20} color="neutral3">
          <Trans>
            Smart wallets are a unique Copin offering that allows copiers to copytrade at Synthetix platform.
          </Trans>
        </Type.Caption>
        <Button variant="primary" block>
          <Trans>Create Smart Wallet</Trans>
        </Button>
      </Box>
    </Modal>
  )
}
