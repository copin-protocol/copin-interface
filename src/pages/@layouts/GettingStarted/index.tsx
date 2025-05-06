import { Trans } from '@lingui/macro'
import { CaretDown, CaretUp, Check } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import { DifferentialBar } from 'components/@ui/DifferentialBar'
import { GradientText } from 'components/@ui/GradientText'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useLiteClickDepositFund from 'hooks/helpers/useLiteClickDepositFund'
import useOnboardingStore from 'hooks/store/useOnboardingStore'
import { useAuthContext } from 'hooks/web3/useAuth'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import DepartureIcon from 'theme/Icons/DepartureIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { AlertTypeEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { parseStorageData } from 'utils/helpers/transform'

type State = {
  checkConnectWallet: boolean | null
  checkCopyTrades: boolean | null
  checkFund: boolean | null
  checkAlert: boolean | null
}
type LastCheckData = {
  isOpen: boolean
  time: string
}
type StoredState = Record<string, State>

const DEFAULT_STATE = { checkCopyTrades: null, checkFund: null, checkAlert: null, checkConnectWallet: null }

function getStoredState() {
  const state = parseStorageData<StoredState>({ storageKey: STORAGE_KEYS.GETTING_STARTED, storage: localStorage })
  return state
}
function setStoredState({ state, userName }: { state: State | null; userName: string }) {
  if (!state) return
  const oldStoredState = getStoredState()
  const payload: StoredState = { ...(oldStoredState ?? {}), [userName]: state }
  localStorage.setItem(STORAGE_KEYS.GETTING_STARTED, JSON.stringify(payload))
}

export default function GettingStarted() {
  const { isAuthenticated, profile, waitingState } = useAuthContext()
  if (isAuthenticated == null || !!waitingState) return null

  return <Menu key={`${profile?.username}`} />
}

const CHECK_STEP_MAPPING: Record<keyof State, number> = {
  checkConnectWallet: 1,
  checkCopyTrades: 2,
  checkFund: 3,
  checkAlert: 4,
}
const checkIsExpand = ({ latestCompleted, step }: { latestCompleted: number; step: number }) =>
  latestCompleted + 1 === step

