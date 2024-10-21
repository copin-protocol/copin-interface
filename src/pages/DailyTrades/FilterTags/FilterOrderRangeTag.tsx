import { ORDER_RANGE_CONFIG_MAPPING } from 'components/@dailyTrades/configs'
import { Type } from 'theme/base'

import { useDailyOrdersContext } from '../Orders/useOrdersProvider'
import TagWrapper from './TagWrapper'

export default function FilterOrderRangesTag() {
  const { ranges, resetFilterRange } = useDailyOrdersContext()
  if (!ranges.length) return null
  return (
    <>
      {ranges.map((values) => {
        //@ts-ignore
        const config = ORDER_RANGE_CONFIG_MAPPING[values.field]
        let text = ''
        let prefix = ''
        let suffix = ''
        if (config.unit === '$') {
          prefix = config.unit
        } else {
          suffix = config.unit
        }
        if (values.gte != null && values.lte != null) {
          text = `${prefix}${values.gte}${suffix} to ${prefix}${values.lte}${suffix}`
        } else if (values.gte != null) {
          text = `>${prefix}${values.gte}${suffix}`
        } else if (values.lte != null) {
          text = `<${prefix}${values.lte}${suffix}`
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
