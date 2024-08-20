import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { createTraderAlertApi, deleteTraderAlertApi, getTraderAlertListApi } from 'apis/alertApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import ToastBody from 'components/@ui/ToastBody'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import AlertOffIcon from 'theme/Icons/AlerOffIcon'
import AlertIcon from 'theme/Icons/AlertIcon'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'

const AlertAction = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) => {
  const { botAlert, handleGenerateLinkBot, isGeneratingLink } = useBotAlertContext()
  const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState(false)

  const { isAuthenticated, profile } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const { data, isLoading, refetch } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, profile?.id, account, protocol],
    () => getTraderAlertListApi({ address: account, protocol }),
    {
      enabled: !!profile?.id && !!botAlert?.chatId,
      retry: 0,
    }
  )

  const currentAlert = data?.data?.[0]

  const reload = () => {
    refetch()
  }

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
        handleGenerateLinkBot()
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
      handleGenerateLinkBot()
      return
    }
    if (currentAlert) {
      setIsOpenUnsubscribeModal(true)
    } else {
      createTraderAlert({ address: account, protocol })
    }
  }

  return (
    <>
      <ButtonWithIcon
        width={['100%', '100%', '100%', 'auto']}
        sx={{
          px: 3,
          borderRadius: 0,
          height: '100%',
          color: 'neutral2',
          '&:hover:not(:disabled)': { color: 'neutral1' },
        }}
        variant={currentAlert ? 'ghostDanger' : 'ghost'}
        icon={currentAlert ? <AlertOffIcon size={20} /> : <AlertIcon size={20} />}
        disabled={isLoading || submittingCreate || submittingDelete || isGeneratingLink}
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
    </>
  )
}

export default AlertAction
