// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { Sparkle } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { registerWaitlistApi } from 'apis/userApis'
import Divider from 'components/@ui/Divider'
import ToastBody from 'components/@ui/ToastBody'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { EMAIL_REGEX, LINKS } from 'utils/config/constants'
import { WaitlistTypeEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'

const ModalContactAI = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      email: '',
    },
  })
  const email = watch('email')

  const [submitting, setSubmitting] = useState(false)

  const registerWaitlist = useMutation(registerWaitlistApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: async () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Register successful!</Trans>} />)
      onDismiss()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onSubmit: SubmitHandler<{ email: string }> = (data) => {
    if (submitting) return
    registerWaitlist.mutate({ email: data.email, type: WaitlistTypeEnum.ANALYZE_WITH_AI })
  }

  useEffect(() => {
    if (!isOpen) reset({ email: '' })
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="450px"
      title={
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.H5>Analyze With AI</Type.H5>
          <Type.Caption color="orange1" sx={{ px: '6px', py: '2px', backgroundColor: 'neutral5', borderRadius: '4px' }}>
            <Trans>Coming soon</Trans>
          </Type.Caption>
        </Flex>
      }
      hasClose
      zIndex={Z_INDEX.TOASTIFY}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" pb={[3, 24]} px={[3, 24]}>
          <Flex sx={{ gap: 3, mb: 3, p: 12, backgroundColor: 'neutral6', borderRadius: '4px' }}>
            <Box>
              <Sparkle size={16} color={themeColors.neutral2} />
            </Box>
            <Type.Caption color="neutral2">
              <Trans>
                Enter your email to join the waitlist today for exclusive early access to AI-driven insights that will
                revolutionize the way you trade!
              </Trans>
            </Type.Caption>
          </Flex>

          <InputField
            placeholder={t`Your email`}
            block
            required
            {...register('email', {
              required: { value: true, message: 'This field is required' },
              pattern: {
                value: EMAIL_REGEX,
                message: t`Please enter a valid email address`,
              },
              onChange: (e) => {
                e.target.value = e.target.value.trim().replace(/\s/g, '').toLowerCase()
              },
            })}
            autoFocus
            fontSize="16px"
          />
          {errors?.email?.message && (
            <Type.Small mt={1} color="red1">
              {errors.email.message}
            </Type.Small>
          )}
          <Button
            mt={3}
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting || !email?.length}
          >
            {submitting ? <Trans>Waiting...</Trans> : <Trans>Get Early Access</Trans>}
          </Button>
          <Flex width="100%" mt={12} alignItems="center" sx={{ gap: 2 }}>
            <Divider flex={1} />
            <Type.Caption color="neutral3">
              <Trans>OR</Trans>
            </Type.Caption>
            <Divider flex={1} />
          </Flex>

          <Button
            sx={{ mt: 2 }}
            p={0}
            variant="ghostPrimary"
            as="a"
            href={LINKS.telegramAI}
            target="_blank"
            rel="noreferrer"
          >
            <Type.Caption textAlign="center">Join Telegram Community</Type.Caption>
          </Button>
        </Flex>
      </form>
    </Modal>
  )
}

export default ModalContactAI
