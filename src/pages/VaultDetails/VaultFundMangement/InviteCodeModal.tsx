import { Trans } from '@lingui/macro'
import { SubmitHandler, useForm } from 'react-hook-form'

import useVaultInviteActions from 'pages/VaultDetails/useVaultInviteActions'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'

import InputInviteCode from './InputInviteCode'

const InviteCodeModal = ({
  submitting,
  onDismiss,
  onDeposit,
}: {
  submitting?: boolean
  onDismiss: () => void
  onDeposit?: () => void
}) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<{ inviteCode: string }>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      inviteCode: '',
    },
  })
  const inviteCode = watch('inviteCode')

  const onSuccess = () => {
    onDismiss()
    onDeposit?.()
  }
  const { addInvite } = useVaultInviteActions({ onSuccess })

  const onSubmit: SubmitHandler<{ inviteCode: string }> = (data) => {
    addInvite(data.inviteCode)
  }

  return (
    <Modal isOpen title="Vaults Invite Code" onDismiss={onDismiss} dismissable={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={24}>
          <InputInviteCode
            label={<Trans>Enter Code</Trans>}
            hasUrlRef={false}
            register={register}
            error={errors?.inviteCode?.message}
            clearErrors={clearErrors}
          />

          <Type.Caption mt={2} color="neutral3">
            <Trans>Invite Code at least 6-character long with only uppercase letters and numbers.</Trans>
          </Type.Caption>

          <Flex mt={[3, 24]} mb={24} width="100%" sx={{ gap: 3 }}>
            <Button size="lg" variant="outline" type="button" onClick={onDismiss} sx={{ flex: 1 }}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              sx={{ flex: 1 }}
              size="lg"
              variant="primary"
              type="submit"
              isLoading={submitting}
              disabled={Object.keys(errors).length > 0 || !inviteCode || submitting}
            >
              <Trans>Enter Vaults</Trans>
            </Button>
          </Flex>
        </Box>
      </form>
    </Modal>
  )
}

export default InviteCodeModal
