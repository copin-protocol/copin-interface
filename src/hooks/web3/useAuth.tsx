import { getAddress } from '@ethersproject/address'
import { Web3Provider } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import dayjs from 'dayjs'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { loginWeb3Api, logoutApi, verifyLoginWeb3Api } from 'apis/authApis'
import { clearAuth, getStoredAccount, getStoredJwt, setJwt, storeAuth } from 'apis/helpers'
import { getMyProfileApi } from 'apis/userApis'
import ToastBody from 'components/@ui/ToastBody'
import WaitingWallet, { WaitingState } from 'components/AuthWaitingWallet'
import WalletModal from 'components/AuthWalletModal'
import ConfirmReferralModal from 'components/ConfirmReferralModal'
import { UserData } from 'entities/user'
import useReferralActions from 'hooks/features/useReferralActions'
import useParsedQueryString from 'hooks/router/useParsedQueryString'
import useMyProfile from 'hooks/store/useMyProfile'
import useUserReferral from 'hooks/store/useReferral'
import useActiveWeb3React from 'hooks/web3/useActiveWeb3React'
import ROUTES from 'utils/config/routes'
import { SUPPORTED_CHAIN_IDS, getChainMetadata } from 'utils/web3/chains'
import connectors, { Connectors, clearConnector, getStoredConnector, storeConnector } from 'utils/web3/connectors'
import { ConnectorName } from 'utils/web3/types'
import { setupNetwork, signVerifyCode } from 'utils/web3/wallet'

