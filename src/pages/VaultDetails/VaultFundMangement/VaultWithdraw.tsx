import { Trans } from '@lingui/macro'
import { Lock } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'

import ConnectWalletAction from 'components/@wallet/ConnectWalletAction'
import useVaultDetailsContext from 'hooks/features/useVaultDetailsProvider'
import useCountdown, { Timer } from 'hooks/helpers/useCountdown'
import { useAuthContext } from 'hooks/web3/useAuth'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import VaultFees from 'pages/VaultDetails/VaultInfo/VaultFees'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import NumberInputField from 'theme/InputField/NumberInputField'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { USD_ASSET } from 'utils/web3/chains'
import { getCopyTradePlatformChain } from 'utils/web3/dcp'

import ConfirmWithdrawModal from './ConfirmWithdrawModal'

const VaultWithdraw = ({
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

  const { isValid, alert } = useRequiredChain({
    chainId,
  })
  const { isAuthenticated, account } = useAuthContext()
  const [openModal, setOpenModal] = useState(false)
  const amountRef = useRef(0)

  const { vault, vaultUserDetails, userRemainingMaxWithdraw } = useVaultDetailsContext()

  const usdAsset = USD_ASSET[chainId]

  const userBalance = vaultUserDetails?.userBalanceUsd ?? 0
  const remainingMaxWithdraw = userRemainingMaxWithdraw ?? 0

  const today = dayjs().utc().valueOf()
  const lastDepositDate = dayjs(vault?.userLastDepositTimes).utc()
  const unlockDate = lastDepositDate.add(vault?.lockDepositDuration ?? 0, 'seconds').valueOf()
  let countdownTime: number | null = null
  if (today < unlockDate) {
    countdownTime = unlockDate
  }
  const timer = useCountdown(dayjs.utc(countdownTime).valueOf())
  const isLocked = timer && !timer?.hasEnded

  const disabled = !remainingMaxWithdraw || openModal || !!errors.amount || isLocked

  const onSubmit = async (values: FieldValues) => {
    if (disabled) return
    amountRef.current = values.amount
    setOpenModal(true)
  }

  return (
    <div>
      {!isAuthenticated || !account ? (
        <ConnectWalletAction />
      ) : isValid ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex alignItems="center" justifyContent="space-between" mb={2}>
            <Type.CaptionBold color="neutral2" mr={1}>
              <Trans>Max Withdraw</Trans>
            </Type.CaptionBold>
            <Type.Caption>
              {remainingMaxWithdraw && remainingMaxWithdraw >= 0
                ? `$${formatNumber(remainingMaxWithdraw, 2, 2)}`
                : '--'}
            </Type.Caption>
          </Flex>

          <NumberInputField
            error={errors.amount?.message}
            label={<Trans>Amount</Trans>}
            annotation={`Bal: ${formatNumber(userBalance, 2, 2)} ${usdAsset.symbol}`}
            control={control}
            suffix={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Button
                  type="button"
                  variant="ghostPrimary"
                  py={2}
                  onClick={() => {
                    setValue('amount', Math.min(userBalance, remainingMaxWithdraw ?? 0))
                    trigger()
                  }}
                  disabled={!userBalance}
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
                value: 0.0000000001,
                message: `Minimum withdrawal amount must be greater than zero`,
              },
              ...(userBalance
                ? {
                    max: {
                      value: Math.min(userBalance, remainingMaxWithdraw),
                      message:
                        userBalance > remainingMaxWithdraw
                          ? `The maximum balance is ${formatNumber(remainingMaxWithdraw, 2)} ${usdAsset.symbol}`
                          : 'Insufficient funds',
                    },
                  }
                : {}),
            })}
            name="amount"
            block
          />

          <VaultFees />

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

          <Flex mt={3} sx={{ gap: 3 }}>
            <Button type="submit" size="lg" block variant="primary" disabled={disabled}>
              <Flex alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
                {isLocked ? <Lock /> : <></>}
                <Trans>Withdraw</Trans>
              </Flex>
            </Button>
          </Flex>

          {!!vault?.lockDepositDuration && !!vault?.userLastDepositTimes && timer && <LockWithdrawNote timer={timer} />}
        </form>
      ) : (
        <Box my={3}>{alert}</Box>
      )}
      {openModal && smartWallet && !!amountRef.current && (
        <ConfirmWithdrawModal
          smartWallet={smartWallet}
          amount={amountRef.current}
          isOpen={openModal}
          onDismiss={(isSuccess?: boolean) => {
            setOpenModal(false)
            if (isSuccess && onSuccess) {
              onSuccess()
            }
          }}
        />
      )}
    </div>
  )
}

export default VaultWithdraw

function LockWithdrawNote({ timer }: { timer?: Timer }) {
  const dayCount = Number(timer?.days) ?? 0
  const hourCount = Number(timer?.hours) ?? 0
  const minuteCount = Number(timer?.minutes) ?? 0
  const secondCount = Number(timer?.seconds) ?? 0

  return (
    <>
      {!!timer?.hasEnded && <></>}
      {!!timer && !timer?.hasEnded && (
        <Type.Caption mt={2} color="orange1" textAlign="center" width="100%">
          You will be able to withdraw after{' '}
          {dayCount > 1
            ? `${formatDuration(dayCount)} days`
            : `${formatDuration(hourCount)}:${formatDuration(minuteCount)}:${formatDuration(secondCount)}`}
        </Type.Caption>
      )}
    </>
  )
}

function formatDuration(duration: number) {
  return `${duration > 9 ? duration : `0${duration}`}`
}
