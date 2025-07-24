import { Trans } from '@lingui/macro'
import { ArrowLineUp, GridFour, ListDashes } from '@phosphor-icons/react'
import { ReactNode, memo, useMemo } from 'react'
import styled from 'styled-components/macro'

import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import { tableSettingsWithoutPnlStatistics } from 'components/@trader/TraderExplorerTableView/configs'
import { ExternalTraderListSource } from 'components/@trader/TraderExplorerTableView/types'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { TraderData } from 'entities/trader.d'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { IGNORE_FIELDS, useUserStatsConfig } from 'hooks/store/useUserCustomize'
import IconButton from 'theme/Buttons/IconButton'
import Checkbox from 'theme/Checkbox'
import CustomizeColumn from 'theme/Table/CustomizeColumn'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Grid, Type } from 'theme/base'
import { SubscriptionFeatureEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { STATISTIC_TYPE_TRANSLATIONS } from 'utils/config/translations'
import { formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'

const GridWrapper = styled(Grid)`
  @media screen and (min-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media screen and (min-width: 1680px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const StatsWrapper = styled.div`
  width: 100%;
  .stat {
    .column-freeze {
      background-color: ${({ theme }) => theme.colors.neutral8};
    }
    .to-top-btn {
      visibility: hidden;
      transform: translateY(-1px);
    }
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral5};
      .column-freeze {
        background-color: ${({ theme }) => theme.colors.neutral5};
      }
      .to-top-btn {
        visibility: visible;
      }
    }
  }
