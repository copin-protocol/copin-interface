import { LanguageProvider } from 'i18n'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'

import { CopyWalletProvider } from 'hooks/features/useCopyWalletContext'
import ThemedGlobalStyle from 'theme/styles'

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
