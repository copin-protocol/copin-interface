import { isAddress } from '@ethersproject/address'
import { Trans } from '@lingui/macro'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getLiteConfigApi, withdrawLiteWalletApi } from 'apis/liteApis'
import ToastBody from 'components/@ui/ToastBody'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import { Box, Flex, Image, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import delay from 'utils/helpers/delay'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'
import { parseChainImage } from 'utils/helpers/transform'

interface LiteWithdrawForm {
  sourceAddress: string
  destinationAddress: string
  amount: number | null
}

const MIN_AMOUNT = 5

const LiteWithdraw = ({ address }: { address: string }) => {
  const { embeddedWalletInfo, reloadEmbeddedWalletInfo } = useCopyWalletContext()
  const { data: configs } = useQuery([QUERY_KEYS.EMBEDDED_WALLET_INFO], () => getLiteConfigApi())
  const available = embeddedWalletInfo?.withdrawable
    ? Math.floor(Number(embeddedWalletInfo.withdrawable) * 100) / 100
    : undefined
  const withdrawMutation = useMutation(withdrawLiteWalletApi, {
    onSuccess: async () => {
      reset()
      toast.success(<ToastBody title="Success" message="Your withdraw request has been submitted" />)
      await delay(DELAY_SYNC)
      reloadEmbeddedWalletInfo?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })
  const {
    control,
    watch,
    reset,
    setValue,
    setError,
    handleSubmit,
    register,
    formState: { errors },
    trigger,
  } = useForm<LiteWithdrawForm>({
    mode: 'onChange',
    defaultValues: {
      sourceAddress: address,
    },
  })

  const amount = watch('amount')
  const destinationAddress = watch('destinationAddress')
  const fee = configs ? configs.withdrawFee + configs.hyperliquidTransferFee + configs.hyperliquidWithdrawFee : 0
  const minWithdrawalAmount = MIN_AMOUNT + fee

  const onSubmit = async ({ sourceAddress, destinationAddress, amount }: LiteWithdrawForm) => {
    if (withdrawMutation.isLoading) return
    if (!amount) {
      setError('amount', new Error('Amount is required'))
      trigger()
      return
    } else if (!destinationAddress) {
      setError('destinationAddress', new Error('Destination address is required'))
      trigger()
      return
    }

    withdrawMutation.mutate({ sourceAddress, destinationAddress, amount })
  }

  return (
    <Box px={3} py={[24, 24, 24, 2]}>
      <Flex mx="auto" justifyContent="center" mb={[24, 24, 24, 12]} alignItems="center" sx={{ gap: 2 }}>
        <Image src={parseChainImage('ARB')} height={28} />
        <Type.CaptionBold>
          <Trans>Withdraw USDC To Arbitrum</Trans>
        </Type.CaptionBold>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          error={errors.amount?.message}
          type="text"
          inputMode="decimal"
          label="Amount"
          block
          {...register('amount', {
            valueAsNumber: true,
            min: {
              value: minWithdrawalAmount,
              message: `Withdrawal amount must be greater than ${minWithdrawalAmount}`,
            },
            max: {
              value: available || 0,
              message: `Insufficient funds`,
            },
            onChange: (e) => {
              let value = e.target.value
              if (value == '') {
                setValue('amount', null)
                trigger()
                return
              }
              if (RegExp(/[^0-9.]/g).test(value)) {
                value = value.replace(/[^0-9.]/g, '')
                setValue('amount', value)
              }
            },
          })}
          annotation={`Available: ${available != null ? `${formatNumber(available, 2, 2)}` : '--'}`}
          suffix={
            <Button
              type="button"
              variant="ghostPrimary"
              p={0}
              disabled={withdrawMutation.isLoading}
              onClick={() => {
                setValue('amount', available || 0)
                trigger()
              }}
            >
              <Trans>MAX</Trans>
            </Button>
          }
          sx={{ mb: 2 }}
        />
        <InputField
          error={errors.destinationAddress?.message}
          label="Destination"
          block
          sx={{ mb: 2 }}
          {...register('destinationAddress', {
            // required: {
            //   value: true,
            //   message: 'Destination is required',
            // },
            validate: (value) => {
              if (!value || isAddress(value)) return true
              return 'Address is invalid'
            },
          })}
        />
        <Type.Caption color="neutral2">• ${fee} fee will be deducted from the withdrawal amount</Type.Caption>
        <Type.Caption color="neutral2">
          • Withdrawal estimated in {configs ? Math.ceil(configs.withdrawTimeInSeconds / 60) : '--'} minutes
        </Type.Caption>
        <Button
          variant="primary"
          type="submit"
          block
          mt={3}
          disabled={withdrawMutation.isLoading || !amount || !destinationAddress}
          isLoading={withdrawMutation.isLoading}
        >
          Withdraw
        </Button>
      </form>
    </Box>
  )
}

export default LiteWithdraw
