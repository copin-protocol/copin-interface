import bitgetModule from '@web3-onboard/bitget'
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import metamaskModule from '@web3-onboard/metamask'
import okxModule from '@web3-onboard/okx'
// import ledgerModule from '@web3-onboard/ledger'
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import React from 'react'

import { AuthProvider } from 'hooks/web3/useAuth'
import themeFn from 'theme/theme'
import { APP_URL, FONT_FAMILY } from 'utils/config/constants'
import { SUPPORTED_CHAIN_IDS, chains } from 'utils/web3/chains'

const theme = themeFn(true)

// const ledger = ledgerModule({
//   projectId: '4ed591829f849797c6391880fa61d5e4',
//   requiredChains: SUPPORTED_CHAIN_IDS,
//   walletConnectVersion: 2,
// })

const walletConnect = walletConnectModule({
  projectId: '4ed591829f849797c6391880fa61d5e4',
  requiredChains: SUPPORTED_CHAIN_IDS,
  optionalChains: SUPPORTED_CHAIN_IDS,
  dappUrl: APP_URL,
})

const metamask = metamaskModule({
  options: {
    extensionOnly: true,
    logging: {
      developerMode: true,
    },
    dappMetadata: {
      name: 'Copin Analyzer',
    },
  },
})
const okx = okxModule()
const bitget = bitgetModule()

const injected = injectedModule({
  filter: {
    [ProviderLabel.Detected]: false,
    [ProviderLabel.RoninWallet]: false,
  },
  displayUnavailable: [
    ProviderLabel.MetaMask,
    ProviderLabel.Brave,
    ProviderLabel.Coinbase,
    ProviderLabel.Trust,
    ProviderLabel.Coin98Wallet,
  ],
  // sort(wallets) {
  //   const metaMask = wallets.find(({ label }) => label === ProviderLabel.MetaMask)
  //   return (
  //     [metaMask, ...wallets.filter(({ label }) => label !== ProviderLabel.MetaMask)]
  //       // remove undefined values
  //       .filter((wallet) => wallet) as any
  //   )
  // },
})

const web3Onboard = init({
  theme: {
    '--w3o-background-color': theme.colors.neutral6,
    '--w3o-foreground-color': theme.colors.neutral5,
    '--w3o-text-color': theme.colors.neutral1,
    '--w3o-border-color': 'transparent',
    '--w3o-action-color': theme.colors.primary1,
    '--w3o-border-radius': theme.borderRadius.xs,
    '--w3o-font-family': FONT_FAMILY,
  },
  wallets: [metamask, walletConnect, okx, bitget, injected],
  chains,
  appMetadata: {
    name: 'Copin',
    icon: `<svg width="51" height="42" viewBox="0 0 51 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.729 13.8848H20.5648C16.8979 13.8848 13.9033 17.0874 13.9033 20.985C13.9033 24.9128 16.8979 28.0852 20.5648 28.0852H23.6206C24.1706 28.0852 24.629 27.6924 24.7512 27.1486L26.8597 15.184C26.9819 14.5193 26.4319 13.8848 25.729 13.8848Z" fill="url(#paint0_linear_243_5101)"/>
    <path d="M28.0822 0.5H21.054C9.65604 0.5 0.15268 9.47347 -0.00010701 20.713C-0.152894 32.164 9.19768 41.4698 20.7178 41.4698H21.2679C21.8179 41.4698 22.2763 41.077 22.3985 40.5332L23.2541 35.6385C23.3763 34.9436 22.8263 34.3394 22.1235 34.3394H20.565C13.384 34.3394 7.57813 28.357 7.57813 20.9547C7.57813 13.5523 13.384 7.57001 20.565 7.57001H27.2266C27.7766 7.57001 28.235 7.17723 28.3572 6.63338L29.2128 1.73876C29.335 1.13449 28.785 0.5 28.0822 0.5Z" fill="url(#paint1_linear_243_5101)"/>
    <path d="M51.0002 20.9845C51.0002 28.3869 45.1637 34.3692 38.0133 34.3692H33.9797C33.3991 34.3692 32.9407 34.7922 32.8491 35.336L32.1157 40.5328C32.024 41.0766 31.5657 41.4996 30.9851 41.4996H26.3403C25.6375 41.4996 25.118 40.8651 25.2097 40.2004L26.2181 34.3994L27.1654 29.0516C27.2571 28.5077 27.746 28.115 28.296 28.115H37.9827C41.6496 28.115 44.6442 24.9425 44.6442 21.0147C44.6442 17.0869 41.6496 13.9145 37.9827 13.9145H31.1684C30.4656 13.9145 29.9461 13.28 30.0378 12.6153L30.7406 8.59689C30.8323 8.05305 31.3212 7.66027 31.8712 7.66027H37.9522C45.1637 7.63006 51.0002 13.6124 51.0002 20.9845Z" fill="url(#paint2_linear_243_5101)"/>
    <defs>
    <linearGradient id="paint0_linear_243_5101" x1="20.39" y1="13.8848" x2="20.39" y2="28.0852" gradientUnits="userSpaceOnUse">
    <stop stop-color="#4EAEFD"/>
    <stop offset="1" stop-color="#008CFF"/>
    </linearGradient>
    <linearGradient id="paint1_linear_243_5101" x1="14.614" y1="0.5" x2="14.614" y2="41.4698" gradientUnits="userSpaceOnUse">
    <stop stop-color="#4EAEFD"/>
    <stop offset="1" stop-color="#008CFF"/>
    </linearGradient>
    <linearGradient id="paint2_linear_243_5101" x1="38.0997" y1="7.66016" x2="38.0997" y2="41.4996" gradientUnits="userSpaceOnUse">
    <stop stop-color="#4EAEFD"/>
    <stop offset="1" stop-color="#008CFF"/>
    </linearGradient>
    </defs>
    </svg>
    `,
    description: 'A leading tool to analyze and copy the best on-chain traders',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
  },
  disableFontDownload: true,
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
})

const DappProvider = ({ children }: { children: any }): JSX.Element => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <AuthProvider>{children}</AuthProvider>
    </Web3OnboardProvider>
  )
}

export default DappProvider
