import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'
import React from 'react'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { linkToBotAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import { useClickLoginButton } from 'components/LoginAction'
import useSearchParams from 'hooks/router/useSearchParams'
import { useAuthContext } from 'hooks/web3/useAuth'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import { Flex, Type } from 'theme/base'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { getErrorMessage } from 'utils/helpers/handleError'

const LinkBotTelegram = () => {
  const { searchParams } = useSearchParams()
  const history = useHistory()
  const currentState = (searchParams?.[URL_PARAM_KEYS.BOT_TELEGRAM_STATE] as string) ?? undefined

  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const { mutate: linkBotAlert, isLoading: submitting } = useMutation(linkToBotAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This bot alert has been subscribed successfully</Trans>}
        />
      )
      history.push(ROUTES.ALERT_LIST.path)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const handleConfirmLinkAlert = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (currentState) {
      linkBotAlert(currentState)
    }
  }

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
      <IconButton
        variant="outline"
        icon={<TelegramIcon size={56} variant="Bold" />}
        size={56}
        sx={{ '&:hover': { cursor: 'initial' } }}
      />
      <Flex my={24} flexDirection="column" sx={{ gap: 1 }}>
        <Type.Body textAlign="center">
          <Trans>To get notifications from traders, you must use Copin Telegram Bot</Trans>
        </Type.Body>
        <Type.Caption color="neutral2" textAlign="center" width="100%">
          <Trans>Note: Each Telegram account is only allowed to link to a Copin account</Trans>
        </Type.Caption>
      </Flex>

      <ButtonWithIcon
        variant="primary"
        icon={<ArrowSquareOut size={16} />}
        width={200}
        direction="right"
        isLoading={submitting}
        disabled={submitting}
        onClick={handleConfirmLinkAlert}
      >
        <Trans>Link Account</Trans>
      </ButtonWithIcon>
    </Flex>
  )
}

export default LinkBotTelegram
