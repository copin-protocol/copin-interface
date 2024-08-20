import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { requestTestMultiOrderApi, requestTestSingleOrderApi } from 'apis/backTestApis'
import { BackTestFormValues } from 'components/@backtest/types'
import ToastBody from 'components/@ui/ToastBody'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest.d'
import { ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeList } from 'utils/config/trades'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function useBacktestRequest(
  protocol?: ProtocolEnum,
  options?: {
    onSuccess?: (args: { result: BackTestResultData[]; settings: RequestBackTestData }) => void
    onError?: () => void
  }
) {
  const [backtestSettings, setBacktestSettings] = useState<RequestBackTestData>()

  const [backtestResultData, setBackTestResultData] = useState<BackTestResultData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutate: requestTestSingleOrder } = useMutation(requestTestSingleOrderApi, {
    onSuccess: (data, variables) => {
      if (!data.length) {
        toast.error(<ToastBody title={<Trans>Error</Trans>} message={'Cannot simulate'} />)
      }
      if (!!data) {
        setIsSubmitting(false)
        setBackTestResultData(data)
        //
        options?.onSuccess && options.onSuccess({ result: data, settings: variables.data })
      }
    },
    onError: (err) => {
      setIsSubmitting(false)
      options?.onError && options.onError()
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })
  const { mutate: requestTestMultiOrder, error: requestMultiError } = useMutation(requestTestMultiOrderApi, {
    onSuccess: (data, variables) => {
      if (!data.length) {
        toast.error(<ToastBody title={<Trans>Error</Trans>} message={'Cannot simulate'} />)
      }
      if (!!data) {
        setBackTestResultData(data)
        setIsSubmitting(false)
        //
        options?.onSuccess && options.onSuccess({ result: data, settings: variables.data })
      }
    },
    onError: (err) => {
      setIsSubmitting(false)
      options?.onError && options.onError()
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  const onSubmitByRequestData = (requestData: RequestBackTestData, reqProtocol?: ProtocolEnum) => {
    setIsSubmitting(true)
    setBacktestSettings(requestData)
    requestTestMultiOrder({ protocol: protocol ?? reqProtocol ?? ProtocolEnum.GMX, data: requestData })
  }
  const onSubmit = ({
    accounts,
    callback,
    isReturnPositions = false,
    reqProtocol,
  }: {
    accounts: string[]
    callback?: (requestData: RequestBackTestData) => void
    isReturnPositions?: boolean
    reqProtocol?: ProtocolEnum
  }) => {
    return (formData: BackTestFormValues) => {
      const _protocol = protocol ?? reqProtocol ?? ProtocolEnum.GMX
      setIsSubmitting(true)
      const fromTime = dayjs(formData.startTime).utc().valueOf()
      const toTime = dayjs(formData.endTime).utc().valueOf()

      const requestData: RequestBackTestData = {
        accounts,
        balance: formData.balance,
        orderVolume: formData.orderVolume,
        leverage: formData.leverage,
        fromTime,
        toTime,
        tokenAddresses: formData.copyAll
          ? getTokenTradeList(_protocol).map((token) => token.address)
          : formData.tokenAddresses,
        reverseCopy: formData.reverseCopy,
        copyAll: formData.copyAll,
        maxVolMultiplier:
          formData.maxMarginPerPosition && formData.maxMarginPerPosition > 0
            ? formData.maxMarginPerPosition / formData.orderVolume
            : null,
      }
      if (formData.lookBackOrders) {
        requestData.volumeProtection = true
        requestData.lookBackOrders = formData.lookBackOrders
      }
      if (formData.stopLossAmount) {
        requestData.enableStopLoss = true
        requestData.stopLossAmount = formData.stopLossAmount
        requestData.stopLossType = formData.stopLossType
      }
      if (formData.takeProfitAmount) {
        requestData.enableTakeProfit = true
        requestData.takeProfitAmount = formData.takeProfitAmount
        requestData.takeProfitType = formData.takeProfitType
      }
      if (isReturnPositions) requestData.isReturnPositions = true
      setBacktestSettings(requestData)
      callback && callback(requestData)

      requestTestMultiOrder({ protocol: _protocol, data: requestData })
    }
  }
  return {
    backtestResultData,
    backtestSettings,
    onSubmit,
    onSubmitByRequestData,
    requestTestMultiOrder,
    requestTestSingleOrder,
    isSubmitting,
    setBackTestResultData,
    setBacktestSettings,
    requestMultiError,
  }
}
