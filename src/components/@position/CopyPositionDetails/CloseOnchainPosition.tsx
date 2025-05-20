import { formatUnits, parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { manualCloseDcpPositionApi, submitCloseApi } from 'apis/dcpPositionApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ToastBody from 'components/@ui/ToastBody'
import { renderEntry } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useCheckCopyTradeExchange from 'hooks/features/copyTrade/useCheckCopyExchange'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { useAuthContext } from 'hooks/web3/useAuth'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import delay from 'utils/helpers/delay'
import { getErrorMessage } from 'utils/helpers/handleError'
import { ARBITRUM_CHAIN, OPTIMISM_CHAIN } from 'utils/web3/chains'
import { calculateAcceptablePrice } from 'utils/web3/perps'
import { signClosePosition, signForClose } from 'utils/web3/wallet'

import { ClosePositionGnsV8Handler } from './ClosePositionGnsV8'

interface ClosePositionData {
  index?: number
  address?: string
  copyPositionId?: string
  indexToken?: string
  isLong?: boolean
  averagePrice?: number
  protocol?: ProtocolEnum
}

const CloseOnchainPosition = ({
  position,
  copyWalletId,
  onSuccess,
}: {
  position: ClosePositionData
  onSuccess: () => void
  copyWalletId: string
}) => {
  const { isAuthenticated, account, connect } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [opening, setOpening] = useState(false)

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!account) {
      connect?.()
      return
    }
    setOpening(true)
  }

  return (
    <>
      <Button type="button" variant="outlineDanger" size="xs" onClick={handleOpenModal}>
        Close Position
      </Button>
      {opening && (
        <CloseOnchainPositionModal
          copyWalletId={copyWalletId}
          isOpen={opening}
          onDismiss={(success?: boolean) => {
            setOpening(false)
            if (success) onSuccess()
          }}
          position={position}
        />
      )}
    </>
  )
}

