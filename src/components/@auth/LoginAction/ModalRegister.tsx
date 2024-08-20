// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { CaretDown, CaretUp, Info } from '@phosphor-icons/react'
import React, { useLayoutEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { requestOtpApi, requestRegisterApi, verifyRegisterApi } from 'apis/authApis'
import { clearUnverifiedAccount, getUnverifiedAccount } from 'apis/helpers'
import Logo from 'assets/logo.svg'
import ToastBody from 'components/@ui/ToastBody'
import useParsedQueryString from 'hooks/router/useParsedQueryString'
import useUserReferralStore from 'hooks/store/useReferral'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { COUNTDOWN_TIME, EMAIL_REGEX, LINKS } from 'utils/config/constants'

import InputReferral from '../InputReferral'
import { RegisterForm } from './types'

const ModalRegister = ({
  isVerifyOTP = false,
  setIsVerifyOTP,
  onDismiss,
}: {
  isVerifyOTP?: boolean
  setIsVerifyOTP: (data: boolean) => void
  onDismiss: () => void
}) => {
  const parsedQS = useParsedQueryString()
  const hasUrlRef = Boolean(parsedQS.ref)

  const { userReferral } = useUserReferralStore()

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      email: getUnverifiedAccount(),
      referralCode: (userReferral ?? '').toUpperCase(),
    },
  })
  const [showReferralInput, setShowReferralInput] = useState(!!userReferral)
  const [submitting, setSubmitting] = useState(false)
  const [resendCountdown, setResendCountdown] = useState<number>(COUNTDOWN_TIME)
  const [startCountdown, setStartCountdown] = useState(true)
  const email = watch('email') ?? ''

  const onResendOTP = async () => {
    if (startCountdown) return
    try {
      await requestOtpApi({ email })
    } catch (error: any) {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    }
    setStartCountdown(true)
  }

  const requestRegister = useMutation(requestRegisterApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: () => {
      setIsVerifyOTP(true)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const verifyRegister = useMutation(verifyRegisterApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: async () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Register successful!</Trans>} />)
      clearUnverifiedAccount()
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
        verifyRegister.mutate({ email: data.email, password: data.password, otp: data.otp })
      }
    } else {
      if (data && data.email && data.password) {
        if (data.referralCode) {
          requestRegister.mutate({ email: data.email, password: data.password, referralCode: data.referralCode })
        } else {
          requestRegister.mutate({ email: data.email, password: data.password })
        }
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
          <Type.H3>{isVerifyOTP ? <Trans>Verify account</Trans> : <Trans>Create an account</Trans>}</Type.H3>
        </Flex>
      }
      maxWidth="450px"
      background="neutral6"
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

          <InputPasswordField
            required
            placeholder={t`Input password`}
            // placeholder={t`At least 8 characters (uppercase, lowercase, and number)`}
            label={<Trans>Password</Trans>}
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
          <Box mt={12} onClick={() => setShowReferralInput(!showReferralInput)} sx={{ cursor: 'pointer' }}>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
              <Type.Caption color={'neutral3'} mb={'10'} fontWeight={600}>
                <Trans>Referral Code (optional)</Trans>
              </Type.Caption>
              <IconButton
                variant="ghost"
                icon={showReferralInput ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
                sx={{ color: 'neutral3', width: 'max-content', height: 'max-content' }}
              />
            </Flex>
          </Box>
          {showReferralInput && (
            <InputReferral
              hasUrlRef={hasUrlRef}
              register={register}
              error={errors?.referralCode?.message}
              clearErrors={clearErrors}
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
            mt={[3, 24]}
            size="lg"
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting}
          >
            {submitting ? <Trans>Waiting...</Trans> : isVerifyOTP ? <Trans>Confirm</Trans> : <Trans>Register</Trans>}
          </Button>

          <Flex mt={2} alignItems="center" color="neutral3" sx={{ gap: 2 }}>
            <IconBox icon={<Info weight="fill" size={20} />} />
            <Type.Caption>
              <Trans>By continuing, you agree to our</Trans>
            </Type.Caption>
            <Button
              as={'a'}
              href={LINKS.termOfUse}
              target="_blank"
              type="button"
              variant="ghostPrimary"
              sx={{ mx: 0, px: 0, py: 1 }}
            >
              <Type.Caption color="primary2">
                <Trans>Term of Use</Trans>
              </Type.Caption>
            </Button>
          </Flex>
        </form>
      </Box>
    </Modal>
  )
}

export default ModalRegister
