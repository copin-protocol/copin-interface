import { Flex, Type } from 'theme/base'
import { compactNumber, formatNumber } from 'utils/helpers/format'

export default function ValueChange({
  value,
  valuePrefix,
  valueSuffix,
  changeValue,
  changeValuePrefix,
  changeValueSuffix,
  valueColor = 'neutral1',
  valueWeight = 'normal',
  isInteger = false,
  isCompactNumber = false,
}: {
  value: number | undefined
  valuePrefix?: string
  valueSuffix?: string
  changeValue: number | undefined
  changeValuePrefix?: string
  changeValueSuffix?: string
  valueColor?: string
  valueWeight?: string
  isInteger?: boolean
  isCompactNumber?: boolean
}) {
  const changeValueColor = !changeValue ? 'neutral3' : changeValue > 1 ? 'green2' : 'red2'
  const changeValueBg = !changeValue ? 'neutral8' : changeValue > 1 ? '#0F231D' : '#1A1210'
  return (
    <Flex sx={{ alignItems: 'center', gap: 1 }}>
      <Type.Caption color={!!value ? valueColor : 'neutral3'} sx={{ fontWeight: valueWeight }}>
        {value != null && valuePrefix}
        {isInteger ? formatNumber(value, 0, 0) : isCompactNumber ? compactNumber(value, 2) : formatNumber(value, 2, 2)}
        {value != null && valueSuffix}
      </Type.Caption>
      <Type.Small
        sx={{ fontSize: '11px', lineHeight: '16px', px: '2px', borderRadius: '2px' }}
        color={changeValue == null ? 'neutral3' : changeValueColor}
        bg={changeValueBg}
      >
        {changeValue == null ? (
          '--'
        ) : (
          <>
            {(changeValue ?? 0) > 0 && '+'}
            {changeValuePrefix}
            {compactNumber(changeValue, 1)}
            {changeValueSuffix}
          </>
        )}
      </Type.Small>
    </Flex>
  )
}
