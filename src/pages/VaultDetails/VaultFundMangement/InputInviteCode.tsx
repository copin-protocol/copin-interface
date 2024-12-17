// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import React, { ReactNode } from 'react'
// eslint-disable-next-line no-restricted-imports
import { UseFormClearErrors, UseFormRegister } from 'react-hook-form/dist/types/form'

import InputField from 'theme/InputField'

const INVITE_CODE_LENGTH = 9
const InputInviteCode = ({
  label,
  hasUrlRef,
  register,
  error,
  clearErrors,
}: {
  label?: ReactNode
  hasUrlRef: boolean
  register: UseFormRegister<any>
  error?: string
  clearErrors: UseFormClearErrors<any>
}) => {
  return (
    <InputField
      label={label}
      placeholder={t`Enter invite code`}
      block
      error={error}
      {...register('inviteCode', {
        minLength: {
          value: INVITE_CODE_LENGTH,
          message: t`The invite code has ${INVITE_CODE_LENGTH} characters.`,
        },
        maxLength: {
          value: INVITE_CODE_LENGTH,
          message: t`The invite code has ${INVITE_CODE_LENGTH} characters.`,
        },
        onChange: (event) => {
          event.target.value = event.target.value.trim().toUpperCase()
          if (!event.target.value || event.target.value === INVITE_CODE_LENGTH) clearErrors('inviteCode')
        },
      })}
      maxLength={INVITE_CODE_LENGTH}
      sx={{ marginTop: 8, marginBottom: 10 }}
      disabled={hasUrlRef}
    />
  )
}

export default InputInviteCode
