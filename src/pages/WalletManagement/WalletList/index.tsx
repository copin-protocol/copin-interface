import { Trans } from '@lingui/macro'
import { ArrowSquareOut, PlusSquare, Warning } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { updateCopyWalletApi } from 'apis/copyWalletApis'
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import ToastBody from 'components/@ui/ToastBody'
import { CreateWalletModal } from 'components/@wallet/CreateWalletAction'
import WalletDetailsCard from 'components/@wallet/WalletDetailsCard'
import { CopyWalletData } from 'entities/copyWallet'
import useCheckCopyTradeExchange from 'hooks/features/copyTrade/useCheckCopyExchange'
import useCopyTradePermission from 'hooks/features/subscription/useCopyTradePermission'
import { useIsElite } from 'hooks/features/subscription/useSubscriptionRestrict'
import useUserUsage from 'hooks/features/subscription/useUserUsage'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useInternalRole from 'hooks/features/useInternalRole'
import { useAuthContext } from 'hooks/web3/useAuth'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DCP_EXCHANGES, DEPRECATED_EXCHANGES, LINKS, WAITLIST_EXCHANGES } from 'utils/config/constants'
import { CopyTradePlatformEnum, SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { parseExchangeImage } from 'utils/helpers/transform'

const EXCHANGES = [
  CopyTradePlatformEnum.HYPERLIQUID,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.BINANCE,
  CopyTradePlatformEnum.APEX,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.GNS_V8,
]
const INTERNAL_EXCHANGES = [
  CopyTradePlatformEnum.HYPERLIQUID,
  CopyTradePlatformEnum.APEX,
  CopyTradePlatformEnum.BITGET,
  CopyTradePlatformEnum.GATE,
  CopyTradePlatformEnum.BINGX,
  CopyTradePlatformEnum.OKX,
  CopyTradePlatformEnum.BYBIT,
  CopyTradePlatformEnum.BINANCE,
  CopyTradePlatformEnum.SYNTHETIX_V2,
  CopyTradePlatformEnum.GNS_V8,
]

export default function WalletList({ hiddenBalance }: { hiddenBalance?: boolean }) {
  const { exchangeAllowed, apiKeyQuota, userNextPlan } = useCopyTradePermission()
  const { usage } = useUserUsage()
  const { copyWallets, loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()
  const isInternal = useInternalRole()
  const isElite = useIsElite()
  const allowExchanges = exchangeAllowed
  const exchangeOptions = isInternal ? INTERNAL_EXCHANGES : EXCHANGES
  const apiWalletOptions = exchangeOptions.filter((e) => !DCP_EXCHANGES.includes(e))
  const smartWalletOptions = exchangeOptions.filter((e) => DCP_EXCHANGES.includes(e))

  const updateCopyWallet = useMutation(updateCopyWalletApi, {
    onSuccess: () => {
      reloadCopyWallets?.()
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
        .filter((wallet) => exchangeOptions.includes(wallet.exchange))
        .reduce((result, wallet) => {
          return { ...result, [wallet.exchange]: [...(result[wallet.exchange] || []), wallet] }
        }, {} as Record<CopyTradePlatformEnum, CopyWalletData[]>)
    : ({} as Record<CopyTradePlatformEnum, CopyWalletData[]>)
  const totalCopyWallets = usage?.exchangeApis ?? 0
  const isLimited = totalCopyWallets >= apiKeyQuota

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
        <Flex px={3} py={2} alignItems="center" sx={{ gap: [1, 2], flexWrap: 'wrap' }}>
          <Type.BodyBold>API Wallet</Type.BodyBold>
          <BadgeWithLimit
            total={totalCopyWallets}
            limit={apiKeyQuota}
            tooltipContent={
              !isElite &&
              userNextPlan && (
                <PlanUpgradePrompt
                  requiredPlan={userNextPlan}
                  title={<Trans>You’ve hit your API wallets limit ({apiKeyQuota})</Trans>}
                  confirmButtonVariant="textPrimary"
                  titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
                />
              )
            }
            clickableTooltip
          />
          {isLimited && (
            <Flex alignItems="center" sx={{ gap: [1, 2, 2, 2] }}>
              <Type.Body>-</Type.Body>
              <UpgradeButton requiredPlan={userNextPlan} showIcon={false} showCurrentPlan />
            </Flex>
          )}
        </Flex>
        {renderWalletList({
          exchangeOptions: apiWalletOptions,
          allowExchanges,
          walletMapping,
          hiddenBalance,
          reloadCopyWallets,
          handleUpdate,
          isLimited,
        })}

        <Flex px={3} py={2} alignItems="center" justifyContent="space-between">
          <Type.BodyBold>Smart Wallet</Type.BodyBold>
          <WalletWarningDCP />
        </Flex>
        {renderWalletList({
          exchangeOptions: smartWalletOptions,
          allowExchanges,
          walletMapping,
          hiddenBalance,
          reloadCopyWallets,
          handleUpdate,
          isLimited,
        })}
      </Flex>
    </Flex>
  )
}

function renderWalletList({
  exchangeOptions,
  allowExchanges,
  walletMapping,
  hiddenBalance,
  reloadCopyWallets,
  handleUpdate,
  isLimited,
}: {
  exchangeOptions: CopyTradePlatformEnum[]
  allowExchanges: CopyTradePlatformEnum[]
  walletMapping: Record<CopyTradePlatformEnum, CopyWalletData[]>
  hiddenBalance?: boolean
  reloadCopyWallets: (() => void) | undefined
  handleUpdate: (params: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => void
  isLimited?: boolean
}) {
  return exchangeOptions.map((exchange) => {
    const isAllowed = allowExchanges.includes(exchange)
    const wallets = walletMapping[exchange] ?? []
    const { getRequiredPlanToExchange, maxApiKeyQuota } = useCopyTradePermission()
    const requiredPlan = getRequiredPlanToExchange(exchange)

    return (
      <Accordion
        defaultOpen={exchange === CopyTradePlatformEnum.HYPERLIQUID}
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
              maxApiKeyQuota={maxApiKeyQuota}
              requiredPlan={requiredPlan}
              count={wallets.length}
              isLimited={isLimited}
              isAllowed={isAllowed}
              exchange={exchange}
              onCreateWalletSuccess={reloadCopyWallets}
            />
            <Box ml={{ _: '-40px', md: 0 }}>
              {!DCP_EXCHANGES.includes(exchange) && <ExternalLink exchange={exchange} />}
            </Box>
          </Flex>
        }
        body={
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
        }
      />
    )
  })
}

function ExchangeTitle({
  requiredPlan,
  isLimited,
  isAllowed,
  exchange,
  onCreateWalletSuccess,
  count,
  maxApiKeyQuota,
}: {
  requiredPlan: SubscriptionPlanEnum
  isLimited?: boolean
  isAllowed: boolean
  exchange: CopyTradePlatformEnum
  onCreateWalletSuccess: (() => void) | undefined
  count: number
  maxApiKeyQuota: number
}) {
  const isInternal = useInternalRole()
  const { profile } = useAuthContext()
  const { sm } = useResponsive()
  const { disabledExchanges } = useCheckCopyTradeExchange()
  const isMaintenance = !!disabledExchanges.includes(exchange)
  const [openModal, setOpenModal] = useState(false)
  const [isOpenUpgradeModal, setIsOpenUpgradeModal] = useState(false)
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
    case CopyTradePlatformEnum.HYPERLIQUID:
      title = 'Hyperliquid Exchange'
      break
    case CopyTradePlatformEnum.SYNTHETIX_V2:
      title = 'Synthetix v2 Exchange'
      break
    case CopyTradePlatformEnum.GNS_V8:
      title = 'gTrade Exchange'
      break
    case CopyTradePlatformEnum.APEX:
      title = 'ApeX Exchange'
      break
  }
  if (!title) return null
  const isWaitlist = !isInternal && WAITLIST_EXCHANGES.includes(exchange)
  const isDeprecated = DEPRECATED_EXCHANGES.includes(exchange)
  const isEmail = profile?.username?.includes('@')
  const isUnsupport = exchange === CopyTradePlatformEnum.HYPERLIQUID && isEmail

  return (
    <>
      <Flex width={['100%', '100%', 'auto']} alignItems="center" sx={{ gap: 2, justifyContent: 'space-between' }}>
        <Flex flex="1" width={['100%', '100%', 'auto']} sx={{ alignItems: 'center', gap: 2 }}>
          <Image src={parseExchangeImage(exchange)} width={32} height={32} />
          <Type.BodyBold display="inline-block" mr={1} sx={{ textTransform: 'uppercase' }}>
            {title} {isAllowed && !!count ? `(${count})` : ''}
          </Type.BodyBold>
        </Flex>
        {isAllowed && !isWaitlist && !isDeprecated && !isMaintenance && !isUnsupport ? (
          <Button
            variant="ghostPrimary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (isLimited) {
                setIsOpenUpgradeModal(true)
              } else {
                setOpenModal(true)
              }
            }}
          >
            <PlusSquare size={16} style={{ color: 'inherit' }} />
            <Box as="span">{DCP_EXCHANGES.includes(exchange) ? <Trans>Create</Trans> : <Trans>Connect</Trans>}</Box>
          </Button>
        ) : isMaintenance || isDeprecated || isUnsupport || isWaitlist ? (
          <Type.Caption sx={{ py: 1, px: 2, bg: 'neutral6', borderRadius: '2px' }} color="neutral3">
            {isUnsupport ? (
              <Trans>Copin Lite only</Trans>
            ) : isMaintenance ? (
              <Trans>Maintenance</Trans>
            ) : isDeprecated ? (
              <Trans>Deprecated</Trans>
            ) : (
              <Trans>Coming soon</Trans>
            )}
          </Type.Caption>
        ) : (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <PlanUpgradeIndicator
              requiredPlan={requiredPlan}
              title={
                <Type.Caption sx={{ textTransform: 'initial' }}>
                  {sm ? (
                    <Trans>Available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]} plans</Trans>
                  ) : (
                    <Trans>{SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]} plans</Trans>
                  )}
                </Type.Caption>
              }
              learnMoreSection={SubscriptionFeatureEnum.COPY_MANAGEMENT}
            />
          </Flex>
        )}
      </Flex>
      {openModal && (
        <CreateWalletModal
          exchange={exchange}
          isOpen={openModal}
          onDismiss={() => {
            onCreateWalletSuccess?.()
            setOpenModal(false)
          }}
        />
      )}
      {isOpenUpgradeModal && (
        <UpgradeModal
          isOpen={isOpenUpgradeModal}
          onDismiss={() => setIsOpenUpgradeModal(false)}
          title={<Trans>YOU’VE HIT YOUR API WALLET LIMIT</Trans>}
          description={
            <Trans>
              You&apos;re reach the maximum of API wallets for your current plan. Upgrade your plan to unlock access up
              to <b>{maxApiKeyQuota} wallets</b>
            </Trans>
          }
        />
      )}
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
    case CopyTradePlatformEnum.APEX:
      link = LINKS.registerApex
      text = `Don’t have a Apex account?`
      break
    case CopyTradePlatformEnum.HYPERLIQUID:
      link = LINKS.registerHyperliquid
      text = `Don’t have a Hyperliquid account?`
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
        sx={{ mx: 0, p: 0, fontSize: '12px', gap: 1, '*': { marginLeft: 0 } }}
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
      <Tooltip id={'tt_dcp_wallet_warning'} clickable>
        <Type.Small sx={{ maxWidth: [300, 400] }}>
          Smart Wallet is currently in alpha version and experiment phase. Please use caution and test with limited
          capital. If you encounter any issues, please contact direct support at:{' '}
          <a href={LINKS.support} target="_blank" rel="noreferrer">
            https://t.me/leecopin
          </a>
        </Type.Small>
      </Tooltip>
    </>
  )
}