function Menu() {
  const { isAuthenticated, profile } = useAuthContext()
  const [checkState, setCheckState] = useState<State | null>(null)
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const storedCheckData = getStoredCheckData()
    const storedData = getStoredState()
    const state = storedData?.[profile?.username ?? '']
    if (!state) {
      setCheckState({ ...DEFAULT_STATE, checkConnectWallet: isAuthenticated })
    } else {
      setCheckState(state)
    }
    const checkStoredData = () => {
      if (!state) {
        setOpen(true)
        return
      }
      if (Object.values(state).some((v) => !v)) {
        setOpen(true)
        return
      }
      setOpen(false)
    }
    if (storedCheckData == null) {
      checkStoredData()
      return
    }
    const dayDiff = dayjs()
      .utc()
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .diff(dayjs(storedCheckData.time).utc(), 'd')
    if (dayDiff > 1) {
      checkStoredData()
      return
    } else {
      setOpen(storedCheckData.isOpen)
      return
    }
  }, [])

  useEffect(() => {
    if (open == null) return
    const data: LastCheckData = {
      isOpen: open,
      time: dayjs.utc().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.GET_STARTED_LAST_CHECK, JSON.stringify(data))
  }, [open])

  const { embeddedCopyTrades, embeddedWalletInfo } = useCopyWalletContext()
  const { hasCopiedChannel, handleGenerateLinkBot } = useBotAlertContext()
  const [latestCompleted, setLatestCompleted] = useState(CHECK_STEP_MAPPING.checkConnectWallet)

  useEffect(() => {
    if (!profile?.username || !checkState) return
    setStoredState({ userName: profile.username, state: checkState })
  }, [checkState])

  const updateLatestCompleted = (step: number) => setLatestCompleted((prev) => (prev + 1 === step ? step : prev))

  useEffect(() => {
    if (checkState == null) return
    if (checkState.checkCopyTrades !== true) {
      const checkedCopyTrades = embeddedCopyTrades
        ? (Array.from(new Set(embeddedCopyTrades.map((v) => (v.accounts?.length ? v.accounts : v.account)).flat()))
            ?.length ?? 0) >= 2
        : false
      setCheckState((prev) => ({ ...(prev ?? DEFAULT_STATE), checkCopyTrades: checkedCopyTrades }))
      if (checkedCopyTrades) {
        updateLatestCompleted(CHECK_STEP_MAPPING.checkCopyTrades)
      }
    } else {
      updateLatestCompleted(CHECK_STEP_MAPPING.checkCopyTrades)
    }
    if (checkState.checkFund) {
      updateLatestCompleted(CHECK_STEP_MAPPING.checkFund)
    }
    if (embeddedWalletInfo != null && checkState.checkFund !== true) {
      const currentMargin = embeddedWalletInfo ? Number(embeddedWalletInfo.marginSummary.accountValue) : undefined
      if ((currentMargin ?? 0) > 0) {
        setCheckState((prev) => ({ ...(prev ?? DEFAULT_STATE), checkFund: true }))
        updateLatestCompleted(CHECK_STEP_MAPPING.checkFund)
      } else {
        setCheckState((prev) => ({ ...(prev ?? DEFAULT_STATE), checkFund: false }))
      }
    }
  }, [embeddedCopyTrades, embeddedWalletInfo])

  useEffect(() => {
    if (checkState == null || checkState.checkAlert === true) return
    if (hasCopiedChannel != null) {
      const checkedAlert = hasCopiedChannel
      setCheckState((prev) => ({ ...(prev ?? DEFAULT_STATE), checkAlert: checkedAlert }))
      if (checkedAlert) updateLatestCompleted(CHECK_STEP_MAPPING.checkAlert)
      return
    }
  }, [hasCopiedChannel])

  const handleClickLogin = useClickLoginButton()

  const { forceOpenModal } = useOnboardingStore()

  const handleClickFindTrader = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    forceOpenModal()
    setOpen(false)
  }

  const history = useHistory()
  const handleClickDepositFund = useLiteClickDepositFund()
  const handleClickDeposit = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    handleClickDepositFund()
    setOpen(false)
  }

  const handleClickAlertBot = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    handleGenerateLinkBot?.(AlertTypeEnum.COPY_TRADE)
    setOpen(false)
  }

  const totalStep = Object.values(checkState ?? {}).length
  const completeStep = Object.values(checkState ?? {}).reduce((result, v) => {
    return result + (!!v ? 1 : 0)
  }, 0)
  const sourceRate = totalStep === 0 ? 0 : (completeStep / totalStep) * 100
  const targetRate = 100 - sourceRate

  if (open == null) return null

  return (
    <Flex
      sx={{
        position: 'relative',
        height: 'calc(100%)',
        flexShrink: 0,
        alignItems: 'center',
        px: 12,
        justifyContent: 'center',
      }}
    >
      <ButtonWithIcon
        icon={<DepartureIcon />}
        variant="ghost"
        onClick={() => setOpen((prev) => !prev)}
        iconSx={{ color: 'neutral3' }}
        sx={{ p: 0, '& *': { textTransform: 'uppercase' } }}
      >
        <Type.CaptionBold>
          <GetStartedText />
        </Type.CaptionBold>
      </ButtonWithIcon>
      <Box
        sx={{
          overflow: 'hidden',
          bg: 'neutral7',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          transform: 'translateY(-100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          height: 'max-content',
          maxHeight: open ? 600 : 0,
          transition: '0.3s',
        }}
      >
        <Box
          p={12}
          sx={{
            width: 300,
            border: 'small',
            borderColor: 'neutral4',
            boxShadow: '0px 16px 32px 0px #777E901A',
          }}
        >
          <Flex sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Type.Large color="neutral2" sx={{ userSelect: 'none', '& *': { textTransform: 'none' } }}>
              <GetStartedText />
            </Type.Large>
            <IconButton
              icon={open ? <CaretDown size={16} /> : <CaretUp size={16} />}
              size={16}
              variant="ghost"
              onClick={() => setOpen((prev) => !prev)}
            />
          </Flex>
          <Box mt={1}>
            <Type.Caption color="neutral2" mb={12}>
              <Trans>🎉 Welcome! Complete the welcome tasks to start copy-trading with Copin Lite!</Trans>
            </Type.Caption>
            {!!totalStep && (
              <DifferentialBar
                sourceRate={sourceRate}
                targetRate={targetRate}
                sourceColor={getGradientColor('bar')}
                targetColor={themeColors.neutral4}
              />
            )}
            <Flex mt={12} sx={{ bg: 'neutral6', p: 2, width: '100%', flexDirection: 'column', gap: 12 }}>
              <Accordion
                wrapperSx={{ p: 0 }}
                isOpen={isAuthenticated === false}
                header={<Checkbox checked={!!checkState?.checkConnectWallet} label={<Trans>Connect Wallet</Trans>} />}
                body={
                  <Type.Caption color="neutral3" mt={12}>
                    <Trans>To begin using Copin, please</Trans>
                    {!!checkState?.checkConnectWallet ? (
                      <>
                        {' '}
                        <Trans>connect your wallet.</Trans>
                      </>
                    ) : (
                      <>
                        {' '}
                        <Button variant="textPrimary" onClick={handleClickLogin}>
                          Connect Your Wallet.
                        </Button>
                      </>
                    )}
                  </Type.Caption>
                }
              />

              <Accordion
                wrapperSx={{ p: 0 }}
                isOpen={
                  checkState?.checkCopyTrades != null &&
                  !checkState.checkCopyTrades &&
                  checkIsExpand({ latestCompleted, step: CHECK_STEP_MAPPING.checkCopyTrades })
                }
                header={<Checkbox checked={!!checkState?.checkCopyTrades} label={<Trans>Copy 2 Traders</Trans>} />}
                body={
                  <Type.Caption color="neutral3" mt={12}>
                    <Trans>
                      Explore the best traders and set up copy-trading to boost your portfolio.
                      {!!checkState?.checkCopyTrades ? null : (
                        <>
                          {' '}
                          <Button variant="textPrimary" onClick={handleClickFindTrader}>
                            Set Up Copy-Trading.
                          </Button>
                        </>
                      )}
                    </Trans>
                  </Type.Caption>
                }
              />

              <Accordion
                wrapperSx={{ p: 0 }}
                isOpen={
                  checkState?.checkFund != null &&
                  !checkState.checkFund &&
                  checkIsExpand({ latestCompleted, step: CHECK_STEP_MAPPING.checkFund })
                }
                header={<Checkbox checked={!!checkState?.checkFund} label={<Trans>Deposit Funds</Trans>} />}
                body={
                  <Type.Caption color="neutral3" mt={12}>
                    <Trans>
                      Easily deposit USDC over Arbitrum. Your funds are securely managed in MPC Wallet.
                      {!!checkState?.checkFund ? null : (
                        <>
                          {' '}
                          <Button variant="textPrimary" onClick={handleClickDeposit}>
                            Deposit Now
                          </Button>
                          .
                        </>
                      )}
                    </Trans>
                  </Type.Caption>
                }
              />

              <Accordion
                wrapperSx={{ p: 0 }}
                isOpen={
                  checkState?.checkAlert != null &&
                  !checkState.checkAlert &&
                  checkIsExpand({ latestCompleted, step: CHECK_STEP_MAPPING.checkAlert })
                }
                header={<Checkbox checked={!!checkState?.checkAlert} label={<Trans>Enable Alert</Trans>} />}
                body={
                  <Type.Caption color="neutral3" mt={12}>
                    <Trans>
                      Connect Telegram to get real-time notifications from your copy-trades.
                      {!!checkState?.checkAlert ? null : (
                        <>
                          {' '}
                          <Button variant="textPrimary" onClick={handleClickAlertBot}>
                            Get Alerts Now
                          </Button>
                          .
                        </>
                      )}
                    </Trans>
                  </Type.Caption>
                }
              />
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}

