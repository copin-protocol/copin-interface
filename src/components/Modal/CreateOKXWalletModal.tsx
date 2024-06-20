import { yupResolver } from '@hookform/resolvers/yup'
// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { requestCopyWalletApi } from 'apis/copyWalletApis'
import Divider from 'components/@ui/Divider'
import OKXHelp from 'components/@ui/OKXHelp'
import ToastBody from 'components/@ui/ToastBody'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Button } from 'theme/Buttons'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import { OKXWalletFormValues, defaultFormValues, okxWalletFormSchema } from './okxSchema'

export default function CreateOKXWalletModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OKXWalletFormValues>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: defaultFormValues,
    resolver: yupResolver(okxWalletFormSchema),
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

  const onSubmit: SubmitHandler<OKXWalletFormValues> = (data) => {
    if (submitting) return
    createWallet.mutate({
      exchange: CopyTradePlatformEnum.OKX,
      name: !!data.name ? data.name?.trim() : undefined,
      okx: {
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
      title={'Create Your OKX Wallet'}
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
            placeholder={t`Your OKX API Key`}
            label={<Trans>OKX API Key</Trans>}
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
            placeholder={t`Your OKX Secret Key`}
            label={<Trans>OKX Secret Key</Trans>}
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
            required
            placeholder={t`Your OKX Pass Phrase`}
            label={<Trans>OKX Pass Phrase</Trans>}
            block
            error={errors?.passPhrase?.message}
            {...register('passPhrase', {
              required: { value: true, message: 'This field is required' },
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

          <OKXHelp hasBorder />

          <Button
            size="xl"
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting}
          >
            {submitting ? <Trans>Creating...</Trans> : <Trans>Create OKX Wallet</Trans>}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
