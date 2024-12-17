import { defaultAbiCoder } from '@ethersproject/abi'
import { parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import React, { useState } from 'react'

import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { ARBITRUM_CHAIN, USD_ASSET } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'

const ConfirmWithdrawModal = ({
  amount,
  isOpen,
  onDismiss,
  smartWallet,
}: {
  amount: number
  isOpen: boolean
  onDismiss: (success?: boolean) => void
  smartWallet: string
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId: ARBITRUM_CHAIN,
  })

  const usdAsset = USD_ASSET[ARBITRUM_CHAIN]

  const smartWalletContract = useContract({
    contract: {
      address: smartWallet,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.COPIN_VAULT_DETAILS],
    },
    withSignerIfPossible: true,
  })

  const smartWalletMutation = useContractMutation(smartWalletContract)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    const input = defaultAbiCoder.encode(['int256'], [parseUnits(amount.toString(), usdAsset.decimals)])

    smartWalletMutation.mutate(
      {
        method: 'withdraw',
        params: [input],
      },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
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
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()} hasClose title={<Trans>Withdraw</Trans>}>
      <Box p={3}>
        {isValid ? (
          <>
            <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
              <Type.Caption color="neutral2">Withdrawal Amount</Type.Caption>
              <Type.Caption>
                {formatNumber(amount, 2, 2)} {usdAsset.symbol}
              </Type.Caption>
            </Flex>

            <Flex mt={3} sx={{ gap: 3 }}>
              <Button variant="outline" onClick={() => onDismiss()} sx={{ flex: 1 }} disabled={submitting}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={onSubmit}
                sx={{ flex: 1 }}
                disabled={submitting}
                isLoading={submitting}
              >
                {submitting ? 'Confirming' : 'Confirm'}
              </Button>
            </Flex>
          </>
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default ConfirmWithdrawModal
