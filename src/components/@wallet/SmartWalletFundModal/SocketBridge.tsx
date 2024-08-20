import { Bridge } from '@socket.tech/plugin'

import useChain from 'hooks/web3/useChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { FONT_FAMILY, SOCKET_API_KEY } from 'utils/config/constants'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { ETHEREUM_MAINNET, OPTIMISM_MAINNET, SUPPORTED_CHAIN_IDS } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

function SocketBridge() {
  const { walletProvider } = useWeb3()
  const { chain } = useChain()
  return (
    <Bridge
      provider={walletProvider}
      API_KEY={SOCKET_API_KEY}
      sourceNetworks={SUPPORTED_CHAIN_IDS}
      destNetworks={[OPTIMISM_MAINNET]}
      defaultSourceToken={'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'}
      defaultDestToken={CONTRACT_ADDRESSES[OPTIMISM_MAINNET][CONTRACT_QUERY_KEYS.SUSD]}
      defaultSourceNetwork={
        SUPPORTED_CHAIN_IDS.includes(Number(chain.id) ?? ETHEREUM_MAINNET) ? Number(chain.id) : ETHEREUM_MAINNET
      }
      enableSameChainSwaps={true}
      customize={{
        // width: 360,
        fontFamily: FONT_FAMILY,
        responsiveWidth: true,
        borderRadius: 1,
        primary: 'rgb(0,0,0)',
        secondary: 'rgb(0,0,0)',
        text: 'rgb(254,254,254)',
        secondaryText: 'rgb(240,240,240)',
        accent: 'rgb(78,174,253)',
        onAccent: 'rgb(255,255,255)',
        interactive: 'rgb(49, 56, 86)',
        onInteractive: 'rgb(255,255,255)',
      }}
    />
  )
}

export default SocketBridge
