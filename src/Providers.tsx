import { LanguageProvider } from 'i18n'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'

import { CopyWalletProvider } from 'hooks/features/useCopyWalletContext'
import ThemedGlobalStyle from 'theme/styles'
import PythConnection from 'utils/web3/pyth'

import DappProvider from './DappProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: false,
    },
  },
})

const Providers = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <ThemeProvider>
      <ThemedGlobalStyle />
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          {/* <Updaters /> */}
          <BrowserRouter>
            <PythConnection />
            <DappProvider>
              <CopyWalletProvider>{children}</CopyWalletProvider>
            </DappProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default Providers
