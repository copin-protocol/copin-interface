import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { AmountText } from 'components/@ui/DecoratedText/ValueText'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { HYPERLIQUID_API_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import useHyperliquidPortfolio from 'hooks/features/trader/useHyperliquidPortfolio'
import { useHyperliquidTraderContext } from 'hooks/features/trader/useHyperliquidTraderContext'
import { Button } from 'theme/Buttons'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import TabItem from 'theme/Tab/TabItem'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { TimeFilterByEnum } from 'utils/config/enums'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import { formatChartData } from './helpers'

interface TimeSelectionProps {
  timeOption: TimeFilterProps
  onChange: (v: TimeFilterProps) => void
}

function TimeSelection({ timeOption, onChange }: TimeSelectionProps) {
  const { lg } = useResponsive()
  return lg ? (
    <Flex alignItems="center" sx={{ '& > button:first-child': { pl: 0 }, '& > button:last-child': { pr: 0 } }}>
      {HYPERLIQUID_API_FILTER_OPTIONS.map((option, index) => {
        return (
          <TabItem
            key={index}
            active={timeOption.id === option.id}
            onClick={() => onChange(option)}
            sx={{
              px: ['6px', '6px', '8px', '8px'],
            }}
          >
            <Flex
              sx={{
                cursor: 'pointer',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Type.Caption
                sx={{
                  cursor: 'pointer',
                }}
                color="inherit"
              >
                {option.text}
              </Type.Caption>
            </Flex>
          </TabItem>
        )
      })}
    </Flex>
  ) : (
    <Dropdown
      buttonVariant="ghost"
      inline
      dismissible={false}
      menuDismissible
      menuSx={{ width: 56, minWidth: 56 }}
      menu={
        <>
          {HYPERLIQUID_API_FILTER_OPTIONS.map((option) => {
            return (
              <DropdownItem
                key={option.id}
                type="button"
                variant="ghost"
                isActive={option.id === timeOption.id}
                onClick={() => {
                  onChange(option)
                }}
              >
                {option.text}
              </DropdownItem>
            )
          })}
        </>
      }
    >
      {timeOption.text}
    </Dropdown>
  )
}

interface PnLChartDatum {
  fullDate: string
  time: number
  pnl: number
}

interface PnLChartProps {
  data: PnLChartDatum[]
  timeOption: TimeFilterProps
}

function PnLChart({ data, timeOption }: PnLChartProps) {
  const { sm } = useResponsive()
  const offset = gradientOffset(data)
  const formatXAxis = (ts: number) => {
    const d = dayjs(ts).local()
    if (timeOption.id === TimeFilterByEnum.LAST_24H) return d.format('HH:mm')
    if (timeOption.id === TimeFilterByEnum.S7_DAY) return d.format('MMM D')
    if (timeOption.id === TimeFilterByEnum.S30_DAY || timeOption.id === TimeFilterByEnum.ALL_TIME)
      return d.format('MMM YYYY')
    return d.format('HH:mm')
  }
  return (
    <Box flex={2}>
      <ResponsiveContainer width="100%" height={sm ? 160 : 150}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor={themeColors.green1} stopOpacity={0.2} />
              <stop offset={offset} stopColor={themeColors.red2} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor={themeColors.green1} stopOpacity={1} />
              <stop offset={offset} stopColor={themeColors.red2} stopOpacity={1} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            minTickGap={40}
            tick={{ fill: themeColors.neutral3, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatXAxis}
          />
          <YAxis
            tickFormatter={(v) => `${v < 0 ? '-' : ''}$${compactNumber(Math.abs(v))}`}
            tick={{ fill: themeColors.neutral3, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: themeColors.neutral5,
              color: themeColors.neutral1,
              border: 'none',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{
              color: themeColors.neutral3,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v < 0 ? '-' : ''}$${formatNumber(Math.abs(v), 0)}`, 'PnL']}
            labelFormatter={(_, payload) => {
              if (payload && payload.length && payload[0].payload.fullDate) {
                return payload[0].payload.fullDate
              }
              return ''
            }}
          />
          <Area
            type="step"
            dataKey="pnl"
            stroke="url(#strokeColor)"
            strokeWidth={2}
            fill="url(#splitColor)"
            dot={false}
            activeDot={{ r: 5, fill: themeColors.neutral3, stroke: themeColors.neutral1, strokeWidth: 1 }}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  )
}

type ToggleButtonValue = string | number | boolean
interface ToggleButtonGroupProps<T extends ToggleButtonValue> {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
}

function ToggleButtonGroup<T extends ToggleButtonValue>({ options, value, onChange }: ToggleButtonGroupProps<T>) {
  return (
    <Flex alignItems="center" sx={{ gap: '2px', p: 1, border: 'small', borderColor: 'neutral5', borderRadius: '32px' }}>
      {options.map((opt) => (
        <Button
          key={String(opt.value)}
          type="button"
          variant="ghostActive"
          onClick={() => onChange(opt.value)}
          px={1}
          py="2px"
          sx={{
            borderRadius: '16px',
            color: value === opt.value ? 'neutral1' : 'neutral3',
            backgroundColor: value === opt.value ? 'neutral4' : 'transparent',
          }}
        >
          <Type.Caption>{opt.label}</Type.Caption>
        </Button>
      ))}
    </Flex>
  )
}

export default function HLChartPnL() {
  const {
    hlPortfolioData,
    timeOption,
    changeTimeOption,
    isCombined,
    setIsCombined,
    isAccountValue,
    setIsAccountValue,
  } = useHyperliquidTraderContext()

  const { historyData } = useHyperliquidPortfolio({
    hlPortfolioData,
    isCombined,
    isAccountValue,
    timeOption: timeOption.id,
  })
  const chartData = useMemo(() => formatChartData(historyData), [historyData])
  const latestPnL = chartData.length ? chartData[chartData.length - 1].pnl : 0

  return (
    <Flex>
      {/*{xl && (*/}
      {/*  <Box flex={1} px={12} sx={{ borderRight: 'small', borderColor: 'neutral4' }}>*/}
      {/*    <SectionTitle icon={Gauge} title={<Trans>PERFORMANCE</Trans>} sx={{ mt: 12, mb: 2 }} />*/}
      {/*    <HLPerformance />*/}
      {/*  </Box>*/}
      {/*)}*/}
      <Flex flex={2} flexDirection="column">
        <Flex mt={[2, 1]} alignItems="center" justifyContent="space-between" px={12}>
          <TimeSelection timeOption={timeOption} onChange={changeTimeOption} />
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <ToggleButtonGroup<boolean>
              options={[
                { label: 'COMBINED', value: true },
                { label: 'PERP', value: false },
              ]}
              value={isCombined}
              onChange={setIsCombined}
            />
            <ToggleButtonGroup<boolean>
              options={[
                { label: 'PNL', value: false },
                { label: 'VALUE', value: true },
              ]}
              value={isAccountValue}
              onChange={setIsAccountValue}
            />
          </Flex>
        </Flex>
        <Flex mt={1} flexDirection="column" alignItems="center">
          <Type.Caption>
            {timeOption.text} {isAccountValue ? 'ACCOUNT VALUE' : 'PNL'} ({isCombined ? 'COMBINED' : 'PERP ONLY'})
          </Type.Caption>
          <Type.H5
            color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}
            sx={{ display: 'block', textAlign: 'center' }}
          >
            <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
          </Type.H5>
        </Flex>
        <PnLChart data={chartData} timeOption={timeOption} />
      </Flex>
    </Flex>
  )
}

function gradientOffset(data: PnLChartDatum[]) {
  if (!data.length) return 0.5
  const dataMax = Math.max(...data.map((i) => i.pnl))
  const dataMin = Math.min(...data.map((i) => i.pnl))
  if (dataMax <= 0) return 0
  if (dataMin >= 0) return 1
  return dataMax / (dataMax - dataMin)
}
