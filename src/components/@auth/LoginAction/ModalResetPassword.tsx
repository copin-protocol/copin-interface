// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import React, { useLayoutEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { requestForgotPasswordApi, verifyForgotPasswordApi } from 'apis/authApis'
import Logo from 'assets/logo.svg'
import ToastBody from 'components/@ui/ToastBody'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, Image, Type } from 'theme/base'
import { COUNTDOWN_TIME, EMAIL_REGEX } from 'utils/config/constants'

import { RegisterForm } from './types'

const ModalResetPassword = ({ onDismiss }: { onDismiss: () => void }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: 'onChange',
    shouldFocusError: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [isVerifyOTP, setIsVerifyOTP] = useState(false)
  const [resendCountdown, setResendCountdown] = useState<number>(COUNTDOWN_TIME)
  const [startCountdown, setStartCountdown] = useState(true)
  const email = watch('email') ?? ''

  const onResendOTP = async () => {
    if (startCountdown) return
    try {
      await requestForgotPasswordApi({ email })
    } catch (error: any) {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    }
    setStartCountdown(true)
  }

  const requestResetPassword = useMutation(requestForgotPasswordApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: () => {
      setIsVerifyOTP(true)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const verifyResetPassword = useMutation(verifyForgotPasswordApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: async () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Reset password successful!</Trans>} />)
      setIsVerifyOTP(false)
      onDismiss()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onSubmit: SubmitHandler<RegisterForm> = (data) => {
    if (submitting) return
    if (isVerifyOTP) {
      if (data && data.email && data.password && data.otp) {
        verifyResetPassword.mutate({ email: data.email, password: data.password, otp: data.otp })
      }
    } else {
      if (data && data.email) {
        requestResetPassword.mutate({ email: data.email })
      }
    }
  }

  useLayoutEffect(() => {
    let isCancelled = false
    let countdownTimeout: ReturnType<typeof setTimeout>

    if (resendCountdown === 0 && !isCancelled) {
      setStartCountdown(false)
      setResendCountdown(COUNTDOWN_TIME)
    }
    if (startCountdown && !isCancelled) {
      countdownTimeout = setTimeout(() => setResendCountdown((countdown) => countdown - 1), 1000)
    }

    return () => {
      isCancelled = true
      clearTimeout(countdownTimeout)
    }
  }, [startCountdown, resendCountdown])

  return (
    <Modal
      isOpen
      onDismiss={onDismiss}
      title={
        <Flex mt={2} width="100%" justifyContent="center" sx={{ gap: 3 }}>
          <Image src={Logo} alt="gmx-copy-trade" />
          <Type.H3>
            <Trans>Reset password</Trans>
          </Type.H3>
        </Flex>
      }
      maxWidth="450px"
      hasClose
    >
      <Box variant="card" pb={[3, 4]} px={[3, 4]} sx={{ backgroundColor: 'neutral6' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <InputField
            label={<Trans>Email</Trans>}
            placeholder={t`Input email`}
            block
            required
            error={errors?.email?.message}
            {...register('email', {
              required: { value: true, message: 'This field is required' },
              pattern: {
                value: EMAIL_REGEX,
                message: t`Please use a valid email address.`,
              },
              onChange: (e) => {
                e.target.value = e.target.value.trim().replace(/\s/g, '').toLowerCase()
              },
            })}
            maxLength={50}
            autoFocus
            fontSize="16px"
          />

          {isVerifyOTP && (
            <InputPasswordField
              required
              placeholder={t`Input new password`}
              label={<Trans>New Password</Trans>}
              block
              error={errors?.password?.message}
              {...register('password', {
                required: { value: true, message: 'This field is required' },
                // pattern: {
                //   value: PASSWORD_REGEX,
                //   message: t`Password must contain at least 8 characters (uppercase, lowercase and number)`,
                // },
              })}
              autoComplete="current-password"
              sx={{ mt: 12, fontSize: '16px' }}
            />
          )}

          {isVerifyOTP && (
            <InputField
              required
              block
              {...register('otp', {
                required: { value: true, message: 'This field is required' },
              })}
              label="Confirm Code"
              error={errors?.otp?.message}
              sx={{ mt: 12, fontSize: '16px' }}
              suffix={
                <Type.CaptionBold
                  sx={{
                    cursor: `${startCountdown ? 'not-allowed' : 'pointer'}`,
                    userSelect: `${startCountdown ? 'none' : 'auto'}`,
                  }}
                  color={startCountdown ? 'neutral3' : 'primary1'}
                  onClick={onResendOTP}
                >
                  {startCountdown ? <Trans>Resend after {resendCountdown}s</Trans> : <Trans>Resend</Trans>}
                </Type.CaptionBold>
              }
            />
          )}

          {isVerifyOTP && (
            <Alert
              mt={24}
              variant="warning"
              description={
                <Trans>
                  A message with a verification code has been sent to your email. Enter the code to continue.
                </Trans>
              }
            />
          )}

          <Button
            mt={[3, 4]}
            size="lg"
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting}
          >
            {submitting ? <Trans>Waiting...</Trans> : isVerifyOTP ? <Trans>Confirm</Trans> : <Trans>Request</Trans>}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}

export default ModalResetPassword
