import { ArrowSquareOut } from '@phosphor-icons/react'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import ValueChange from 'pages/PerpDEXsExplorer/components/ValueChange'
import {
  MARGIN_MODE_MAPPING,
  PERP_DEX_TYPE_MAPPING,
  POSITION_MODE_MAPPING,
} from 'pages/PerpDEXsExplorer/constants/perpdex'
import { FULL_TITLE_MAPPING, TITLE_MAPPING } from 'pages/PerpDEXsExplorer/constants/title'
import { TOOLTIP_CONTENT_MAPPING } from 'pages/PerpDEXsExplorer/constants/tooltip'
import { ExternalResource, NormalValueComponentType } from 'pages/PerpDEXsExplorer/types'
import { getChangeValueConfig } from 'pages/PerpDEXsExplorer/utils'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'
import { compactNumber, formatDate, formatDuration, formatNumber } from 'utils/helpers/format'

const CaptionTag = styled(Box)`
  width: max-content;
  font-size: 13px;
  line-height: 24px;
  font-weight: 400;
  padding: 0 8px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.neutral6};
`

/**
 * Use for column like: $20.2b +100.2%
 */
export function renderChangeValue({
  data,
  valueKey,
  valuePrefix,
  valueSuffix,
  changeValuePrefix,
  changeValueSuffix,
  externalResource,
  topValueHighlighting = true,
}: {
  data: PerpDEXSourceResponse | undefined
  valueKey: keyof PerpDEXSourceResponse
  valuePrefix?: string
  valueSuffix?: string
  changeValuePrefix?: string
  changeValueSuffix?: string
  externalResource?: ExternalResource
  topValueHighlighting?: boolean
}) {
  const value = (data?.[valueKey] as any) ?? 0
  //@ts-ignore
  const lastValue = (data?.lastData?.[valueKey] as any) ?? 0
  const changeValue = !!lastValue ? ((value - lastValue) / lastValue) * 100 : undefined
  const valueConfig = getChangeValueConfig({ value, valueKey })
  return (
    <ValueChange
      value={value}
      valuePrefix={valuePrefix}
      valueSuffix={valueSuffix}
      changeValue={changeValue}
      changeValuePrefix={changeValuePrefix}
      changeValueSuffix={changeValueSuffix}
      // valueColor={topValueHighlighting ? getValueColor({ value, idealValue: externalResource?.[valueKey] }) : undefined}
      valueColor={valueConfig.color}
      valueWeight={valueConfig.fontWeight}
      isInteger={valueConfig.isInteger}
      isCompactNumber={valueConfig.isCompactNumber}
    />
  )
}

/**
 * Use for column like: +$20.2b
 */
export function renderNormalValue({
  data,
  valueKey,
  type,
  prefix,
  suffix,
  externalResource,
  topValueHighlighting = false,
}: {
  type: NormalValueComponentType
  data: PerpDEXSourceResponse | undefined
  valueKey: keyof PerpDEXSourceResponse
  prefix?: string
  suffix?: string
  externalResource?: ExternalResource
  topValueHighlighting?: boolean
}) {
  const value = data?.[valueKey] as any
  let content: ReactNode = ''
  let color: string | undefined = undefined
  let fontWeight: string | undefined = undefined

  switch (type) {
    case 'number':
      {
        const {
          isCompactNumber,
          isInteger,
          color: _color,
          fontWeight: _fontWeight,
        } = getChangeValueConfig({ value, valueKey })
        content = isInteger
          ? formatNumber(value, 0, 0)
          : isCompactNumber
          ? compactNumber(value ?? 0, 2)
          : formatNumber(value, 2, 2)
        color = _color
        fontWeight = _fontWeight
      }
      break
    case 'timeDuration':
      content = formatDuration(value ?? '')
      break
    case 'date':
      content = formatDate(value ?? '', DATE_FORMAT)
      break
    case 'boolean':
      {
        // const Icon = !!value ? CheckCircle : MinusCircle
        const text = !!value ? 'Yes' : 'No'
        const color = !!value ? 'green2' : 'neutral3'
        // content = <IconBox icon={<Icon size={16} />} color={color} sx={{ width: '100%', textAlign: 'center' }} />
        content = <Type.Caption color={color}>{text}</Type.Caption>
      }
      break

    case 'percentage':
      {
        const text = `${formatNumber(value, 2, 2)} %`
        const color = value > 0 ? 'neutral1' : 'neutral3'
        content = <Type.Caption color={color}>{text}</Type.Caption>
      }
      break
    case 'greaterThanZero':
      {
        const color = value > 0 ? 'neutral1' : 'neutral3'
        content = <Type.Caption color={color}>{formatNumber(value, 2, 2)}</Type.Caption>
      }
      break
    default:
      break
  }

  return (
    <Type.Caption
      color={color ? color : !!value ? 'neutral1' : 'neutral3'}
      sx={{ fontWeight: fontWeight ? fontWeight : 'normal' }}
    >
      {value != null && prefix}
      {content}
      {value != null && suffix}
    </Type.Caption>
  )
}

export function renderSignValue({
  data,
  valueKey,
  valuePrefix,
  valueSuffix,
}: {
  data: PerpDEXSourceResponse | undefined
  valueKey: keyof PerpDEXSourceResponse
  valuePrefix?: string
  valueSuffix?: string
}) {
  const value = (data?.[valueKey] as any) ?? 0
  const isInteger = Math.abs(value) < 1_000
  return (
    <SignedText
      prefixZero
      value={value}
      prefix={valuePrefix}
      suffix={valueSuffix}
      maxDigit={isInteger ? 0 : 2}
      minDigit={isInteger ? 0 : 2}
      isCompactNumber={isInteger ? false : true}
    />
  )
}

