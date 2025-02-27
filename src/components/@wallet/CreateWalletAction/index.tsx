import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useInternalRole from 'hooks/features/useInternalRole'
import { CreateTypeWalletEnum } from 'pages/MyProfile/CheckingWalletRenderer'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Flex, Image, Type } from 'theme/base'
import { CEX_EXCHANGES, DCP_EXCHANGES } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { EXCHANGES_INFO } from 'utils/config/platforms'
import { parseExchangeImage } from 'utils/helpers/transform'

import CreateCEXWalletModal from '../CreateWalletModals/CreateCEXWalletModal'
import CreateHyperliquidWalletModal from '../CreateWalletModals/CreateHyperliquidWalletModal'
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
      {CEX_EXCHANGES.map((exchange) => {
        const exchangeInfo = EXCHANGES_INFO[exchange]
        return (
          <WalletItem
            key={exchange}
            exchange={exchange}
            label={<Trans>{exchangeInfo.name} API</Trans>}
            description={
              <Box>
                <Trans>Link with your {exchangeInfo.name} account through API key.</Trans>
                <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
                  <Type.Caption color="neutral2">
                    <Trans>Don’t have a {exchangeInfo.name} account?</Trans>
                  </Type.Caption>
                  <ButtonWithIcon
                    type="button"
                    variant="ghostPrimary"
                    as="a"
                    href={exchangeInfo.linkRegister}
                    target="_blank"
                    direction="right"
                    icon={<ArrowSquareOut size={16} />}
                    sx={{ mx: 0, p: 0, fontSize: '12px', lineHeight: '18px' }}
                  >
                    <Trans>Connect</Trans>
                  </ButtonWithIcon>
                </Flex>
              </Box>
            }
            handleClick={() => handleOpenCreateModal(exchange)}
          />
        )
      })}
    </>
  )

  const dcpItems = (
    <>
      {DCP_EXCHANGES.map((exchange) => {
        const exchangeInfo = EXCHANGES_INFO[exchange]

        return (
          <WalletItem
            key={exchange}
            exchange={exchange}
            label={<Trans>{exchangeInfo.name} Wallet</Trans>}
            description={
              <Trans>An abstract account (AA) wallet. Your own all your assets, fully decentralized copy trading</Trans>
            }
            handleClick={!loadingCopyWallets ? () => handleOpenCreateModal(exchange) : undefined}
          />
        )
      })}
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
          reloadCopyWallets?.()
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
    case CopyTradePlatformEnum.BITGET:
    case CopyTradePlatformEnum.BINANCE:
    case CopyTradePlatformEnum.BYBIT:
    case CopyTradePlatformEnum.OKX:
    case CopyTradePlatformEnum.GATE:
      Modal = CreateCEXWalletModal
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
  return <Modal isOpen={isOpen} onDismiss={onDismiss} exchange={exchange} />
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
