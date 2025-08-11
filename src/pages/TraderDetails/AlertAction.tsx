import { Trans } from '@lingui/macro'
import { BellSimple, BellSimpleRinging } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getTraderAlertListApi, postAlertLabelApi, putAlertLabelApi } from 'apis/alertApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import ToastBody from 'components/@ui/ToastBody'
import AlertLabelTooltip from 'components/@widgets/AlertLabelButton/AlertLabelNoteTooltip'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import { useTraderAlerts } from 'hooks/features/alert/useTraderAlerts'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { AlertTypeEnum, ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'

const AlertAction = ({
  protocol,
  account,
  shoulShowGroupAlerts = true,
}: {
  protocol: ProtocolEnum
  account: string
  shoulShowGroupAlerts?: boolean
}) => {
  const { md, lg } = useResponsive()
  const { isAllowedProtocol, requiredPlanToProtocol } = useTraderProfilePermission({ protocol })
  const { maxWatchedListQuota } = useAlertPermission()
  const { hasWatchlistChannel, handleGenerateLinkBot, isGeneratingLink, usage, maxTraderAlert } = useBotAlertContext()
  const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState(false)
  const [isOpenLimitModal, setIsOpenLimitModal] = useState(false)
  const [showAlertLabelTooltip, setShowAlertLabelTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>()
  const refetchQueries = useRefetchQueries()

  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const total = usage?.watchedListAlerts ?? 0
  const limit = maxTraderAlert ?? 0
  const isLimited = total >= limit

  const { currentAlert, groupAlerts } = useTraderAlerts(account, protocol)
  const { mutate: createAlertLabel, isLoading: submittingCreate } = useMutation(postAlertLabelApi, {
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

  const { mutate: updateAlertLabel, isLoading: submittingUpdate } = useMutation(putAlertLabelApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Alert label updated successfully</Trans>} />
      )
      refetchQueries([QUERY_KEYS.GET_TRADER_ALERTS])
      setShowAlertLabelTooltip(false)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { deleteTraderAlert, submittingDelete } = useSettingWatchlistTraders({
    onSuccess: () => {
      setIsOpenUnsubscribeModal(false)
      setShowAlertLabelTooltip(false)
    },
  })

  const handleRequestUnsubscribe = () => {
    setIsOpenUnsubscribeModal(true)
  }

  const handleConfirmDeleteAlert = () => {
    if (currentAlert?.id) {
      deleteTraderAlert(currentAlert.id)
    }
    setIsOpenUnsubscribeModal(false)
  }

  const handleDismissUnsubscribeModal = () => {
    setIsOpenUnsubscribeModal(false)
  }

  const handleSaveAlertLabel = async (label?: string) => {
    if (currentAlert) {
      updateAlertLabel({
        id: currentAlert.id,
        address: account,
        protocol,
        label: label?.trim(),
      })
    } else {
      createAlertLabel({
        protocol,
        account,
        address: account,
        label: label?.trim(),
      })
    }
    setShowAlertLabelTooltip(false)
  }

  const handleCancelAlertLabel = () => {
    setShowAlertLabelTooltip(false)
  }

  const setTooltipPositionByScreenSize = (buttonRect: DOMRect) => {
    if (lg) {
      setTooltipPosition({
        top: buttonRect.bottom + 10,
        left: buttonRect.left + buttonRect.width / 2 - 22,
      })
    } else if (md) {
      setTooltipPosition({
        top: buttonRect.top + buttonRect.width / 2 - 56,
        left: buttonRect.left + buttonRect.width / 2 - 321,
      })
    } else {
      setTooltipPosition({
        top: buttonRect.bottom,
        left: buttonRect.left,
      })
    }
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpenUnsubscribeModal(false)

    if (!isAuthenticated) {
      handleClickLogin()
      return
    }

    if (!hasWatchlistChannel) {
      handleGenerateLinkBot?.(AlertTypeEnum.TRADERS)
      return
    }

    const buttonRect: DOMRect = e.currentTarget.getBoundingClientRect()

    if (currentAlert) {
      setShowAlertLabelTooltip(true)
      setTooltipPositionByScreenSize(buttonRect)
    } else {
      if (isLimited) {
        setIsOpenLimitModal(true)
      } else {
        setShowAlertLabelTooltip(true)
        setTooltipPositionByScreenSize(buttonRect)
      }
    }
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentAlert) {
      setShowAlertLabelTooltip(true)
    }
  }

  return (
    <>
      <Flex width={['100%', '100%', '100%', 'auto']} alignItems="center" px={3} sx={{ gap: 1 }}>
        <Flex width="100%" flexDirection={'column'} sx={{ position: 'relative', gap: 0, px: 0 }}>
          <ButtonWithIcon
            width="100%"
            sx={{
              px: 0,
              py: 0,
              borderRadius: 0,
              height: '100%',
              color: 'neutral2',
              '&:hover:not(:disabled)': { color: 'neutral1' },
            }}
            variant={currentAlert ? 'ghostPrimary' : 'ghost'}
            icon={
              currentAlert ? (
                <BellSimpleRinging style={{ color: `${themeColors.primary1}` }} weight="fill" size={20} />
              ) : (
                <BellSimple size={20} />
              )
            }
            disabled={!isAllowedProtocol || submittingCreate || submittingDelete || isGeneratingLink}
            onClick={onSubmit}
            onContextMenu={handleRightClick}
          >
            <Trans>Alert</Trans>
          </ButtonWithIcon>
        </Flex>
        {!isAllowedProtocol && (
          <PlanUpgradeIndicator
            requiredPlan={requiredPlanToProtocol}
            learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
          />
        )}
      </Flex>

      <AlertLabelTooltip
        key={`${account}_${protocol}`}
        tooltipOpen={!md && showAlertLabelTooltip}
        address={showAlertLabelTooltip ? account : undefined}
        protocol={protocol}
        position={tooltipPosition || undefined}
        submitting={submittingCreate || submittingUpdate}
        currentLabel={currentAlert?.label}
        isEditMode={!!currentAlert}
        onSave={handleSaveAlertLabel}
        onCancel={handleCancelAlertLabel}
        groupAlerts={shoulShowGroupAlerts ? groupAlerts : undefined}
        onRequestUnsubscribe={handleRequestUnsubscribe}
        isAlertEnabled={currentAlert?.enableAlert}
      />

      {isOpenUnsubscribeModal && currentAlert && (
        <UnsubscribeAlertModal
          data={currentAlert}
          isConfirming={submittingDelete}
          onConfirm={handleConfirmDeleteAlert}
          onDismiss={handleDismissUnsubscribeModal}
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
