import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { ReactNode, memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { submitActionApi, submitActionForCopyApi } from 'apis/dcpPositionApis'
import Divider from 'components/@ui/Divider'
import ToastBody from 'components/@ui/ToastBody'
import { PositionData } from 'entities/trader'
import useWeb3 from 'hooks/web3/useWeb3'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import Label from 'theme/InputField/Label'
import Modal from 'theme/Modal'
import SliderInput from 'theme/SliderInput'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DELAY_SYNC } from 'utils/config/constants'
import { ActionTypeEnum, CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { calcLiquidatePrice } from 'utils/helpers/calculate'
import delay from 'utils/helpers/delay'
import { formatNumber, formatPrice } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'
import { signForAction, signForActionByCopy } from 'utils/web3/wallet'

import { OnchainPositionData } from '../OpeningPositions/schema'

const MIN_TP = 1
const MIN_SL = 1
const MAX_TP = 200
const MAX_SL = 70

interface SltpForm {
  entryPrice: number | null
  slPrice: number | null
  slPercent: number | null
  tpPrice: number | null
  tpPercent: number | null
}

const ModifyTPSLModal = memo(function ModifyTPSLModal({
  isOpen,
  onDismiss,
  positionData,
  onSuccess,
}: {
  isOpen: boolean
  onDismiss: () => void
  positionData: OnchainPositionData
  onSuccess?: () => void
}) {
  const { walletProvider, walletAccount } = useWeb3()
  const [submitting, setSubmitting] = useState(false)
  const submitActionMutation = useMutation(submitActionApi, {
    onSuccess: async () => {
      await delay(DELAY_SYNC * 6)
      setSubmitting(false)
      toast.success(<ToastBody title="Success" message="Your SL / TP has been submitted" />)
      onDismiss()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      setSubmitting(false)
    },
  })
  const submitActionForCopyMutation = useMutation(submitActionForCopyApi, {
    onSuccess: async () => {
      await delay(DELAY_SYNC * 6)
      setSubmitting(false)
      toast.success(<ToastBody title="Success" message="Your SL / TP has been submitted" />)
      onDismiss()
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      setSubmitting(false)
    },
  })
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    trigger,
  } = useForm<SltpForm>({
    mode: 'onChange',
    defaultValues: {
      slPrice: positionData.sl,
      slPercent: positionData.sl
        ? roundNumber({
            value: transformValue({
              onchainPositionData: positionData,
              isSL: true,
              isPercent: false,
              value: positionData.sl,
            }).sltpPercent,
          })
        : null,
      tpPrice: positionData.tp,
      tpPercent: positionData.tp
        ? roundNumber({
            value: transformValue({
              onchainPositionData: positionData,
              isSL: false,
              isPercent: false,
              value: positionData.tp,
            }).sltpPercent,
          })
        : null,
    },
  })
  const tpPercent = watch('tpPercent')
  const tpPrice = watch('tpPrice')
  const slPercent = watch('slPercent')
  const slPrice = watch('slPrice')
  const liqPrice = calcLiquidatePrice(positionData as unknown as PositionData)
  const onSubmit = async (values: SltpForm) => {
    if (!walletProvider || !walletAccount) return
    let tp, sl
    if (!values.tpPrice) {
      tp = transformValue({
        onchainPositionData: positionData,
        isSL: false,
        isPercent: true,
        value: 900,
      }).sltpPrice
    } else {
      tp = values.tpPrice
    }
    if (!values.slPrice) {
      sl = transformValue({
        onchainPositionData: positionData,
        isSL: true,
        isPercent: true,
        value: 100,
      }).sltpPrice
    } else {
      sl = values.slPrice
    }
    if (positionData.copyPositionId) {
      const signature = await signForActionByCopy({
        from: walletAccount,
        copyPositionId: positionData.copyPositionId,
        data: {
          sl,
          tp,
        },
        actionType: ActionTypeEnum.SET_SLTP,
        web3Provider: walletProvider,
      })
      if (!signature) {
        toast.error(<ToastBody title="Error" message={<Trans>Can not verify the action</Trans>} />)
        return
      }
      setSubmitting(true)
      submitActionForCopyMutation.mutate({
        copyPositionId: positionData.copyPositionId,
        payload: {
          actionType: ActionTypeEnum.SET_SLTP,
          data: {
            sl,
            tp,
          },
          signature,
        },
      })
    } else {
      const signature = await signForAction({
        from: walletAccount,
        smartWalletAddress: positionData.address,
        positionIndex: positionData.index,
        data: {
          sl,
          tp,
        },
        actionType: ActionTypeEnum.SET_SLTP,
        web3Provider: walletProvider,
      })
      if (!signature) {
        toast.error(<ToastBody title="Error" message={<Trans>Can not verify the action</Trans>} />)
        return
      }
      setSubmitting(true)
      submitActionMutation.mutate({
        exchange:
          positionData.protocol === ProtocolEnum.GNS
            ? CopyTradePlatformEnum.GNS_V8
            : CopyTradePlatformEnum.SYNTHETIX_V2,
        payload: {
          smartWalletAddress: positionData.address,
          positionIndex: positionData.index,
          actionType: ActionTypeEnum.SET_SLTP,
          data: {
            sl,
            tp,
          },
          signature,
        },
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <Box p={3} bg="neutral5">
        <Flex mb={24} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
          <Type.BodyBold>Modify TP/SL</Type.BodyBold>
          <IconBox
            role="button"
            icon={<XCircle size={20} />}
            sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
            onClick={onDismiss}
          />
        </Flex>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 3 }}>
          <StatsItem label={<Trans>Entry Price</Trans>} value={formatPrice(positionData.averagePrice, 2, 2)} />
          <StatsItem label={<Trans>Qty</Trans>} value={formatNumber(positionData.size, 2, 2)} />
          {/* Change to pyth or anything to get price */}

          <StatsItem label={<Trans>Liq.Price</Trans>} value={formatNumber(liqPrice)} color="orange1" />
        </Flex>
        <Divider my={3} />
        <Label label={<Trans>Take Profit - Trigger by ROI (%)</Trans>} />
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Flex sx={{ gap: 2 }}>
            <Input
              type="text"
              inputMode="decimal"
              control={control}
              disabled={submitting}
              sx={{ flex: 2 }}
              {...register('tpPrice', {
                valueAsNumber: true,
                onChange: (e) => {
                  let value = e.target.value
                  if (value == '') {
                    setValue('tpPercent', null)
                    setValue('tpPrice', null)
                    trigger()
                    return
                  }
                  if (RegExp(/[^0-9.]/g).test(value)) {
                    value = value.replace(/[^0-9.]/g, '')
                    setValue('tpPrice', value)
                  }
                  const { sltpPercent } = transformValue({
                    onchainPositionData: positionData,
                    isSL: false,
                    isPercent: false,
                    value: Number(e.target.value),
                  })
                  setValue('tpPercent', Math.round(sltpPercent))
                  trigger()
                },
              })}
            />
            <Input
              error={!!errors.tpPercent?.type}
              type="text"
              inputMode="decimal"
              {...register('tpPercent', {
                valueAsNumber: true,
                min: {
                  value: MIN_TP,
                  message: `Take Profit must be greater than ${MIN_TP}%`,
                },
                max: {
                  value: MAX_TP,
                  message: `Take Profit must be less than ${MAX_TP}%`,
                },
                onChange: (e) => {
                  let value = e.target.value
                  if (value == '') {
                    setValue('tpPercent', null)
                    setValue('tpPrice', null)
                    trigger()
                    return
                  }
                  if (RegExp(/[^0-9.]/g).test(value)) {
                    value = value.replace(/[^0-9.]/g, '')
                    setValue('tpPercent', value)
                  }
                  const { sltpPrice } = transformValue({
                    onchainPositionData: positionData,
                    isSL: false,
                    isPercent: true,
                    value: Number(e.target.value),
                  })
                  setValue('tpPrice', roundNumber({ value: sltpPrice }))
                  trigger()
                },
              })}
              disabled={submitting}
              sx={{ flex: 1 }}
              suffix="%"
            />
          </Flex>
          {errors.tpPercent?.message ? (
            <Type.Caption color="red1" display="block">
              {errors.tpPercent.message}
            </Type.Caption>
          ) : null}
          <Box my={3} pb={28} pl={'6px'} pr={'10px'}>
            <SliderInput
              name="tpPercent"
              disabled={submitting}
              control={control}
              error=""
              minValue={MIN_TP}
              maxValue={MAX_TP}
              stepValue={1}
              marksStep={20}
              marksUnit={'%'}
              onChangeValue={(value) => {
                if (!value) {
                  setValue('tpPercent', null)
                  setValue('tpPrice', null)
                  trigger()
                  return
                }
                setValue('tpPercent', value)
                const { sltpPrice } = transformValue({
                  onchainPositionData: positionData,
                  isSL: false,
                  isPercent: true,
                  value,
                })
                setValue('tpPrice', roundNumber({ value: sltpPrice }))
                trigger()
              }}
            />
          </Box>
          {!!tpPercent && (
            <Box mb={3} sx={{ p: 2, bg: 'neutral6' }}>
              <Type.Caption color="neutral2">
                Price reaching {tpPrice} will trigger a Take Profit order. Your expected profit is{' '}
                <Box as="span" color={tpPercent < 0 ? 'red2' : 'green1'}>
                  {roundNumber({
                    value: estimatePnL({
                      totalSize: positionData.size,
                      leverage: positionData.leverage,
                      sltpPercent: tpPercent,
                    }),
                  })}
                </Box>{' '}
                USDC (ROI:{' '}
                <Box as="span" color={tpPercent < 0 ? 'red2' : 'green1'}>
                  {formatNumber(tpPercent, 2)}
                </Box>
                %)
              </Type.Caption>
            </Box>
          )}
          <Label label={<Trans>Stop Loss - Trigger by ROI (%)</Trans>} />

          <Flex sx={{ gap: 2 }}>
            <Input
              type="text"
              inputMode="decimal"
              {...register('slPrice', {
                valueAsNumber: true,
                onChange: (e) => {
                  let value = e.target.value
                  if (value == '') {
                    setValue('slPercent', null)
                    setValue('slPrice', null)
                    trigger()
                    return
                  }
                  if (RegExp(/[^0-9.]/g).test(value)) {
                    value = value.replace(/[^0-9.]/g, '')
                    setValue('slPrice', value)
                  }
                  const { sltpPercent } = transformValue({
                    onchainPositionData: positionData,
                    isSL: true,
                    isPercent: false,
                    value: Number(value),
                  })
                  setValue('slPercent', Math.round(sltpPercent))
                  trigger()
                },
              })}
              disabled={submitting}
              sx={{ flex: 2 }}
            />
            <Input
              type="text"
              inputMode="decimal"
              error={errors.slPercent?.type}
              {...register('slPercent', {
                valueAsNumber: true,
                min: {
                  value: MIN_SL,
                  message: `Stop Loss must be greater than ${MIN_SL}%`,
                },
                max: {
                  value: MAX_SL,
                  message: `Stop Loss must be less than ${MAX_SL}%`,
                },
                onChange: (e) => {
                  let value = e.target.value
                  if (value == '') {
                    setValue('slPercent', null)
                    setValue('slPrice', null)
                    trigger()
                    return
                  }
                  if (RegExp(/[^0-9.]/g).test(value)) {
                    value = value.replace(/[^0-9.]/g, '')
                    setValue('slPercent', value)
                  }
                  const { sltpPrice } = transformValue({
                    onchainPositionData: positionData,
                    isSL: true,
                    isPercent: true,
                    value: Number(value),
                  })
                  setValue('slPrice', roundNumber({ value: sltpPrice }))
                  trigger()
                },
              })}
              disabled={submitting}
              control={control}
              sx={{ flex: 1 }}
              suffix="%"
            />
          </Flex>
          {errors.slPercent?.message ? (
            <Type.Caption color="red1" display="block">
              {errors.slPercent.message}
            </Type.Caption>
          ) : null}
          <Box my={3} pb={28} pl={'6px'} pr={'10px'}>
            <SliderInput
              disabled={submitting}
              name="slPercent"
              control={control}
              error=""
              minValue={MIN_SL}
              maxValue={MAX_SL}
              stepValue={1}
              marksStep={10}
              marksUnit={'%'}
              onChangeValue={(value) => {
                if (!value) {
                  setValue('slPercent', null)
                  setValue('slPrice', null)
                  trigger()
                  return
                }
                setValue('slPercent', value)
                const { sltpPrice } = transformValue({
                  onchainPositionData: positionData,
                  isSL: true,
                  isPercent: true,
                  value,
                })
                setValue('slPrice', roundNumber({ value: sltpPrice }))
                trigger()
              }}
            />
          </Box>
          {!!slPercent && (
            <Box mb={3} sx={{ p: 2, bg: 'neutral6' }}>
              <Type.Caption color="neutral2">
                Price reaching {slPrice} will trigger a Stop Loss order. Your expected loss is{' '}
                <Box as="span" color={slPercent > 0 ? 'red2' : 'green1'}>
                  {slPercent > 0 ? '-' : ''}
                  {Math.abs(
                    roundNumber({
                      value: estimatePnL({
                        totalSize: positionData.size,
                        leverage: positionData.leverage,
                        sltpPercent: slPercent,
                      }),
                    })
                  )}
                </Box>{' '}
                USDC (ROI:{' '}
                <Box as="span" color={slPercent > 0 ? 'red2' : 'green1'}>
                  {slPercent > 0 ? '-' : ''}
                  {formatNumber(Math.abs(slPercent), 2)}
                </Box>
                %)
              </Type.Caption>
            </Box>
          )}
          <Alert
            sx={{ textAlign: 'left', mb: 3 }}
            variant="cardWarning"
            message={<Trans>Notice</Trans>}
            description={
              <Trans>
                If the trader increase / decrease position, the TP / SL will be re-adjusted as your copytrade settings
              </Trans>
            }
          />
          <Button
            variant="primary"
            block
            disabled={submitting || !walletProvider || !walletAccount}
            isLoading={submitting}
            type="submit"
          >
            <Trans>Modify SL / TP</Trans>
          </Button>
        </form>
      </Box>
    </Modal>
  )
})

function StatsItem({ label, value, color = 'neutral1' }: { label: ReactNode; value: ReactNode; color?: string }) {
  return (
    <Box>
      <Type.Caption color="neutral3" pr={2}>
        {label}
      </Type.Caption>
      <Type.CaptionBold color={color}>{value}</Type.CaptionBold>
    </Box>
  )
}

function transformValue({
  onchainPositionData,
  isSL,
  isPercent,
  value,
}: {
  onchainPositionData: OnchainPositionData
  isSL: boolean
  isPercent: boolean
  value: number
}) {
  const { leverage, averagePrice, isLong } = onchainPositionData
  const multiply = (isSL ? -1 : 1) * (isLong ? 1 : -1)

  let sltpPrice: number | undefined = 0
  let sltpPercent: number | undefined = 0
  if (isPercent) {
    sltpPercent = value
    const delta = (1 / 100 / leverage) * value * averagePrice
    sltpPrice = delta * multiply + averagePrice
  } else {
    sltpPrice = value
    const delta = value - averagePrice
    sltpPercent = ((delta * multiply) / averagePrice) * 100 * leverage
  }
  return { sltpPrice, sltpPercent }
}

function estimatePnL({
  totalSize,
  leverage,
  sltpPercent,
}: {
  totalSize: number // size $
  leverage: number
  sltpPercent: number
}) {
  const result = ((totalSize / leverage) * sltpPercent) / 100
  return result
}

function roundNumber({ value, decimals = 8 }: { value: number; decimals?: number }) {
  return Math.round(value * decimals) / decimals
}

export default ModifyTPSLModal
