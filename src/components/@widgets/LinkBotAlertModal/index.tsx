// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { memo, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { linkGroupToBotAlertApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useCountdown from 'hooks/helpers/useCountdown'
import useIsIphone from 'hooks/helpers/useIsIphone'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import Tabs, { TabPane } from 'theme/Tab'
import { Flex, IconBox, Type } from 'theme/base'
import { TELEGRAM_BOT_ALERT } from 'utils/config/constants'
import { AlertTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'
import { getErrorMessage } from 'utils/helpers/handleError'

enum TabEnum {
  DIRECT = 'direct',
  GROUP = 'group',
}

const LinkBotAlertModal = memo(function LinkBotAlertModalComponent() {
  const { lg } = useResponsive()
  const isIphone = useIsIphone()

  const { currentAlert, botAlertState, openingModal, stateExpiredTime, handleResetState, handleDismissModal } =
    useBotAlertContext()
  const [tab, setTab] = useState(TabEnum.DIRECT)

  function onDismiss() {
    setTab(TabEnum.DIRECT)
    handleDismissModal?.()
  }

  function onSuccess() {
    setTab(TabEnum.DIRECT)
    handleResetState?.()
  }

  return (
    <Modal
      mode={lg || isIphone ? 'center' : 'bottom'}
      isOpen={!!openingModal && !!botAlertState}
      title={
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <IconBox icon={<TelegramIcon size={24} variant="Bold" />} />
          <Trans>Connect Telegram</Trans>
        </Flex>
      }
      onDismiss={onDismiss}
      hasClose
      maxWidth="450px"
      zIndex={Z_INDEX.TOASTIFY}
    >
      <Tabs
        defaultActiveKey={tab}
        onChange={(tab) => setTab(tab as TabEnum)}
        sx={{
          width: '100%',
        }}
        headerSx={{ marginBottom: 0, gap: 0, width: '100%' }}
        tabItemSx={{
          pt: 0,
          py: 0,
          width: '50%',
        }}
      >
        <TabPane key={TabEnum.DIRECT} tab={<Trans>DIRECT MESSAGE</Trans>}>
          <LinkBotComponent botAlertState={botAlertState} stateExpiredTime={stateExpiredTime} onSuccess={onSuccess} />
        </TabPane>
        <TabPane key={TabEnum.GROUP} tab={<Trans>GROUP MESSAGE</Trans>}>
          <LinkGroupComponent
            alertType={currentAlert?.type}
            customAlertId={currentAlert?.customAlertId}
            onSuccess={onSuccess}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
})
export default LinkBotAlertModal

function LinkGroupComponent({
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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ chatId?: string; name?: string }>({
    defaultValues: { chatId: undefined, name: undefined },
  })

  const refetchQueries = useRefetchQueries()
  const { mutate: linkGroup, isLoading: submitting } = useMutation(linkGroupToBotAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This bot alert has been subscribed successfully</Trans>}
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
    const chatId = Number(values.chatId)
    if (chatId > 0) {
      setError('chatId', { type: 'validate', message: 'Group ID must be negative' })
      return
    }
    if (alertType) {
      clearErrors()
      linkGroup({ customAlertId, type: alertType, chatId: values.chatId, name: values.name })
    }
  }

  const botUsername = `@${TELEGRAM_BOT_ALERT}`

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex width="100%" px={[16, 24]} py={1} flexDirection="column" alignItems="center">
        <Flex width="100%" my={3} flexDirection="column" sx={{ gap: 3 }}>
          <Flex flex={1} flexDirection="column" sx={{ gap: 1 }}>
            <Type.Caption textAlign="left" color="neutral2">
              Add{' '}
              <CopyButton
                type="button"
                variant="ghost"
                value={botUsername}
                size="sm"
                sx={{ color: 'primary2', p: 0, display: 'inline-block' }}
                iconSize={14}
              >
                {botUsername}
              </CopyButton>{' '}
              to your group and past the chat ID below. The bot will automatically send the chat ID to the group.
            </Type.Caption>
            <Flex mt={1} width="100%" flexDirection="column" justifyContent="flex-start" sx={{ gap: 2 }}>
              <InputField
                block
                required
                label={<Trans>Group Chat ID</Trans>}
                placeholder={t`Input group chat ID`}
                error={errors?.chatId?.message}
                {...register('chatId', {
                  required: { value: true, message: 'This field is required' },
                  onChange: (e) => {
                    e.target.value = e.target.value.trim().replace(/\s/g, '').toLowerCase()
                  },
                })}
              />
              <InputField
                block
                required
                label={<Trans>Group Name</Trans>}
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

function LinkBotComponent({
  botAlertState,
  stateExpiredTime,
  onSuccess,
}: {
  botAlertState?: string
  stateExpiredTime?: number
  onSuccess?: () => void
}) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (botAlertState && stateExpiredTime && dayjs().utc().isAfter(dayjs.utc(stateExpiredTime))) {
        onSuccess?.()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [botAlertState, onSuccess, stateExpiredTime])

  return (
    <Flex width="100%" px={[16, 24]} py={1} flexDirection="column" alignItems="center">
      <Flex width="100%" my={3} flexDirection="column" sx={{ gap: 3 }}>
        <Flex flex={1} flexDirection="column" sx={{ gap: 1 }}>
          <Type.Caption textAlign="left" color="neutral2">
            To receive alerts as direct messages, click the button below to open Telegram. This session will be expired
            after {stateExpiredTime ? <Countdown endTime={stateExpiredTime} /> : '--'}.
          </Type.Caption>
          <Button
            mt={3}
            type="button"
            variant="primary"
            as="a"
            href={generateTelegramBotAlertUrl(botAlertState)}
            target="_blank"
            width="100%"
          >
            <Type.CaptionBold>
              <Trans>CONNECT</Trans>
            </Type.CaptionBold>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

function Countdown({ endTime }: { endTime: number }) {
  const timer = useCountdown(endTime)

  return (
    <Type.Caption color="orange1">
      {!timer?.hasEnded && (
        <>
          {timer?.minutes}m {timer?.seconds}s
        </>
      )}
    </Type.Caption>
  )
}
