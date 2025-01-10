import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { LanguageProvider } from 'i18n'
import PythConnection from 'pythConnection'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'

import { BotAlertProvider } from 'hooks/features/useBotAlertProvider'
import { CopyWalletProvider } from 'hooks/features/useCopyWalletContext'
import { SystemConfigProvider } from 'hooks/features/useSystemConfigContext'
import { useInitTabsOpen } from 'hooks/helpers/useTabsOpen'
import { ProtocolProvider } from 'hooks/store/useProtocols'
import ThemedGlobalStyle from 'theme/styles'

import DappProvider from './DappProvider'
import GainsTradeConnection from './utils/web3/gTrade'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: false,
    },
  },
})

const apolloClient = new ApolloClient({
  uri: `${import.meta.env.VITE_API}/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
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
          <ApolloProvider client={apolloClient}>
            <SystemConfigProvider>
              {/* <Updaters /> */}
              <BrowserRouter>
                {/* <UseRemoveTimeFilter /> */}
                <PythConnection />
                <GainsTradeConnection />
                <DappProvider>
                  <ProtocolProvider>
                    <CopyWalletProvider>
                      <BotAlertProvider>{children}</BotAlertProvider>
                    </CopyWalletProvider>
                  </ProtocolProvider>
                </DappProvider>
              </BrowserRouter>
            </SystemConfigProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default Providers