/**
 * Use for column like: $20.2b with highlight text
 */
export function renderLSRatio({
  data,
  valueKey,
}: {
  data: PerpDEXSourceResponse | undefined
  valueKey: keyof PerpDEXSourceResponse
}) {
  const longRatio = ((data?.[valueKey] as number | undefined) ?? 0) * 100
  return longRatio == null ? (
    '--'
  ) : (
    <>
      <ProgressBar percent={longRatio} color="green2" bg="red2" sx={{ width: '90%' }} height={2} />
      <Flex alignItems="center" justifyContent="space-between" sx={{ width: '90%' }}>
        <Type.Small color="green2">{compactNumber(longRatio, 0)}%</Type.Small>
        <Type.Small color="red2">{compactNumber(100 - longRatio, 0)}%</Type.Small>
      </Flex>
    </>
  )
}

export function renderTableText(valueKey: keyof PerpDEXSourceResponse) {
  const tooltipContent = TOOLTIP_CONTENT_MAPPING[valueKey]
  const fullText = FULL_TITLE_MAPPING[valueKey]
  return tooltipContent ? (
    <LabelWithTooltip id={`tt_perp_${valueKey}`} tooltip={tooltipContent}>
      {fullText ?? TITLE_MAPPING[valueKey]}
    </LabelWithTooltip>
  ) : (
    fullText ?? ((TITLE_MAPPING[valueKey] ?? '') as ReactNode)
  )
}

export function renderTableTitleWithTooltip(valueKey: keyof PerpDEXSourceResponse, title?: ReactNode) {
  const tooltipContent = TOOLTIP_CONTENT_MAPPING[valueKey]
  return tooltipContent ? (
    <LabelWithTooltip id={`tt_perp_${valueKey}`} tooltip={tooltipContent}>
      {title ?? TITLE_MAPPING[valueKey]?.toUpperCase()}
    </LabelWithTooltip>
  ) : (
    title ?? ((TITLE_MAPPING[valueKey]?.toUpperCase() ?? '') as ReactNode)
  )
}

/**
 * Use for perpDEX rendering
 */
export function renderPerpDexTypeItems({ data }: { data: PerpDEXSourceResponse | undefined }) {
  return (
    <>
      {data?.type?.map((type) => {
        const perpDexTypeConfig = PERP_DEX_TYPE_MAPPING[type]
        return (
          <CaptionTag key={type} color={perpDexTypeConfig.color}>
            {perpDexTypeConfig.label}
          </CaptionTag>
        )
      })}
    </>
  )
}

export function renderMarginModeItems({ data }: { data: PerpDEXSourceResponse | undefined }) {
  return (
    <>
      {data?.marginModes?.map((marginMode) => {
        const config = MARGIN_MODE_MAPPING[marginMode]
        return (
          <CaptionTag key={marginMode} color={config.color}>
            {config.label}
          </CaptionTag>
        )
      })}
    </>
  )
}

export function renderPositionModeItems({ data }: { data: PerpDEXSourceResponse | undefined }) {
  return (
    <>
      {data?.positionModes?.map((positionMode) => {
        const config = POSITION_MODE_MAPPING[positionMode]
        return (
          <CaptionTag key={positionMode} color={config.color}>
            {config.label}
          </CaptionTag>
        )
      })}
    </>
  )
}

export function renderAudit({ data }: { data: PerpDEXSourceResponse | undefined }) {
  if (!data?.audit) return '--'
  return (
    <Flex
      as="a"
      href={data.audit}
      target="_blank"
      sx={{
        alignItems: 'center',
        gap: 1,
        color: 'primary1',
        '&:hover': { color: 'primary2' },
      }}
    >
      <Type.Caption>Explore</Type.Caption> <ArrowSquareOut size={16} />
    </Flex>
  )
}

/**
 * Use for table rendering
 */
export function renderRowBackground(parentElement: HTMLElement) {
  const listTr = parentElement.getElementsByTagName('tr')
  const listVisibleItem: { element: HTMLTableRowElement; children: HTMLTableRowElement[] }[] = []
  for (const row of listTr) {
    row.classList.remove('row__even')
    row.classList.remove('row__odd')
    if (!row.classList.contains('row__hidden')) {
      listVisibleItem.push({ element: row, children: [] })
    }
    // } else if (row.hasAttribute('data-children-key')) {
    //   const lastElementConfig = listVisibleItem.at(-1)
    //   lastElementConfig?.children.push(row)
    // }
  }
  listVisibleItem.forEach((row, index) => {
    if (index % 2 === 0) {
      row.element.classList.add('row__even')
      // row.children?.forEach((child, index) => {
      //   if (index % 2 === 0) {
      //     child.classList.add('row__child__even')
      //   } else {
      //     child.classList.add('row__child__odd')
      //   }
      // })
    } else {
      row.element.classList.add('row__odd')
      // row.children?.forEach((child, index) => {
      //   if (index % 2 === 0) {
      //     child.classList.add('row__child__even')
      //   } else {
      //     child.classList.add('row__child__odd')
      //   }
      // })
    }
  })
}
