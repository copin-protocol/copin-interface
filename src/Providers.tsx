import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { LanguageProvider } from 'i18n'
import PythConnection from 'pythConnection'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'

import { BotAlertInitializer } from 'hooks/features/useBotAlertProvider'
import { CopyWalletInitializer } from 'hooks/features/useCopyWalletContext'
import ProtocolInitializer from 'hooks/helpers/useProtocols'
import { useInitTabsOpen } from 'hooks/helpers/useTabsOpen'
import { GlobalStoreInitializer } from 'hooks/store/useGlobalStore'
import { ProtocolFilterStoreInitializer } from 'hooks/store/useProtocolFilter'
import { SystemConfigInitializer } from 'hooks/store/useSystemConfigStore'
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
            <BrowserRouter>
              <SystemConfigInitializer />
              <PythConnection />
              <GainsTradeConnection />
              <ProtocolInitializer />
              <GlobalStoreInitializer />
              <ProtocolFilterStoreInitializer />
              <DappProvider>
                <CopyWalletInitializer />
                <BotAlertInitializer />
                {children}
              </DappProvider>
            </BrowserRouter>
          </ApolloProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default Providers
