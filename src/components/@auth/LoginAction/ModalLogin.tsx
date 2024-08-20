// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { Info } from '@phosphor-icons/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { requestLoginApi, requestOtpApi } from 'apis/authApis'
import { storeAuth, storeUnverifiedAccount } from 'apis/helpers'
import Logo from 'assets/logo.svg'
import Divider from 'components/@ui/Divider'
import ToastBody from 'components/@ui/ToastBody'
import { VerifyLoginResponse } from 'entities/auth.d'
import { useAuthContext } from 'hooks/web3/useAuth'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

import ConnectButton from './ConnectButton'
import { LoginForm } from './types'

const ModalLogin = ({
  setIsVerifyOTP,
  switchRegisterModal,
  switchResetModal,
  onDismiss,
}: {
  setIsVerifyOTP: (data: boolean) => void
  switchRegisterModal: () => void
  switchResetModal: () => void
  onDismiss: () => void
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      username: undefined,
      password: undefined,
    },
  })
  const { eagerAuth } = useAuthContext()
  const [submitting, setSubmitting] = useState(false)
  const username = watch('username')
  const verifyLogin = useMutation(requestLoginApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: async (data: VerifyLoginResponse) => {
      if (data.isActivated) {
        storeAuth({
          jwt: data.access_token,
          account: data.username,
        })
        // toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Login successful!</Trans>} />)
        if (eagerAuth) {
          await eagerAuth()
        }
        onDismiss()
      } else {
        toast.error(
          <ToastBody
            title={<Trans>Unverified User</Trans>}
            message={<Trans>Please check the verification code from your email!</Trans>}
          />
        )
        storeUnverifiedAccount(username)
        switchRegisterModal()
        setIsVerifyOTP(true)
        await requestOtpApi({ email: username })
      }
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    if (submitting) return
    verifyLogin.mutate({ username: data.username, password: data.password })
  }

  return (
    <Modal
      isOpen
      onDismiss={onDismiss}
      title={
        <Flex mt={2} width="100%" justifyContent="center" sx={{ gap: 3 }}>
          <Image src={Logo} alt="gmx-copy-trade" />
          <Type.H3>
            <Trans>Login to Copin</Trans>
          </Type.H3>
        </Flex>
      }
      maxWidth="450px"
      background="neutral6"
      hasClose
    >
      <Box variant="card" pb={[3, 4]} px={[3, 4]} sx={{ backgroundColor: 'neutral6' }}>
        <ConnectButton size="lg" my={3} onConnect={() => onDismiss()} />

        <Flex width="100%" mt={3} alignItems="center" sx={{ gap: 3 }}>
          <Flex flex={1}>
            <Divider color="neutral3" width="100%" height={1} />
          </Flex>
          <Type.CaptionBold width="max-content">
            <Trans>OR LOGIN WITH</Trans>
          </Type.CaptionBold>
          <Flex flex={1}>
            <Divider color="neutral3" width="100%" height={1} />
          </Flex>
        </Flex>

        <Alert
          my={3}
          variant="cardWarning"
          description={
            <Type.Caption textAlign="left">
              <Trans>We only support login by email within the next 30 days (Deadline: November 30, 2023)</Trans>
              <a href={LINKS.notice} target="_blank" style={{ paddingLeft: '4px' }} rel="noreferrer">
                <Trans>Read more</Trans>
              </a>
            </Type.Caption>
          }
        />
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <InputField
            label={<Trans>Email</Trans>}
            placeholder={t`Input email address`}
            block
            required
            error={errors?.username?.message}
            {...register('username', {
              required: { value: true, message: 'This field is required' },
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
            label={<Trans>Password</Trans>}
            block
            error={errors?.password?.message}
            {...register('password', { required: { value: true, message: 'This field is required' } })}
            autoComplete="current-password"
            sx={{ mt: 12, fontSize: '16px' }}
          />

          <Flex my={2} alignItems="center" justifyContent="space-between">
            {/*<ControlledCheckbox*/}
            {/*  label={*/}
            {/*    <Type.BodyBold>*/}
            {/*      <Trans>Remember me</Trans>*/}
            {/*    </Type.BodyBold>*/}
            {/*  }*/}
            {/*  size={24}*/}
            {/*  {...register('remember')}*/}
            {/*/>*/}
            <Box />
            <Button
              type="button"
              variant="ghostPrimary"
              sx={{ color: 'primary2', mx: 0, px: 0, py: 1 }}
              onClick={switchResetModal}
            >
              <Type.Caption>
                <Trans>Forgot password?</Trans>
              </Type.Caption>
            </Button>
          </Flex>

          <Button
            size="lg"
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting}
          >
            {submitting ? <Trans>Waiting...</Trans> : <Trans>Login</Trans>}
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

export default ModalLogin
