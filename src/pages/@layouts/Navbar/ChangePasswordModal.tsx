// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { changePasswordApi } from 'apis/userApis'
import ToastBody from 'components/@ui/ToastBody'
import { Button } from 'theme/Buttons'
import { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box } from 'theme/base'

export interface ChangePasswordForm {
  oldPassword: string
  password: string
}

export default function ChangePasswordModal({ onDismiss }: { onDismiss: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    mode: 'onChange',
    shouldFocusError: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const changePassword = useMutation(changePasswordApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Change password successful!</Trans>} />)
      onDismiss()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onSubmit: SubmitHandler<ChangePasswordForm> = (data) => {
    if (submitting) return
    changePassword.mutate({ oldPassword: data.oldPassword, password: data.password })
  }
  return (
    <Modal isOpen hasClose title={'Change Password'} onDismiss={onDismiss} width="90vw" maxWidth="450px">
      <Box variant="card" sx={{ backgroundColor: 'modalBG' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <InputPasswordField
            required
            placeholder={t`Input current password`}
            label={<Trans>Current Password</Trans>}
            block
            error={errors?.oldPassword?.message}
            {...register('oldPassword', {
              required: { value: true, message: 'This field is required' },
            })}
          />

          <InputPasswordField
            required
            placeholder={t`Input new password`}
            label={<Trans>New Password</Trans>}
            block
            error={errors?.password?.message}
            {...register('password', {
              required: { value: true, message: 'This field is required' },
            })}
            sx={{ mt: 3 }}
          />

          <Button size="xl" mt={24} variant="primary" type="submit" isLoading={submitting}>
            {submitting ? <Trans>Confirming...</Trans> : <Trans>Confirm</Trans>}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
