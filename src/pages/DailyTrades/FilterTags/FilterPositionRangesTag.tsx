import { POSITION_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import { Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

import TagWrapper from '../../../theme/Tag/TagWrapper'
import { useDailyPositionsContext } from '../Positions/usePositionsProvider'

export default function FilterPositionRangesTag() {
  const { ranges, resetFilterRange } = useDailyPositionsContext()
  if (!ranges.length) return null
  return (
    <>
      {ranges.map((values) => {
        //@ts-ignore
        const config = POSITION_RANGE_CONFIG_MAPPING[values.field]
        let text = ''
        let prefix = ''
        let suffix = ''
        if (config.unit === '$') {
          prefix = config.unit
        } else {
          suffix = config.unit
        }
        if (config.unit === 'min') {
          let gte: string | undefined = values.gte != null ? formatNumber(values.gte, 2, 2) : undefined
          let lte: string | undefined = values.lte != null ? formatNumber(values.lte, 2, 2) : undefined
          let suffixGte = 'min'
          let suffixLte = 'min'
          if ((values.gte as number) > 600) {
            gte = formatNumber((values.gte as number) / 60, 2, 2)
            suffixGte = 'h'
          }
          if ((values.lte as number) > 600) {
            lte = formatNumber((values.lte as number) / 60, 2, 2)
            suffixLte = 'h'
          }
          text = formatRangeValue({ gte, lte, prefixLte: '', suffixLte, prefixGte: '', suffixGte })
        } else {
          text = formatRangeValue({
            gte: values.gte,
            lte: values.lte,
            prefixLte: prefix,
            suffixLte: suffix,
            prefixGte: prefix,
            suffixGte: suffix,
          })
        }
        return (
          <TagWrapper key={values.field as any} onClear={() => resetFilterRange({ valueKey: values.field })}>
            <Type.Caption>{config.title}:</Type.Caption>
            <Type.Caption>{text}</Type.Caption>
          </TagWrapper>
        )
      })}
    </>
  )
}

function formatRangeValue({
  prefixLte,
  suffixLte,
  prefixGte,
  suffixGte,
  gte,
  lte,
}: {
  prefixGte: string
  suffixGte: string
  prefixLte: string
  suffixLte: string
  gte: string | number | undefined
  lte: string | number | undefined
}) {
  let text = ''
  if (gte != null && lte != null) {
    text = `${prefixGte}${formatNumber(gte, 2, 2)}${suffixGte} to ${prefixLte}${formatNumber(lte, 2, 2)}${suffixLte}`
  } else if (gte != null) {
    text = `>${prefixGte}${formatNumber(gte, 2, 2)}${suffixGte}`
  } else if (lte != null) {
    text = `<${prefixLte}${formatNumber(lte, 2, 2)}${suffixLte}`
  }
  return text
}
