import { useResponsive } from 'ahooks'
import React, { useMemo } from 'react'

import TraderLabels from 'components/@ui/TraderLabels'
import { TraderData } from 'entities/trader'
import { Box, Flex } from 'theme/base'
import { SxProps } from 'theme/types'
import { PERFORMANCE_LABEL_KEY, TimeFrameEnum } from 'utils/config/enums'
import { LABEL_TOOLTIP_TRANSLATION, LABEL_TRANSLATION, STATISTIC_TYPE_TRANSLATIONS } from 'utils/config/translations'

const TradeLabelsFrame = ({
  traderStats,
  sx,
  showedItems,
}: { traderStats?: TraderData[]; showedItems?: number } & SxProps) => {
  const { sm } = useResponsive()
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
    // eslint-disable-next-line react/jsx-no-undef
    <Box sx={{ alignItems: 'center', gap: 2, display: 'flex', ...(sx ?? {}) }}>
      <TraderLabels labels={labels} tooltipPlacement="bottom" showedItems={showedItems} />
    </Box>
  ) : (
    <></>
  )
}

export default TradeLabelsFrame
