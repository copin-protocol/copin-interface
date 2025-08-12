import { Trans } from '@lingui/macro'
import { ArrowsIn, ArrowsOutSimple, Coins } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getTraderTokensStatistic } from 'apis/traderApis'
import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useEscapeToClose } from 'hooks/helpers/useEscapeToClose'
import useUserPreferencesStore from 'hooks/store/useUserPreferencesStore'
import Loading from 'theme/Loading'
import { TabHeader } from 'theme/Tab'
import { Box, Flex, IconBox } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import MarketDistribution from './MarketDistribution'
import { MarketList } from './MarketList'
import MarketPerformance from './MarketPerformance'
import MarketPositions from './MarketPositions'
import PermissionContainer from './PermissionContainer'

enum MarketStatsTab {
  PERFORMANCE = 'performance',
  DISTRIBUTION = 'distribution',
  LIST = 'list',
}

const MarketStats = ({
  account,
  protocol,
  isExpanded,
  handleExpand,
}: {
  account: string
  protocol: ProtocolEnum
  isExpanded: boolean
  handleExpand: () => void
}) => {
  const { isEnableTokenStats } = useTraderProfilePermission({ protocol })
  const [tab, setTab] = useState<MarketStatsTab>(MarketStatsTab.PERFORMANCE)
  const [currentPair, setCurrentPair] = useState<string | undefined>(undefined)
  const pnlWithFeeEnabled = useUserPreferencesStore((s) => s.pnlWithFeeEnabled)
  const { xl } = useResponsive()
  const { data: tokensStatistic, isLoading: loadingTokenStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, account, isEnableTokenStats, pnlWithFeeEnabled],
    () => getTraderTokensStatistic({ protocol, account }),
    {
      enabled: !!account && !!protocol && isEnableTokenStats,
      retry: 0,
      keepPreviousData: true,
      select: (res) => ({
        ...res,
        data: res.data.map((item) => ({
          ...item,
          realisedPnl: pnlWithFeeEnabled ? item.realisedPnl - item.totalFee : item.realisedPnl,
        })),
      }),
      // onSuccess(data) {
      //   if (!data.data.length) return
      //   const firstData = data.data[0]
      //   setCurrentPair(firstData?.pair)
      // },
    }
  )
  const handleChangePair = (pair: string) => {
    if (isExpanded) {
      setCurrentPair(pair)
    }
  }
  useEscapeToClose({
    isOpen: isExpanded,
    onClose: handleExpand,
  })
  return (
    <Flex sx={{ flexDirection: 'column', height: '100%', width: '100%', position: 'relative' }}>
      <Flex
        height={44}
        px={3}
        sx={{
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: isExpanded ? 'small' : 'smallDashed',
          borderBottomColor: 'neutral4',
        }}
      >
        <SectionTitle icon={Coins} title={<Trans>MARKET STATS</Trans>} sx={{ mb: 0 }} />
        {xl && isEnableTokenStats && (
          <IconBox
            icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
            role="button"
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 'sm',
              color: 'neutral2',
              '&:hover': { color: 'neutral1' },
            }}
            onClick={handleExpand}
          />
        )}
      </Flex>
      <PermissionContainer>
        <Flex sx={{ flexDirection: 'column', flex: '1 0 0', position: 'relative' }}>
          {/*<BlurMask isBlur={!isAvailableFeature}>*/}
          {/*  <PlanUpgradePrompt*/}
          {/*    requiredPlan={requiredPlan}*/}
          {/*    title={<Trans>Available on Pro & Elite plans</Trans>}*/}
          {/*    description={<Trans>Know exactly which tokens this trader dominates, and which they don’t</Trans>}*/}
          {/*    noLoginTitle={<Trans>Login to view more information</Trans>}*/}
          {/*    showTitleIcon*/}
          {/*    showLearnMoreButton*/}
          {/*    showNoLoginTitleIcon*/}
          {/*    requiredLogin*/}
          {/*  />*/}
          {/*</BlurMask>*/}
          {loadingTokenStatistic ? (
            <Loading />
          ) : !tokensStatistic?.data?.length ? (
            <NoDataFound message="No market stats found" />
          ) : (
            <Flex
              sx={{
                flex: '1 0 0',
                flexDirection: isExpanded ? 'row' : 'column',
                width: '100%',
                bg: isExpanded ? 'neutral7' : 'transparent',
                position: 'relative',
              }}
            >
              <Flex
                height="100%"
                flexDirection="column"
                width={isExpanded ? '450px' : '100%'}
                sx={{
                  borderRight: isExpanded ? 'small' : 'none',
                  borderRightColor: 'neutral4',
                }}
              >
                <TabHeader
                  configs={[
                    {
                      name: <Trans>PERFORMANCE</Trans>,
                      key: MarketStatsTab.PERFORMANCE,
                    },
                    {
                      name: <Trans>DISTRIBUTION</Trans>,
                      key: MarketStatsTab.DISTRIBUTION,
                    },
                    {
                      name: <Trans>List</Trans>,
                      key: MarketStatsTab.LIST,
                    },
                  ]}
                  isActiveFn={(config) => config.key === tab}
                  onClickItem={(key) => setTab(key as MarketStatsTab)}
                  fullWidth
                  hasLine
                  size="md"
                />
                <Box flex="1">
                  {tab === MarketStatsTab.PERFORMANCE && (
                    <MarketPerformance
                      data={tokensStatistic?.data}
                      isExpanded={isExpanded}
                      pair={currentPair}
                      changePair={handleChangePair}
                    />
                  )}
                  {tab === MarketStatsTab.DISTRIBUTION && (
                    <MarketDistribution
                      isExpanded={isExpanded}
                      data={tokensStatistic?.data}
                      currentPair={currentPair}
                      changePair={handleChangePair}
                    />
                  )}
                  {tab === MarketStatsTab.LIST && (
                    <MarketList
                      isExpanded={isExpanded}
                      data={tokensStatistic?.data}
                      currentPair={currentPair}
                      changePair={handleChangePair}
                    />
                  )}
                </Box>
              </Flex>
              {isExpanded && (
                <Box flex="1">
                  <MarketPositions
                    account={account}
                    protocol={protocol}
                    tokensStatistic={tokensStatistic?.data}
                    currentPair={currentPair}
                    setCurrentPair={setCurrentPair}
                  />
                </Box>
              )}
            </Flex>
          )}
        </Flex>
      </PermissionContainer>
    </Flex>
  )
}

export default MarketStats
