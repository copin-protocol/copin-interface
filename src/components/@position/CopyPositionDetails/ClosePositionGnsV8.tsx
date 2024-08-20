import { Trans } from '@lingui/macro'
import React, { useState } from 'react'

import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { useSmartWalletContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import delay from 'utils/helpers/delay'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'

const ClosePositionGnsV8 = ({
  copyPosition,
  copyWalletId,
  onSuccess,
}: {
  copyPosition: CopyPositionData
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
        <ClosePositionModal
          isOpen={opening}
          onDismiss={(success?: boolean) => {
            setOpening(false)
            if (success) onSuccess()
          }}
          copyPosition={copyPosition}
          smartWallet={smartWallet}
        />
      )}
    </>
  )
}

const ClosePositionHandler = ({
  copyPosition,
  smartWallet,
  onDismiss,
}: {
  copyPosition: CopyPositionData
  smartWallet: string
  onDismiss: (success?: boolean) => void
}) => {
  // console.log('copyPosition', copyPosition)
  const [submitting, setSubmitting] = useState(false)
  const smartWalletContract = useSmartWalletContract(smartWallet, true)
  const smartWalletMutation = useContractMutation(smartWalletContract)

  // console.log('positions', positions)

  const onConfirm = async () => {
    if (submitting) return
    setSubmitting(true)

    smartWalletMutation.mutate(
      {
        method: 'closePosition',
        params: [copyPosition.positionIndex],
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

const ClosePositionModal = ({
  isOpen,
  onDismiss,
  copyPosition,
  smartWallet,
}: {
  isOpen: boolean
  onDismiss: (success?: boolean) => void
  copyPosition: CopyPositionData
  smartWallet: string
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId: ARBITRUM_CHAIN,
  })
  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()} hasClose title={<Trans>Manually Close Position</Trans>}>
      <Box p={3}>
        {isValid ? (
          <ClosePositionHandler copyPosition={copyPosition} smartWallet={smartWallet} onDismiss={onDismiss} />
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default ClosePositionGnsV8
