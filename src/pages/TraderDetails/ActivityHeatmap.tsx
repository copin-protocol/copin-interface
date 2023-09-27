import { useSize } from 'ahooks'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ActivityCalendar, { Activity } from 'react-activity-calendar'
import { useQuery } from 'react-query'

import { getPositionsCounterApi } from 'apis/positionApis'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box } from 'theme/base'
import colors from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { formatLocalDate } from 'utils/helpers/format'

const COLORS = colors(true)

const ActivityHeatmap = ({ protocol, account }: { protocol: ProtocolEnum; account: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const lastDays = useRef<number>()
  const { data, isLoading } = useQuery(['positions-counter', account, protocol], () =>
    getPositionsCounterApi({ protocol, account })
  )

  const [days, setDays] = useState<number>()
  useEffect(() => {
    if (!size) return
    let newDays = Math.ceil(size.width / 16) * 7
    if (newDays > 365) newDays = 365
    if (newDays != lastDays.current) {
      setDays(newDays)
      lastDays.current = newDays
    }
  }, [size])
  const heatmapData = useMemo(() => {
    if (!days) return null
    const startDate = Date.now() - days * 24 * 3600 * 1000
    let heatmapData = data
      ? data.map((item) => ({
          date: item.date.split('T')[0],
          count: item.total,
          level: Math.min(3, item.total),
        }))
      : []
    if (heatmapData.length > 0 && new Date(heatmapData[0].date).getTime() < startDate) {
      heatmapData = heatmapData?.filter((item) => new Date(item.date).getTime() > startDate) ?? []
    }
    const start = dayjs(startDate).format('YYYY-MM-DD')
    const end = dayjs().format('YYYY-MM-DD')
    if (!heatmapData.length || heatmapData[0].date !== start) {
      heatmapData.unshift({
        date: start,
        count: 0,
        level: 0,
      })
    }
    if (!heatmapData.length || heatmapData[heatmapData.length - 1].date !== end) {
      heatmapData.push({
        date: end,
        count: 0,
        level: 0,
      })
    }
    return heatmapData
  }, [days, data])
  return (
    <Box ref={ref} sx={{ position: 'relative', width: '100%' }}>
      {!!heatmapData && (
        <>
          <ActivityCalendar
            hideTotalCount
            hideColorLegend
            fontSize={13}
            data={heatmapData as Activity[]}
            labels={{
              months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              totalCount: `{{count}} positions in ${days} days`,
              legend: {
                less: '0',
                more: '5+',
              },
            }}
            theme={{
              light: [
                COLORS.neutral6,
                `${COLORS.primary1}40`,
                `${COLORS.primary1}80`,
                `${COLORS.primary1}AA`,
                COLORS.primary1,
              ],
              dark: [
                COLORS.neutral6,
                `${COLORS.primary1}40`,
                `${COLORS.primary1}80`,
                `${COLORS.primary1}AA`,
                COLORS.primary1,
              ],
            }}
            style={{
              color: COLORS.neutral3,
            }}
            renderBlock={(block, activity) =>
              React.cloneElement(block, {
                'data-tooltip-id': 'activity-heatmap-tooltip',
                'data-tooltip-html': `${activity.count} positions on ${formatLocalDate(activity.date)}`,
              })
            }
          />
          <Tooltip id="activity-heatmap-tooltip" />
        </>
      )}
      {isLoading && <Loading />}
    </Box>
  )
}

export default ActivityHeatmap
