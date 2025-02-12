import { defaultAbiCoder } from '@ethersproject/abi'
import { Contract } from '@ethersproject/contracts'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ShieldCheck } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { FieldValues, useForm, useWatch } from 'react-hook-form'

import ERC20_ABI from 'abis/ERC20.json'
import { SmartWalletFund } from 'hooks/features/copyTrade/useWalletFundSnxV2'
import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useERC20Approval from 'hooks/web3/useTokenApproval'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum, SmartWalletCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { USD_ASSET } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'

const Deposit = ({
  smartWallet,
  smartWalletFund,
  platform,
  onDismiss,
}: {
  smartWallet: string
  smartWalletFund: SmartWalletFund
  platform: CopyTradePlatformEnum
  onDismiss: () => void
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

  const usdAsset = USD_ASSET[chainId]

  const [submitting, setSubmitting] = useState(false)
  const { isTokenAllowanceEnough, approving, approveToken } = useERC20Approval({
    token: usdAsset.address,
    account: walletAccount?.address,
    spender: smartWallet,
  })

  const smartWalletContract = useContract({
    contract: {
      address: smartWallet,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET],
    },
    withSignerIfPossible: true,
  })
  const smartWalletMutation = useContractMutation(smartWalletContract)

  const enoughAllowance = isTokenAllowanceEnough(amount > 1_000_000_000 ? 1_000_000_000 : amount)

  const usdAssetContract = useMemo(() => new Contract(usdAsset.address, ERC20_ABI, publicProvider), [publicProvider])

  const { data: usdAssetBalance, refetch: refetchUSDBalance } = useContractQuery<number>(
    usdAssetContract,
    'balanceOf',
    [walletAccount?.address],
    {
      enabled: !!walletAccount?.address,
      select(data) {
        return Number(formatUnits(data, usdAsset.decimals))
      },
    }
  )

  const disabled = !usdAssetBalance || !enoughAllowance || submitting || !!errors.amount

  const onSubmit = async (values: FieldValues) => {
    if (disabled) return
    setSubmitting(true)
    const input = defaultAbiCoder.encode(['int256'], [parseUnits(values.amount.toString(), usdAsset.decimals)])
    smartWalletMutation.mutate(
      {
        method: 'execute',
        params: [[SmartWalletCommand.OWNER_MODIFY_FUND], [input]],
      },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
          smartWalletFund.reloadFund()
          refetchUSDBalance()
          setSubmitting(false)
          onDismiss()
        },
        onError: () => {
          setSubmitting(false)
        },
      }
    )
  }

  const remainingMaxDeposit = Math.max(10000 - (smartWalletFund.available?.num || 0), 0)

  return (
    <div>
      {isValid ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <Type.CaptionBold mr={1}>
              <Trans>Smart Wallet Available Fund</Trans>:
            </Type.CaptionBold>
            <Type.Caption>
              {formatNumber(smartWalletFund.available?.num, 2, 2)} ${usdAsset.symbol}
            </Type.Caption>
          </Box>

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
                    setValue('amount', usdAssetBalance)
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
                value: 1,
                message: `Minimum deposit amount is 1 ${usdAsset.symbol}`,
              },
              ...(usdAssetBalance
                ? {
                    max: {
                      value: Math.min(usdAssetBalance, remainingMaxDeposit),
                      message:
                        usdAssetBalance > remainingMaxDeposit
                          ? `The maximum balance is 10,000 ${usdAsset.symbol}`
                          : 'Insufficient funds',
                    },
                  }
                : {}),
            })}
            name="amount"
            block
          />

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
          <Button sx={{ mt: 3 }} type="submit" block variant="primary" disabled={disabled} isLoading={submitting}>
            <Trans>Deposit</Trans>
          </Button>
        </form>
      ) : (
        <Box my={3}>{alert}</Box>
      )}
    </div>
  )
}

export default Deposit
