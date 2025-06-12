import { HlTwapOrderData } from 'entities/hyperliquid'

import OrderTwapWrapper from './OrderTwapWrapper'
import { OrderTwapProvider } from './useOrderTwapContext'

type Props = {
  isLoading: boolean
  data: HlTwapOrderData[] | undefined
  isDrawer: boolean
  isExpanded: boolean
  toggleExpand: () => void
  onPageChange: (page: number) => void
}

export default function OrderTwapView(props: Props) {
  return (
    <OrderTwapProvider>
      <OrderTwapWrapper {...props} />
    </OrderTwapProvider>
  )
}
