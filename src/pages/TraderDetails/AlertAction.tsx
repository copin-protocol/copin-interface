import { Trans } from '@lingui/macro'
import { BellSimple, BellSimpleSlash } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderAlertListApi } from 'apis/alertApis'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/alert/useSettingWatchlistTraders'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { AlertTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

const AlertAction = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) => {
  const { hasWatchlistChannel, handleGenerateLinkBot, isGeneratingLink } = useBotAlertContext()
  const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState(false)

  const { isAuthenticated, profile } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

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
    if (currentAlert) {
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
        icon={currentAlert ? <BellSimpleSlash size={20} /> : <BellSimple size={20} />}
        disabled={isLoading || submittingCreate || submittingDelete || isGeneratingLink}
        onClick={onSubmit}
      >
        {currentAlert ? <Trans>Unnotify</Trans> : <Trans>Alert</Trans>}
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
