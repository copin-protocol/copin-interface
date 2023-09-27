import { Web3Provider } from '@ethersproject/providers'
import * as Sentry from '@sentry/react'
import { Web3ReactProvider } from '@web3-react/core'
import React from 'react'

import { ActiveWeb3ReactProvider } from 'hooks/web3/useActiveWeb3React'
import { AuthProvider } from 'hooks/web3/useAuth'

function getLibrary(provider?: any) {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any'
  )
  library.pollingInterval = 5_000
  return library
}

if (import.meta.env.VITE_SENTRY_ENABLE === 'true') {
  let dns
  let rate
  switch (import.meta.env.VITE_NETWORK_ENV) {
    case 'devnet':
      dns = 'https://ad506bd7a5254000b253b1f5a61dfc9e@sentry.copin.io/19'
      rate = 1.0
      break
    case 'mainnet':
      dns = 'https://a89c93817d8644c086f3960fd6738b1f@sentry.copin.io/20'
      rate = 0.4
      break
  }
  Sentry.init({
    dsn: dns,

    integrations: [new Sentry.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: rate,
  })
}

const DappProvider = ({
  children,
  chainId,
  rpcUrls,
}: {
  children: any
  chainId: number
  rpcUrls?: string[]
}): JSX.Element => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ActiveWeb3ReactProvider defaultChainId={chainId} rpcUrls={rpcUrls}>
        <AuthProvider>{children}</AuthProvider>
      </ActiveWeb3ReactProvider>
    </Web3ReactProvider>
  )
  // return (
  //   <Web3ReactProvider getLibrary={getLibrary}>
  //     <ActiveWeb3ReactProvider defaultChainId={chainId}>
  //       <AuthProvider>{children}</AuthProvider>
  //     </ActiveWeb3ReactProvider>
  //   </Web3ReactProvider>
  // )
}

export default DappProvider
