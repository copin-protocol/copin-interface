import { PrivyProvider } from '@privy-io/react-auth'

import { AuthProvider } from 'hooks/web3/useAuth'
import { themeColors } from 'theme/colors'
import { PRIVY_APP_ID } from 'utils/config/constants'

const DappProvider = ({ children }: { children: any }): JSX.Element => {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          logo: '/apple-touch-icon.png',
          accentColor: themeColors.primary1 as `#${string}`,
        },
        loginMethods: ['email', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </PrivyProvider>
  )
}

export default DappProvider
