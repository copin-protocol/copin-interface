// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import React, { ReactNode } from 'react'
// eslint-disable-next-line no-restricted-imports
import { UseFormClearErrors, UseFormRegister } from 'react-hook-form/dist/types/form'

import InputField from 'theme/InputField'
import { REFERRAL_CODE_LENGTH } from 'utils/config/constants'

const InputReferral = ({
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
      placeholder={t`Enter referral code`}
      block
      error={error}
      {...register('referralCode', {
        minLength: {
          value: REFERRAL_CODE_LENGTH,
          message: t`The referral code has ${REFERRAL_CODE_LENGTH} characters.`,
        },
        maxLength: {
          value: REFERRAL_CODE_LENGTH,
          message: t`The referral code has ${REFERRAL_CODE_LENGTH} characters.`,
        },
        onChange: (event) => {
          event.target.value = event.target.value.trim().toUpperCase()
          if (!event.target.value || event.target.value === REFERRAL_CODE_LENGTH) clearErrors('referralCode')
        },
      })}
      maxLength={REFERRAL_CODE_LENGTH}
      sx={{ marginTop: 8, marginBottom: 10 }}
      disabled={hasUrlRef}
    />
  )
}

export default InputReferral