const ClosePositionHandler = ({
  position,
  onDismiss,
}: {
  position: ClosePositionData
  onDismiss: (success?: boolean) => void
}) => {
  const { account } = useAuthContext()
  const { walletProvider } = useWeb3()
  const [submitting, setSubmitting] = useState(false)
  const [acceptablePrice, setAcceptablePrice] = useState<number | undefined>()
  const submitCloseMutation = useMutation(submitCloseApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: async () => {
      await delay(DELAY_SYNC * 6)
      setSubmitting(false)
      toast.success(<ToastBody title="Success" message="Your position has been closed" />)
      onDismiss(true)
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      setSubmitting(false)
    },
  })
  const manualCloseMutation = useMutation(manualCloseDcpPositionApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    async onSuccess() {
      await delay(DELAY_SYNC * 6)
      onDismiss(true)
      toast.success(<ToastBody title="Success" message="Your position has been closed" />)
    },
    onError() {
      onDismiss()
      toast.error(<ToastBody title="Error" message="Something went wrong. Please try later." />)
    },
  })
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: position.protocol })
  const { getSymbolByIndexToken } = useMarketsConfig()
  const symbol = getSymbolByIndexToken?.({ indexToken: position.indexToken })

  useEffect(() => {
    if (!symbol) return
    const price = prices[symbol]
    if (!!price) {
      const _acceptablePrice = calculateAcceptablePrice(parseUnits(price.toFixed(10), 10), !position.isLong)
      setAcceptablePrice(Number(formatUnits(_acceptablePrice, 10)))
    }
  }, [symbol, position.isLong, prices])

  const onConfirm = async () => {
    if (submitting || !account || !walletProvider || !symbol) return
    const price = prices[symbol]
    if (price == null) {
      toast.error(<ToastBody title="Fetch price error" message="Can't find the price of this token" />)
      return
    }
    setSubmitting(true)
    const _acceptablePrice = calculateAcceptablePrice(parseUnits(price.toFixed(10), 10), !position.isLong)
    if (position.copyPositionId) {
      signClosePosition(account, position.copyPositionId, _acceptablePrice.toString(), walletProvider)
        .then((signature) => {
          if (!signature) {
            setSubmitting(false)
            toast.error(<ToastBody title="Error" message="Can't sign message to close position" />)
            return
          }
          manualCloseMutation.mutate({
            copyPositionId: position.copyPositionId ?? '',
            acceptablePrice: _acceptablePrice.toString(),
            signature,
          })
        })
        .catch((error) => {
          if (error.code === 4001) {
            toast.error(<ToastBody title="Error" message="User denied transaction signature" />)
          } else {
            toast.error(<ToastBody title="Error" message="Can't sign message to close position" />)
          }
          setSubmitting(false)
        })
    } else {
      if (position.address && position.index) {
        signForClose({
          from: account,
          smartWalletAddress: position.address,
          positionIndex: position.index,
          acceptablePrice: _acceptablePrice.toString(),
          web3Provider: walletProvider,
        })
          .then((signature) => {
            if (!signature) {
              setSubmitting(false)
              toast.error(<ToastBody title="Error" message="Can't sign message to close position" />)
              return
            }
            if (position.index && position.address) {
              submitCloseMutation.mutate({
                exchange:
                  position.protocol === ProtocolEnum.GNS
                    ? CopyTradePlatformEnum.GNS_V8
                    : CopyTradePlatformEnum.SYNTHETIX_V2,
                payload: {
                  smartWalletAddress: position.address,
                  positionIndex: position.index,
                  acceptablePrice: _acceptablePrice.toString(),
                  signature,
                },
              })
            }
          })
          .catch((error) => {
            if (error.code === 4001) {
              toast.error(<ToastBody title="Error" message="User denied transaction signature" />)
            } else {
              toast.error(<ToastBody title="Error" message="Can't sign message to close position" />)
            }
            setSubmitting(false)
          })
      } else {
        toast.error(<ToastBody title="Error" message="Can't sign message to close position" />)
      }
    }
  }

  return (
    <>
      <Flex alignItems="center" sx={{ gap: 2 }}>
        <Type.Caption>Position:</Type.Caption>
        {renderEntry(position as unknown as PositionData)}
      </Flex>
      <Type.Caption mx="auto" mb={3} display="inline-block">
        Do you want to close this position with acceptable price:{' '}
        {PriceTokenText({
          value: acceptablePrice,
          maxDigit: 2,
          minDigit: 2,
        })}
      </Type.Caption>

      <Flex sx={{ gap: 3 }}>
        <Button variant="outline" onClick={() => onDismiss()} sx={{ flex: 1 }} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} sx={{ flex: 1 }} disabled={submitting} isLoading={submitting}>
          Confirm
        </Button>
      </Flex>
    </>
  )
}

export const CloseOnchainPositionModal = ({
  isOpen,
  onDismiss,
  position,
  copyWalletId,
}: {
  isOpen: boolean
  onDismiss: (success?: boolean) => void
  position: ClosePositionData
  copyWalletId: string
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId: position.protocol === ProtocolEnum.GNS ? ARBITRUM_CHAIN : OPTIMISM_CHAIN,
  })
  const { disabledExchanges } = useCheckCopyTradeExchange()
  const isUseCloseOnChain = disabledExchanges.includes(CopyTradePlatformEnum.GNS_V8)
  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()} hasClose title={<Trans>Manually Close Position</Trans>}>
      <Box p={3}>
        {isValid ? (
          isUseCloseOnChain && !!position.index && position.isLong != null && !!copyWalletId ? (
            //@ts-ignore
            <ClosePositionGnsV8Handler position={position} copyWalletId={copyWalletId} onDismiss={onDismiss} />
          ) : (
            <ClosePositionHandler position={position} onDismiss={onDismiss} />
          )
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default CloseOnchainPosition
