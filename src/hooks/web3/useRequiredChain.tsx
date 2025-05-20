import { Trans } from '@lingui/macro'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'

import switchChain from 'assets/images/switch-chain.png'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import useGlobalDialog from 'hooks/store/useGlobalDialog'
import useChain from 'hooks/web3/useChain'
import { Button } from 'theme/Buttons'
import { Box, Flex, Image, Type } from 'theme/base'
import { DEFAULT_CHAIN_ID, getChainMetadata } from 'utils/web3/chains'

import { useAuthContext } from './useAuth'
import useWeb3 from './useWeb3'

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
  const { isAuthenticated, connect, profile, reconnectWallet, walletDisconnected } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const { walletAccount } = useWeb3()
  const { chain, setChain } = useChain()
  const [alert, setAlert] = useState<ReactNode>()
  const { dialog, showDialog, hideDialog } = useGlobalDialog()
  const requiredChain = getChainMetadata(chainId)
  const title = walletDisconnected ? (
    <Trans>The account in your web3 wallet does not match the account currently in use in the app</Trans>
  ) : (
    <Trans>This feature only supports on {requiredChain.label}</Trans>
  )

  const handleSubmit = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!walletAccount) {
      connect?.()
      // onDismiss?.()
      return
    }
    if (walletDisconnected) {
      reconnectWallet()
      return
    }
    setChain(requiredChain.id).catch((err) => {
      console.error('Failed to switch chain', err)
      connect?.()
    })
  }

  const renderComponent = useCallback(() => {
    return (
      <Box sx={{ minWidth: 300 }}>
        <Flex sx={{ alignItems: 'center', flexDirection: 'column' }}>
          <Image mb={2} width={120} height={120} src={switchChain} />
          <Type.Caption mb={3} color="neutral2">
            {title}
          </Type.Caption>
          <Button variant="primary" width={200} onClick={handleSubmit}>
            {walletDisconnected ? 'Connect Wallet' : 'Switch Chain'}
          </Button>
        </Flex>
      </Box>
      // <AlertDashboard
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
  }, [requiredChain, walletDisconnected])

  useEffect(() => {
    if (!enabled) return
    if (chain.id !== requiredChain.id || walletDisconnected) {
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
                <Button variant="primary" onClick={handleSubmit}>
                  {walletDisconnected ? 'Connect Wallet' : 'Switch Chain'}
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
  }, [chain, dialog, enabled, requiredChain, walletDisconnected])

  return {
    isValid: !walletDisconnected && chain.id === requiredChain.id,
    alert,
  }
}

export default useRequiredChain
