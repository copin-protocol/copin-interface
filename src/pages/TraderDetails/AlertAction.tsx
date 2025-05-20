import { Trans } from '@lingui/macro'
import { BellSimple, BellSimpleSlash } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderAlertListApi } from 'apis/alertApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex } from 'theme/base'
import { AlertTypeEnum, ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

const AlertAction = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) => {
  const { isAllowedProtocol, requiredPlanToProtocol } = useTraderProfilePermission({ protocol })
  const { maxWatchedListQuota } = useAlertPermission()
  const { hasWatchlistChannel, handleGenerateLinkBot, isGeneratingLink, usage, maxTraderAlert } = useBotAlertContext()
  const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState(false)
  const [isOpenLimitModal, setIsOpenLimitModal] = useState(false)

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

  const currentAlert = data?.data?.[0]

  const { createTraderAlert, deleteTraderAlert, submittingDelete, submittingCreate } = useSettingWatchlistTraders({
    onSuccess: () => {
      setIsOpenUnsubscribeModal(false)
    },
  })

  const handleConfirmDeleteAlert = () => {
    if (currentAlert?.id) {
      deleteTraderAlert(currentAlert.id)
    }
  }

  const onSubmit = () => {
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
        createTraderAlert({ address: account, protocol })
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
