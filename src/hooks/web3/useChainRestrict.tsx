import { Trans } from '@lingui/macro'
import { useEffect, useRef } from 'react'

import useGlobalDialog from 'hooks/store/useGlobalDialog'
import { CHAINS, SUPPORTED_CHAIN_IDS } from 'utils/web3/chains'

import { useAuthContext } from './useAuth'

const useChainRestrict = () => {
  const connectedChainRef = useRef<string>()
  const { wallet } = useAuthContext()
  const { dialog, showDialog, hideDialog } = useGlobalDialog()

  const supportedChains = SUPPORTED_CHAIN_IDS.map((chainId) => CHAINS[chainId])

  useEffect(() => {
    if (!wallet) return
    if (connectedChainRef.current && connectedChainRef.current == wallet.chainId) return
    connectedChainRef.current = wallet.chainId
    if (!SUPPORTED_CHAIN_IDS.includes(wallet.chainId)) {
      // setChain({
      //   chainId: `0x${DEFAULT_CHAIN_ID.toString(16)}`,
      // })
      showDialog({
        id: 'RESTRICT_CHAIN',
        title: <Trans>Unsupported Network</Trans>,
        description: (
          <Trans>
            Please switch your wallet to one of a chain below: {supportedChains.map((c) => c.label).join(', ')}
          </Trans>
        ),
      })
    } else {
      if (dialog?.id === 'RESTRICT_CHAIN') hideDialog()
    }
  }, [dialog, wallet])
}

export default useChainRestrict
