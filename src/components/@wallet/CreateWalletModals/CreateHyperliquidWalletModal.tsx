import { yupResolver } from '@hookform/resolvers/yup'
// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { requestCopyWalletApi } from 'apis/copyWalletApis'
import Divider from 'components/@ui/Divider'
import ToastBody from 'components/@ui/ToastBody'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Button } from 'theme/Buttons'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import HyperliquidHelp from './WalletHelpHyperliquid'
import { HyperliquidWalletFormValues, defaultFormValues, hyperliquidWalletFormSchema } from './hyperliquidSchema'

export default function CreateHyperliquidWalletModal({
  isOpen,
  onDismiss,
}: {
  isOpen: boolean
  onDismiss: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HyperliquidWalletFormValues>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: defaultFormValues,
    resolver: yupResolver(hyperliquidWalletFormSchema),
  })

  const { reloadCopyWallets } = useCopyWalletContext()
  const [submitting, setSubmitting] = useState(false)

  const createWallet = useMutation(requestCopyWalletApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Create wallet successful!</Trans>} />)
      onDismiss()
      reloadCopyWallets()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onSubmit: SubmitHandler<HyperliquidWalletFormValues> = (data) => {
    if (submitting) return
    createWallet.mutate({
      exchange: CopyTradePlatformEnum.HYPERLIQUID,
      name: !!data.name ? data.name?.trim() : undefined,
      hyperliquid: {
        apiKey: data.apiKey,
        secretKey: data.secretKey,
        passPhrase: data.passPhrase,
      },
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      hasClose
      title={'Connect Your Hyperliquid API'}
      onDismiss={onDismiss}
      width="90vw"
      maxWidth="450px"
    >
      <Box variant="card" sx={{ backgroundColor: 'modalBG' }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <InputPasswordField
            required
            placeholder={t`Your Hyperliquid Account Address`}
            label={<Trans>Hyperliquid Account Address</Trans>}
            block
            error={errors?.apiKey?.message}
            {...register('apiKey', {
              required: { value: true, message: 'This field is required' },
              onChange: (e) => {
                e.target.value = e.target.value.trim().replace(/\s/g, '')
              },
            })}
            allowShowPassword
          />

          <InputPasswordField
            required
            placeholder={t`Your Hyperliquid API Wallet Private Key`}
            label={<Trans>Hyperliquid API Wallet Private Key</Trans>}
            block
            error={errors?.secretKey?.message}
            {...register('secretKey', {
              required: { value: true, message: 'This field is required' },
              onChange: (e) => {
                e.target.value = e.target.value.trim().replace(/\s/g, '')
              },
            })}
          />

          <InputPasswordField
            placeholder={t`Your Hyperliquid Vault Address`}
            label={<Trans>Hyperliquid Vault Address</Trans>}
            block
            error={errors?.passPhrase?.message}
            {...register('passPhrase', {
              onChange: (e) => {
                e.target.value = e.target.value.trim().replace(/\s/g, '')
              },
            })}
          />

          <InputField
            block
            label={<Trans>Wallet Name</Trans>}
            placeholder={t`Input wallet name`}
            {...register('name')}
            error={errors.name?.message}
          />

          <Divider />

          <HyperliquidHelp />

          <Button
            size="xl"
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting}
          >
            {submitting ? <Trans>Connecting...</Trans> : <Trans>Connect API</Trans>}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
