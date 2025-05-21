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
import { RequestCopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { Button } from 'theme/Buttons'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { EXCHANGES_INFO } from 'utils/config/platforms'
import { Z_INDEX } from 'utils/config/zIndex'

import WalletHelpCEX from './WalletHelpCEX'
import { ApiWalletFormValues, PASS_PHRASE_EXCHANGES, apiWalletFormSchema, defaultFormValues } from './cexSchema'

export default function CreateCEXWalletModal({
  exchange,
  isOpen,
  onDismiss,
}: {
  exchange: CopyTradePlatformEnum
  isOpen: boolean
  onDismiss: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApiWalletFormValues>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: { ...defaultFormValues, exchange },
    resolver: yupResolver(apiWalletFormSchema),
  })

  const { reloadCopyWallets } = useCopyWalletContext()
  const [submitting, setSubmitting] = useState(false)
  const hasPassPhrase = PASS_PHRASE_EXCHANGES.includes(exchange)
  const exchangeInfo = EXCHANGES_INFO[exchange]
  const refetchQueries = useRefetchQueries()

  const createWallet = useMutation(requestCopyWalletApi, {
    onMutate: () => setSubmitting(true),
    onSettled: () => setSubmitting(false),
    onSuccess: () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Create wallet successful!</Trans>} />)
      onDismiss()
      refetchQueries([QUERY_KEYS.GET_USER_SUBSCRIPTION_USAGE])
      reloadCopyWallets?.()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const onSubmit: SubmitHandler<ApiWalletFormValues> = (data) => {
    if (submitting) return
    const requestData: RequestCopyWalletData = {
      exchange,
      name: !!data.name ? data.name?.trim() : undefined,
      [exchangeInfo.key]: {
        apiKey: data.apiKey,
        secretKey: data.secretKey,
        passPhrase: hasPassPhrase ? data.passPhrase : undefined,
      },
    }
    if (exchange === CopyTradePlatformEnum.APEX) {
      requestData.apexSignature = { omniSeed: data.omniSeed! }
    }
    createWallet.mutate(requestData)
  }

  return (
    <Modal
      isOpen={isOpen}
      hasClose
      title={`Connect Your ${exchangeInfo.name} API`}
      onDismiss={onDismiss}
      width="90vw"
      maxWidth="450px"
      zIndex={Z_INDEX.TOASTIFY}
    >
      <Box variant="card" sx={{ backgroundColor: 'modalBG' }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <InputPasswordField
            required
            placeholder={t`Your ${exchangeInfo.name} API Key`}
            label={<Trans>{exchangeInfo.name} API Key</Trans>}
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
            placeholder={t`Your ${exchangeInfo.name} Secret Key`}
            label={<Trans>{exchangeInfo.name} Secret Key</Trans>}
            block
            error={errors?.secretKey?.message}
            {...register('secretKey', {
              required: { value: true, message: 'This field is required' },
              onChange: (e) => {
                e.target.value = e.target.value.trim().replace(/\s/g, '')
              },
            })}
          />

          {hasPassPhrase && (
            <InputPasswordField
              required
              placeholder={t`Your ${exchangeInfo.name} Pass Phrase`}
              label={<Trans>{exchangeInfo.name} Pass Phrase</Trans>}
              block
              error={errors?.passPhrase?.message}
              {...register('passPhrase', {
                required: { value: true, message: 'This field is required' },
                onChange: (e) => {
                  e.target.value = e.target.value.trim().replace(/\s/g, '')
                },
              })}
            />
          )}
          {exchange === CopyTradePlatformEnum.APEX && (
            <InputPasswordField
              required
              placeholder={t`Your Omni Key Seed`}
              label={<Trans>Omni Key Seed</Trans>}
              block
              error={errors?.omniSeed?.message}
              {...register('omniSeed', {
                required: { value: true, message: 'This field is required' },
                onChange: (e) => {
                  e.target.value = e.target.value.trim().replace(/\s/g, '')
                },
              })}
            />
          )}

          <InputField
            block
            label={<Trans>Wallet Name</Trans>}
            placeholder={t`Input wallet name`}
            {...register('name')}
            error={errors.name?.message}
          />

          <Divider />

          <WalletHelpCEX exchange={exchange} />

          <Button
            size="xl"
            variant="primary"
            type="submit"
            isLoading={submitting}
            disabled={Object.keys(errors).length > 0 || submitting}
          >
            {submitting ? <Trans>Connecting...</Trans> : <Trans>Connect</Trans>}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
