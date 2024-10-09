import { defaultAbiCoder } from '@ethersproject/abi'
import { parseUnits } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

import { SmartWalletFund } from 'hooks/features/useWalletFundSnxV2'
import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum, SmartWalletCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'
import { USD_ASSET } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'

const Withdraw = ({
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
  const { isValid, alert } = useRequiredChain({
    chainId,
    onDismiss,
  })
  const [submitting, setSubmitting] = useState(false)

  const usdAsset = USD_ASSET[chainId]

  const smartWalletContract = useContract({
    contract: {
      address: smartWallet,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_COPYWALLET],
    },
    withSignerIfPossible: true,
  })

  const smartWalletMutation = useContractMutation(smartWalletContract)

  const disabled = !smartWalletFund.available || submitting || !!errors.amount

  const onSubmit = async (values: FieldValues) => {
    if (disabled || !smartWalletFund.inWallet) return
    setSubmitting(true)
    const amount = parseUnits(values.amount.toString(), usdAsset.decimals)
    const commands = [SmartWalletCommand.OWNER_MODIFY_FUND]
    const inputs: any[] = [defaultAbiCoder.encode(['int256'], [amount.mul(-1)])]

    const margins = (smartWalletFund.accessibleMargins ?? []).filter((e) => e.value.gt(0))
    margins.forEach((margin) => {
      commands.unshift(SmartWalletCommand.PERP_WITHDRAW_ALL_MARGIN)
      inputs.unshift(defaultAbiCoder.encode(['address'], [margin.market]))
    })

    smartWalletMutation.mutate(
      {
        method: 'execute',
        params: [commands, inputs],
      },
      {
        onSuccess: async () => {
          // await delay(DELAY_SYNC * 2)
          smartWalletFund.reloadFund()
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
            annotation={`Bal: ${formatNumber(smartWalletFund.available?.num, 2, 2)} ${usdAsset.symbol}`}
            control={control}
            suffix={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Button
                  type="button"
                  variant="ghostPrimary"
                  py={2}
                  onClick={() => {
                    setValue('amount', smartWalletFund.available?.num)
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
                value: 0.1,
                message: `Minimum withdrawal amount is 0.1 ${usdAsset.symbol}`,
              },
              ...(smartWalletFund.available
                ? {
                    max: {
                      value: smartWalletFund.available.num,
                      message: 'Insufficient funds',
                    },
                  }
                : {}),
            })}
            name="amount"
            block
          />
          <Flex mt={3} sx={{ gap: 3 }}>
            <Button type="submit" size="lg" block variant="primary" disabled={disabled} isLoading={submitting}>
              <Trans>Withdraw</Trans>
            </Button>
          </Flex>
        </form>
      ) : (
        <Box my={3}>{alert}</Box>
      )}
    </div>
  )
}

export default Withdraw
