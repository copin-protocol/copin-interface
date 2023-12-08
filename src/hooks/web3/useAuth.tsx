import { Web3Provider } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { WalletState } from '@web3-onboard/core'
import { useConnectWallet } from '@web3-onboard/react'
import dayjs from 'dayjs'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { loginWeb3Api, logoutApi, verifyLoginWeb3Api } from 'apis/authApis'
import { clearAuth, getStoredJwt, getStoredWallet, setJwt, storeAuth } from 'apis/helpers'
import { getMyProfileApi } from 'apis/userApis'
import ToastBody from 'components/@ui/ToastBody'
import WaitingWallet, { WaitingState } from 'components/AuthWaitingWallet'
import ConfirmReferralModal from 'components/ConfirmReferralModal'
import { UserData } from 'entities/user'
import useReferralActions from 'hooks/features/useReferralActions'
import useParsedQueryString from 'hooks/router/useParsedQueryString'
import useMyProfile from 'hooks/store/useMyProfile'
import useUserReferral from 'hooks/store/useReferral'
import { Account } from 'utils/web3/types'
import { signVerifyCode } from 'utils/web3/wallet'

const getAccount = (wallet: WalletState) => wallet.accounts[0] as any as Account

interface ContextValues {
  loading: boolean
  isAuthenticated: boolean | null
  account: Account | null
  updateBalances: () => void
  provider: Web3Provider | null
  profile: UserData | null
  connect: ({ skipAuth }: { skipAuth?: boolean }) => Promise<Account | null>
  disconnect: () => void
  logout: () => void
  eagerAuth: () => Promise<void>
}

