import React, { useState } from 'react'

import CreateSmartWalletModal from 'components/CreateSmartWalletModal'
import { useClickLoginButton } from 'components/LoginAction'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import WaveHandIcon from 'theme/Icons/WaveHandIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

export default function CreateSmartWalletAction({
  exchange,
  onSuccess,
}: {
  exchange: CopyTradePlatformEnum
  onSuccess?: () => void
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const { profile, isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  return (
    <Box mt={3}>
      <Flex alignItems="center" color="primary1" sx={{ gap: 1 }}>
        <IconBox icon={<WaveHandIcon />} />
        <Type.Caption>Hi! Copier</Type.Caption>
      </Flex>
      <Type.CaptionBold mt={1}>To start, you need to create a smart wallet</Type.CaptionBold>
      <Type.Caption color="neutral3">
        The process of create a wallet is quick and only cost a small in gas fees.
      </Type.Caption>
      <Button
        mt={3}
        sx={{
          width: '100%',
        }}
        variant="primary"
        onClick={handleOpenModal}
      >
        Create Smart Wallet
      </Button>

      {isOpenModal && !!profile && (
        <CreateSmartWalletModal
          isOpen={isOpenModal}
          platform={exchange}
          onDismiss={handleCloseModal}
          onSuccess={onSuccess}
        />
      )}
    </Box>
  )
}
