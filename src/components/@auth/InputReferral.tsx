// eslint-disable-next-line no-restricted-imports
import { ReactNode } from 'react'
// eslint-disable-next-line no-restricted-imports
import { UseFormRegister } from 'react-hook-form/dist/types/form'

import InputField from 'theme/InputField'
import { MAX_REFERRAL_CODE_LENGTH, MIN_REFERRAL_CODE_LENGTH } from 'utils/config/constants'

const InputReferral = ({
  label,
  value,
  placeholder,
  disabled,
  register,
  error,
  sx = {},
}: // clearErrors,
{
  value: string
  register: UseFormRegister<any>
  label?: ReactNode
  placeholder?: string
  disabled?: boolean
  error?: string
  sx?: any
}) => {
  return (
    <InputField
      label={label}
      placeholder={placeholder}
      block
      error={error}
      warning={
        value?.match(/^[a-zA-Z0-9]{1,5}$/)
          ? `The referral code need to be ${MIN_REFERRAL_CODE_LENGTH} - ${MAX_REFERRAL_CODE_LENGTH} character (letters and numbers)`
          : undefined
      }
      {...register('referralCode', {
        pattern: {
          value: /^[a-zA-Z0-9]{6,20}$/,
          message: `The referral code need to be ${MIN_REFERRAL_CODE_LENGTH} - ${MAX_REFERRAL_CODE_LENGTH} character (letters and numbers)`,
        },
        onChange: (event) => {
          event.target.value = event.target.value.trim().toUpperCase()
        },
      })}
      maxLength={MAX_REFERRAL_CODE_LENGTH}
      sx={sx}
      disabled={disabled}
    />
  )
}

export default InputReferral
