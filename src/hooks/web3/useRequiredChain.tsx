import React, { useEffect } from 'react'

import useGlobalDialog from 'hooks/store/useGlobalDialog'
import useChain from 'hooks/web3/useChain'
import { Button } from 'theme/Buttons'
import { Flex } from 'theme/base'
import { DEFAULT_CHAIN_ID, getChainMetadata } from 'utils/web3/chains'

const useRequiredChain = ({
  chainId = DEFAULT_CHAIN_ID,
  enabled = true,
  onDismiss,
}: {
  chainId?: number
  enabled?: boolean
  onDismiss: () => void
}) => {
  const { chain, setChain } = useChain()
  const { dialog, showDialog, hideDialog } = useGlobalDialog()
  const requiredChain = getChainMetadata(chainId)
  useEffect(() => {
    if (!enabled) return
    if (chain.id !== requiredChain.id) {
      showDialog({
        id: 'SWITCH_CHAIN',
        title: `This feature only supports on ${requiredChain.label}`,
        body: (
          <Flex sx={{ gap: 2 }} justifyContent="center" mt={3}>
            <Button
              variant="outline"
              onClick={() => {
                hideDialog()
                onDismiss()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                setChain({
                  chainId: requiredChain.id,
                })
              }
            >
              Switch Chain
            </Button>
          </Flex>
        ),
      })
    } else {
      if (dialog?.id === 'SWITCH_CHAIN') hideDialog()
    }
  }, [chain, enabled])
  return chain.id === requiredChain.id
}

export default useRequiredChain
