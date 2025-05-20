import TagWrapper from 'theme/Tag/TagWrapper'
import { Type } from 'theme/base'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import { RangeFilterValues, TableFilterConfig } from './types'

export default function FilterRangeTags({
  ranges,
  rangeConfigMapping,
  onClear,
}: {
  ranges: RangeFilterValues[]
  rangeConfigMapping: Record<string, TableFilterConfig>
  onClear?: (key: string) => void
}) {
  if (!ranges.length) return null
  return (
    <>
      {ranges.map((values) => {
        //@ts-ignore
        const config = rangeConfigMapping[values.field]
        let text = ''
        let prefix = ''
        let suffix = ''
        if (config.unit === '$') {
          prefix = config.unit
        } else {
          suffix = config.unit ?? ''
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
          text = formatRangeValue({
            gte,
            lte,
            prefixLte: '',
            suffixLte,
            prefixGte: '',
            suffixGte,
            isCompactNumber: false,
          })
        } else {
          text = formatRangeValue({
            gte: values.gte,
            lte: values.lte,
            prefixLte: prefix,
            suffixLte: suffix,
            prefixGte: prefix,
            suffixGte: suffix,
            isCompactNumber: !!config.isCompactNumber,
          })
        }
        return (
          <TagWrapper
            key={values.field as any}
            onClear={onClear ? () => onClear(config?.urlParamKey ?? '') : undefined}
          >
            <Type.Caption>{config.label}:</Type.Caption>
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
  isCompactNumber,
}: {
  prefixGte: string
  suffixGte: string
  prefixLte: string
  suffixLte: string
  gte: string | number | undefined
  lte: string | number | undefined
  isCompactNumber: boolean
}) {
  let text = ''
  const formattedLte = lte == null ? lte : isCompactNumber ? compactNumber(lte) : formatNumber(lte, 2, 2)
  const formattedGte = gte == null ? gte : isCompactNumber ? compactNumber(gte) : formatNumber(gte, 2, 2)
  if (gte != null && lte != null) {
    text = `${prefixGte}${formattedGte}${suffixGte} to ${prefixLte}${formattedLte}${suffixLte}`
  } else if (gte != null) {
    text = `>${prefixGte}${formattedGte}${suffixGte}`
  } else if (lte != null) {
    text = `<${prefixLte}${formattedLte}${suffixLte}`
  }
  return text
}