export const AuthContext = createContext({} as ContextValues)

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [{ wallet, connecting }, activate, deactivate, updateBalances] = useConnectWallet()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [openingRefModal, setOpeningRefModal] = useState(false)

  const authedRef = useRef<boolean>(false)
  const eagerTriggeredRef = useRef<boolean>(false)
  const accountRef = useRef<string | null | undefined>(wallet?.accounts[0].address)
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
    clearAuth()
    setWaitingState(null)
    setMyProfile(null)
    setIsAuthenticated(false)
    if (!wallet) return
    deactivate({
      label: wallet.label,
    })
  }, [deactivate, setMyProfile, wallet])

  useEffect(() => {
    if (!wallet) {
      const { wallet: storedWallet } = getStoredWallet()
      if (storedWallet && authedRef.current) {
        setWaitingState(WaitingState.WalletLocked)
      }
      return
    }
    if (waitingState === WaitingState.WalletLocked) setWaitingState(null)

    const account = getAccount(wallet)
    const { account: storedAccount } = getStoredWallet()
    if (storedAccount && storedAccount !== account.address) {
      setWaitingState(WaitingState.SwitchAccount)
    } else {
      if (waitingState === WaitingState.SwitchAccount) setWaitingState(null)
    }
  }, [waitingState, wallet])

  const auth = useCallback(
    async (wallet: WalletState): Promise<Account | null> => {
      const account = getAccount(wallet)
      setWaitingState(WaitingState.Signing)
      try {
        const { verifyCode } = await loginWeb3Api(account.address)
        verifyCodeRef.current = verifyCode
        accountRef.current = account.address
        const time = dayjs().utc().toISOString()
        const provider = new Web3Provider(wallet.provider, 'any')
        const sign = await signVerifyCode(account.address, verifyCode, time, provider)
        if (!sign) throw Error("Can't sign verify message")
        if (verifyCodeRef.current !== verifyCode || account.address !== accountRef.current) return null
        const response = await verifyLoginWeb3Api(account.address, sign, time)
        storeAuth({
          jwt: response.access_token,
          wallet: wallet.label,
          account: account.address,
        })
        setMyProfile({ ...response })
        setIsAuthenticated(true)
        setWaitingState(null)
        if (!response.isAddedReferral && !response.isSkippedReferral) {
          if (hasUrlRef && referralCodeQs) {
            addReferral.mutate(referralCodeQs.toUpperCase())
          } else {
            setOpeningRefModal(true)
          }
        }
        authedRef.current = true
        return account
      } catch (err: any) {
        console.error(err)
        if (err?.code !== 4001) {
          toast.error(<ToastBody title={err.name} message={err.message} />)
          disconnect()
        } else {
          setWaitingState(WaitingState.CancelSign)
        }
      }
      authedRef.current = true
      return null
    },
    [disconnect, setMyProfile]
  )

  const connect = useCallback(
    async ({ skipAuth = false }: { skipAuth?: boolean } = {}) => {
      const [_wallet] = await activate()
      if (!skipAuth) {
        return auth(_wallet)
      }
      return getAccount(_wallet)
    },
    [activate, auth]
  )

  const handleAuth = useCallback(() => {
    if (!wallet) return null
    return auth(wallet)
  }, [auth, wallet])

  const eagerAuth = useCallback(async () => {
    if (!!myProfile || eagerTriggeredRef.current) return
    eagerTriggeredRef.current = true

    const { account: storedAccount, wallet: storedWallet } = getStoredWallet()
    const jwt = getStoredJwt()
    if (!storedAccount || !jwt) {
      setIsAuthenticated(false)
      return
    }
    if (storedWallet) {
      // setWaitingState(WaitingState.Connecting)
      const [_wallet] = await activate({
        autoSelect: {
          label: storedWallet,
          disableModals: true,
        },
      })
      if (!_wallet) {
        disconnect()
        return
      }
      const _account = getAccount(_wallet)
      if (_account.address !== storedAccount) {
        setWaitingState(WaitingState.SwitchAccount)
        return
      }
    }
    try {
      setJwt(jwt)
      const user = await getMyProfileApi()
      setMyProfile(user)
      setIsAuthenticated(true)
      setWaitingState(null)
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        if (storedWallet) setWaitingState(WaitingState.TokenExpired)
      } else {
        setWaitingState(null)
        toast.error(<ToastBody title={error.name} message={error.message} />)
      }
      clearAuth()
      setIsAuthenticated(false)
      setMyProfile(null)
    }
    authedRef.current = true
  }, [myProfile])

  const logout = useCallback(() => {
    logoutApi()
      .then(() => {
        disconnect()
        // setTimeout(() => {
        //   window.location.replace(ROUTES.HOME.path)
        // })
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }, [disconnect])

  const contextValue: ContextValues = useMemo(() => {
    return {
      loading: waitingState != null,
      isAuthenticated,
      account: wallet ? getAccount(wallet) : null,
      updateBalances,
      provider: wallet ? new Web3Provider(wallet.provider, 'any') : null,
      profile: myProfile,
      connect,
      disconnect,
      logout,
      eagerAuth,
    }
  }, [waitingState, isAuthenticated, wallet, myProfile, connect, disconnect, logout, eagerAuth])
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {waitingState != null && (
        <WaitingWallet
          active={waitingState != null}
          waitingState={waitingState}
          connect={async () => {
            const { account: storedAccount, wallet: storedWallet } = getStoredWallet()
            if (storedWallet) {
              const [_wallet] = await activate({
                autoSelect: {
                  label: storedWallet,
                  disableModals: true,
                },
              })
              if (!_wallet) {
                disconnect()
                toast.error(
                  <ToastBody title={<Trans>Error</Trans>} message={<Trans>Cannot unlock your wallet</Trans>} />
                )
                return
              }
              const _account = getAccount(_wallet)
              if (_account.address !== storedAccount) {
                setWaitingState(WaitingState.SwitchAccount)
                return
              }
              setWaitingState(null)
            }
          }}
          disconnect={disconnect}
          handleAuth={handleAuth}
        />
      )}
      {openingRefModal && <ConfirmReferralModal onDismiss={() => setOpeningRefModal(false)} />}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
