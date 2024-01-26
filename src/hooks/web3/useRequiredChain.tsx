import { Trans } from '@lingui/macro'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import switchChain from 'assets/images/switch-chain.png'
import useGlobalDialog from 'hooks/store/useGlobalDialog'
import useChain from 'hooks/web3/useChain'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import { Box, Flex, Image, Type } from 'theme/base'
import { DEFAULT_CHAIN_ID, getChainMetadata } from 'utils/web3/chains'

const useRequiredChain = ({
  chainId = DEFAULT_CHAIN_ID,
  enabled = true,
  dialogMode = false,
  onDismiss,
}: {
  chainId?: number
  enabled?: boolean
  dialogMode?: boolean
  onDismiss?: () => void
} = {}) => {
  const { chain, setChain } = useChain()
  const [alert, setAlert] = useState<ReactNode>()
  const { dialog, showDialog, hideDialog } = useGlobalDialog()
  const requiredChain = getChainMetadata(chainId)
  const title = `This feature only supports on ${requiredChain.label}`

  const renderComponent = useCallback(() => {
    return (
      <Box sx={{ minWidth: 300 }}>
        <Flex sx={{ alignItems: 'center', flexDirection: 'column' }}>
          <Image mb={3} width={150} height={150} src={switchChain} />
          <Type.Caption mb={3} color="neutral2">
            {title}
          </Type.Caption>
          <Button variant="primary" width={200} onClick={() => setChain({ chainId: requiredChain.id })}>
            Switch Chain
          </Button>
        </Flex>
      </Box>
      // <Alert
      //   variant="warning"
      //   message={title}
      //   description={
      //     <Button
      //       size="xs"
      //       variant="primary"
      //       onClick={() =>
      //         setChain({
      //           chainId: requiredChain.id,
      //         })
      //       }
      //     >
      //       Switch Chain
      //     </Button>
      //   }
      // />
      // <Flex sx={{ gap: 2 }}>
      //   <Type.Caption>{title}</Type.Caption>

      // </Flex>
    )
  }, [requiredChain])

  useEffect(() => {
    if (!enabled) return
    if (chain.id !== requiredChain.id) {
      if (dialogMode) {
        if (dialog?.id !== 'SWITCH_CHAIN')
          showDialog({
            id: 'SWITCH_CHAIN',
            title,
            body: (
              <Flex sx={{ gap: 2 }} justifyContent="center" mt={3}>
                <Button
                  variant="outline"
                  onClick={() => {
                    hideDialog()
                    onDismiss && onDismiss()
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
        setAlert(renderComponent())
      }
    } else {
      if (dialogMode) {
        if (dialog?.id === 'SWITCH_CHAIN') hideDialog()
      } else {
        setAlert(undefined)
      }
    }
  }, [chain, dialog, enabled, requiredChain])
  return {
    isValid: chain.id === requiredChain.id,
    alert,
  }
}

export default useRequiredChain
