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
import { HYPERLIQUID_BUILDER_CODE, HYPERLIQUID_BUILDER_MAX_FEES, LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'
import { addressShorten } from 'utils/helpers/format'
import { ARBITRUM_MAINNET } from 'utils/web3/chains'
import { signTypedData } from 'utils/web3/wallet'

import WalletHelpCEX from './WalletHelpCEX'
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
  const apiKey = watch('apiKey')

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
      reloadCopyWallets?.()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
      setSignatureData(undefined)
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
      hyperliquidSignature: signatureData,
    })
  }

  const handleAccept = async () => {
    if (!!signatureData) return setSignatureData(undefined)
    if (!walletAccount || !walletProvider) return
    if (walletAccount?.toLowerCase() !== apiKey?.toLowerCase()) {
      toast.error(
        <ToastBody
          title="Can not approve Hyperliquid Builder Fee"
          message={`The Hyperliquid Account Address does not match your web3 wallet account. Please switch account to [${addressShorten(
            apiKey
          )}] and try again`}
        />
      )
      return
    }
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
      maxFeeRate: HYPERLIQUID_BUILDER_MAX_FEES,
      builder: HYPERLIQUID_BUILDER_CODE,
      nonce: Date.now(),
    }
    try {
      const signature = await signTypedData(
        walletAccount,
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
      zIndex={Z_INDEX.TOASTIFY}
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

            <WalletHelpCEX exchange={CopyTradePlatformEnum.HYPERLIQUID} />

            <Box>
              <Checkbox checked={!!signatureData} onClick={handleAccept}>
                <Type.Caption>I agree to let Copin use the API to place orders.</Type.Caption>
              </Checkbox>
              <Type.Caption>
                <Box
                  as="a"
                  href={LINKS.termOfUse}
                  target="_blank"
                  color="primary1"
                  sx={{ textDecoration: 'underline', '&:hover': { color: 'primary2' } }}
                >
                  Terms of Service
                </Box>
                &nbsp;&&nbsp;
                <Box
                  sx={{ textDecoration: 'underline', '&:hover': { color: 'primary2' } }}
                  as="a"
                  href={LINKS.riskDisclaimer}
                  target="_blank"
                  color="primary1"
                >
                  Risk Disclaimer
                </Box>
              </Type.Caption>
            </Box>

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
