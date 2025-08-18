import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactElement, memo } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { renderEntry } from 'components/@widgets/renderProps'
import { BackTestResultData, RequestBackTestData, SimulatorPosition } from 'entities/backTest.d'
import { Button } from 'theme/Buttons'
import SkullIcon from 'theme/Icons/SkullIcon'
import Table from 'theme/Table'
import TableLabel from 'theme/Table/TableLabel'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

import ShareBacktestButton from '../BacktestShareButton'
import ResultStats from './ResultStats'
import BacktestSettings, { SettingItem } from './Settings'

const BacktestSummaryAndPositions = memo(function BacktestSummaryAndPositionsMemo({
  protocol,
  backtestResult,
  dataSimulations,
  settings,
  onClearResult,
  renderActionButton,
  disabledShare,
  onClickPosition,
}: {
  protocol: ProtocolEnum
  backtestResult: BackTestResultData
  dataSimulations: SimulatorPosition[] | undefined
  settings: RequestBackTestData | undefined
  onClearResult?: () => void
  renderActionButton?: () => ReactElement
  disabledShare?: boolean
  onClickPosition: (data?: SimulatorPosition) => void
}) {
  const account = backtestResult.account
  const { sm, md, xl } = useResponsive()
  const statsColumns = xl ? 3 : md ? 2 : sm ? 1 : 1
  const totalStatsItems = 9

  return (
    <Box>
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
          bg: '#000',
        }}
      >
        <Flex sx={{ alignItems: 'end', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 3 }}>
          <AccountInfo
            addressFormatter={Type.Head}
            address={account}
            protocol={protocol}
            avatarSize={32}
            hasLink={!!disabledShare}
            hasQuickView={false}
            addressWidth="fit-content"
          />
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

      {dataSimulations && dataSimulations.length > 0 ? (
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
            <SettingItem label={'Fund Tier'} value={backtestResult.fundTier} />
            <SettingItem
              label={'Margin Suggestion'}
              value={`$${formatNumber(backtestResult.volumeSuggestion, 2, 2)}`}
            />
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
            <ResultStats data={backtestResult} settings={settings} />
          </Box>

          <Flex mx={3} mb={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <TableLabel>Positions</TableLabel>
          </Flex>

          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Table
              data={dataSimulations}
              columns={columns}
              isLoading={false}
              tableBodyWrapperSx={{
                overflow: 'auto',
                flex: 'auto',
              }}
              wrapperSx={{
                px: 0,
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
              onClickRow={onClickPosition}
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
  )
})
export default BacktestSummaryAndPositions

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
    style: { minWidth: '150px' },
    render: (item) => renderEntry(item?.position),
  },
  {
    title: 'Value',
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
    style: { minWidth: '120px', textAlign: 'right' },
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
            prefix: '$',
          })}
        </Flex>
      )
    },
  },
  {
    title: 'ROI',
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