interface ContextValues {
  loading: boolean
  isAuthenticated: boolean | null
  account: string | null | undefined
  profile: UserData | null
  connect: (connectorName: ConnectorName, skipAuth?: boolean) => Promise<string | null>
  disconnect: () => void
  logout: () => void
  eagerAuth: () => Promise<void>
  openModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext({} as ContextValues)

export function AuthProvider({ children }: { children: JSX.Element }) {
  const { account, activate, deactivate, setError, chainId, library } = useActiveWeb3React()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [openingModal, setOpeningModal] = useState(false)
  const [openingRefModal, setOpeningRefModal] = useState(false)

  const accountRef = useRef<string | null | undefined>(account)
  const verifyCodeRef = useRef<string>()
  const { myProfile, setMyProfile } = useMyProfile()
  const { setUserReferral } = useUserReferral()
  const [waitingState, setWaitingState] = useState<WaitingState | null>(null)

  const parsedQS = useParsedQueryString()
  const referralCodeQs = parsedQS?.ref as string
  const hasUrlRef = Boolean(referralCodeQs)

  const onSuccess = () => {
    setUserReferral(null)
  }
  const { addReferral } = useReferralActions({ onSuccess })

  const disconnect = useCallback(() => {
    deactivate()
    clearConnector()
    clearAuth()
    setWaitingState(null)
    setMyProfile(null)
    setIsAuthenticated(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const auth = useCallback(
    async (_account: string, _provider: Web3Provider): Promise<string | null> => {
      setWaitingState(WaitingState.Connecting)
      try {
        const { verifyCode } = await loginWeb3Api(_account)
        verifyCodeRef.current = verifyCode
        accountRef.current = _account
        const time = dayjs().utc().toISOString()
        const sign = await signVerifyCode(_account, verifyCode, time, _provider)
        if (!sign) throw Error("Can't sign verify message")
        if (verifyCodeRef.current !== verifyCode || _account !== accountRef.current) return null
        const response = await verifyLoginWeb3Api(_account, sign, time)
        storeAuth(response.access_token, _account)
        setMyProfile({ ...response })
        setIsAuthenticated(true)
        setOpeningModal(false)
        setWaitingState(null)
        if (!response.isAddedReferral && !response.isSkippedReferral) {
          if (hasUrlRef && referralCodeQs) {
            addReferral.mutate(referralCodeQs.toUpperCase())
          } else {
            setOpeningRefModal(true)
          }
        }
        return _account
      } catch (err: any) {
        console.error(err)
        if (err?.code !== 4001) {
          toast.error(<ToastBody title={err.name} message={err.message} />)
          disconnect()
        } else {
          setWaitingState(WaitingState.CancelSign)
        }
      }
      return null
    },
    [disconnect, setMyProfile]
  )

  const onActiveWalletError = useCallback(
    (connector: Connectors) => async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        setError(error)
      } else {
        if (error instanceof NoEthereumProviderError) {
          toast.error(
            <ToastBody title={<Trans>Provider Error</Trans>} message={<Trans>No provider was found</Trans>} />
          )
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = undefined
          }
          toast.error(
            <ToastBody
              title={<Trans>Authorization Error</Trans>}
              message={<Trans>Please authorize to access your account</Trans>}
            />
          )
        } else {
          toast.error(<ToastBody title={error.name} message={error.message} />)
        }
      }
    },
    [setError]
  )

  const handleAuth = useCallback(() => {
    if (!account || !library) return null
    return auth(account, library)
  }, [auth, account, library])

  const connect = useCallback(
    async (connectorName: 'injected' | 'walletconnect', skipAuth = false): Promise<string | null> => {
      const connector = connectors[connectorName]
      let currentAccount = null
      if (connectorName === 'injected') {
        const connectorProvider = await connector.getProvider()
        const connectorAccount = await connector.getAccount()
        const connectorChainId = await connector.getChainId()
        const numChainId = Number(connectorChainId)
        if (!connectorProvider || !connectorAccount) return null
        currentAccount = getAddress(connectorAccount)
        let success = false
        try {
          success = await setupNetwork(numChainId, connectorProvider)
        } catch (err) {
          toast.error(
            <ToastBody
              title={<Trans>Chain Error</Trans>}
              message={<Trans>Can&#39;t switch to {getChainMetadata(numChainId).chainName}</Trans>}
            />
          )
        } finally {
          if (!success && !SUPPORTED_CHAIN_IDS.includes(Number(connectorChainId))) {
            disconnect()
            toast.error(
              <ToastBody
                title={<Trans>Unsupported Chain</Trans>}
                message={<Trans>Please switch network on your wallet to {getChainMetadata(chainId).chainName}</Trans>}
              />
            )
            return null
          }
        }
        await activate(connector, onActiveWalletError(connector))
        if (!skipAuth) {
          await auth(currentAccount, new Web3Provider(connectorProvider, 'any'))
        }
      } else {
        try {
          await activate(connector, onActiveWalletError(connector), true)
          const currentProvider = (connector as WalletConnectConnector).walletConnectProvider
          currentAccount = currentProvider.accounts[0]
          if (!skipAuth) {
            await auth(currentAccount, new Web3Provider(currentProvider, 'any'))
          }
        } catch (err) {
          toast.error(
            <ToastBody
              title={<Trans>Error</Trans>}
              message={
                err.message.includes('Unsupported chain') ? (
                  <Trans>Please switch network on your wallet to {getChainMetadata(chainId).chainName}</Trans>
                ) : (
                  err.message
                )
              }
            />
          )
        }
      }
      if (currentAccount) storeConnector(connectorName)
      return currentAccount
    },
    [activate, onActiveWalletError, chainId, disconnect, auth]
  )

  const eagerAuth = useCallback(async () => {
    if (!!myProfile) return
    const connectorName = getStoredConnector()
    const currentAccount = getStoredAccount()
    const jwt = getStoredJwt()
    if (!currentAccount || !jwt) {
      setIsAuthenticated(false)
      return
    }
    if (connectorName) {
      const _account = await connect(connectorName, true)
      if (!_account) return
      if (_account !== currentAccount) {
        setWaitingState(WaitingState.SwitchAccount)
        return
      }
    }
    try {
      setJwt(jwt)
      const user = await getMyProfileApi()
      setMyProfile(user)
      setIsAuthenticated(true)
    } catch (error: any) {
      if (connectorName && error.message.includes('Unauthorized')) {
        setWaitingState(WaitingState.TokenExpired)
      } else {
        toast.error(<ToastBody title={error.name} message={error.message} />)
      }
      clearAuth()
      setIsAuthenticated(false)
      setMyProfile(null)
    }
  }, [connect, myProfile, setMyProfile])

  const logout = useCallback(() => {
    logoutApi()
      .then(() => {
        disconnect()
        window.location.replace(ROUTES.HOME.path)
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }, [disconnect])

  const contextValue: ContextValues = useMemo(() => {
    return {
      loading: waitingState != null,
      isAuthenticated,
      account,
      profile: myProfile,
      connect,
      disconnect,
      logout,
      eagerAuth,
      openModal: setOpeningModal,
    }
  }, [waitingState, isAuthenticated, account, myProfile, connect, disconnect, logout, eagerAuth])
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {openingModal && (
        <WalletModal isOpen={openingModal} onDismiss={() => setOpeningModal(false)} onConnect={connect}></WalletModal>
      )}
      {waitingState != null && (
        <WaitingWallet
          active={!!waitingState}
          waitingState={waitingState}
          disconnect={disconnect}
          handleAuth={handleAuth}
        />
      )}
      {openingRefModal && <ConfirmReferralModal onDismiss={() => setOpeningRefModal(false)} />}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
