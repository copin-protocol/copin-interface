import { OrderData } from 'entities/trader'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'

export function getOrderData({
  isOpening,
  orderData,
  protocol,
}: {
  isOpening: boolean
  orderData: OrderData[] | undefined
  protocol: ProtocolEnum
}) {
  let orders = [...(orderData ?? [])].sort((x, y) =>
    x.blockTime < y.blockTime ? -1 : x.blockTime > y.blockTime ? 1 : x.logId < y.logId ? -1 : x.logId > y.logId ? 1 : 0
  )
  if (protocol === ProtocolEnum.GMX) {
    orders = orders?.filter((e) => e.type !== OrderTypeEnum.CLOSE)
  }

  orders = orders?.map((_o, index) => {
    if (index === 0 || (!isOpening && index === (orders?.length ?? 0) - 1)) return _o
    if (_o.sizeDeltaNumber === 0) {
      if (_o.type === OrderTypeEnum.DECREASE) {
        if (_o.collateralDeltaInTokenNumber) {
          _o.collateralDeltaInTokenNumber = -1 * _o.collateralDeltaInTokenNumber
        }
        if (_o.collateralDeltaNumber) {
          _o.collateralDeltaNumber = -1 * _o.collateralDeltaNumber
        }
      }
      _o.type = OrderTypeEnum.MARGIN_TRANSFERRED
    }
    return _o
  })

  return orders ?? ([] as OrderData[])
}
