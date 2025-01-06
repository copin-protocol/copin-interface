import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ChartPositions from 'components/@charts/ChartPositions'
import { TimeRangeProps } from 'components/@charts/ChartPositions/types'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import { BackTestResultData, RequestBackTestData, SimulatorPosition } from 'entities/backTest.d'
import { PositionData } from 'entities/trader'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { Box, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { ALL_OPTION } from 'utils/config/trades'
import { getSymbolFromPair } from 'utils/helpers/transform'

import BacktestSummaryAndPositions from '../BacktestSummaryAndPositions'

export default function BacktestSingleResult({
  protocol,
  results,
  settings,
  onClearResult,
  renderActionButton,
  disabledShare,
}: {
  protocol: ProtocolEnum
  results: BackTestResultData[]
  settings: RequestBackTestData | undefined
  onClearResult?: () => void
  renderActionButton?: () => ReactElement
  disabledShare?: boolean
}) {
  const defaultToken = useRef<string>('')
  const data = results[0]
  const { simulatorPositions } = data
  const dataSimulations: SimulatorPosition[] | undefined = useMemo(() => {
    return simulatorPositions
      ?.map((simulatedData) => ({
        ...simulatedData,
        position: {
          ...(simulatedData.position ?? ({} as PositionData)),
          isLong: !!settings?.reverseCopy ? !simulatedData.position?.isLong : !!simulatedData.position?.isLong,
          leverage: settings?.leverage ?? 0,
          size:
            !!settings?.leverage && !!settings?.orderVolume && !!simulatedData.volMultiplier
              ? settings.leverage * settings.orderVolume * simulatedData.volMultiplier
              : 0,

          roi: simulatedData?.liquidate ? -100 : simulatedData.roi ?? 0,
          pnl: simulatedData.profit ?? 0,
          fee: 0,
        },
      }))
      .sort((x, y) =>
        x.position && y.position
          ? x.position.closeBlockTime < y.position.closeBlockTime
            ? 1
            : x.position.closeBlockTime > y.position.closeBlockTime
            ? -1
            : 0
          : 0
      )
  }, [simulatorPositions, settings?.leverage, settings?.orderVolume, settings?.reverseCopy])

  const { getListSymbolOptions } = useMarketsConfig()
  const tokenOptions = useMemo(() => {
    const allOptions = getListSymbolOptions()
    return settings?.pairs && settings.pairs.length > 0
      ? allOptions.filter((e) => settings?.pairs?.find((i) => getSymbolFromPair(i) === e.id))
      : allOptions
  }, [getListSymbolOptions, settings?.pairs])

  const { currentOption: currencyOption, changeCurrentOption: changeCurrency } = useOptionChange({
    optionName: 'currency',
    options: tokenOptions,
    optionNameToBeDelete: ['currency'],
  })

  useEffect(() => {
    if (!!defaultToken.current || !dataSimulations || dataSimulations.length === 0) return
    const option = tokenOptions.find(
      (e) => e.id === getSymbolFromPair(dataSimulations[dataSimulations.length - 1]?.position?.pair)
    )
    if (option) {
      changeCurrency(option)
      defaultToken.current = option.id
    }
  }, [dataSimulations, tokenOptions])

  const timeRange = {
    from: settings?.fromTime,
    to: settings?.toTime,
  } as TimeRangeProps

  const [targetPosition, setTargetPosition] = useState<PositionData | undefined>()
  useEffect(() => {
    if (!targetPosition) return
    changeCurrency(tokenOptions.find((e) => e.id === getSymbolFromPair(targetPosition.pair)) ?? ALL_OPTION)
  }, [targetPosition])

  const onClickPosition = useCallback(
    (data: SimulatorPosition | undefined) => {
      setTargetPosition(data?.position)
      if (!data) return
    },
    [tokenOptions]
  )

  return (
    <Box
      display={['block', 'block', 'block', 'flex']}
      overflow={['auto', 'auto', 'auto', 'hidden']}
      width="100%"
      height="100%"
      pl={0}
      pb={3}
      bg="neutral7"
    >
      <Box flex="1 0 0" sx={{ borderRight: 'small', borderRightColor: 'neutral4', overflow: 'auto' }}>
        <BacktestSummaryAndPositions
          protocol={protocol}
          backtestResult={data}
          dataSimulations={dataSimulations}
          settings={settings}
          onClearResult={onClearResult}
          renderActionButton={renderActionButton}
          disabledShare={disabledShare}
          onClickPosition={onClickPosition}
        />
      </Box>
      <Box flex="1">
        <Box
          minHeight={300}
          height={['auto', '50vh', '50vh', '70vh']}
          sx={{ position: ['relative', 'relative', 'relative', 'sticky'], top: 0 }}
        >
          <Type.BodyBold sx={{ display: 'block', px: 3, py: 3, borderBottom: 'small', borderBottomColor: 'neutral4' }}>
            Positions Chart
          </Type.BodyBold>
          <Box height={['auto', '100%']} bg="neutral7">
            <ChartPositions
              protocol={protocol}
              targetPosition={targetPosition}
              closedPositions={[...(dataSimulations?.map((_d) => _d.position ?? ({} as PositionData)) ?? [])]}
              currencyOptions={tokenOptions}
              currencyOption={currencyOption}
              changeCurrency={changeCurrency}
              timeframeOption={TIME_FILTER_OPTIONS[0]}
              timeRange={timeRange}
              componentIds={{ legend: 'legend_chart_id', tooltip: 'tooltip_chart_id', chart: 'position_chart_id' }}
              currencySelectProps={{ menuPosition: undefined, menuPlacement: 'bottom' }}
              showLoadMoreButton={false}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
