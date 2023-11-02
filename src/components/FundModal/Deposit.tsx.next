import { defaultAbiCoder } from '@ethersproject/abi'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ShieldCheck } from '@phosphor-icons/react'
import { useState } from 'react'
import { FieldValues, useForm, useWatch } from 'react-hook-form'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useERC20Approval from 'hooks/web3/useTokenApproval'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Box, Flex, Type } from 'theme/base'
import { SmartAccountCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { getTokenBalanceFromAccount } from 'utils/web3/balance'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'

const Deposit = ({ smartAccount, onDismiss }: { smartAccount: string; onDismiss: () => void }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })
  const amount = useWatch({
    control,
    name: 'amount',
  })
  const { walletAccount } = useWeb3()
  const { isValid, alert } = useRequiredChain({
    chainId: DEFAULT_CHAIN_ID,
  })
  const [submitting, setSubmitting] = useState(false)
  const { isTokenAllowanceEnough, approving, approveToken } = useERC20Approval({
    token: CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_QUERY_KEYS.SUSD],
    account: walletAccount?.address,
    spender: smartAccount,
  })

  const smartAccountContract = useContract({
    contract: {
      address: smartAccount,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_ACCOUNT],
    },
    withSignerIfPossible: true,
  })
  const smartAccountMutation = useContractMutation(smartAccountContract)
  const {
    smartWalletMargin: { available, reloadAvailableMargin },
  } = useCopyWalletContext()
  const enoughAllowance = isTokenAllowanceEnough(amount)
  const sUSDBalance = walletAccount ? getTokenBalanceFromAccount(walletAccount, 'sUSD') : undefined

  const disabled = !sUSDBalance || !enoughAllowance || submitting || !!errors.amount

  const onSubmit = async (values: FieldValues) => {
    if (disabled) return
    setSubmitting(true)
    const input = defaultAbiCoder.encode(['int256'], [parseEther(values.amount.toString())])
    smartAccountMutation.mutate(
      {
        method: 'execute',
        params: [[SmartAccountCommand.ACCOUNT_MODIFY_MARGIN], [input]],
      },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
          reloadAvailableMargin()
          setSubmitting(false)
          onDismiss()
        },
        onError: () => {
          setSubmitting(false)
        },
      }
    )
  }

  return (
    <div>
      {isValid ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <Type.CaptionBold mr={1}>
              <Trans>Smart Wallet Available Margin</Trans>:
            </Type.CaptionBold>
            <Type.Caption>{formatNumber(available?.num, 2, 2)} sUSD</Type.Caption>
          </Box>

          <NumberInputField
            error={errors.amount?.message}
            label={<Trans>Amount</Trans>}
            annotation={`Bal: ${formatNumber(sUSDBalance, 2, 2)} sUSD`}
            control={control}
            suffix={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Button
                  type="button"
                  variant="ghostPrimary"
                  py={2}
                  onClick={() => setValue('amount', sUSDBalance)}
                  disabled={submitting}
                >
                  Max
                </Button>
                <Type.Caption>sUSD</Type.Caption>
              </Flex>
            }
            required
            {...register('amount', {
              required: {
                value: true,
                message: 'Please enter the amount',
              },
              ...(sUSDBalance
                ? {
                    max: {
                      value: sUSDBalance,
                      message: 'Insufficient funds',
                    },
                  }
                : {}),
            })}
            name="amount"
            block
          />

          {!enoughAllowance && (
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
              <Type.Caption flex="1">Allow the smart account to usse your sUSD</Type.Caption>
              <Button variant="primary" isLoading={approving} disabled={approving} onClick={() => approveToken(amount)}>
                Approve
              </Button>
            </Flex>
          )}
          <Flex mt={3} sx={{ gap: 3 }}>
            <Button type="button" variant="outlineInactive" disabled={submitting} block onClick={() => onDismiss()}>
              Cancel
            </Button>
            <Button type="submit" block variant="primary" disabled={disabled} isLoading={submitting}>
              Deposit
            </Button>
          </Flex>
        </form>
      ) : (
        alert
      )}
    </div>
  )
}

export default Deposit
