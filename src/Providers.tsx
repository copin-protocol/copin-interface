import { LanguageProvider } from 'i18n'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'

import ThemedGlobalStyle from 'theme/styles'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'

import DappProvider from './DappProvider'
import { CopyWalletProvider } from './pages/WalletManagement/useCopyWalletContext'

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
            <DappProvider chainId={DEFAULT_CHAIN_ID}>
              <CopyWalletProvider>{children}</CopyWalletProvider>
            </DappProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default Providers
