import { TextProps, Type } from 'theme/base'
import { OrderTypeEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

function signOrderDelta(type: OrderTypeEnum, delta: number) {
  if (delta === 0) return ''
  switch (type) {
    case OrderTypeEnum.DECREASE:
    case OrderTypeEnum.CLOSE:
    case OrderTypeEnum.LIQUIDATE:
      return '-'
    case OrderTypeEnum.OPEN:
    case OrderTypeEnum.INCREASE:
    case OrderTypeEnum.MARGIN_TRANSFERRED:
      return delta > 0 ? '+' : ''
    default:
      return ''
  }
}

export const DeltaText = ({
  type,
  delta,
  maxDigit = 0,
  minDigit,
  prefix = '',
  suffix = '',
  ...props
}: {
  type: OrderTypeEnum
  delta: number | undefined
  maxDigit?: number
  minDigit?: number
  prefix?: string
  suffix?: string
} & TextProps) => {
  return (
    <Type.Caption {...props}>
      {delta == null || isNaN(delta) ? (
        '--'
      ) : (
        <>{`${signOrderDelta(type, delta)}${prefix}${formatNumber(Math.abs(delta), 2, 2)} ${suffix}`} </>
      )}
    </Type.Caption>
  )
}
