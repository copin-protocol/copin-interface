import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'

import { getPnlStatisticsApi, getTraderByLabelApi } from 'apis/traderApis'
import { GetTraderByLabelPayload } from 'apis/types'
import logo from 'assets/images/logo.png'
import { Account, ResponseTraderData, StatisticData } from 'entities/trader'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useReferralActions from 'hooks/features/useReferralActions'
import useParsedQueryString from 'hooks/router/useParsedQueryString'
import useOnboardingStore from 'hooks/store/useOnboardingStore'
import useUserReferral from 'hooks/store/useReferral'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import RcDialog from 'theme/RcDialog'
import { Box, Flex, Image } from 'theme/base'
import { SortTypeEnum, TimeFilterByEnum, TraderLabelEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { logEventLite } from 'utils/tracking/event'
import { EventCategory } from 'utils/tracking/types'
import { EVENT_ACTIONS } from 'utils/tracking/types'

import CopyTraderModal from './CopyTraderModal'
import TraderFilter from './TraderFilter'
import { TraderListDesktop, TraderListMobile } from './TraderList'

const LIMIT_TRADER = 16

export default function OnboardingModal() {
  const { profile, isNewUser, setIsNewUser, setOpenReferralModal } = useAuthContext()
  const parsedQS = useParsedQueryString()
  const { setUserReferral } = useUserReferral()
  const referralCodeQs = parsedQS?.ref as string
  const hasUrlRef = Boolean(referralCodeQs)

  const onSuccess = () => {
    setUserReferral(null)
  }
  const { addReferral } = useReferralActions({ onSuccess })
  const { openModal, setOpenModal } = useOnboardingStore()
  const onDismiss = useCallback(() => {
    if (!profile?.id) return
    if (isNewUser) {
      if (!profile.isAddedReferral && !profile.isSkippedReferral) {
        if (hasUrlRef && referralCodeQs) {
          addReferral.mutate(referralCodeQs.toUpperCase())
        } else {
          setOpenReferralModal(true)
        }
      }
      setIsNewUser(false)
    }
    setOpenModal(false)
    logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_SKIP_ONBOARDING })
  }, [profile, isNewUser, hasUrlRef])
  useLayoutEffect(() => {
    if (isNewUser) setOpenModal(true)
  }, [isNewUser])

  return (
    <RcDialog
      keyboard={false}
      key={profile?.id}
      isOpen={openModal}
      onDismiss={onDismiss}
      maxWidth="100svw"
      height="100svh"
      offsetBottom="0px"
      offsetTop="0px"
      contentStyles={{ width: '100svw', height: '100svh' }}
      bodyStyles={{ width: '100%', height: '100%' }}
    >
      <OnboardingContent onDismiss={onDismiss} />
    </RcDialog>
  )
}

