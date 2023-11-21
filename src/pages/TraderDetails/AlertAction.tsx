import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import {
  createTraderAlertApi,
  deleteTraderAlertApi,
  generateLinkBotAlertApi,
  getBotAlertApi,
  getTraderAlertListApi,
} from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import { useClickLoginButton } from 'components/LoginAction'
import LinkBotAlertModal from 'components/Modal/LinkBotAlertModal'
import UnsubscribeAlertModal from 'components/Modal/UnsubscribeAlertModal'
import useSubscriptionRestrict from 'hooks/features/useSubscriptionRestrict'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import AlertOffIcon from 'theme/Icons/AlerOffIcon'
import AlertIcon from 'theme/Icons/AlertIcon'
import { MAX_TRADER_ALERT_BASIC } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

const AlertAction = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) => {
  const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState(false)
  const [isOpenLinkBotModal, setIsOpenLinkBotModal] = useState(false)
  const [currentState, setCurrentState] = useState<string | undefined>()

  const { isAuthenticated, profile } = useAuthContext()
  const { isPremiumUser, handleAlertQuotaExceed } = useSubscriptionRestrict()
  const handleClickLogin = useClickLoginButton()

  const { data: botAlert } = useQuery([QUERY_KEYS.GET_BOT_ALERT, profile?.id], () => getBotAlertApi(), {
    enabled: !!profile?.id,
    retry: 0,
  })

  const { data, isLoading, refetch } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, profile?.id, account, protocol],
    () => getTraderAlertListApi({ address: account, protocol }),
    {
      enabled: !!profile?.id && !!botAlert?.chatId,
      retry: 0,
    }
  )
  const { data: listTraders, refetch: reloadAll } = useQuery(
    [QUERY_KEYS.CHECK_ALL_TRADER_ALERTS, profile?.id],
    () => getTraderAlertListApi({}),
    {
      enabled: !!profile?.id && !!botAlert?.chatId,
      retry: 0,
    }
  )
  const currentAlert = data?.data?.[0]
  const totalTraderAlerts = listTraders?.meta?.total ?? 0

  const reload = () => {
    refetch()
    reloadAll()
  }

  const { mutate: generateLinkBot, isLoading: generatingLinkBot } = useMutation(generateLinkBotAlertApi, {
    onSuccess: (state?: string) => {
      setIsOpenLinkBotModal(true)
      setCurrentState(state)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const { mutate: createTraderAlert, isLoading: submittingCreate } = useMutation(createTraderAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been subscribed successfully</Trans>}
        />
      )
      reload()
    },
    onError: (error: any) => {
      if (error?.message?.includes(`Can't find data`)) {
        generateLinkBot()
        setIsOpenLinkBotModal(true)
      } else {
        toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      }
    },
  })

  const { mutate: deleteTraderAlert, isLoading: submittingDelete } = useMutation(deleteTraderAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been removed successfully</Trans>}
        />
      )
      setIsOpenUnsubscribeModal(false)
      reload()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const handleConfirmDeleteAlert = () => {
    if (currentAlert) {
      deleteTraderAlert(currentAlert.id)
    }
  }

  const onSubmit = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!botAlert?.chatId) {
      generateLinkBot()
      setIsOpenLinkBotModal(true)
      return
    }
    if (currentAlert) {
      setIsOpenUnsubscribeModal(true)
    } else {
      if (!isPremiumUser && totalTraderAlerts >= MAX_TRADER_ALERT_BASIC) {
        handleAlertQuotaExceed()
        return
      }
      createTraderAlert({ address: account, protocol })
    }
  }

  return (
    <>
      <ButtonWithIcon
        width={['100%', '100%', '100%', 105]}
        sx={{
          borderRadius: 0,
          height: '100%',
          borderLeft: ['none', 'small', 'small', 'small'],
          borderTop: ['small', 'small', 'small', 'none'],
          borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
        }}
        variant={currentAlert ? 'ghostDanger' : 'ghost'}
        icon={currentAlert ? <AlertOffIcon /> : <AlertIcon />}
        disabled={isLoading || submittingCreate || submittingDelete || generatingLinkBot}
        onClick={onSubmit}
      >
        {currentAlert ? <Trans>Remove</Trans> : <Trans>Alert</Trans>}
      </ButtonWithIcon>
      {isOpenUnsubscribeModal && currentAlert && (
        <UnsubscribeAlertModal
          data={currentAlert}
          isConfirming={submittingDelete}
          onConfirm={handleConfirmDeleteAlert}
          onDismiss={() => setIsOpenUnsubscribeModal(false)}
        />
      )}
      {isOpenLinkBotModal && currentState && (
        <LinkBotAlertModal
          state={currentState}
          address={account}
          protocol={protocol}
          onDismiss={() => setIsOpenLinkBotModal(false)}
        />
      )}
    </>
  )
}

export default AlertAction
