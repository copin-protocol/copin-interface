import React, { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { Id, toast } from 'react-toastify'

import { getFungiesPaymentDetails } from 'apis/subscription'
import ToastBody from 'components/@ui/ToastBody'
import useSearchParams from 'hooks/router/useSearchParams'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS } from 'utils/config/keys'

const FungiesPaymentProgress = () => {
  const { searchParams, setSearchParams } = useSearchParams()
  const toastId = useRef<Id | null>(null)
  const { refetchProfile } = useAuthContext()
  const orderId = searchParams['fngs-order-id'] as string
  const { data: paymentDetails } = useQuery({
    queryKey: [QUERY_KEYS.GET_FUNGIES_PAYMENT_DETAILS, orderId],
    queryFn: () => getFungiesPaymentDetails(orderId || ''),
    enabled: !!orderId,
    refetchInterval: !!orderId ? 5000 : false,
  })
  useEffect(() => {
    if (toastId.current) return
    if (orderId) {
      toastId.current = toast.loading(
        <ToastBody
          title="Payment Progressing"
          message="Your subscription is being processed. Estimated time: 10 minutes"
          onClose={() => {
            setSearchParams({ 'fngs-order-id': undefined })
            if (toastId.current) toast.dismiss(toastId.current)
          }}
        />
      )
    }
  }, [orderId])

  useEffect(() => {
    if (paymentDetails?.status === 'SUCCESS') {
      setSearchParams({ 'fngs-order-id': undefined })
      refetchProfile()
    }
  }, [paymentDetails])

  useEffect(() => {
    if (toastId.current) {
      if (paymentDetails?.status === 'SUCCESS') {
        setSearchParams({ 'fngs-order-id': undefined })
        refetchProfile()
        toast.update(toastId.current, {
          render: <ToastBody title="Payment Success" message="Your subscription has been successfully purchased" />,
          type: 'success',
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
        })
      } else if (paymentDetails?.status === 'FAILURE' || paymentDetails?.status === 'EXPIRED') {
        setSearchParams({ 'fngs-order-id': undefined })
        refetchProfile()
        toast.update(toastId.current, {
          render: <ToastBody title="Payment Failed" message="Your subscription has been failed to purchase" />,
          type: 'error',
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
        })
      }
    }
  }, [paymentDetails])
  return <></>
}

export default FungiesPaymentProgress
