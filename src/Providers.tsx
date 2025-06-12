import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { LanguageProvider } from 'i18n'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import ThemeProvider from 'theme'
import WorkerConnection from 'workerConnection'

import { BotAlertInitializer } from 'hooks/features/alert/useBotAlertProvider'
import { CopyWalletInitializer } from 'hooks/features/useCopyWalletContext'
import ProtocolInitializer from 'hooks/helpers/useProtocols'
import { useInitTabsOpen } from 'hooks/helpers/useTabsOpen'
import { GlobalStoreInitializer } from 'hooks/store/useGlobalStore'
import { SystemConfigInitializer } from 'hooks/store/useSystemConfigStore'
import EagerConnect from 'pages/@helpers/EagerConnect'
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
              <WorkerConnection />
              <ProtocolInitializer />
              <GlobalStoreInitializer />
              <DappProvider>
                <EagerConnect />
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
