import { Trans } from '@lingui/macro'
import React from 'react'

import useIsSafari from 'hooks/helpers/useIsSafari'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button, ButtonProps } from 'theme/Buttons'
import { Flex } from 'theme/base'

const ConnectButton = ({ onConnect, ...props }: ButtonProps & { onConnect: () => void }) => {
  const isSafari = useIsSafari()
  const { connect, loading } = useAuthContext()

  const handleSubmit = () => {
    connect({})
    onConnect()
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
        <Trans>Connect Wallet</Trans>
      </Flex>
      {/* {openModal && <ModalWarningSafari onDismiss={() => setOpenModal(false)} />} */}
    </Button>
  )
}

export default ConnectButton
