import { Trans } from '@lingui/macro'

import { useAuthContext } from 'hooks/web3/useAuth'
import { Button, ButtonProps } from 'theme/Buttons'

const ConnectButton = ({ onConnect, ...props }: ButtonProps & { onConnect?: () => void }) => {
  const { connect, loading } = useAuthContext()

  const handleSubmit = () => {
    connect()
    onConnect && onConnect()
  }

  return (
    <Button variant="ghostPrimary" onClick={handleSubmit} isLoading={loading} disabled={loading} {...props}>
      <Trans>Login</Trans>
    </Button>
  )
}

export default ConnectButton
