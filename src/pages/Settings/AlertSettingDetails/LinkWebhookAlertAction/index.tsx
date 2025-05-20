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
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import { EnterpriseUpgradePrompt } from 'components/@subscription/PlanUpgradePrompt'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import ToastBody from 'components/@ui/ToastBody'
import { BotAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import WebhookIcon from 'theme/Icons/WebhookIcon'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { AlertTypeEnum, SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { Z_INDEX } from 'utils/config/zIndex'
import { getErrorMessage } from 'utils/helpers/handleError'

const LinkWebhookAlertAction = memo(function LinkWebhookAlertModalComponent({
  botAlert,
  isLimited,
  isAvailableFeature,
  requiredPlan,
  openLimitModal,
}: {
  botAlert?: BotAlertData
  isLimited?: boolean
  isAvailableFeature?: boolean | null
  requiredPlan: SubscriptionPlanEnum
  openLimitModal?: () => void
}) {
  const { usage } = useBotAlertContext()
  const { webhookQuota } = useAlertPermission()
  const { lg } = useResponsive()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const webhookUsage = usage?.webhookAlerts ?? 0
  const isLimitedWebhook = webhookUsage >= webhookQuota

  const onSuccess = () => {
    setIsOpenModal(false)
  }

  return (
    <>
      {isAvailableFeature ? (
        <ButtonWithIcon
          icon={<Plus />}
          variant="primary"
          sx={{ width: 225 }}
          onClick={() => {
            if (isLimited) {
              openLimitModal?.()
            } else {
              setIsOpenModal(true)
            }
          }}
          disabled={!isAvailableFeature}
        >
          Webhook
        </ButtonWithIcon>
      ) : (
        <Link to={`${ROUTES.SUBSCRIPTION.path}?plan=${requiredPlan}`}>
          <ButtonWithIcon
            icon={<PlanUpgradeIndicator requiredPlan={requiredPlan} useLockIcon={false} />}
            variant="outline"
            sx={{ width: 225 }}
          >
            <Trans>Upgrade to add Webhook</Trans>
          </ButtonWithIcon>
        </Link>
      )}
      {isOpenModal && (
        <Modal
          mode={lg ? 'center' : 'bottom'}
          isOpen={isOpenModal}
          title={
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <IconBox icon={<WebhookIcon size={24} variant="Bold" />} />
              <Trans>Connect Webhook</Trans>
              <BadgeWithLimit total={webhookUsage} limit={webhookQuota} />
            </Flex>
          }
          onDismiss={() => setIsOpenModal(false)}
          hasClose
          maxWidth="450px"
          zIndex={Z_INDEX.TOASTIFY}
        >
          {isLimitedWebhook ? (
            <Box p={24} pt={1}>
              <EnterpriseUpgradePrompt
                title={<Trans>Reach maximum quota ({webhookQuota}) for this plan</Trans>}
                description={<Trans>Customize a pricing plan that scales to your business&apos; needs</Trans>}
                showTitleIcon
                showLearnMoreButton
                learnMoreSection={SubscriptionFeatureEnum.TRADER_ALERT}
              />
            </Box>
          ) : (
            <LinkWebhookComponent alertType={botAlert?.alertType} customAlertId={botAlert?.id} onSuccess={onSuccess} />
          )}
        </Modal>
      )}
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
      refetchQueries([
        QUERY_KEYS.GET_BOT_ALERT,
        QUERY_KEYS.GET_CUSTOM_ALERT_DETAILS_BY_ID,
        QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE,
      ])
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
                    e.target.value = e.target.value.trim().replace(/\s/g, '')
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
