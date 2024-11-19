import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useInternalRole from 'hooks/features/useInternalRole'
import { CreateTypeWalletEnum } from 'pages/MyProfile/CheckingWalletRenderer'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Flex, Image, Type } from 'theme/base'
import { DCP_EXCHANGES, LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseExchangeImage } from 'utils/helpers/transform'

import CreateBinanceWalletModal from '../CreateWalletModals/CreateBinanceWalletModal'
import CreateBingXWalletModal from '../CreateWalletModals/CreateBingXWalletModal'
import CreateBitgetWalletModal from '../CreateWalletModals/CreateBitgetWalletModal'
import CreateBybitWalletModal from '../CreateWalletModals/CreateBybitWalletModal'
import CreateGateWalletModal from '../CreateWalletModals/CreateGateWalletModal'
import CreateHyperliquidWalletModal from '../CreateWalletModals/CreateHyperliquidWalletModal'
import CreateOKXWalletModal from '../CreateWalletModals/CreateOKXWalletModal'
import CreateSmartWalletModal from '../CreateWalletModals/CreateSmartWalletModal'

export default function CreateWalletAction({ type = CreateTypeWalletEnum.FULL }: { type?: CreateTypeWalletEnum }) {
  const { loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [currentExchange, setCurrentExchange] = useState<CopyTradePlatformEnum | undefined>()

  const handleOpenCreateModal = (exchange: CopyTradePlatformEnum) => {
    setCurrentExchange(exchange)
    setOpenCreateModal(true)
  }

  const cexItems = (
    <>
      <WalletItem
        exchange={CopyTradePlatformEnum.BINGX}
        label={<Trans>BingX API</Trans>}
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
                <Trans>Connect</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BINGX)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.BITGET}
        label={<Trans>Bitget API</Trans>}
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
                <Trans>Connect</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BITGET)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.BYBIT}
        label={<Trans>Bybit API</Trans>}
        description={
          <Box>
            <Trans>
              Link with your Bybit account through API key. All your assets and your positions management by Bybit.
              Lowest fee, CEX trading
            </Trans>
            <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Type.Caption color="neutral2">
                <Trans>Don’t have a Bybit account?</Trans>
              </Type.Caption>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                as="a"
                href={LINKS.registerBybit}
                target="_blank"
                direction="right"
                icon={<ArrowSquareOut size={16} />}
                sx={{ mx: 0, p: 0, fontSize: '14px' }}
              >
                <Trans>Connect</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BYBIT)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.OKX}
        label={<Trans>OKX API</Trans>}
        description={
          <Box>
            <Trans>
              Link with your OKX account through API key. All your assets and your positions management by OKX. Lowest
              fee, CEX trading
            </Trans>
            <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Type.Caption color="neutral2">
                <Trans>Don’t have a OKX account?</Trans>
              </Type.Caption>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                as="a"
                href={LINKS.registerOKX}
                target="_blank"
                direction="right"
                icon={<ArrowSquareOut size={16} />}
                sx={{ mx: 0, p: 0, fontSize: '14px' }}
              >
                <Trans>Connect</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.OKX)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.GATE}
        label={<Trans>Gate API</Trans>}
        description={
          <Box>
            <Trans>Link with your Gate account through API key</Trans>
            <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Type.Caption color="neutral2">
                <Trans>Don’t have a Gate account?</Trans>
              </Type.Caption>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                as="a"
                href={LINKS.registerGate}
                target="_blank"
                direction="right"
                icon={<ArrowSquareOut size={16} />}
                sx={{ mx: 0, p: 0, fontSize: '14px' }}
              >
                <Trans>Connect</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.GATE)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.BINANCE}
        label={<Trans>Binance API</Trans>}
        description={
          <Trans>
            Link with your Binance account through API key. All your assets and your positions management by Binance.
            Lowest fee, CEX trading
          </Trans>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.BINANCE)}
      />
      <WalletItem
        exchange={CopyTradePlatformEnum.HYPERLIQUID}
        label={<Trans>Hyperliquid API</Trans>}
        description={
          <Box>
            <Trans>Link with your Hyperliquid account through API key</Trans>
            <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
              <Type.Caption color="neutral2">
                <Trans>Don’t have a Hyperliquid account?</Trans>
              </Type.Caption>
              <ButtonWithIcon
                type="button"
                variant="ghostPrimary"
                as="a"
                href={LINKS.registerHyperliquid}
                target="_blank"
                direction="right"
                icon={<ArrowSquareOut size={16} />}
                sx={{ mx: 0, p: 0, fontSize: '14px' }}
              >
                <Trans>Connect</Trans>
              </ButtonWithIcon>
            </Flex>
          </Box>
        }
        handleClick={() => handleOpenCreateModal(CopyTradePlatformEnum.HYPERLIQUID)}
      />
    </>
  )

  const dcpItems = (
    <>
      <WalletItem
        exchange={CopyTradePlatformEnum.SYNTHETIX_V2}
        label={<Trans>Synthetix v2 Wallet</Trans>}
        description={
          <Trans>An abstract account (AA) wallet. Your own all your assets, fully decentralized copy trading</Trans>
        }
        handleClick={
          // () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX)
          !loadingCopyWallets ? () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX_V2) : undefined
        }
      />

      <WalletItem
        exchange={CopyTradePlatformEnum.GNS_V8}
        label={<Trans>gTrade Wallet</Trans>}
        description={
          <Trans>An abstract account (AA) wallet. Your own all your assets, fully decentralized copy trading</Trans>
        }
        handleClick={
          // () => handleOpenCreateModal(CopyTradePlatformEnum.SYNTHETIX)
          !loadingCopyWallets ? () => handleOpenCreateModal(CopyTradePlatformEnum.GNS_V8) : undefined
        }
      />
    </>
  )

  return (
    <>
      {(type === CreateTypeWalletEnum.FULL || type === CreateTypeWalletEnum.CEX) && cexItems}
      {(type === CreateTypeWalletEnum.FULL || type === CreateTypeWalletEnum.DCP) && dcpItems}
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
    case CopyTradePlatformEnum.BYBIT:
      Modal = CreateBybitWalletModal
      break
    case CopyTradePlatformEnum.OKX:
      Modal = CreateOKXWalletModal
      break
    case CopyTradePlatformEnum.GATE:
      Modal = CreateGateWalletModal
      break
    case CopyTradePlatformEnum.SYNTHETIX_V2:
    case CopyTradePlatformEnum.GNS_V8:
      Modal = CreateSmartWalletModal
      break
    case CopyTradePlatformEnum.HYPERLIQUID:
      Modal = CreateHyperliquidWalletModal
      break
  }
  if (!Modal || !isOpen) return null
  return <Modal isOpen={isOpen} onDismiss={onDismiss} platform={exchange} />
}

interface WalletItemProps {
  exchange: CopyTradePlatformEnum
  label: ReactNode
  description: ReactNode
  handleClick?: (exchange: CopyTradePlatformEnum) => void
}

function WalletItem({ exchange, label, description, handleClick }: WalletItemProps) {
  const isInternal = useInternalRole()
  const isComingSoon = !isInternal && exchange === CopyTradePlatformEnum.BINANCE
  const isDCP = DCP_EXCHANGES.includes(exchange)
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
        {isComingSoon ? <Trans>Coming Soon</Trans> : isDCP ? <Trans>Create</Trans> : <Trans>Connect</Trans>}
      </Button>
    </Flex>
  )
}
