import { Trans } from '@lingui/macro'
import React, { useState } from 'react'

import useIsSafari from 'hooks/helpers/useIsSafari'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button, ButtonProps } from 'theme/Buttons'
import { Flex, Image } from 'theme/base'
import { SUPPORTED_WALLETS } from 'utils/web3/providers'

import ModalWarningSafari from './ModalWarningSafari'

const ConnectButton = ({ ...props }: ButtonProps) => {
  const isSafari = useIsSafari()
  const { connect, loading } = useAuthContext()
  const [openModal, setOpenModal] = useState(false)

  const handleSubmit = () => {
    if (isSafari) {
      setOpenModal(true)
    } else {
      connect(SUPPORTED_WALLETS['METAMASK'].connectorName)
    }
  }

  return (
    <Button
      variant="white"
      size="lg"
      onClick={handleSubmit}
      width="100%"
      display="block"
      isLoading={loading}
      disabled={loading}
      px={0}
      {...props}
    >
      <Flex alignItems="center" sx={{ gap: 2 }} justifyContent="center">
        <Image src={SUPPORTED_WALLETS['METAMASK'].iconURL} width={20} />
        <Trans>Login with MetaMask</Trans>
      </Flex>
      {openModal && <ModalWarningSafari onDismiss={() => setOpenModal(false)} />}
    </Button>
  )
}

export default ConnectButton
