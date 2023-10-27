import { defaultAbiCoder } from '@ethersproject/abi'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { FieldValues, useForm, useWatch } from 'react-hook-form'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Flex, Type } from 'theme/base'
import { SmartAccountCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'

const Withdraw = ({ smartAccount, onDismiss }: { smartAccount: string; onDismiss: () => void }) => {
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
  const { isValid, alert } = useRequiredChain({
    chainId: DEFAULT_CHAIN_ID,
  })
  const [submitting, setSubmitting] = useState(false)

  const smartAccountContract = useContract({
    contract: {
      address: smartAccount,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_ACCOUNT],
    },
    withSignerIfPossible: true,
  })
  const {
    smartWalletMargin: { inWallet, available, accessibleMargins, reloadAvailableMargin },
  } = useCopyWalletContext()
  const smartAccountMutation = useContractMutation(smartAccountContract)

  const disabled = !available || submitting || !!errors.amount

  const onSubmit = async (values: FieldValues) => {
    if (disabled) return
    setSubmitting(true)
    const amount = parseEther(values.amount.toString())
    const commands = [SmartAccountCommand.ACCOUNT_MODIFY_MARGIN]
    const inputs: any[] = [defaultAbiCoder.encode(['int256'], [amount.mul(-1)])]

    if (inWallet && amount.gt(inWallet.bn)) {
      const margins = (accessibleMargins ?? []).filter((e) => e.value.gt(0))
      margins.forEach((margin) => {
        commands.unshift(SmartAccountCommand.PERP_WITHDRAW_ALL_MARGIN)
        inputs.unshift(defaultAbiCoder.encode(['address'], [margin.market]))
      })
    }

    smartAccountMutation.mutate(
      {
        method: 'execute',
        params: [commands, inputs],
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
          <NumberInputField
            error={errors.amount?.message}
            label={<Trans>Amount</Trans>}
            annotation={`Bal: ${formatNumber(available?.num, 2, 2)} sUSD`}
            control={control}
            suffix={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Button
                  type="button"
                  variant="ghostPrimary"
                  py={2}
                  onClick={() => setValue('amount', available?.num)}
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
              ...(available
                ? {
                    max: {
                      value: available.num,
                      message: 'Insufficient funds',
                    },
                  }
                : {}),
            })}
            name="amount"
            block
          />
          <Flex mt={3} sx={{ gap: 3 }}>
            <Button type="button" variant="outlineInactive" disabled={submitting} block onClick={() => onDismiss()}>
              Cancel
            </Button>
            <Button type="submit" block variant="primary" disabled={disabled} isLoading={submitting}>
              Withdraw
            </Button>
          </Flex>
        </form>
      ) : (
        alert
      )}
    </div>
  )
}

export default Withdraw
