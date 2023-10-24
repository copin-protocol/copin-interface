import { Trans } from '@lingui/macro'
import React, { ReactNode, useState } from 'react'

import CreateSmartWalletModal from 'components/CreateSmartWalletModal'
import CreateBingXWalletModal from 'components/Modal/CreateBingXWalletModal'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Button } from 'theme/Buttons'
import { Flex, Image, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseExchangeImage } from 'utils/helpers/transform'

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
          <Trans>
            Link with your BingX account through API key. All your assets and your positions management by BingX. Lowest
            fee, CEX trading
          </Trans>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BINGX)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.SYNTHETIX}
        label={<Trans>Smart Wallet</Trans>}
        description={<Trans>A non-custody wallet. Your own all your assets, fully decentralized copy trading</Trans>}
        handleClick={
          // () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX)
          !hasSynthetixWallet && !loadingCopyWallets
            ? () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX)
            : undefined
        }
      />
      {openCreateModal && currentExchange === CopyTradePlatformEnum.BINGX && (
        <CreateBingXWalletModal
          onDismiss={() => {
            setOpenCreateModal(false)
            reloadCopyWallets()
          }}
        />
      )}
      {openCreateModal && currentExchange === CopyTradePlatformEnum.SYNTHETIX && (
        <CreateSmartWalletModal
          onDismiss={() => {
            setOpenCreateModal(false)
            reloadCopyWallets()
          }}
        />
      )}
    </>
  )
}

interface WalletItemProps {
  exchange: CopyTradePlatformEnum
  label: ReactNode
  description: ReactNode
  handleClick?: (exchange: CopyTradePlatformEnum) => void
}

function WalletItem({ exchange, label, description, handleClick }: WalletItemProps) {
  return (
    <Flex p={24} flexDirection="column" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      <Flex alignItems="center" sx={{ gap: 3 }}>
        <Image src={parseExchangeImage(exchange)} width={40} height={40} />
        <Type.LargeBold>{label}</Type.LargeBold>
      </Flex>
      <Type.Caption mt={12} mb={3} color="neutral3">
        {description}
      </Type.Caption>
      <Button
        type="button"
        variant="outlineActive"
        onClick={() => handleClick && handleClick(exchange)}
        disabled={!handleClick}
      >
        <Trans>Create</Trans>
      </Button>
    </Flex>
  )
}
