import { ReactNode } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import WaveHandIcon from 'theme/Icons/WaveHandIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'

export default function ConnectWalletAction({
  title = 'To start, you need to connect your wallet',
  description = 'Connect your wallet is like “logging in” to Web3',
}: {
  title?: ReactNode
  description?: ReactNode
}) {
  const { isAuthenticated, account, connect } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const handleConnect = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!account) {
      connect?.({})
      return
    }
  }

  return (
    <Box>
      <Flex alignItems="center" color="primary1" sx={{ gap: 1 }}>
        <IconBox icon={<WaveHandIcon />} />
        <Type.Caption>Hi! Copier</Type.Caption>
      </Flex>
      <Type.CaptionBold mt={1}>{title}</Type.CaptionBold>
      <Type.Caption color="neutral3">{description}</Type.Caption>
      <Button
        mt={3}
        sx={{
          width: '100%',
        }}
        variant="primary"
        onClick={handleConnect}
      >
        Connect Wallet
      </Button>
    </Box>
  )
}
