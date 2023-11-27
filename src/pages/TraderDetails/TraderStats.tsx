import { Trans } from '@lingui/macro'
import { ArrowLineUp } from '@phosphor-icons/react'
import { ReactNode, memo } from 'react'
import styled from 'styled-components/macro'

import CustomizeColumn from 'components/@ui/Table/CustomizeColumn'
import { ExternalSource, tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader.d'
import { IGNORE_FIELDS, useStatsCustomizeStore } from 'hooks/store/useStatsCustomize'
import IconButton from 'theme/Buttons/IconButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'

const StatsWrapper = styled.div`
  width: 100%;
  .stat {
    .column-freeze {
      background-color: ${({ theme }) => theme.colors.neutral8};
    }
    .to-top-btn {
      display: none;
      transform: translateY(-1px);
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral5};
      .column-freeze {
        background-color: ${({ theme }) => theme.colors.neutral5};
      }
      .to-top-btn {
        display: block;
      }
    }
  }
`
interface StatProps {
  id: string
  label: ReactNode
  render?: (item: TraderData, index: number, externalSource?: ExternalSource | undefined) => ReactNode
}

const stats = tableSettings.filter((settings) => !IGNORE_FIELDS.includes(settings.id))
const defaultColumns = stats.map((stat) => ({
  key: stat.id,
  title: stat.label,
}))

const statsObj = stats.reduce((prev, cur) => {
  prev[cur.id] = {
    id: cur.id,
    label: cur.text,
    render: cur.render,
  }
  return prev
}, {} as { [key: string]: StatProps })

export default memo(AccountStats)
function AccountStats({ data }: { data: (TraderData | undefined)[] }) {
  const { customizeStats, toggleVisibleStat, moveStatToTop } = useStatsCustomizeStore()
  return (
    <Box display="flex" flexWrap="wrap" minWidth={610} pb={[3, 4, 4, 4, 3]}>
      <Box
        sx={{
          mr: '1px',
          width: 'calc(100% - 1px)',
          borderTop: 'small',
          borderColor: 'neutral4',
          pr: 3,
          position: 'sticky',
          top: 0,
          bg: 'neutral7',
          zIndex: 3,
        }}
      >
        <Flex width="100%" alignItems="center" color="neutral3">
          <Flex
            sx={{
              pl: 3,
              position: 'sticky',
              left: 0,
              top: 0,

              bg: 'neutral7',
              flex: 1,
              alignItems: 'center',
            }}
          >
            <Type.Caption
              sx={{
                py: 2,
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              STATS
            </Type.Caption>
            <Box
              flex="1"
              sx={{
                pl: 2,
                width: '100%',
                borderBottom: 'small',
                borderColor: 'neutral4',
                pt: '10px',
                pb: '4px',
              }}
            >
              <CustomizeColumn
                defaultColumns={defaultColumns}
                placement="bottomLeft"
                currentColumnKeys={customizeStats}
                handleToggleColumn={(key) => toggleVisibleStat(key.toString())}
                menuSx={{
                  maxHeight: 300,
                }}
              />
            </Box>
          </Flex>

          <Type.Caption
            textAlign="right"
            sx={{
              flex: 1,
              py: 2,
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            60 DAYS
          </Type.Caption>
          <Type.Caption
            textAlign="right"
            sx={{
              flex: 1,
              py: 2,
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            30 DAYS
          </Type.Caption>
          <Type.Caption
            textAlign="right"
            sx={{
              flex: 1,
              py: 2,
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            14 DAYS
          </Type.Caption>
          <Type.Caption
            textAlign="right"
            sx={{
              flex: 1,
              py: 2,
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            7 DAYS
          </Type.Caption>
        </Flex>
      </Box>

      {/* <Flex alignItems="center" mb={16} width="100%">
        <Box flex="1">
          <Type.Caption
            color="neutral3"
            data-tip="React-tooltip"
            data-tooltip-id="balance-tooltip"
            sx={{
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textDecorationColor: 'rgba(119, 126, 144, 0.5)',
            }}
          >
            Balance
          </Type.Caption>
        </Box>

        <Tooltip id="balance-tooltip" place="top" type="dark" effect="solid">
          Total values: WBTC + ETH + USDC
        </Tooltip>

        <Type.Caption flex="1" textAlign="right">
          {`$${formatNumber(balance, 2, 2)}` ?? '--'}
        </Type.Caption>
        <Type.Caption flex="1" textAlign="right">
          {`$${formatNumber(balance, 2, 2)}` ?? '--'}
        </Type.Caption>
        <Type.Caption flex="1" textAlign="right">
          {`$${formatNumber(balance, 2, 2)}` ?? '--'}
        </Type.Caption>
        <Type.Caption flex="1" textAlign="right">
          {`$${formatNumber(balance, 2, 2)}` ?? '--'}
        </Type.Caption>
      </Flex> */}
      <StatsWrapper>
        {customizeStats.map((key, index) => {
          const stat = statsObj[key]
          if (!stat) return <div key={key}></div>
          return (
            <Flex pr={3} key={key} alignItems="center" width="calc(100% - 2px)" mx="1px" className="stat">
              <Flex
                sx={{
                  pl: 3,
                  position: 'sticky',
                  left: 0,
                  flex: 1,
                  py: 2,
                }}
                className="column-freeze"
                alignItems="center"
              >
                <Type.Caption color="neutral3">{stat.label}</Type.Caption>
                <IconButton
                  data-tip="React-tooltip"
                  data-tooltip-id="tt_to_top"
                  data-tooltip-offset={0}
                  variant="ghost"
                  className="to-top-btn"
                  onClick={() => moveStatToTop(stat.id)}
                  size={24}
                  icon={<ArrowLineUp size={13} fontVariant="bold" />}
                />
              </Flex>

              {data.map((item, i) => (
                <Box
                  key={i}
                  textAlign="right"
                  sx={{
                    flex: 1,
                    py: 2,
                  }}
                >
                  {stat.render && item ? stat.render(item, index) : '--'}
                </Box>
              ))}
            </Flex>
          )
        })}
      </StatsWrapper>
      <Tooltip id="tt_to_top" place="top" type="dark" effect="solid" clickable={false}>
        <Type.Caption>Move stat to top</Type.Caption>
      </Tooltip>
    </Box>
  )
}

export function generateStats(
  data: TraderData,
  balance?: number
): {
  label: ReactNode
  value: number | string
  digit?: number
  valuePrefix?: string
  valueSuffix?: string
  hasStyle?: boolean
  tooltipText?: string
  tooltipContent?: ReactNode
  clickableTooltip?: boolean
}[] {
  return [
    {
      label: <Trans>Balance</Trans>,
      value: balance ?? '--',
      digit: 0,
      valuePrefix: '$',
      tooltipText: 'Total value of collateral',
    },
    {
      label: <Trans>Total Trade</Trans>,
      value: data.totalTrade,
    },
    {
      label: <Trans>Profit Factor</Trans>,
      value: data.gainLossRatio,
      digit: 0,
    },
    {
      label: <Trans>PNL Ratio</Trans>,
      value: data.profitLossRatio,
      valueSuffix: '%',
      hasStyle: true,
    },
    {
      label: <Trans>Max Drawdown</Trans>,
      value: data.maxDrawDownPnl,
      valueSuffix: ` (${formatNumber(data.maxDrawDownRoi, 1)}%)`,
      valuePrefix: '$',
      digit: 0,
      hasStyle: true,
    },
    {
      label: <Trans>Avg Duration</Trans>,
      value: data.avgDuration / (60 * 60),
      valueSuffix: ' (h)',
      digit: 1,
    },
    {
      label: <Trans>Avg Leverage</Trans>,
      value: data.avgLeverage,
      valueSuffix: ' x',
      digit: 1,
    },
    {
      label: <Trans>Max Leverage</Trans>,
      value: data.maxLeverage,
      valueSuffix: ' x',
      digit: 1,
    },
    {
      label: <Trans>Min Leverage</Trans>,
      value: data.minLeverage,
      valueSuffix: ' x',
      digit: 1,
    },
    {
      label: <Trans>Last Trade (All)</Trans>,
      value: formatLocalRelativeDate(data.lastTradeAt),
      valueSuffix: '',
    },
    {
      label: <Trans>Run Time (All)</Trans>,
      value: data.runTimeDays,
      valueSuffix: ' days',
    },
  ]
}
