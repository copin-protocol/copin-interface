import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { getDepthHistoriesApi } from 'apis/cexStatsApis'
import NoDataFound from 'components/@ui/NoDataFound'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import { FormattedDepthPairData } from 'entities/cexStats'
import { isMobile } from 'hooks/helpers/useIsMobile'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { MIN_TICK_GAP, YAXIS_WIDTH } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PLATFORM_TEXT_TRANS } from 'utils/config/translations'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { parseExchangeImage } from 'utils/helpers/transform'

import DepthPercentageFilter, { DepthPercentageFilterProps } from './DepthPercentageFilter'

export default function DepthPairDetails({
  depthPair,
  exchange,
}: {
  depthPair: FormattedDepthPairData
  exchange: CopyTradePlatformEnum
}) {
  const [to, setTo] = useState(dayjs().utc().valueOf())
  const [from, setFrom] = useState(dayjs(to).utc().subtract(7, 'day').valueOf())

  const depthOptions: DepthPercentageFilterProps[] = ['0.1', '0.15', '0.2', '0.3', '0.4'].map((e) => {
    return {
      id: e,
      value: e,
      label: `Depth ${e}%`,
    }
  })
  const { currentOption: currentDepthPercent, changeCurrentOption: changeDepthPercent } = useOptionChange({
    optionName: 'depth',
    options: depthOptions,
  })

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_CEX_DEPTH_HISTORIES, depthPair.pair, currentDepthPercent.id, from, to],
    () => getDepthHistoriesApi({ symbol: depthPair.pair, exchange, from, to, depthPercentage: currentDepthPercent.id }),
    {
      enabled: !!depthPair,
      retry: 0,
    }
  )

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && !data && <NoDataFound />}
      {data && (
        <Box pb={0} sx={{ border: 'small', borderTop: 'none', borderColor: 'transparent' }}>
          <Flex p={12} alignItems="center" flexWrap="wrap" sx={{ gap: 3 }}>
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Image src={parseExchangeImage(exchange)} width={24} height={24} />
              <Type.CaptionBold>{PLATFORM_TEXT_TRANS[exchange]}</Type.CaptionBold>
            </Flex>
            <VerticalDivider />
            <DepthPercentageFilter
              options={depthOptions}
              currentFilter={currentDepthPercent}
              handleFilterChange={changeDepthPercent}
            />
            <RangeFilter
              isRangeSelection
              forceDisplaySelectedDate
              from={dayjs(from).local().toDate()}
              to={dayjs(to).local().toDate()}
              changeTimeRange={(range) => {
                setFrom(dayjs(range.from).utc().valueOf())
                setTo(dayjs(range.to).utc().valueOf())
              }}
              maxDate={dayjs().local().toDate()}
              posDefine={{ top: '40px' }}
              iconColor="primary1"
              iconHoverColor="primary1"
            />
          </Flex>
          <Box
            bg="neutral7"
            my={3}
            mx={3}
            px={12}
            sx={{
              borderRadius: '2px',
              border: 'small',
              borderTop: 'small',
              borderColor: 'neutral4',
            }}
          >
            <Box width="100%" overflow="hidden" sx={{ pt: 12 }}>
              <Box
                sx={{
                  '.recharts-cartesian-axis-tick': {
                    text: {
                      fill: 'neutral3',
                    },
                  },
                  fontSize: isMobile ? 12 : 16,
                }}
              >
                <ResponsiveContainer minHeight="80svh">
                  <ComposedChart data={data} margin={{ top: 4, left: 4, right: 4, bottom: 4 }}>
                    <CartesianGrid stroke={themeColors.neutral4} strokeDasharray="3 3" opacity={0.5} />
                    <XAxis dataKey="date" stroke={themeColors.neutral4} minTickGap={MIN_TICK_GAP} />
                    <YAxis
                      width={YAXIS_WIDTH}
                      stroke={themeColors.neutral4}
                      tickFormatter={(value) => `$${compactNumber(value, 0)}`}
                    />
                    <Line
                      type="monotone"
                      name="Long Volume"
                      dataKey="longVolume"
                      stroke={themeColors.green1}
                      strokeWidth={0.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      name="Short Volume"
                      dataKey="shortVolume"
                      stroke={themeColors.red1}
                      strokeWidth={0.5}
                      dot={false}
                    />
                    <Legend />
                    <Tooltip
                      offset={isMobile ? 100 : 20}
                      contentStyle={{
                        backgroundColor: themeColors.neutral8,
                        borderColor: 'transparent',
                      }}
                      formatter={tooltipFormatter}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

function tooltipFormatter(value: any, index: any, item: any) {
  const _value = value as number
  if (item.unit === '%') return formatNumber(_value, 1)
  return formatNumber(_value, _value < 1 && _value > -1 ? 1 : 0)
}
