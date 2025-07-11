import { Web3Provider } from '@ethersproject/providers'
import { ConnectedWallet, User, WalletListEntry, usePrivy, useWallets } from '@privy-io/react-auth'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { loginPrivyApi, logoutApi } from 'apis/authApis'
import { clearAuth, getStoredAccount, getStoredJwt, setJwt, storeAuth } from 'apis/helpers'
import { postLogApi } from 'apis/logApis'
import { getMyProfileApi } from 'apis/userApis'
import ConfirmReferralModal from 'components/@auth/ConfirmReferralModal'
import ToastBody from 'components/@ui/ToastBody'
import { UserData } from 'entities/user'
import useMyProfile from 'hooks/store/useMyProfile'
import { PRIVY_APP_ID } from 'utils/config/constants'
import { QUERY_KEYS, STORAGE_KEYS } from 'utils/config/keys'
import { useDeviceFingerprint } from 'utils/helpers/deviceFingerprint'
import { Account } from 'utils/web3/types'

interface ContextValues {
  loading: boolean
  isAuthenticated: boolean | null
  account: string | null
  wallet: Wallet | null
  profile: UserData | null
  connect: () => Promise<void>
  disconnect: () => void
  logout: () => void
  eagerAuth: () => Promise<void>
  reconnectWallet: () => void
  setProfile: (myProfile: UserData | null) => void
  isNewUser: boolean
  setIsNewUser: (isNewUser: boolean) => void
  setOpenReferralModal: (isOpen: boolean) => void
  walletDisconnected: boolean
  refetchProfile: () => void
}

export type Wallet = { provider: Web3Provider; chainId: number } & ConnectedWallet

export const AuthContext = createContext({} as ContextValues)

export function AuthProvider({ children }: { children: JSX.Element }) {
  const { login, logout: privyLogout, user, getAccessToken, ready, connectWallet } = usePrivy()
  const [openReferralModal, setOpenReferralModal] = useState(false)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const { wallets } = useWallets()
  const [loading, setLoading] = useState(true)
  const { myProfile, isAuthenticated, setMyProfile } = useMyProfile()
  const { getFingerprint } = useDeviceFingerprint()
  const { refetch: refetchProfile } = useQuery(
    [QUERY_KEYS.GET_USER_PROFILE_AFTER_CHANGE, myProfile?.id],
    getMyProfileApi,
    {
      enabled: false,
      onSuccess: (data) => {
        if (!data) return
        setMyProfile(data)
      },
      keepPreviousData: false,
    }
  )
  const [isNewUser, setIsNewUser] = useState(false)

  const eagerTriggeredRef = useRef<boolean>(false)
  const requestedWalletRef = useRef<string>()

  useEffect(() => {
    async function initProvider() {
      if (!wallets.length || !user || !ready) return
      const selectedWallet = wallets.find((wallet) => wallet.address === user.wallet?.address)
      if (!selectedWallet) return
      if (requestedWalletRef.current && requestedWalletRef.current !== selectedWallet.address) {
        toast.error(
          <ToastBody title="Wallet mismatch" message={`Please connect to the address ${requestedWalletRef.current}`} />
        )
        requestedWalletRef.current = undefined
        return
      }
      const privyProvider = await selectedWallet.getEthereumProvider()
      const provider = new Web3Provider(privyProvider, 'any')
      const chainComponents = selectedWallet.chainId.split(':')
      setWallet({ ...selectedWallet, provider, chainId: Number(chainComponents[chainComponents.length - 1]) } as Wallet)
    }
    initProvider()
  }, [wallets, ready, user])

  const disconnectWeb3 = useCallback(() => {
    privyLogout()
  }, [privyLogout])

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.BINGX_NOTE)
    clearAuth()
    setLoading(false)
    setMyProfile(null)
    setWallet(null)
    setIsNewUser(false)
    disconnectWeb3()
    toast.dismiss()
  }, [disconnectWeb3, setMyProfile])

  useEffect(() => {
    const jwt = getStoredJwt()
    if (user && !jwt) {
      auth(user)
    }
  }, [user])

  const connect = useCallback(async () => {
    try {
      const { encryptedFingerprint } = await getFingerprint()
      sessionStorage.setItem('device_fingerprint', encryptedFingerprint)
    } catch (error) {}
    await login()
  }, [login, getFingerprint])

  const auth = useCallback(
    async (user: User): Promise<Account | null> => {
      setLoading(true)
      try {
        const jwt = await getAccessToken()
        if (!jwt) {
          login()
          return null
        }

        const fingerprint = sessionStorage.getItem('device_fingerprint')
        sessionStorage.removeItem('device_fingerprint')
        const response = await loginPrivyApi(jwt)
        storeAuth({
          jwt: response.access_token,
          account: user.wallet?.address ?? '',
        })
        setMyProfile(response)
        setLoading(false)
        if (fingerprint) {
          await postLogApi(fingerprint)
        }
      } catch (err: any) {
        console.error('Error auth', err)
        toast.error(<ToastBody title={err.name} message={err.message} />)
        disconnect()
      }
      return null
    },
    [getAccessToken, setMyProfile, login, disconnect]
  )

  const eagerAuth = useCallback(async () => {
    if (!!myProfile || eagerTriggeredRef.current) {
      if (loading && !!myProfile) {
        setLoading(false)
      }
      return
    }
    eagerTriggeredRef.current = true

    const jwt = getStoredJwt()
    if (!jwt) {
      setMyProfile(null)
      setLoading(false)
      return
    }

    try {
      setJwt(jwt)
      const profile = await getMyProfileApi()
      setMyProfile(profile)
    } catch (error: any) {
      if (error.message.includes('Unauthorized')) {
        if (user) {
          await auth(user)
        }
      } else {
        toast.error(<ToastBody title={error.name} message={error.message} />)
      }
      clearAuth()
      setMyProfile(null)
    }
    setLoading(false)
  }, [myProfile, user, loading, setLoading])

  const reconnectWallet = useCallback(() => {
    const storedAccount = getStoredAccount()
    const lastWalletClient = localStorage.getItem(`privy:${PRIVY_APP_ID}:recent-login-wallet-client`)
    requestedWalletRef.current = storedAccount ?? undefined
    connectWallet({
      suggestedAddress: storedAccount ?? undefined,
      walletList: lastWalletClient ? [lastWalletClient.replace(/"/g, '') as WalletListEntry] : undefined,
    })
  }, [connectWallet])

  const logout = useCallback(() => {
    logoutApi()
      .then(() => {
        disconnect()
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }, [disconnect])

  const walletDisconnected =
    !wallet || !myProfile || (!myProfile.username.includes('@') && wallet.address !== myProfile.username)

  const contextValue: ContextValues = useMemo(() => {
    return {
      isNewUser,
      setIsNewUser,
      loading,
      isAuthenticated,
      account: wallet?.address ?? null,
      wallet,
      walletDisconnected,
      profile: myProfile,
      connect,
      disconnect,
      logout,
      eagerAuth,
      reconnectWallet,
      setProfile: setMyProfile,
      setOpenReferralModal,
      refetchProfile,
    }
  }, [
    wallet,
    isAuthenticated,
    myProfile,
    connect,
    disconnect,
    logout,
    eagerAuth,
    reconnectWallet,
    setMyProfile,
    isNewUser,
    refetchProfile,
  ])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <ConfirmReferralModal
        isOpen={openReferralModal}
        onDismiss={() => setOpenReferralModal(false)}
        onSuccess={() => refetchProfile()}
      />
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