`
interface StatProps {
  id: string
  label: ReactNode
  render?: (item: TraderData, index: number, externalSource?: ExternalTraderListSource | undefined) => ReactNode
}

const stats = tableSettingsWithoutPnlStatistics.filter((settings) => !IGNORE_FIELDS.includes(settings.id))
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

const AccountStats = memo(function AccountStatsMemo({
  data,
  timeOption,
}: {
  data: (TraderData | undefined)[]
  timeOption: TimeFilterProps
}) {
  const {
    customizeStats,
    toggleVisibleStat,
    moveStatToTop,
    changeView,
    toogleCurrentStatOnly,
    customizeView,
    currentStatOnly,
  } = useUserStatsConfig()

  const externalSource: ExternalTraderListSource = {
    isMarketsLeft: customizeView === 'GRID',
  }

  const { timeFramesAllowed, isEnableLast24H, isEnableYesterday, getRequiredPlanByTimeframe } =
    useTraderProfilePermission({})

  const formattedData = useMemo(() => {
    if (!data) return data
    const _data = [...data]
    if (!isEnableYesterday) {
      _data[_data.length - 2] = { ..._data[0], type: TimeFrameEnum.A_DAY } as TraderData
    }
    if (!isEnableLast24H) {
      _data[_data.length - 1] = { ..._data[0], type: TimeFrameEnum.LAST_24H } as TraderData
    }
    return _data
  }, [data, isEnableLast24H, isEnableYesterday])

  return (
    <Box display="flex" flexWrap="wrap" minWidth={customizeView === 'LIST' ? 1150 : undefined} pb={[3, 4, 4, 4, 3]}>
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
          zIndex: 4,
        }}
      >
        <Flex width="100%" alignItems="center" color="neutral3" height={44}>
          <Flex
            sx={{
              pl: 3,
              position: 'sticky',
              left: 0,
              top: 0,
              maxWidth: 160,
              bg: 'neutral7',
              width: 160,
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
            <Flex
              flex="1"
              sx={{
                pl: 2,
                gap: 2,
                width: '100%',
                borderBottom: 'small',
                borderColor: 'neutral4',
                alignItems: 'center',
                py: '6px',
              }}
            >
              <CustomizeColumn
                buttonVariant="ghostInactive"
                defaultColumns={defaultColumns}
                placement="bottomLeft"
                currentColumnKeys={customizeStats}
                handleToggleColumn={(key) => toggleVisibleStat(key.toString())}
                hasLabels={false}
              />
              <IconButton
                mt={'-2px'}
                variant={customizeView === 'LIST' ? 'ghostPrimary' : 'ghostInactive'}
                onClick={() => customizeView !== 'LIST' && changeView('LIST')}
                size={24}
                icon={<ListDashes size={20} />}
              />
              <IconButton
                mt={'-2px'}
                variant={customizeView === 'GRID' ? 'ghostPrimary' : 'ghostInactive'}
                onClick={() => customizeView !== 'GRID' && changeView('GRID')}
                size={24}
                icon={<GridFour size={20} />}
              />
            </Flex>
          </Flex>
          {customizeView === 'GRID' && (
            <Flex
              justifyContent="end"
              sx={{
                flex: 1,
                py: '9px',
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              <Checkbox checked={currentStatOnly} onChange={(e) => toogleCurrentStatOnly(e.target.checked)}>
                <Type.Caption>Only show {STATISTIC_TYPE_TRANSLATIONS[timeOption.id]?.text}</Type.Caption>
              </Checkbox>
            </Flex>
          )}
          {customizeView === 'LIST' && (
            <>
              <Type.Caption
                textAlign="right"
                sx={{
                  flex: 1,
                  py: 2,
                  borderBottom: 'small',
                  borderColor: 'neutral4',
                }}
              >
                ALL TIME
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
              <Type.Caption
                textAlign="right"
                sx={{
                  flex: 1,
                  py: 2,
                  borderBottom: 'small',
                  borderColor: 'neutral4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 1,
                }}
              >
                YESTERDAY
                {!isEnableYesterday && (
                  <PlanUpgradeIndicator
                    requiredPlan={getRequiredPlanByTimeframe(TimeFrameEnum.A_DAY)}
                    useLockIcon
                    learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
                  />
                )}
              </Type.Caption>
              <Type.Caption
                textAlign="right"
                sx={{
                  flex: 1,
                  py: 2,
                  borderBottom: 'small',
                  borderColor: 'neutral4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 1,
                }}
              >
                LAST 24H
                {!isEnableLast24H && (
                  <PlanUpgradeIndicator
                    requiredPlan={getRequiredPlanByTimeframe(TimeFrameEnum.LAST_24H)}
                    useLockIcon
                    learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
                  />
                )}
              </Type.Caption>
            </>
          )}
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

        <Tooltip id="balance-tooltip">
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

      {customizeView === 'GRID' && (
        <GridWrapper
          width="100%"
          pt={3}
          px={3}
          sx={{
            gap: 2,
            gridTemplateColumns: ['1fr 1fr', '1fr 1fr', '1fr 1fr 1fr', '1fr 1fr'],
          }}
        >
          {customizeStats
            .filter((key) => key !== 'labels' && key !== 'ifLabels')
            .map((key, index) => {
              const stat = statsObj[key]
              if (!stat) return <Box display="none" key={key}></Box>
              return (
                <Box key={key} width="100%" variant="cardBorder" sx={{ borderColor: 'neutral5' }} p={12}>
                  <Type.CaptionBold>{stat.label}</Type.CaptionBold>
                  {currentStatOnly ? (
                    <Box>
                      {stat.render && formattedData[STATISTIC_TYPE_TRANSLATIONS[timeOption.id]?.index ?? 0]
                        ? stat.render(
                            formattedData[STATISTIC_TYPE_TRANSLATIONS[timeOption.id]?.index ?? 0] as TraderData,
                            index,
                            externalSource
                          )
                        : '--'}
                    </Box>
                  ) : (
                    <div>
                      {[
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.ALL_TIME]?.key,
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.S60_DAY]?.key,
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.S30_DAY]?.key,
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.S14_DAY]?.key,
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.S7_DAY]?.key,
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.S1_DAY]?.key,
                        STATISTIC_TYPE_TRANSLATIONS[TimeFilterByEnum.LAST_24H]?.key,
                      ].map((item, i) => {
                        const isNotAllowed =
                          //@ts-ignore
                          !!formattedData?.[i]?.type && !timeFramesAllowed.includes(formattedData[i]?.type)
                        const requiredPlan = !!formattedData?.[i]?.type
                          ? //@ts-ignore
                            getRequiredPlanByTimeframe(formattedData?.[i]?.type)
                          : undefined
                        return (
                          <Flex key={item} justifyContent="space-between" mt={1}>
                            <Flex alignItems="center" sx={{ gap: 1 }}>
                              <Type.Caption color="neutral3" width={40}>
                                {item}
                              </Type.Caption>
                              {isNotAllowed && requiredPlan && (
                                <PlanUpgradeIndicator
                                  requiredPlan={requiredPlan}
                                  useLockIcon
                                  learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
                                />
                              )}
                            </Flex>
                            <Box
                              key={i}
                              flex={key === 'indexTokens' ? undefined : '1'}
                              textAlign="right"
                              sx={{
                                filter: isNotAllowed ? 'blur(6px)' : 'none',
                                position: 'relative',
                              }}
                            >
                              {stat.render && formattedData[i]
                                ? stat.render(formattedData[i] as TraderData, index, externalSource)
                                : '--'}
                            </Box>
                          </Flex>
                        )
                      })}
                    </div>
                  )}
                </Box>
              )
            })}
        </GridWrapper>
      )}

      {customizeView === 'LIST' && (
        <>
          <StatsWrapper>
            {customizeStats
              .filter((key) => key !== 'labels' && key !== 'ifLabels')
              .map((key, index) => {
                const stat = statsObj[key]
                if (!stat) return <div key={key} style={{ display: 'none' }}></div>
                return (
                  <Flex pr={3} key={key} alignItems="center" width="calc(100% - 2px)" mx="1px" className="stat">
                    <Flex
                      sx={{
                        pl: 0,
                        position: 'sticky',
                        left: 0,
                        width: 160,
                        py: 2,
                        zIndex: 3,
                        maxWidth: 160,
                      }}
                      className="column-freeze"
                      alignItems="center"
                    >
                      <Type.Caption pl={3} color="neutral3">
                        {stat.label}
                      </Type.Caption>
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

                    {formattedData.map((item, i) => (
                      <Box
                        key={i}
                        textAlign="right"
                        sx={{
                          filter: item?.type && !timeFramesAllowed.includes(item.type) ? 'blur(6px)' : 'none',
                          flex: 1,
                          py: 2,
                          position: 'relative',
                        }}
                      >
                        {stat.render && item ? stat.render(item, index) : '--'}
                      </Box>
                    ))}
                  </Flex>
                )
              })}
          </StatsWrapper>
          <Tooltip id="tt_to_top" clickable={false}>
            <Type.Caption>Move stat to top</Type.Caption>
          </Tooltip>
        </>
      )}
    </Box>
  )
})

export default AccountStats

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
      value: data.maxDrawdownPnl,
      valueSuffix: ` (${formatNumber(data.maxDrawdown, 1)}%)`,
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