function GetStartedText() {
  return (
    <GradientText bg={getGradientColor('text')}>
      <Trans>Get Started</Trans>
    </GradientText>
  )
}

const mapping = {
  icon: { deg: 115, left: 25, right: 70 },
  text: { deg: 90, left: 0, right: 80 },
  bar: { deg: 90, left: 0, right: 80 },
}
const getGradientColor = (type: 'icon' | 'text' | 'bar') => {
  const config = mapping[type]
  return `linear-gradient(${config.deg}deg, #FFC24B ${config.left}%, #02FFE8 ${config.right}%)`
}

function Checkbox({ checked, label }: { checked: boolean; label: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      {checked ? (
        <IconBox
          icon={<Check size={12} />}
          sx={{
            backgroundImage: getGradientColor('icon'),
            p: '2px',
            borderRadius: '50%',
            '& *': { color: 'neutral7' },
          }}
        />
      ) : (
        <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: 'small', borderColor: 'neutral3' }} />
      )}
      <Type.Body color="white">{label}</Type.Body>
    </Flex>
  )
}

function getStoredCheckData() {
  const storedCheck = parseStorageData<LastCheckData>({
    storageKey: STORAGE_KEYS.GET_STARTED_LAST_CHECK,
    storage: localStorage,
  })
  return storedCheck
}
