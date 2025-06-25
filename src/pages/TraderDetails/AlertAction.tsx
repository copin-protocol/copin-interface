import { Trans } from '@lingui/macro'
import { BellSimple, BellSimpleSlash } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getTraderAlertListApi, postAlertLabelApi } from 'apis/alertApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import ToastBody from 'components/@ui/ToastBody'
import AlertLabelTooltip from 'components/@widgets/AlertLabelButton/AlertLabelNoteTooltip'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex } from 'theme/base'
import { AlertTypeEnum, ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'

const AlertAction = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) => {
  const { sm, md, lg, xs } = useResponsive()
  const { isAllowedProtocol, requiredPlanToProtocol } = useTraderProfilePermission({ protocol })
  const { maxWatchedListQuota } = useAlertPermission()
  const { hasWatchlistChannel, handleGenerateLinkBot, isGeneratingLink, usage, maxTraderAlert } = useBotAlertContext()
  const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState(false)
  const [isOpenLimitModal, setIsOpenLimitModal] = useState(false)
  const [showAlertLabelTooltip, setShowAlertLabelTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const refetchQueries = useRefetchQueries()

  const { isAuthenticated, profile } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const total = usage?.watchedListAlerts ?? 0
  const limit = maxTraderAlert ?? 0
  const isLimited = total >= limit

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, profile?.id, account, protocol],
    () => getTraderAlertListApi({ address: account, protocol }),
    {
      enabled: !!profile?.id,
      retry: 0,
    }
  )

  const { mutate: createAlertLabel, isLoading: submittingLabel } = useMutation(postAlertLabelApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been subscribed successfully</Trans>}
        />
      )
      refetchQueries([QUERY_KEYS.GET_TRADER_ALERTS, QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE])

      setShowAlertLabelTooltip(false)
    },
    onError: (error: any) => {
      if (error?.message?.includes(`Can't find data`)) {
        handleGenerateLinkBot?.(AlertTypeEnum.TRADERS)
      } else {
        toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      }
    },
  })

  const currentAlert = data?.data?.[0]

  const { createTraderAlert, deleteTraderAlert, submittingDelete, submittingCreate } = useSettingWatchlistTraders({
    onSuccess: () => {
      setIsOpenUnsubscribeModal(false)
      setShowAlertLabelTooltip(false)
    },
  })

  const handleConfirmDeleteAlert = () => {
    if (currentAlert?.id) {
      deleteTraderAlert(currentAlert.id)
    }
  }

  const handleSaveAlertLabel = async (label?: string) => {
    // if (!label?.trim()) {
    // createTraderAlert({ address: account, protocol })
    // } else {
    createAlertLabel({
      protocol,
      account,
      address: account,
      label,
    })
    // }
  }

  const handleCancelAlertLabel = () => {
    setShowAlertLabelTooltip(false)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!hasWatchlistChannel) {
      handleGenerateLinkBot?.(AlertTypeEnum.TRADERS)
      return
    }
    if (currentAlert) {
      setIsOpenUnsubscribeModal(true)
    } else {
      if (isLimited) {
        setIsOpenLimitModal(true)
      } else {
        setShowAlertLabelTooltip(true)
        const buttonRect: DOMRect = e.currentTarget.getBoundingClientRect()
        if (lg) {
          setTooltipPosition({
            top: buttonRect.bottom - 30,
            left: buttonRect.left + buttonRect.width / 2 - 22,
          })
        } else if (md) {
          setTooltipPosition({
            top: buttonRect.top + buttonRect.width / 2 - 90,
            left: buttonRect.left + buttonRect.width / 2 - 267,
          })
        } else if (sm) {
          setTooltipPosition({
            top: buttonRect.bottom + buttonRect.width / 2 + 55,
            left: buttonRect.left + buttonRect.width / 2 - 268,
          })
        } else if (xs) {
          setTooltipPosition({
            top: buttonRect.bottom + 115,
            left: buttonRect.left - 206,
          })
        }
      }
    }
  }

  return (
    <>
      <Flex width={['100%', '100%', '100%', 'auto']} alignItems="center" px={3} sx={{ gap: 1 }}>
        <ButtonWithIcon
          width="100%"
          sx={{
            px: 0,
            borderRadius: 0,
            height: '100%',
            color: 'neutral2',
            '&:hover:not(:disabled)': { color: 'neutral1' },
          }}
          variant={currentAlert ? 'ghostDanger' : 'ghost'}
          icon={currentAlert ? <BellSimpleSlash size={20} /> : <BellSimple size={20} />}
          disabled={!isAllowedProtocol || isLoading || submittingCreate || submittingDelete || isGeneratingLink}
          onClick={onSubmit}
        >
          {currentAlert ? <Trans>Unnotify</Trans> : <Trans>Alert</Trans>}
        </ButtonWithIcon>
        {!isAllowedProtocol && (
          <PlanUpgradeIndicator
            requiredPlan={requiredPlanToProtocol}
            learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
          />
        )}
      </Flex>
      <AlertLabelTooltip
        address={showAlertLabelTooltip && !currentAlert ? account : undefined}
        protocol={protocol}
        position={tooltipPosition || undefined}
        submitting={submittingLabel || submittingCreate}
        onSave={handleSaveAlertLabel}
        onCancel={handleCancelAlertLabel}
      />
      {isOpenUnsubscribeModal && currentAlert && (
        <UnsubscribeAlertModal
          data={currentAlert}
          isConfirming={submittingDelete}
          onConfirm={handleConfirmDeleteAlert}
          onDismiss={() => setIsOpenUnsubscribeModal(false)}
        />
      )}
      {isOpenLimitModal && (
        <UpgradeModal
          isOpen={isOpenLimitModal}
          onDismiss={() => setIsOpenLimitModal(false)}
          title={<Trans>YOU’VE HIT YOUR WATCHLIST TRADERS LIMIT</Trans>}
          description={
            <Trans>
              You’re reach the maximum of Trader in watchlist for your current plan. Upgrade your plan to unlock access
              up to <b>{formatNumber(maxWatchedListQuota)} traders</b>
            </Trans>
          }
        />
      )}
    </>
  )
}

export default AlertAction
