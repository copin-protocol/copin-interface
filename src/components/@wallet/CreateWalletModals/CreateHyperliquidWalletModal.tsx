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
import useInternalRole from 'hooks/features/useInternalRole'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import InputField, { InputPasswordField } from 'theme/InputField'
import Modal from 'theme/Modal'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { ARBITRUM_MAINNET } from 'utils/web3/chains'
import { signTypedData } from 'utils/web3/wallet'

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
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HyperliquidWalletFormValues>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: defaultFormValues,
    resolver: yupResolver(hyperliquidWalletFormSchema),
  })
  const enableVault = watch('enableVault')

  const isInternal = useInternalRole()
  const { reloadCopyWallets } = useCopyWalletContext()
  const { isValid, alert } = useRequiredChain({ chainId: ARBITRUM_MAINNET })
  const { walletProvider, walletAccount } = useWeb3()
  const [submitting, setSubmitting] = useState(false)
  const [signatureData, setSignatureData] = useState<{ signature: string; nonce: number }>()

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
        passPhrase: !data.enableVault && !data.passPhrase ? undefined : data.passPhrase,
      },
      hyperliquidSignature: !data.enableVault && !data.passPhrase ? signatureData : undefined,
    })
  }

  const handleAccept = async () => {
    if (!!signatureData) return setSignatureData(undefined)
    if (!walletAccount || !walletProvider) return
    const domain = {
      name: 'HyperliquidSignTransaction',
      version: '1',
      chainId: ARBITRUM_MAINNET,
      verifyingContract: '0x0000000000000000000000000000000000000000',
    }
    const types = {
      'HyperliquidTransaction:ApproveBuilderFee': [
        { name: 'hyperliquidChain', type: 'string' },
        { name: 'maxFeeRate', type: 'string' },
        { name: 'builder', type: 'address' },
        { name: 'nonce', type: 'uint64' },
      ],
    }

    const value = {
      hyperliquidChain: 'Mainnet',
      maxFeeRate: '0.025%',
      builder: '0x055ba87dbff972e23bcf26ea4728c31e05240e66',
      nonce: Date.now(),
    }
    try {
      const signature = await signTypedData(
        walletAccount?.address,
        {
          domain,
          types,
          value,
        },
        walletProvider
      )

      setSignatureData({
        signature,
        nonce: value.nonce,
      })
    } catch (err) {
      toast.error(<ToastBody title={<Trans>Sign Message Error</Trans>} message={err.message} />)
    }
    // const signature = await wallet2._signTypedData(domain, types, builderFee)
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
        {isValid ? (
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

            {isInternal && (
              <Box>
                <SwitchInputField
                  switchLabel="Enable Vault"
                  // labelColor="orange1"
                  {...register('enableVault')}
                  error={errors.enableVault?.message}
                />
                <Box mt={2} sx={{ display: enableVault ? 'block' : 'none' }}>
                  <InputPasswordField
                    required={enableVault}
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
                </Box>
              </Box>
            )}

            <InputField
              block
              label={<Trans>Wallet Name</Trans>}
              placeholder={t`Input wallet name`}
              {...register('name')}
              error={errors.name?.message}
            />

            <Divider />

            <HyperliquidHelp />

            {!enableVault && (
              <Checkbox checked={!!signatureData} onClick={handleAccept}>
                <Type.Caption>I agree to let Copin use the API to place orders</Type.Caption>
              </Checkbox>
            )}

            <Button
              size="xl"
              variant="primary"
              type="submit"
              isLoading={submitting}
              disabled={Object.keys(errors).length > 0 || submitting || (!enableVault && !signatureData)}
            >
              {submitting ? <Trans>Connecting...</Trans> : <Trans>Connect API</Trans>}
            </Button>
          </form>
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}
