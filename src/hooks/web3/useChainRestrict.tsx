import { Trans } from '@lingui/macro'
import { useSetChain } from '@web3-onboard/react'
import { useEffect, useRef } from 'react'

import useGlobalDialog from 'hooks/store/useGlobalDialog'
import { CHAINS, SUPPORTED_CHAIN_IDS } from 'utils/web3/chains'

const useChainRestrict = () => {
  const connectedChainRef = useRef<string>()
  const [{ connectedChain }, setChain] = useSetChain()
  const { dialog, showDialog, hideDialog } = useGlobalDialog()

  const supportedChains = SUPPORTED_CHAIN_IDS.map((chainId) => CHAINS[chainId])

  useEffect(() => {
    if (!connectedChain) return
    if (connectedChainRef.current && connectedChainRef.current == connectedChain.id) return
    connectedChainRef.current = connectedChain.id
    if (!SUPPORTED_CHAIN_IDS.includes(parseInt(connectedChain.id, 16))) {
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
  }, [dialog, connectedChain])
}

export default useChainRestrict
