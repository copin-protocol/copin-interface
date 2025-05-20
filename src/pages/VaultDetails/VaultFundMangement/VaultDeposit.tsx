import { defaultAbiCoder } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ShieldCheck } from '@phosphor-icons/react'
import React, { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import ERC20_ABI from 'abis/ERC20.json'
import ConnectWalletAction from 'components/@wallet/ConnectWalletAction'
import { getDurationFromSeconds } from 'hooks/helpers/useCountdown'
import useVaultInviteCode from 'hooks/store/useVaultInviteCode'
import { useAuthContext } from 'hooks/web3/useAuth'
import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useERC20Approval from 'hooks/web3/useTokenApproval'
import useWeb3 from 'hooks/web3/useWeb3'
import VaultFees from 'pages/VaultDetails/VaultInfo/VaultFees'
import useVaultDetailsContext from 'pages/VaultDetails/useVaultDetailsProvider'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { USD_ASSET } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'

import InviteCodeModal from './InviteCodeModal'

const VaultDeposit = ({
  smartWallet,
  platform,
  onSuccess,
}: {
  smartWallet: string
  platform: CopyTradePlatformEnum
  onSuccess: () => void
}) => {
  const chainId = getCopyTradePlatformChain(platform)
  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const amount = useWatch({
    control,
    name: 'amount',
  })
  const { walletAccount, publicProvider } = useWeb3({ chainId })
  const { isValid, alert } = useRequiredChain({
    chainId,
  })
  const { isAuthenticated, account, profile } = useAuthContext()
  const { vaultInviteCode, currentInviteCode } = useVaultInviteCode()

  const { vault, vaultUserDetails } = useVaultDetailsContext()

  const usdAsset = USD_ASSET[chainId]

  const [openInviteModal, setOpenInviteModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { isTokenAllowanceEnough, approving, approveToken } = useERC20Approval({
    token: usdAsset.address,
    account: walletAccount,
    spender: smartWallet,
  })

  const smartWalletContract = useContract({
    contract: {
      address: smartWallet,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.COPIN_VAULT_DETAILS],
    },
    withSignerIfPossible: true,
  })
  const smartWalletMutation = useContractMutation(smartWalletContract)

  const enoughAllowance = isTokenAllowanceEnough(amount > 1_000_000_000 ? 1_000_000_000 : amount)

  const usdAssetContract = useMemo(() => new Contract(usdAsset.address, ERC20_ABI, publicProvider), [publicProvider])

  const { data: usdAssetBalance, refetch: refetchUSDBalance } = useContractQuery<number>(
    usdAssetContract,
    'balanceOf',
    [walletAccount],
    {
      enabled: !!walletAccount,
      select(data) {
        return Number(formatUnits(data, usdAsset.decimals))
      },
      refetchInterval: 30 * 1000,
    }
  )

  const disabled = !usdAssetBalance || !enoughAllowance || submitting || !!errors.amount

  const onSubmit = async () => {
    const isInvited = !!profile?.username ? vaultInviteCode?.[profile.username] === currentInviteCode : false
    if (isInvited) {
      onDeposit()
    } else {
      setOpenInviteModal(true)
    }
  }

  const onDeposit = async () => {
    if (disabled || !amount) return
    setSubmitting(true)
    const input = defaultAbiCoder.encode(['int256'], [parseUnits(amount.toString(), usdAsset.decimals)])
    smartWalletMutation.mutate(
      {
        method: 'deposit',
        params: [input],
      },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
          refetchUSDBalance()
          setSubmitting(false)
          onSuccess()
        },
        onError: () => {
          setSubmitting(false)
        },
      }
    )
  }

  const minDeposit = vault?.vaultConfigs?.minDeposit ?? 1
  const maxDeposit = vault?.vaultConfigs?.maxDeposit ?? 100000
  const currentDeposit = vaultUserDetails?.userBalanceUsd ?? 0
  const remainingMaxDeposit = Math.max(maxDeposit - currentDeposit, 0)

  return (
    <div>
      {!isAuthenticated || !account ? (
        <ConnectWalletAction />
      ) : isValid ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <Type.CaptionBold color="neutral2" mr={1}>
              <Trans>Max Deposit</Trans>
            </Type.CaptionBold>
            <Type.CaptionBold>${formatNumber(remainingMaxDeposit, 2, 2)}</Type.CaptionBold>
          </Flex>

          <NumberInputField
            error={errors.amount?.message}
            label={<Trans>Amount</Trans>}
            annotation={`Bal: ${formatNumber(usdAssetBalance, 2, 2)} ${usdAsset.symbol}`}
            control={control}
            suffix={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Button
                  type="button"
                  variant="ghostPrimary"
                  py={2}
                  onClick={() => {
                    setValue('amount', Math.min(usdAssetBalance ?? 0, remainingMaxDeposit))
                    trigger()
                  }}
                  disabled={submitting}
                >
                  Max
                </Button>
                <Type.Caption>{usdAsset.symbol}</Type.Caption>
              </Flex>
            }
            required
            {...register('amount', {
              required: {
                value: true,
                message: 'Please enter the amount',
              },
              min: {
                value: minDeposit,
                message: `Minimum deposit amount is ${formatNumber(minDeposit, 0)} ${usdAsset.symbol}`,
              },
              ...(usdAssetBalance
                ? {
                    max: {
                      value: Math.min(usdAssetBalance, remainingMaxDeposit),
                      message:
                        usdAssetBalance > remainingMaxDeposit
                          ? `The maximum balance is ${formatNumber(remainingMaxDeposit, 2)} ${usdAsset.symbol}`
                          : 'Insufficient funds',
                    },
                  }
                : {}),
            })}
            name="amount"
            block
          />

          <VaultFees />

          {!!vault?.lockDepositDuration && (
            <Type.Caption mt={1} color="orange1">
              *Your deposit will be locked for {<DepositLockDuration durationInSeconds={vault.lockDepositDuration} />}
            </Type.Caption>
          )}

          <Box mt={3}>
            <Checkbox
              {...register('agreement', {
                required: { value: true, message: 'This field is required' },
              })}
            >
              <Type.Caption>
                Agree to{' '}
                <a href={LINKS.vaultTerms} target="_blank" rel="noreferrer">
                  Terms & Conditions
                </a>
              </Type.Caption>
            </Checkbox>
            {!!errors.agreement?.message && (
              <Type.Caption color="red1" display="block" mt={1}>
                You must agree to the agreement before continuing
              </Type.Caption>
            )}
          </Box>

          {!enoughAllowance && !errors.amount?.message && (
            <Flex
              mt={3}
              alignItems="center"
              px={3}
              py={2}
              sx={{
                border: 'small',
                borderColor: 'primary1',
                borderRadius: 'sm',
                color: 'primary1',
                gap: 2,
              }}
            >
              <ShieldCheck size={24} />
              <Type.Caption flex="1">
                <Trans>Allow the smart wallet to use your {usdAsset.symbol}</Trans>
              </Type.Caption>
              <Button variant="primary" isLoading={approving} disabled={approving} onClick={() => approveToken(amount)}>
                <Trans>Approve</Trans>
              </Button>
            </Flex>
          )}
          <Flex mt={3} sx={{ gap: 3 }}>
            <Button type="submit" size="lg" block variant="primary" disabled={disabled} isLoading={submitting}>
              <Trans>Deposit</Trans>
            </Button>
          </Flex>
        </form>
      ) : (
        <Box my={3}>{alert}</Box>
      )}

      {openInviteModal && (
        <InviteCodeModal submitting={submitting} onDismiss={() => setOpenInviteModal(false)} onDeposit={onDeposit} />
      )}
    </div>
  )
}

export default VaultDeposit

function DepositLockDuration({ durationInSeconds }: { durationInSeconds: number }) {
  const timer = getDurationFromSeconds(durationInSeconds)

  const dayCount = Number(timer?.days) ?? 0
  const hourCount = Number(timer?.hours) ?? 0
  const minuteCount = Number(timer?.minutes) ?? 0

  if (dayCount > 0) {
    return (
      <Box as="a" color="orange1">
        {dayCount > 1 ? `${dayCount} days` : `${dayCount} day`}
      </Box>
    )
  }
  if (hourCount > 0) {
    return (
      <Box as="a" color="orange1">
        {hourCount > 1 ? `${hourCount} hours` : `${hourCount} hour`}
      </Box>
    )
  }
  if (minuteCount > 0) {
    return (
      <Box as="span" color="orange1">
        {minuteCount > 1 ? `${minuteCount} minutes` : `${minuteCount} minute`}
      </Box>
    )
  }

  return null
}
