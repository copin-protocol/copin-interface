import { Web3Provider } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { WalletState } from '@web3-onboard/core'
import { useConnectWallet } from '@web3-onboard/react'
import dayjs from 'dayjs'
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
// import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { loginWeb3Api, logoutApi, verifyLoginWeb3Api } from 'apis/authApis'
import { clearAuth, clearWeb3Auth, getStoredJwt, getStoredWallet, setJwt, storeAuth } from 'apis/helpers'
import { getMyProfileApi } from 'apis/userApis'
import WaitingWallet, { WaitingState } from 'components/@auth/AuthWaitingWallet'
import ConfirmReferralModal from 'components/@auth/ConfirmReferralModal'
// import ConfirmReferralModal from 'components/@auth/ConfirmReferralModal'
import ToastBody from 'components/@ui/ToastBody'
import { UserData } from 'entities/user'
// import useReferralActions from 'hooks/features/useReferralActions'
import useMyProfile from 'hooks/store/useMyProfile'
// import useUserReferral from 'hooks/store/useReferral'
import { STORAGE_KEYS } from 'utils/config/keys'
import { Account } from 'utils/web3/types'
import { signVerifyCode } from 'utils/web3/wallet'

const getAccount = (wallet: WalletState) => wallet?.accounts[0] as any as Account

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
  handleSwitchAccount: () => void
  setProfile: (myProfile: UserData | null) => void
  isNewUser: boolean
  setIsNewUser: (isNewUser: boolean) => void
  setOpenReferralModal: (isOpen: boolean) => void
  waitingState: WaitingState | null
}

export const AuthContext = createContext({} as ContextValues)

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [{ wallet }, activate, deactivate, updateBalances] = useConnectWallet()
  const [openReferralModal, setOpenReferralModal] = useState(false)

  const authedRef = useRef<boolean>(false)
  const eagerTriggeredRef = useRef<boolean>(false)
  const accountRef = useRef<string | null | undefined>(wallet?.accounts[0].address)
  const verifyCodeRef = useRef<string>()
  const { myProfile, isAuthenticated, setMyProfile } = useMyProfile()
  const { refetch: refetchProfile } = useQuery('get_user_profile_after_change_referrer', getMyProfileApi, {
    enabled: false,
    onSuccess: (data) => {
      if (!data) return
      setMyProfile(data)
    },
  })
  const [waitingState, setWaitingState] = useState<WaitingState | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)

  // const parsedQS = useParsedQueryString()
  // const { setUserReferral } = useUserReferral()
  // const referralCodeQs = parsedQS?.ref as string
  // const hasUrlRef = Boolean(referralCodeQs)

  // const onSuccess = () => {
  //   setUserReferral(null)
  // }
  // const { addReferral } = useReferralActions({ onSuccess })

  const disconnectWeb3 = useCallback(() => {
    clearWeb3Auth()
    setWaitingState(null)
    if (!wallet) return
    deactivate({
      label: wallet.label,
    })
  }, [deactivate, wallet])

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.BINGX_NOTE)
    clearAuth()
    setMyProfile(null)
    disconnectWeb3()
  }, [disconnectWeb3, setMyProfile])

  // DELETE
  // useEffect(() => {
  //   // if (!wallet) {
  //   //   const { wallet: storedWallet } = getStoredWallet()
  //   //   if (storedWallet && authedRef.current) {
  //   //     setWaitingState(WaitingState.WalletLocked)
  //   //   }
  //   //   return
  //   // }
  //   // if (waitingState === WaitingState.WalletLocked) setWaitingState(null)
  //
  //   const account = wallet ? getAccount(wallet) : undefined
  //   const { account: storedAccount } = getStoredWallet()
  //   if (storedAccount && account && storedAccount !== account?.address) {
  //     setWaitingState(WaitingState.SwitchAccount)
  //   } else {
  //     if (waitingState === WaitingState.SwitchAccount) setWaitingState(null)
  //   }
  // }, [waitingState, wallet])

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
        sessionStorage.clear()
        storeAuth({
          jwt: response.access_token,
          wallet: wallet.label,
          account: account.address,
        })
        setMyProfile({ ...response })
        setWaitingState(null)
        // if (!response.isAddedReferral && !response.isSkippedReferral) {
        //   if (hasUrlRef && referralCodeQs) {
        //     addReferral.mutate(referralCodeQs.toUpperCase())
        //   } else {
        //     setOpeningRefModal(true)
        //   }
        // }
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
      if (!skipAuth && _wallet) {
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
    if (!jwt) {
      setMyProfile(null)
      return
    }
    if (storedWallet) {
      // DELETE
      // setWaitingState(WaitingState.Connecting)
      activate({
        autoSelect: {
          label: storedWallet,
          disableModals: true,
        },
      }).then(([_wallet]) => {
        if (!_wallet) {
          disconnectWeb3()
          return
        }
        // DELETE
        // if (_wallet) {
        //   const _account = getAccount(_wallet)
        //   if (_account.address !== storedAccount) {
        //     setWaitingState(WaitingState.SwitchAccount)
        //     return
        //   }
        // }
      })
      // DELETE
      // if (!_wallet) {
      //   disconnect()
      //   return
      // }
      // if (_wallet) {
      //   const _account = getAccount(_wallet)
      //   if (_account.address !== storedAccount) {
      //     setWaitingState(WaitingState.SwitchAccount)
      //     return
      //   }
      // }
    }
    try {
      setJwt(jwt)
      const user = await getMyProfileApi()
      setMyProfile(user)
      setWaitingState(null)
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        const { wallet: storedWallet } = getStoredWallet()
        if (storedWallet) setWaitingState(WaitingState.TokenExpired)
      } else {
        setWaitingState(null)
        toast.error(<ToastBody title={error.name} message={error.message} />)
      }
      clearAuth()
      setMyProfile(null)
    }
    authedRef.current = true
  }, [myProfile])

  const handleSwitchAccount = useCallback(async () => {
    setIsNewUser(false)
    const account = wallet ? getAccount(wallet) : undefined
    const { account: storedAccount } = getStoredWallet()

    if (!account) {
      connect({})
      return
    }
    if (storedAccount && account && storedAccount !== account?.address) {
      setWaitingState(WaitingState.SwitchAccount)
    } else {
      if (waitingState === WaitingState.SwitchAccount) setWaitingState(null)
    }
  }, [connect, waitingState, wallet])

  const logout = useCallback(() => {
    setIsNewUser(false)
    logoutApi()
      .then(() => {
        disconnect()
        // DELETE
        // setTimeout(() => {
        //   window.location.replace(ROUTES.HOME.path)
        // })
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }, [disconnect])

  const contextValue: ContextValues = useMemo(() => {
    return {
      isNewUser,
      setIsNewUser,
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
      handleSwitchAccount,
      setProfile: setMyProfile,
      setOpenReferralModal,
      waitingState,
    }
  }, [
    waitingState,
    wallet,
    isAuthenticated,
    getAccount,
    updateBalances,
    myProfile,
    connect,
    disconnect,
    logout,
    eagerAuth,
    setMyProfile,
    isNewUser,
  ])

  return (
    <AuthContext.Provider value={contextValue}>
      {/* {cloneElement(children, { key: myProfile?.id })} */}
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
      <ConfirmReferralModal
        isOpen={openReferralModal}
        onDismiss={() => setOpenReferralModal(false)}
        onSuccess={() => refetchProfile()}
      />
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