export function OnboardingContent({
  onDismiss,
  onStartInteraction,
}: {
  onDismiss: (() => void) | undefined
  onStartInteraction?: () => void
}) {
  const { allowedCopyTradeProtocols } = useProtocolPermission()
  const baseFilterTraderPayload: GetTraderByLabelPayload = {
    protocols: allowedCopyTradeProtocols,
    statisticType: TimeFilterByEnum.S30_DAY,
    labels: [],
    sortBy: 'realisedPnl',
    sortType: SortTypeEnum.DESC,
  }
  const [step, setStep] = useState(1)
  const [listTraderLabel, setListTraderLabel] = useState<TraderLabelEnum[]>([])
  const { data: traderData, isFetching: isLoading } = useQuery(
    [QUERY_KEYS, listTraderLabel],
    () =>
      getTraderByLabelApi({
        payload: { ...baseFilterTraderPayload, labels: listTraderLabel, protocols: allowedCopyTradeProtocols },
      }),
    {
      enabled: !!listTraderLabel.length,
      onSuccess: () => setStep(2),
      keepPreviousData: true,
    }
  )

  const [selectedTraderData, setSelectedTraderData] = useState<ResponseTraderData | null>(null)
  const onClickCopyTrade = useCallback((trader: ResponseTraderData) => {
    setSelectedTraderData(trader)

    logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_COPY_TRADER_START })

    // logEventBacktest({ event: EVENT_ACTIONS[EventCategory.BACK_TEST].HOME_OPEN_SINGLE, username: profile?.username })
  }, [])
  const onDismissModalCopyTrade = () => {
    setSelectedTraderData(null)
    logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_COPY_TRADER_CANCEL })
  }
  // const { botAlert, handleGenerateLinkBot } = useBotAlertContext()

  const history = useHistory()
  const onCopySuccess = () => {
    history.push(ROUTES.LITE.path)
    logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_ONBOARDING_NAVIGATE_TO_LITE })
    // if (!botAlert?.chatId) handleGenerateLinkBot?.()
    onDismiss?.()
  }

  const listTraderData = useMemo(() => traderData?.data?.slice(0, LIMIT_TRADER), [traderData?.data])
  const getPnlStatisticsPayload = (traderData: ResponseTraderData[]): StatisticData => {
    const accounts: Account[] = traderData?.map((trader: ResponseTraderData) => ({
      account: trader.account,
      protocol: trader.protocol,
    }))

    const payload: StatisticData = {
      accounts,
      statisticType: traderData?.[0]?.type,
    }

    return payload
  }

  const { data: pnlData } = useQuery(
    [QUERY_KEYS.GET_PNL_STATISTICS, traderData],
    () => getPnlStatisticsApi(getPnlStatisticsPayload(listTraderData ?? [])),
    {
      enabled: !!traderData?.data?.length && step === 2,
      retry: 0,
    }
  )

  const onConfirmFilter = useCallback((listLabel: TraderLabelEnum[]) => {
    setListTraderLabel(listLabel)
    logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_FIND_TRADER })
  }, [])

  const { lg } = useResponsive()

  const [filterHeadHeight, setFilterHeadHeight] = useState(0)
  const handleResize = useMemo(() => {
    return debounce(() => {
      const filterHead = document.getElementById('filter_head')
      if (!filterHead) return
      setFilterHeadHeight(filterHead.clientHeight)
    }, 100)
  }, [])
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    if (!traderData?.data?.length) return
    const mobileContainer = document.getElementById('mobile_trader_container')
    if (!mobileContainer || !mobileContainer.scrollHeight) return
    mobileContainer.scrollTo({ top: mobileContainer.scrollHeight })
  }, [traderData])

  const { actionType: onboardingActionType } = useOnboardingStore()
  const [isForcedOpen, setIsForceOpen] = useState(onboardingActionType === 'forced')
  useEffect(() => {
    if (onboardingActionType === 'forced' && !isForcedOpen) setIsForceOpen(true)
  }, [onboardingActionType])

  return (
    <>
      {lg ? (
        <Flex
          sx={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              transition: '0.6s',
              width: step !== 1 ? '100svw' : 520,
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Flex
              sx={{
                height: '100%',
                width: '100svw',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: [24, 24, 24, 60, 60],
                px: [24, 24, 24, 60, 60],
                py: 0,
              }}
            >
              <Flex
                sx={{
                  flexDirection: 'column',
                  py: 3,
                  width: '100%',
                  maxWidth: [360, 360, 360, 420, 420],
                  minHeight: 472,
                  flexShrink: 0,
                  alignItems: 'start',
                }}
              >
                <Image mb={24} height={40} src={logo} width="auto" />
                <TraderFilter
                  onConfirm={onConfirmFilter}
                  onSkip={onDismiss}
                  isFindingTrader={isLoading}
                  skipButtonText={isForcedOpen ? <Trans>Cancel</Trans> : <Trans>Skip</Trans>}
                  showSkipButton={!!onDismiss}
                  onClickFilter={onStartInteraction}
                />
              </Flex>

              <TraderListDesktop
                listTraderData={listTraderData}
                pnlData={pnlData}
                onClickCopyTrade={onClickCopyTrade}
                isLoading={isLoading}
              />
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Flex py={3} sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
          <Flex mb={3} px={3} sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
            <Image height={40} src={logo} width="auto" />
            {onDismiss && (
              <Button variant="ghost" sx={{ color: 'neutral2' }} onClick={onDismiss}>
                {isForcedOpen ? <Trans>Cancel</Trans> : <Trans>Skip</Trans>}
              </Button>
            )}
          </Flex>
          <Box id="mobile_trader_container" px={3} flex="1 0 0" sx={{ overflow: 'auto' }}>
            <Box sx={{ mt: step !== 1 ? filterHeadHeight * -1 : 'none', transition: '0.6s' }}>
              <TraderFilter
                onConfirm={onConfirmFilter}
                onSkip={onDismiss}
                isFindingTrader={isLoading}
                showSkipButton={false}
                onClickFilter={onStartInteraction}
              />
              {step !== 1 && (
                <TraderListMobile
                  listTraderData={listTraderData}
                  pnlData={pnlData}
                  onClickCopyTrade={onClickCopyTrade}
                />
              )}
            </Box>
          </Box>
        </Flex>
      )}
      <CopyTraderModal
        onCopySuccess={onCopySuccess}
        key={`${selectedTraderData?.protocol}${selectedTraderData?.account}`}
        onDismiss={onDismissModalCopyTrade}
        traderData={selectedTraderData}
      />
    </>
  )
}
