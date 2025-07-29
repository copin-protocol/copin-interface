import React from 'react'

import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { PNL_TIER_KEY, VOLUME_TIER_KEY } from 'utils/config/enums'
import { LABEL_TOOLTIP_TRANSLATION, LABEL_TRANSLATION } from 'utils/config/translations'

import LabelWithTooltip from './LabelWithTooltip'

const IF_BG_COLOR = '#422c54'
const IF_COLOR = '#a05fd3'

const getLabelColor = (key: string | undefined, { isIF, isPositive }: { isIF?: boolean; isPositive?: boolean }) => {
  if (isIF) return IF_BG_COLOR
  if (isPositive != null) {
    if (isPositive) return '#7ce45b'
    return '#f37b53'
  }
  switch (key) {
    case VOLUME_TIER_KEY.VOLUME_TIER1:
      return `${themeColors.primary1}20`
    case VOLUME_TIER_KEY.VOLUME_TIER2:
      return `${themeColors.primary1}30`
    case VOLUME_TIER_KEY.VOLUME_TIER3:
      return `${themeColors.primary1}40`
    case VOLUME_TIER_KEY.VOLUME_TIER4:
      return `${themeColors.primary1}50`
    case VOLUME_TIER_KEY.VOLUME_TIER5:
      return `${themeColors.primary1}60`
    case VOLUME_TIER_KEY.VOLUME_TIER6:
      return `${themeColors.primary1}70`
    case VOLUME_TIER_KEY.VOLUME_TIER7:
      return `${themeColors.primary1}80`
    case PNL_TIER_KEY.PNL_TIER1:
      return `${themeColors.red2}50`
    case PNL_TIER_KEY.PNL_TIER2:
      return `${themeColors.red2}40`
    case PNL_TIER_KEY.PNL_TIER3:
      return `${themeColors.red2}30`
    case PNL_TIER_KEY.PNL_TIER4:
      return `${themeColors.red2}20`
    case PNL_TIER_KEY.PNL_TIER5:
      return `${themeColors.green1}20`
    case PNL_TIER_KEY.PNL_TIER6:
      return `${themeColors.green1}30`
    case PNL_TIER_KEY.PNL_TIER7:
      return `${themeColors.green1}40`
    case PNL_TIER_KEY.PNL_TIER8:
      return `${themeColors.green1}50`
    default:
      return 'rgba(255, 255, 255, 0.1)'
  }
}

const TraderLabels = ({
  labels,
  showedItems,
  tooltipPlacement,
  shouldShowTooltip = true,
  isIF,
  isPositive,
}: {
  labels: { key: string; title?: React.ReactNode; tooltip?: React.ReactNode }[]
  showedItems?: number
  tooltipPlacement?: string
  shouldShowTooltip?: boolean
  isIF?: boolean
  isPositive?: boolean
}) => {
  if (!showedItems) {
    showedItems = labels.length
  }

  const tagSx = isIF ? { px: '4px', py: 0, borderRadius: '2px' } : { px: '4px', py: 0 }
  const textColor = isPositive != null ? '#000' : undefined

  return (
    <>
      {labels.slice(0, showedItems).map((label) =>
        shouldShowTooltip ? (
          <LabelWithTooltip
            tooltipPlacement={tooltipPlacement}
            key={label.key}
            id={`tt_label_${label.key}`}
            tooltip={label.tooltip || LABEL_TOOLTIP_TRANSLATION[label.key]}
          >
            <Tag sx={tagSx} bg={getLabelColor(label.key, { isIF, isPositive })}>
              <Type.Caption color={textColor}>{label.title || LABEL_TRANSLATION[label.key]}</Type.Caption>
            </Tag>
          </LabelWithTooltip>
        ) : (
          <Tag key={label.key} sx={tagSx} bg={getLabelColor(label.key, { isIF, isPositive })}>
            {isIF && (
              <Box
                width={10}
                height={10}
                sx={{ fontSize: '8px', lineHeight: '10px', color: IF_COLOR, fontWeight: 'bold' }}
              >
                IF
              </Box>
            )}
            <Type.Caption color={textColor}>{label.title || LABEL_TRANSLATION[label.key]}</Type.Caption>
          </Tag>
        )
      )}
      {labels.length > showedItems && (
        <Tag sx={tagSx} bg={getLabelColor(undefined, { isIF, isPositive })}>
          <LabelWithTooltip
            tooltipClickable
            id="tt_more_labels"
            tooltipPlacement={tooltipPlacement}
            tooltip={
              <Flex sx={{ gap: 2, flexWrap: 'wrap', maxWidth: '200px' }}>
                {labels.slice(showedItems).map((label) =>
                  shouldShowTooltip ? (
                    <LabelWithTooltip
                      key={label.key}
                      id={`tt_label_${label.key}`}
                      tooltip={label.tooltip || LABEL_TOOLTIP_TRANSLATION[label.key]}
                    >
                      <Tag key={label.key} sx={tagSx} bg={getLabelColor(label.key, { isIF, isPositive })}>
                        <Type.Caption color={textColor}>{label.title || LABEL_TRANSLATION[label.key]}</Type.Caption>
                      </Tag>
                    </LabelWithTooltip>
                  ) : (
                    <Tag key={label.key} sx={tagSx} bg={getLabelColor(label.key, { isIF, isPositive })}>
                      <Type.Caption color={textColor}>{label.title || LABEL_TRANSLATION[label.key]}</Type.Caption>
                    </Tag>
                  )
                )}
              </Flex>
            }
          >
            <Type.Caption color={textColor}>+{labels.length - showedItems}</Type.Caption>
          </LabelWithTooltip>
        </Tag>
      )}
    </>
  )
}

export default TraderLabels
