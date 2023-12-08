import { Trans } from '@lingui/macro'
import React from 'react'
import { animated, useTransition } from 'react-spring'

import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'

const AnimatedDiv = animated.div

export enum WaitingState {
  Connecting = 'Connecting',
  Signing = 'Signing',
  CancelSign = 'CancelSign',
  SwitchAccount = 'SwitchAccount',
  TokenExpired = 'TokenExpired',
  WalletLocked = 'WalletLocked',
}

const WaitingWallet = ({
  active,
  waitingState,
  disconnect,
  connect,
  handleAuth,
}: {
  active: boolean
  waitingState: WaitingState
  connect: (options: { skipAuth?: boolean }) => void
  disconnect: () => void
  handleAuth: () => void
}) => {
  const fadeTransition = useTransition(active, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const renderTitle = () => {
    switch (waitingState) {
      case WaitingState.CancelSign:
        return <Trans>Canceled</Trans>
      case WaitingState.TokenExpired:
        return <Trans>Session Expired</Trans>
      case WaitingState.SwitchAccount:
        return <Trans>Hey</Trans>
      case WaitingState.WalletLocked:
        return <Trans>Wallet Locked</Trans>
      default:
        return undefined
    }
  }

  const renderDescription = () => {
    switch (waitingState) {
      case WaitingState.WalletLocked:
        return <Trans>Please unlock your wallet to continue</Trans>
      case WaitingState.CancelSign:
        return <Trans>Looks like you canceled signing of authentication message with your provider</Trans>
      case WaitingState.TokenExpired:
        return <Trans>Looks like your session has expired. You should sign new authentication message</Trans>
      case WaitingState.SwitchAccount:
        return (
          <Trans>
            Looks like you have changed primary address in your wallet. You should sign new authentication message
          </Trans>
        )
      case WaitingState.Signing:
        return <Trans>Communicating with wallet. Sign message with your wallet</Trans>
      default:
        return <Trans>Connecting with your wallet...</Trans>
    }
  }

  return fadeTransition((props, item) =>
    item ? (
      <AnimatedDiv style={props}>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          bg="neutral8"
          sx={{
            position: 'fixed',
            top: 0,
            zIndex: 10000,
            opacity: active ? 1 : 0,
            transition: 'all ease 360ms',
          }}
        >
          <Flex width="100%" maxWidth={550} mx="auto" px={16} flexDirection="column" alignItems="center">
            <Type.H3 mb={3} textAlign="center">
              {renderTitle()}
            </Type.H3>

            <Type.LargeBold color="neutral3" textAlign="center">
              {renderDescription()}
            </Type.LargeBold>
            {waitingState === WaitingState.WalletLocked ? (
              <Box mt={4}>
                <Button type="button" width={150} variant="primary" onClick={() => connect({})}>
                  <Trans>Unlock</Trans>
                </Button>
              </Box>
            ) : (
              <Flex mt={4} width="100%" alignItems="center" justifyContent="center" sx={{ gap: 3 }}>
                {waitingState !== WaitingState.Signing && waitingState !== WaitingState.Connecting && (
                  <Button type="button" width={150} variant="primary" onClick={() => handleAuth()}>
                    {waitingState === WaitingState.CancelSign ? <Trans>Try Again</Trans> : <Trans>Sign message</Trans>}
                  </Button>
                )}

                <Button type="button" width={150} variant="outline" onClick={disconnect}>
                  {waitingState === WaitingState.Connecting ? <Trans>Cancel</Trans> : <Trans>Disconnect</Trans>}
                </Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </AnimatedDiv>
    ) : (
      <div></div>
    )
  )
}

export default WaitingWallet
