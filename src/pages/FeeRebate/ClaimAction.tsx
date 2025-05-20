import React, { ReactNode, useState } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import { useAuthContext } from 'hooks/web3/useAuth'
import { useFeeRebateContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'

export default function ClaimButton({
  availableClaim,
  buttonSx,
  disabled = false,
  onSuccess,
}: {
  availableClaim: number | undefined
  buttonSx?: any
  disabled?: boolean
  onSuccess?: () => void
}) {
  const { isAuthenticated, account, connect } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [openModal, setOpenModal] = useState(false)

  const { isValid, alert } = useRequiredChain({ chainId: ARBITRUM_CHAIN })
  const feeRebateContract = useFeeRebateContract(ARBITRUM_CHAIN)
  const feeRebateMutation = useContractMutation(feeRebateContract)

  const handleSubmit = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!account) {
      connect?.()
      return
    }
    if (!isValid) {
      setOpenModal(true)
      return
    }

    feeRebateMutation.mutate(
      { method: 'claim', params: [] },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <>
      <Button
        variant="outlinePrimary"
        block
        sx={{ width: ['100%', 170], height: 40, ...buttonSx }}
        py="6px"
        disabled={!availableClaim || disabled || feeRebateMutation.isLoading}
        isLoading={feeRebateMutation.isLoading}
        onClick={handleSubmit}
      >
        {feeRebateMutation.isLoading ? (
          'Claiming'
        ) : (
          <Flex alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
            <Type.CaptionBold textAlign="center">Claim All - {formatNumber(availableClaim, 2)}</Type.CaptionBold>
            <ArbitrumLogo size={16} />
          </Flex>
        )}
      </Button>
      {!isValid && openModal && <SwitchChainModal alert={alert} onDismiss={() => setOpenModal(false)} />}
    </>
  )
}

function SwitchChainModal({ alert, onDismiss }: { alert: ReactNode; onDismiss: () => void }) {
  return (
    <Modal isOpen hasClose onDismiss={onDismiss}>
      <Box p={3}>{alert}</Box>
    </Modal>
  )
}
