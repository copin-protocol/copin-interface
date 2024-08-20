import { LanguageProvider } from 'i18n'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'

import { CopyWalletProvider } from 'hooks/features/useCopyWalletContext'
import { SystemConfigProvider } from 'hooks/features/useSystemConfigContext'
import UseRemoveTimeFilter from 'hooks/helpers/useRemoveTimeFilter'
import { useInitTabsOpen } from 'hooks/helpers/useTabsOpen'
import { ProtocolProvider } from 'hooks/store/useProtocols'
import ThemedGlobalStyle from 'theme/styles'
// import GainsTradeConnection from 'utils/web3/gTrade'
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
  useInitTabsOpen()

  return (
    <ThemeProvider>
      <ThemedGlobalStyle />
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <SystemConfigProvider>
            {/* <Updaters /> */}
            <BrowserRouter>
              <UseRemoveTimeFilter />
              <PythConnection />
              {/*<GainsTradeConnection />*/}
              <DappProvider>
                <ProtocolProvider>
                  <CopyWalletProvider>{children}</CopyWalletProvider>
                </ProtocolProvider>
              </DappProvider>
            </BrowserRouter>
          </SystemConfigProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default Providers
