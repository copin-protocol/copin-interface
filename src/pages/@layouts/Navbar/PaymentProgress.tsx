import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Id, toast } from 'react-toastify'

import { getPaymentDetails } from 'apis/subscription'
import ToastBody from 'components/@ui/ToastBody'
import { useAuthContext } from 'hooks/web3/useAuth'
import { QUERY_KEYS, STORAGE_KEYS } from 'utils/config/keys'

const PaymentProgress = () => {
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const toastId = useRef<Id | null>(null)
  const { profile, refetchProfile } = useAuthContext()
  const { data: paymentDetails } = useQuery({
    queryKey: [QUERY_KEYS.GET_PAYMENT_DETAILS, paymentId],
    queryFn: () => getPaymentDetails(paymentId || ''),
    enabled: !!paymentId,
    refetchInterval: !!paymentId ? 5000 : false,
  })
  useEffect(() => {
    if (toastId.current) return
    const paymentId = localStorage.getItem(`${profile?.id}_${STORAGE_KEYS.PAYMENT_ID}`)
    if (paymentId) {
      setPaymentId(paymentId)
      toastId.current = toast.loading(
        <ToastBody
          title="Payment Progressing"
          message="Your subscription is being processed"
          onClose={() => {
            localStorage.removeItem(`${profile?.id}_${STORAGE_KEYS.PAYMENT_ID}`)
            setPaymentId(null)
            if (toastId.current) toast.dismiss(toastId.current)
          }}
        />
      )
    }
  }, [])

  useEffect(() => {
    if (toastId.current) {
      if (paymentDetails?.status === 'SUCCESS') {
        localStorage.removeItem(`${profile?.id}_${STORAGE_KEYS.PAYMENT_ID}`)
        setPaymentId(null)
        refetchProfile()
        toast.update(toastId.current, {
          render: <ToastBody title="Payment Success" message="Your subscription has been successfully purchased" />,
          type: 'success',
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
        })
      } else if (paymentDetails?.status === 'FAILURE' || paymentDetails?.status === 'EXPIRED') {
        localStorage.removeItem(`${profile?.id}_${STORAGE_KEYS.PAYMENT_ID}`)
        setPaymentId(null)
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

export default PaymentProgress
