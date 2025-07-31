import { CaretDown, CaretUp } from '@phosphor-icons/react'
import React, { useMemo, useState } from 'react'

import TraderLabels from 'components/@ui/TraderLabels'
import { TraderData } from 'entities/trader'
import { Button } from 'theme/Buttons'
import { Box, Flex, IconBox } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SxProps } from 'theme/types'
import { BASE_LINE_HEIGHT } from 'utils/config/constants'
import { PERFORMANCE_LABEL_KEY, TimeFrameEnum } from 'utils/config/enums'
import { LABEL_TOOLTIP_TRANSLATION, LABEL_TRANSLATION, STATISTIC_TYPE_TRANSLATIONS } from 'utils/config/translations'

const TradeLabelsFrame = ({
  traderStats,
  sx,
  showedItems,
  shouldShowExpand,
  expandSx,
}: {
  traderStats?: TraderData[]
  showedItems?: number
  shouldShowExpand?: boolean
  expandSx?: any
} & SxProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const labels: { key: string; title: React.ReactNode; tooltip: React.ReactNode }[] = useMemo(() => {
    const allTimeLabels = traderStats?.find((data) => data && data.type === TimeFrameEnum.ALL_TIME)?.labels
    return (traderStats
      ?.map((data) =>
        data?.labels
          ?.filter(
            (label) =>
              data.type === TimeFrameEnum.ALL_TIME ||
              (!allTimeLabels?.includes(label) && !Object.keys(PERFORMANCE_LABEL_KEY).includes(label))
          )
          .map((label) => ({
            key: label,
            title: (
              <Flex sx={{ gap: 1 }}>
                <span>{data.type !== TimeFrameEnum.ALL_TIME && STATISTIC_TYPE_TRANSLATIONS[data.type]?.key}</span>
                <span>{LABEL_TRANSLATION[label as keyof typeof LABEL_TRANSLATION]}</span>
              </Flex>
            ),
            tooltip: LABEL_TOOLTIP_TRANSLATION[label as keyof typeof LABEL_TOOLTIP_TRANSLATION],
          }))
      )
      .flat()
      .filter((label) => label != null) ?? []) as { key: string; title: React.ReactNode; tooltip: React.ReactNode }[]
  }, [traderStats])

  return !!labels?.length ? (
    <Box
      sx={{
        display: isExpanded ? 'flex' : 'block',
        position: 'relative',
        overflow: shouldShowExpand ? 'hidden' : 'auto',
        height: 'auto',
      }}
    >
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexWrap: isExpanded ? 'wrap' : 'nowrap',
          gap: 1,
          alignItems: 'center',
          maxHeight: isExpanded ? 399 : 26,
          transition: isExpanded ? 'max-height 0.4s ease-in-out' : 'max-height 0s',
          ...(sx ?? {}),
        }}
      >
        <TraderLabels
          labels={labels}
          tooltipPlacement="bottom"
          showedItems={isExpanded ? labels.length : showedItems}
        />
      </Box>
      {isExpanded && <Box sx={{ width: 35 }} />}
      {labels.length > 3 && shouldShowExpand && (
        <Button
          variant="ghostPrimary"
          onClick={() => setIsExpanded((prev) => !prev)}
          sx={{
            height: 30,
            display: ['flex', 'flex', 'flex', 'none'],
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 99,
            pr: 1,
            pl: 25,
            background:
              !isExpanded &&
              'linear-gradient(to right, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.9));',
            ...expandSx,
          }}
        >
          {isExpanded ? (
            <>
              <IconBox icon={<CaretUp size={14} color={`${themeColors.neutral2}`} />} height={BASE_LINE_HEIGHT} />
            </>
          ) : (
            <>
              <IconBox icon={<CaretDown size={14} color={`${themeColors.neutral2}`} height={BASE_LINE_HEIGHT} />} />
            </>
          )}
        </Button>
      )}
    </Box>
  ) : (
    <></>
  )
}

export default TradeLabelsFrame
