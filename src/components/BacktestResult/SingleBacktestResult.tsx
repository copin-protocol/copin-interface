import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactElement, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import Table from 'components/@ui/Table'
import TableLabel from 'components/@ui/Table/TableLabel'
import { renderEntry } from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import ChartPositions from 'components/Charts/ChartPositions'
import { TimeRangeProps } from 'components/Charts/ChartPositions/types'
import { BackTestResultData, RequestBackTestData, SimulatorPosition } from 'entities/backTest.d'
import { PositionData } from 'entities/trader'
import { useOptionChange } from 'hooks/helpers/useOptionChange'
import { Button } from 'theme/Buttons'
import SkullIcon from 'theme/Icons/SkullIcon'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { ALL_OPTION, getDefaultTokenOptions } from 'utils/config/trades'
import { addressShorten, formatLocalDate, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

import ResultStats from './ResultStats'
import BacktestSettings, { SettingItem } from './Settings'
import ShareBacktestButton from './ShareBacktestButton'

export default function SingleBacktestResult({
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
  const [targetPosition, setTargetPosition] = useState<PositionData | undefined>()
  const data = results[0]
  const { account = '', simulatorPositions } = data
  const positions = (simulatorPositions ?? []).map(
    (positionData) =>
      ({
        ...(positionData.position ?? {}),
        leverage: settings?.leverage,
        size:
          settings?.leverage && settings?.orderVolume && positionData.volMultiplier
            ? settings.leverage * settings.orderVolume * positionData.volMultiplier
            : undefined,
        roi: positionData?.liquidate ? -100 : positionData.roi,
        pnl: positionData.profit,
        isLong: !!settings?.reverseCopy ? !positionData.position?.isLong : positionData.position?.isLong,
        fee: 0,
      } as PositionData)
  )
  const tokenOptions = useMemo(
    () =>
      settings?.tokenAddresses && settings.tokenAddresses.length > 0
        ? getDefaultTokenOptions(protocol).filter((e) => settings?.tokenAddresses?.find((i) => i === e.id), [protocol])
        : getDefaultTokenOptions(protocol),
    [settings?.tokenAddresses, protocol]
  )

  const { currentOption: currencyOption, changeCurrentOption: changeCurrency } = useOptionChange({
    optionName: 'currency',
    options: tokenOptions,
    optionNameToBeDelete: ['currency'],
  })

  const dataSimulations = useMemo(
    () =>
      data.simulatorPositions
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
        ),
    [data.simulatorPositions, settings?.leverage, settings?.orderVolume, settings?.reverseCopy]
  )

  const { sm, md, xl } = useResponsive()
  const statsColumns = xl ? 3 : md ? 2 : sm ? 1 : 1
  const totalStatsItems = 9

  const timeRange = {
    from: settings?.fromTime,
    to: settings?.toTime,
  } as TimeRangeProps

  const handleTargetPosition = (data?: PositionData) => {
    setTargetPosition(data)
    if (data) {
      changeCurrency(tokenOptions.find((e) => e.id === data.indexToken) ?? ALL_OPTION)
    }
  }

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
        <Flex
          px={3}
          pb={3}
          sx={{
            py: 3,
            flexWrap: 'wrap',
            columnGap: 4,
            rowGap: 3,
            alignItems: 'center',
            width: '100%',
            position: ['sticky'],
            top: 0,
            zIndex: 1,
            bg: 'neutral7',
          }}
        >
          <Flex sx={{ alignItems: 'end', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 3 }}>
            <Flex
              sx={{
                alignItems: 'center',
                gap: 3,
                ...(disabledShare ? { color: 'neutral1', '&:hover': { color: 'primary1' } } : {}),
              }}
              as={disabledShare ? Link : 'div'}
              to={disabledShare ? generateTraderDetailsRoute(protocol, account) : ''}
              target="_blank"
            >
              <AddressAvatar address={account} size={40} />
              <Type.H5>{addressShorten(account)}</Type.H5>
            </Flex>
            {settings && !disabledShare ? (
              <ShareBacktestButton protocol={protocol} type="single" settings={settings} />
            ) : null}
            {renderActionButton ? (
              renderActionButton()
            ) : (
              <>
                {onClearResult && (
                  <Button variant="outline" onClick={onClearResult}>
                    Clear Result
                  </Button>
                )}
              </>
            )}
          </Flex>
        </Flex>

        <Box px={3}>
          <BacktestSettings data={settings} protocol={protocol} />
        </Box>

        <Divider my={24} />

        {positions && positions.length > 0 ? (
          <Box>
            <Flex mx={3} mb={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <TableLabel>Fund</TableLabel>
            </Flex>
            <Flex
              sx={{
                gap: 3,
                '& > *': {
                  flex: 1,
                },
              }}
              px={3}
              pb={4}
            >
              <SettingItem label={'Fund Tier'} value={data.fundTier} />
              <SettingItem label={'Margin Suggestion'} value={`$${formatNumber(data.volumeSuggestion, 2, 2)}`} />
              <div></div>
            </Flex>

            <TableLabel mx={3} mb={3}>
              Result
            </TableLabel>

            <Box
              mx={3}
              mb={24}
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${statsColumns}, 1fr)`,
                borderRadius: '6px',
                border: 'small',
                borderColor: 'neutral4',
                '& > *': {
                  borderRight: 'small',
                  borderRightColor: 'neutral4',
                  borderBottom: 'small',
                  borderBottomColor: 'neutral4',
                  py: 2,
                  px: 12,
                },
                [`& > *:nth-child(${statsColumns}n)`]: {
                  borderRight: 'none',
                },
                [`& > ${Array.from({ length: statsColumns }, (_, v) => totalStatsItems - v).reduce(
                  (result, value, index) => {
                    if (index === statsColumns - 1) {
                      result += `*:nth-child(${value})`
                    } else {
                      result += `*:nth-child(${value}),`
                    }
                    return result
                  },
                  ''
                )}`]: {
                  borderBottom: 'none',
                },
              }}
            >
              <ResultStats data={data} settings={settings} />
            </Box>

            <Flex mx={3} mb={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <TableLabel>Positions</TableLabel>
            </Flex>

            <Box>
              <Table
                data={dataSimulations}
                columns={columns}
                isLoading={false}
                wrapperSx={{
                  px: 0,
                  overflowX: 'auto',
                  table: {
                    borderSpacing: '0 !important',
                    'tbody tr:hover': {
                      bg: 'neutral5',
                    },
                    'tbody td': {
                      py: 2,
                    },
                    thead: {
                      pr: 3,
                    },
                    '& th:first-child, td:first-child': {
                      pl: 3,
                    },
                  },
                }}
                onClickRow={(data) => handleTargetPosition(data.position)}
              />
            </Box>
          </Box>
        ) : (
          <NoDataFound
            message={
              <Trans>
                No trade history from{' '}
                {`${formatLocalDate(settings?.fromTime, 'DD MMM YYYY')} to ${formatLocalDate(
                  settings?.toTime,
                  'DD MMM YYYY'
                )}`}
              </Trans>
            }
          />
        )}
      </Box>
      <Box flex="1">
        <Box
          minHeight={300}
          height={['50vh', '50vh', '50vh', '70vh']}
          sx={{ position: ['relative', 'relative', 'relative', 'sticky'], top: 0 }}
        >
          <Type.BodyBold sx={{ display: 'block', px: 3, py: 3, borderBottom: 'small', borderBottomColor: 'neutral4' }}>
            Positions Chart
          </Type.BodyBold>
          <Box height="100%" bg="neutral7">
            <ChartPositions
              protocol={protocol}
              targetPosition={targetPosition}
              closedPositions={positions.reverse()}
              currencyOptions={tokenOptions}
              currencyOption={currencyOption}
              changeCurrency={changeCurrency}
              timeframeOption={TIME_FILTER_OPTIONS[0]}
              timeRange={timeRange}
              componentIds={{ legend: 'legend_chart_id', tooltip: 'tooltip_chart_id', chart: 'position_chart_id' }}
              currencySelectProps={{ menuPosition: undefined, menuPlacement: 'bottom' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const columns: ColumnData<SimulatorPosition>[] = [
  {
    title: 'Time',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: '120px' },
    render: (item) => (
      <Type.Caption color="neutral1">
        <LocalTimeText date={item?.position?.closeBlockTime} />
      </Type.Caption>
    ),
  },
  {
    title: 'Entry',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: '130px' },
    render: (item) => renderEntry(item?.position),
  },
  {
    title: 'Size',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: '60px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption textAlign="right" color="neutral1">
          ${formatNumber(item.position?.size, 0)}
        </Type.Caption>
      )
    },
  },
  {
    title: 'Vol Multiplier',
    dataIndex: 'volMultiplier',
    key: 'volMultiplier',
    style: { minWidth: '70px', textAlign: 'right' },
    render: (item) => {
      return (
        <Type.Caption textAlign="right" color="neutral1">
          {formatNumber(item.volMultiplier, 1, 1)}x
        </Type.Caption>
      )
    },
  },
  {
    title: 'PnL',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: '70px', textAlign: 'right' },
    render: (item) => {
      return (
        <Flex alignItems="center" sx={{ gap: '1px' }}>
          {item?.position?.isLiquidate && <SkullIcon />}
          {SignedText({
            value: item.profit,
            maxDigit: 1,
            minDigit: 1,
            sx: { textAlign: 'right', width: '100%' },
          })}
        </Flex>
      )
    },
  },
  {
    title: 'ROI %',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: '70px', textAlign: 'right', pr: 3 },
    render: (item) =>
      SignedText({
        value: item.roi,
        maxDigit: 1,
        minDigit: 1,
        sx: { textAlign: 'right', width: '100%' },
        suffix: `%`,
      }),
  },
]
