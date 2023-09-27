// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { Info } from '@phosphor-icons/react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import ToastBody from 'components/@ui/ToastBody'
import InputReferralCode from 'components/InputReferral'
import useReferralActions from 'hooks/features/useReferralActions'
import useMyProfile from 'hooks/store/useMyProfile'
import useUserReferral from 'hooks/store/useReferral'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'

const ConfirmReferralModal = ({ onDismiss }: { onDismiss: () => void }) => {
  const { userReferral, setUserReferral } = useUserReferral()
  const { myProfile } = useMyProfile()

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<{ referralCode: string }>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      referralCode: userReferral?.toUpperCase(),
    },
  })
  const referralCode = watch('referralCode')

  const onReset = () => {
    setUserReferral(null)
    onDismiss()
  }
  const onSuccess = () => {
    toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Add referral successful!</Trans>} />)
    onReset()
  }
  const { addReferral, skipReferral, submitting, skipping } = useReferralActions({ onSuccess })

  const onSubmit: SubmitHandler<{ referralCode: string }> = (data) => {
    if (submitting || skipping) return
    addReferral.mutate(data?.referralCode?.toUpperCase())
  }

  const onSkip = () => {
    if (submitting || skipping || !myProfile) return
    skipReferral.mutate()
    onReset()
  }

  return (
    <Modal isOpen title="Referral" onDismiss={onDismiss} dismissable={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={24} pb={24}>
          <InputReferralCode
            label={<Trans>Would you like to use a referral code?</Trans>}
            hasUrlRef={false}
            register={register}
            error={errors?.referralCode?.message}
            clearErrors={clearErrors}
          />

          <Alert
            mt={24}
            variant="card"
            message={
              <Flex width="100%" alignItems="center" sx={{ gap: 1 }}>
                <IconBox icon={<Info size={18} />} />
                <Type.CaptionBold>
                  <Trans>Notice</Trans>
                </Type.CaptionBold>
              </Flex>
            }
            description={<Trans>If you skip it this time, you will not be able to re-enter the referral code.</Trans>}
            sx={{ textAlign: 'left' }}
          />

          <Flex mt={[3, 24]} width="100%" sx={{ gap: 3 }}>
            <Button size="lg" variant="outline" type="button" onClick={onSkip} sx={{ flex: 1 }}>
              {skipping ? <Trans>Skipping...</Trans> : <Trans>No, thanks</Trans>}
            </Button>
            <Button
              sx={{ flex: 1 }}
              size="lg"
              variant="primary"
              type="submit"
              isLoading={submitting}
              disabled={Object.keys(errors).length > 0 || submitting || !referralCode}
            >
              {submitting ? <Trans>Confirming...</Trans> : <Trans>Use this code</Trans>}
            </Button>
          </Flex>
        </Box>
      </form>
    </Modal>
  )
}

export default ConfirmReferralModal
