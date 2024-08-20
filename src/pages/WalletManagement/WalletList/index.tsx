import { Trans } from '@lingui/macro'
import { ArrowSquareOut, PlusSquare, Warning } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { updateCopyWalletApi } from 'apis/copyWalletApis'
import ToastBody from 'components/@ui/ToastBody'
import { CreateWalletModal } from 'components/@wallet/CreateWalletAction'
import WalletDetailsCard from 'components/@wallet/WalletDetailsCard'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DCP_EXCHANGES, LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { parseExchangeImage } from 'utils/helpers/transform'

const EXCHANGES = [
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.BINANCE,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.GNS_V8,
]
const ALLOW_EXCHANGE = [
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.GNS_V8,
]

export default function WalletList({ hiddenBalance }: { hiddenBalance?: boolean }) {
  const allowExchanges = ALLOW_EXCHANGE
  const { copyWallets, loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()

  const updateCopyWallet = useMutation(updateCopyWalletApi, {
    onSuccess: () => {
      reloadCopyWallets()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const handleUpdate = ({
    copyWalletId,
    name,
    previousValue,
    callback,
  }: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => {
    if (!copyWalletId || !name) return
    updateCopyWallet.mutate(
      { copyWalletId, data: { name } },
      {
        onSuccess: () => {
          callback(name)
        },
        onError: () => {
          callback(previousValue)
        },
      }
    )
  }
  const walletMapping = copyWallets?.length
    ? copyWallets
        .filter((wallet) => EXCHANGES.includes(wallet.exchange))
        .reduce((result, wallet) => {
          return { ...result, [wallet.exchange]: [...(result[wallet.exchange] || []), wallet] }
        }, {} as Record<CopyTradePlatformEnum, CopyWalletData[]>)
    : ({} as Record<CopyTradePlatformEnum, CopyWalletData[]>)

  return (
    <Flex flexDirection="column" height="100%">
      {loadingCopyWallets && <Loading />}
      {/* {!loadingCopyWallets && (!copyWallets || copyWallets.length === 0) && (
        <NoDataFound message={<Trans>You don’t have any wallet. Please create a wallet</Trans>} />
      )} */}
      <Flex
        flexDirection="column"
        sx={{
          overflowY: 'auto',
          '& > *': { borderTop: 'small', borderTopColor: 'neutral4' },
          '& > *:first-child': { borderTop: 'none' },
        }}
      >
        {EXCHANGES.map((exchange) => {
          const isAllowed = allowExchanges.includes(exchange)
          const wallets = walletMapping[exchange] ?? []
          return (
            <Accordion
              disabled={!isAllowed}
              iconSize={24}
              direction="left"
              key={exchange}
              wrapperSx={{ p: 0 }}
              headerWrapperSx={{
                p: 3,
                gap: 3,
                bg: 'neutral5',
                alignItems: ['start', 'start', 'center'],
                '.icon': { mt: [1, 1, 0] },
              }}
              header={
                <Flex
                  sx={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <ExchangeTitle
                    count={wallets.length}
                    isAllowed={isAllowed}
                    exchange={exchange}
                    onCreateWalletSuccess={reloadCopyWallets}
                  />
                  <Box ml={{ _: '-40px', md: 0 }}>
                    {DCP_EXCHANGES.includes(exchange) ? <WalletWarningDCP /> : <ExternalLink exchange={exchange} />}
                  </Box>
                </Flex>
              }
              body={
                isAllowed && (
                  <Box
                    sx={{
                      '& > *': {
                        borderBottom: 'small',
                        borderBottomColor: 'neutral4',
                        '&:last-child': { borderBottom: 'none' },
                      },
                    }}
                  >
                    {wallets.map((wallet) => {
                      return (
                        <WalletDetailsCard
                          hiddenBalance={hiddenBalance}
                          key={wallet.id}
                          data={wallet}
                          hasBorderTop={false}
                          handleUpdate={handleUpdate}
                          reload={reloadCopyWallets}
                        />
                      )
                    })}
                    {!wallets?.length && (
                      <Box sx={{ textAlign: 'left', p: 3 }} color="neutral3">
                        No Wallet
                      </Box>
                    )}
                  </Box>
                )
              }
            />
          )
        })}
      </Flex>
    </Flex>
  )
}

function ExchangeTitle({
  isAllowed,
  exchange,
  onCreateWalletSuccess,
  count,
}: {
  isAllowed: boolean
  exchange: CopyTradePlatformEnum
  onCreateWalletSuccess: () => void
  count: number
}) {
  const [openModal, setOpenModal] = useState(false)
  let title = ''
  switch (exchange) {
    case CopyTradePlatformEnum.BINGX:
      title = 'BingX Exchange'
      break
    case CopyTradePlatformEnum.BITGET:
      title = 'Bitget Exchange'
      break
    case CopyTradePlatformEnum.BINANCE:
      title = 'Binance Exchange'
      break

    case CopyTradePlatformEnum.BYBIT:
      title = 'Bybit Exchange'
      break
    case CopyTradePlatformEnum.OKX:
      title = 'OKX Exchange'
      break
    case CopyTradePlatformEnum.GATE:
      title = 'Gate Exchange'
      break
    case CopyTradePlatformEnum.SYNTHETIX_V2:
      title = 'Synthetix v2 Exchange'
      break
    case CopyTradePlatformEnum.GNS_V8:
      title = 'gTrade Exchange'
      break
  }
  if (!title) return null
  return (
    <>
      <Flex width={['100%', '100%', 'auto']} alignItems="center" sx={{ gap: 2, justifyContent: 'space-between' }}>
        <Flex flex="1" width={['100%', '100%', 'auto']} sx={{ alignItems: 'center', gap: 2 }}>
          <Image src={parseExchangeImage(exchange)} width={32} height={32} />
          <Type.BodyBold display="inline-block" mr={1}>
            {title} {isAllowed && !!count ? `(${count})` : ''}
          </Type.BodyBold>
        </Flex>
        {isAllowed ? (
          <Button
            variant="ghostPrimary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpenModal(true)
            }}
          >
            <PlusSquare size={16} style={{ color: 'inherit' }} />
            <Box as="span">Create</Box>
          </Button>
        ) : (
          <Type.Caption sx={{ py: 1, px: 2, bg: 'neutral6', borderRadius: '2px' }} color="neutral3">
            Coming soon
          </Type.Caption>
        )}
      </Flex>
      <CreateWalletModal
        exchange={exchange}
        isOpen={openModal}
        onDismiss={() => {
          onCreateWalletSuccess()
          setOpenModal(false)
        }}
      />
    </>
  )
}

function ExternalLink({ exchange }: { exchange: CopyTradePlatformEnum }) {
  let link = ''
  let text = ''
  switch (exchange) {
    case CopyTradePlatformEnum.BINGX:
      link = LINKS.registerBingX
      text = `Don’t have a BingX account?`
      break
    case CopyTradePlatformEnum.BITGET:
      link = LINKS.registerBitget
      text = `Don’t have a Bitget account?`
      break
    case CopyTradePlatformEnum.BINANCE:
      link = LINKS.registerBinance
      text = `Don’t have a Binance account?`
      break
    case CopyTradePlatformEnum.BYBIT:
      link = LINKS.registerBybit
      text = `Don’t have a Bybit account?`
      break
    case CopyTradePlatformEnum.OKX:
      link = LINKS.registerOKX
      text = `Don’t have a OKX account?`
      break
    case CopyTradePlatformEnum.GATE:
      link = LINKS.registerGate
      text = `Don’t have a Gate account?`
      break
  }
  if (!link) return null
  return (
    <Flex sx={{ alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
      <Type.Caption color="neutral1">{text}</Type.Caption>
      <Type.Caption>-</Type.Caption>
      <ButtonWithIcon
        type="button"
        variant="ghostPrimary"
        as="a"
        href={link}
        target="_blank"
        direction="right"
        icon={<ArrowSquareOut size={16} style={{ color: 'inherit' }} />}
        sx={{ mx: 0, p: 0, fontSize: '13px', gap: 1, '*': { marginLeft: 0 } }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <Trans>Register</Trans>
      </ButtonWithIcon>
    </Flex>
  )
}

function WalletWarningDCP() {
  return (
    <>
      <IconBox
        icon={<Warning color={themeColors.orange1} size={24} />}
        data-tip="React-tooltip"
        data-tooltip-id={'tt_dcp_wallet_warning'}
      />
      <Tooltip id={'tt_dcp_wallet_warning'} place="top" type="dark" effect="solid" clickable>
        <Type.Small sx={{ maxWidth: [300, 400] }}>
          DCP is currently in alpha version and experiment phase. Please use caution and test with limited capital. If
          you encounter any issues, please contact direct support at:{' '}
          <a href={LINKS.support} target="_blank" rel="noreferrer">
            https://t.me/leecopin
          </a>
        </Type.Small>
      </Tooltip>
    </>
  )
}
