// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { Plus } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { memo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { linkWebhookToBotAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import { BotAlertData } from 'entities/alert'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import WebhookIcon from 'theme/Icons/WebhookIcon'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import Tooltip from 'theme/Tooltip'
import { Flex, IconBox, Type } from 'theme/base'
import { AlertTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { Z_INDEX } from 'utils/config/zIndex'
import { getErrorMessage } from 'utils/helpers/handleError'

const LinkWebhookAlertAction = memo(function LinkWebhookAlertModalComponent({
  botAlert,
  isLimited,
  isPremiumUser,
}: {
  botAlert?: BotAlertData
  isLimited?: boolean
  isPremiumUser?: boolean | null
}) {
  const { lg } = useResponsive()
  const [isOpenModal, setIsOpenModal] = useState(false)

  const onSuccess = () => {
    setIsOpenModal(false)
  }

  return (
    <>
      <ButtonWithIcon
        icon={<Plus />}
        variant="primary"
        sx={{ width: 178 }}
        onClick={() => {
          setIsOpenModal(true)
        }}
        disabled={!isPremiumUser || isLimited}
        data-tooltip-id={!isPremiumUser ? 'tt-webhook' : isLimited ? 'tt-max-channels' : undefined}
        data-tooltip-delay-show={360}
      >
        Webhook
      </ButtonWithIcon>
      <Tooltip id={'tt-webhook'} clickable>
        <Type.Caption color="neutral2" sx={{ maxWidth: 350 }}>
          You need to{' '}
          <Link to={ROUTES.SUBSCRIPTION.path}>
            <Button type="button" variant="ghostPrimary" p={0} sx={{ textTransform: 'lowercase' }}>
              upgrade
            </Button>
          </Link>{' '}
          to use this feature.
        </Type.Caption>
      </Tooltip>
      <Modal
        mode={lg ? 'center' : 'bottom'}
        isOpen={isOpenModal}
        title={
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <IconBox icon={<WebhookIcon size={24} variant="Bold" />} />
            <Trans>Connect Webhook</Trans>
          </Flex>
        }
        onDismiss={() => setIsOpenModal(false)}
        hasClose
        maxWidth="450px"
        zIndex={Z_INDEX.TOASTIFY}
      >
        <LinkWebhookComponent alertType={botAlert?.type} customAlertId={botAlert?.id} onSuccess={onSuccess} />
      </Modal>
    </>
  )
})
export default LinkWebhookAlertAction

function LinkWebhookComponent({
  alertType,
  customAlertId,
  onSuccess,
}: {
  alertType?: AlertTypeEnum
  customAlertId?: string
  onSuccess?: () => void
}) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<{ webhookUrl?: string; name?: string }>({
    defaultValues: { webhookUrl: undefined, name: undefined },
  })

  const refetchQueries = useRefetchQueries()
  const { mutate: linkWebhook, isLoading: submitting } = useMutation(linkWebhookToBotAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This webhook has been subscribed successfully</Trans>}
        />
      )
      refetchQueries([QUERY_KEYS.GET_BOT_ALERT, QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID])
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const onSubmit = async (values: FieldValues) => {
    if (submitting) return
    if (alertType) {
      clearErrors()
      linkWebhook({ customAlertId, type: alertType, webhookUrl: values.webhookUrl, name: values.name })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex width="100%" px={[16, 24]} py={1} flexDirection="column" alignItems="center">
        {/*<TelegramIcon size={56} variant="Bold" />*/}
        <Flex width="100%" mb={24} flexDirection="column" sx={{ gap: 3 }}>
          <Flex flex={1} flexDirection="column" sx={{ gap: 1 }}>
            <Type.Caption textAlign="left" color="neutral2">
              Add the webhook URL below
            </Type.Caption>
            <Flex mt={1} width="100%" flexDirection="column" justifyContent="flex-start" sx={{ gap: 2 }}>
              <InputField
                block
                required
                label={<Trans>Webhook Url</Trans>}
                placeholder={t`Input webhook url`}
                error={errors?.webhookUrl?.message}
                {...register('webhookUrl', {
                  required: { value: true, message: 'This field is required' },
                  onChange: (e) => {
                    e.target.value = e.target.value.trim().replace(/\s/g, '').toLowerCase()
                  },
                })}
              />
              <InputField
                block
                required
                label={<Trans>Webhook Name</Trans>}
                placeholder={t`Input name`}
                {...register('name', { required: { value: true, message: 'This field is required' } })}
                error={errors.name?.message}
              />
              <Button mt={2} type="submit" variant="primary" width="100%" isLoading={submitting} disabled={submitting}>
                <Type.CaptionBold>
                  <Trans>CONNECT</Trans>
                </Type.CaptionBold>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </form>
  )
}
