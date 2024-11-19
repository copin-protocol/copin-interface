import { parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import ToastBody from 'components/@ui/ToastBody'
import { renderEntry } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { useSmartWalletContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import delay from 'utils/helpers/delay'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { calculateAcceptablePrice } from 'utils/web3/perps'

interface ClosePositionData {
  index: number
  indexToken: string
  isLong: boolean
  averagePrice: number
  protocol: ProtocolEnum
}

const ClosePositionGnsV8 = ({
  position,
  copyWalletId,
  onSuccess,
}: {
  position: ClosePositionData
  copyWalletId: string
  onSuccess: () => void
}) => {
  const { walletProvider } = useWeb3()
  const { copyWallets } = useCopyWalletContext()
  const [opening, setOpening] = useState(false)
  const smartWallet = copyWallets?.find((wallet) => wallet.id === copyWalletId)?.smartWalletAddress
  return (
    <>
      <Button
        variant="outlineDanger"
        size="xs"
        disabled={!walletProvider || !smartWallet}
        onClick={() => setOpening(true)}
      >
        Close
      </Button>
      {!!walletProvider && !!smartWallet && (
        <ClosePositionGnsV8Modal
          isOpen={opening}
          onDismiss={(success?: boolean) => {
            setOpening(false)
            if (success) onSuccess()
          }}
          position={position}
          smartWallet={smartWallet}
        />
      )}
    </>
  )
}

const ClosePositionHandler = ({
  position,
  smartWallet,
  onDismiss,
}: {
  position: ClosePositionData
  smartWallet: string
  onDismiss: (success?: boolean) => void
}) => {
  // console.log('copyPosition', copyPosition)
  const [submitting, setSubmitting] = useState(false)
  const smartWalletContract = useSmartWalletContract(smartWallet, true)
  const smartWalletMutation = useContractMutation(smartWalletContract)
  const { gainsPrices: prices } = useGetUsdPrices()

  // console.log('positions', positions)

  const onConfirm = async () => {
    if (submitting) return
    const price = prices[position.indexToken]
    if (price == null) {
      toast.error(<ToastBody title="Fetch price error" message="Can't find the price of this token" />)
      return
    }
    setSubmitting(true)

    smartWalletMutation.mutate(
      {
        method: 'closePosition',
        params: [position.index, calculateAcceptablePrice(parseUnits(price.toString(), 10), !position.isLong)],
        // gasLimit: 2500000,
      },
      {
        onSuccess: async () => {
          await delay(DELAY_SYNC * 2)
          setSubmitting(false)
          onDismiss(true)
        },
        onError: () => {
          setSubmitting(false)
        },
      }
    )
  }

  return (
    <>
      <Flex alignItems="center" sx={{ gap: 2 }}>
        <Type.Caption>Position:</Type.Caption>
        {renderEntry(position as unknown as PositionData)}
      </Flex>
      <Type.Caption mx="auto" mb={3}>
        Do you want to close this position with market price?
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

export const ClosePositionGnsV8Modal = ({
  isOpen,
  onDismiss,
  position,
  smartWallet,
}: {
  isOpen: boolean
  onDismiss: (success?: boolean) => void
  position: ClosePositionData
  smartWallet: string
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId: ARBITRUM_CHAIN,
  })
  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()} hasClose title={<Trans>Manually Close Position</Trans>}>
      <Box p={3}>
        {isValid ? <ClosePositionHandler position={position} smartWallet={smartWallet} onDismiss={onDismiss} /> : alert}
      </Box>
    </Modal>
  )
}

export default ClosePositionGnsV8
