import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React, { ReactNode, useState } from 'react'

import CreateSmartWalletModal from 'components/CreateSmartWalletModal'
import CreateBingXWalletModal from 'components/Modal/CreateBingXWalletModal'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useInternalRole from 'hooks/features/useInternalRole'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Flex, Image, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseExchangeImage } from 'utils/helpers/transform'

import CreateBinanceWalletModal from '../Modal/CreateBinanceWalletModal'
import CreateBitgetWalletModal from '../Modal/CreateBitgetWalletModal'

export default function CreateWalletAction() {
  const { copyWallets, loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [currentExchange, setCurrentExchange] = useState<CopyTradePlatformEnum | undefined>()

  const hasSynthetixWallet = !!copyWallets?.find((wallet) => wallet.exchange === CopyTradePlatformEnum.SYNTHETIX)

  const handleOpenCreateModal = (exchange: CopyTradePlatformEnum) => {
    setCurrentExchange(exchange)
    setOpenCreateModal(true)
  }
  return (
    <>
      <WalletItem
        exchange={CopyTradePlatformEnum.BINGX}
        label={<Trans>BingX Wallet</Trans>}
        description={
          <Box>
            <Trans>
              Link with your BingX account through API key. All your assets and your positions management by BingX.
              Lowest fee, CEX trading
            </Trans>
            <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Type.Caption color="neutral2">
                <Trans>Don’t have a BingX account?</Trans>
              </Type.Caption>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                as="a"
                href={LINKS.registerBingX}
                target="_blank"
                direction="right"
                icon={<ArrowSquareOut size={16} />}
                sx={{ mx: 0, p: 0, fontSize: '14px' }}
              >
                <Trans>Register</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BINGX)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.BITGET}
        label={<Trans>Bitget Wallet</Trans>}
        description={
          <Box>
            <Trans>
              Link with your Bitget account through API key. All your assets and your positions management by Bitget.
              Lowest fee, CEX trading
            </Trans>
            <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Type.Caption color="neutral2">
                <Trans>Don’t have a Bitget account?</Trans>
              </Type.Caption>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                as="a"
                href={LINKS.registerBitget}
                target="_blank"
                direction="right"
                icon={<ArrowSquareOut size={16} />}
                sx={{ mx: 0, p: 0, fontSize: '14px' }}
              >
                <Trans>Register</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BITGET)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.BINANCE}
        label={<Trans>Binance Wallet</Trans>}
        description={
          <Trans>
            Link with your Binance account through API key. All your assets and your positions management by Binance.
            Lowest fee, CEX trading
          </Trans>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BINANCE)}
      />

      <WalletItem
        exchange={CopyTradePlatformEnum.SYNTHETIX}
        label={<Trans>Smart Wallet</Trans>}
        description={
          <Trans>An abstract account (AA) wallet. Your own all your assets, fully decentralized copy trading</Trans>
        }
        // handleClick={
        //   // () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX)
        //   !hasSynthetixWallet && !loadingCopyWallets
        //     ? () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX)
        //     : undefined
        // }
      />

      <CreateWalletModal
        isOpen={openCreateModal}
        exchange={currentExchange}
        onDismiss={() => {
          setOpenCreateModal(false)
          reloadCopyWallets()
        }}
      />
    </>
  )
}

export function CreateWalletModal({
  exchange,
  isOpen,
  onDismiss,
}: {
  exchange: CopyTradePlatformEnum | undefined
  isOpen: boolean
  onDismiss: () => void
}) {
  if (!exchange) return null
  let Modal = null
  switch (exchange) {
    case CopyTradePlatformEnum.BINGX:
      Modal = CreateBingXWalletModal
      break
    case CopyTradePlatformEnum.BITGET:
      Modal = CreateBitgetWalletModal
      break
    case CopyTradePlatformEnum.BINANCE:
      Modal = CreateBinanceWalletModal
      break
    // case CopyTradePlatformEnum.SYNTHETIX:
    //   Modal = CreateSmartWalletModal
    //   break
  }
  if (!Modal) return null
  return <Modal isOpen={isOpen} onDismiss={onDismiss} />
}

interface WalletItemProps {
  exchange: CopyTradePlatformEnum
  label: ReactNode
  description: ReactNode
  handleClick?: (exchange: CopyTradePlatformEnum) => void
}

function WalletItem({ exchange, label, description, handleClick }: WalletItemProps) {
  const isInternal = useInternalRole()
  const isComingSoon =
    exchange === CopyTradePlatformEnum.SYNTHETIX || (!isInternal && exchange === CopyTradePlatformEnum.BINANCE)
  return (
    <Flex minWidth={350} p={24} flexDirection="column" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      <Flex alignItems="center" sx={{ gap: 3 }}>
        <Image src={parseExchangeImage(exchange)} width={40} height={40} />
        <Type.LargeBold>{label}</Type.LargeBold>
      </Flex>
      <Type.Caption mt={12} mb={3} color="neutral3">
        {description}
      </Type.Caption>
      <Button
        type="button"
        variant="outlinePrimary"
        onClick={() => handleClick && handleClick(exchange)}
        disabled={!handleClick || isComingSoon}
      >
        {isComingSoon ? <Trans>Coming Soon</Trans> : <Trans>Create</Trans>}
      </Button>
    </Flex>
  )
}
