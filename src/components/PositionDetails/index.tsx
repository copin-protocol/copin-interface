import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getOpeningPositionDetailApi, getPositionDetailByIdApi } from 'apis/positionApis'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import { AmountText, BalanceText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { VerticalDivider, renderEntry, renderSize, renderSizeOpening } from 'components/@ui/Table/renderProps'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useTraderCopying from 'hooks/store/useTraderCopying'
import useUsdPricesStore from 'hooks/store/useUsdPrices'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Loading from 'theme/Loading'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { OrderTypeEnum, PositionStatusEnum, ProtocolEnum, TraderStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { calcOpeningPnL, calcOpeningROI } from 'utils/helpers/calculate'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

import ChartProfit from './ChartProfit'
import ListOrderTable from './ListOrderTable'
import SharePosition from './SharePosition'
import WhatIf from './WhatIf'

export default function PositionDetails({
  protocol,
  id,
  account,
  indexToken,
  dataKey,
  isShow,
  isDrawer = true,
}: {
  protocol: ProtocolEnum
  id?: string
  account?: string
  indexToken?: string
  dataKey?: string
  isShow?: boolean
  isDrawer?: boolean
}) {
  const isMobile = useIsMobile()
  const { prices } = useUsdPricesStore()
  const isOpening = !id && !!account && !!indexToken && !!dataKey
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_POSITION_DETAIL, id, account, indexToken, protocol],
    () =>
      isOpening
        ? getOpeningPositionDetailApi({
            protocol,
            account: account ?? '',
            indexToken: indexToken ?? '',
            key: dataKey ?? '',
          })
        : getPositionDetailByIdApi({ protocol, positionId: id ?? '' }),
    {
      enabled: !!id || (!!account && !!indexToken && !!dataKey),
      retry: 0,
    }
  )
  const hasLiquidate = (data?.orders?.filter((e) => e.type === OrderTypeEnum.LIQUIDATE) ?? []).length > 0
  const { isCopying } = useTraderCopying(data?.account)

  const openBlockTimeUnix = useMemo(
    () =>
      data
        ? dayjs(isOpening ? data.blockTime : data.openBlockTime)
            .utc()
            .unix()
        : 0,
    [data, isOpening]
  )
  const closeBlockTimeUnix = useMemo(() => (data ? dayjs(data.closeBlockTime).utc().unix() : 0), [data])

  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  const latestPnL = useMemo(
    () =>
      crossMovePnL === 0
        ? 0
        : data
        ? isOpening || crossMovePnL
          ? crossMovePnL
            ? crossMovePnL
            : calcOpeningPnL(data, prices[data.indexToken])
          : data.realisedPnl
        : 0,
    [crossMovePnL, data, isOpening, prices]
  )

  const latestROI = useMemo(
    () =>
      crossMovePnL === 0 ? 0 : data ? (isOpening || crossMovePnL ? calcOpeningROI(data, latestPnL) : data.roi) : 0,
    [crossMovePnL, data, isOpening, latestPnL]
  )

  const explorerUrl = data && data.protocol ? PROTOCOL_PROVIDER[data.protocol].explorerUrl : LINKS.arbitrumExplorer
  const hasFundingFee = !!data?.totalFundingRateFee

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && !data && <NoDataFound />}
      {data && (
        <Box mb={3}>
          <Flex p={12} alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 2 }}>
            <Flex alignItems="center" sx={{ gap: 12 }}>
              <AddressAvatar address={data.account} size={40} />
              <Link to={generateTraderDetailsRoute(protocol, data.account)}>
                <Button type="button" variant="ghost" sx={{ p: 0 }}>
                  <Flex flexDirection="column" textAlign="left">
                    <Type.BodyBold>{addressShorten(data.account)}</Type.BodyBold>
                    <Type.Caption color="neutral3">
                      <BalanceText protocol={data.protocol} account={data.account} />
                    </Type.Caption>
                  </Flex>
                </Button>
              </Link>
              <CopyButton
                type="button"
                variant="ghost"
                value={data.account}
                size="sm"
                sx={{ color: 'neutral3', p: 0 }}
              ></CopyButton>
              <ExplorerLogo protocol={data.protocol} explorerUrl={`${explorerUrl}/address/${data.account}`} />
              <SharePosition isOpening={isOpening} stats={data} />
              {isCopying && <Tag width={70} status={TraderStatusEnum.COPYING} />}
            </Flex>
            {!isDrawer && <ProtocolLogo size={24} protocol={data.protocol} textSx={{ fontSize: '14px' }} />}
          </Flex>
          <Flex
            alignItems="center"
            sx={{ gap: [3, 4], flexWrap: 'wrap', borderTop: 'small', borderColor: 'neutral4', p: 12 }}
          >
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Type.Caption color="neutral3">Settled:</Type.Caption>
              <Type.Caption>
                <RelativeTimeText date={isOpening ? data.blockTime : data.openBlockTime} />
              </Type.Caption>
            </Flex>
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Type.Caption color="neutral3">Total Collateral:</Type.Caption>
              <Type.Caption>${formatNumber(data.collateral, 0)}</Type.Caption>
            </Flex>
            {data.durationInSecond && (
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption color="neutral3">Duration:</Type.Caption>
                <Type.Caption>{formatNumber(data.durationInSecond / (60 * 60), 1)}h</Type.Caption>
              </Flex>
            )}
            <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
              <Type.Caption color="neutral3">Paid Fees:</Type.Caption>
              <Type.Caption>
                <SignedText value={-(data.paidFee ?? data.fee)} maxDigit={0} prefix="$" />{' '}
              </Type.Caption>
            </Flex>
            {hasFundingFee && (
              <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
                <Type.Caption color="neutral3">Funding:</Type.Caption>
                <Type.Caption>
                  <SignedText value={data.totalFundingRateFee} maxDigit={0} prefix="$" />{' '}
                </Type.Caption>
              </Flex>
            )}
          </Flex>
          <Box sx={{ borderTop: 'small', borderColor: 'neutral4', p: 12 }}>
            <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap' }}>
              {isMobile ? (
                <Flex width="100%" flexDirection="column" sx={{ gap: 2, mb: 3 }}>
                  <Flex alignItems="center" sx={{ gap: 2 }}>
                    <Tag
                      minWidth={70}
                      status={
                        hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status
                      }
                      bg="neutral4"
                    />
                    <VerticalDivider />
                    {renderEntry(data)}
                  </Flex>
                  <Flex>{isOpening ? renderSizeOpening(data, prices) : renderSize(data)}</Flex>
                </Flex>
              ) : (
                <Flex alignItems="center" sx={{ gap: 3 }}>
                  <Tag
                    minWidth={70}
                    status={
                      hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status
                    }
                    bg="neutral4"
                  />
                  {renderEntry(data)}
                  <Flex width={220}>{isOpening ? renderSizeOpening(data, prices) : renderSize(data)}</Flex>
                </Flex>
              )}
              {!isOpening && data.id && <WhatIf protocol={protocol} positionId={data.id} />}
            </Flex>

            <Flex mt={3} mb={3} width="100%" alignItems="center" justifyContent="center">
              <Type.H5 color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}>
                <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
              </Type.H5>
              <Type.H5 ml={2} color="neutral3">
                (
              </Type.H5>
              <Type.H5 color={latestROI > 0 ? 'green1' : latestROI < 0 ? 'red2' : 'inherit'}>
                <PercentText percent={latestROI} digit={1} />
              </Type.H5>
              <Type.H5 color="neutral3">)</Type.H5>
            </Flex>
            {data && (
              <ChartProfit
                position={data}
                hasLiquidate={hasLiquidate}
                isOpening={isOpening}
                openBlockTime={openBlockTimeUnix}
                closeBlockTime={closeBlockTimeUnix}
                setCrossMovePnL={setCrossMovePnL}
                isShow={isShow}
              />
            )}
          </Box>
          <Box width="100%" overflow="hidden" sx={{ pt: 12 }}>
            {data.orders && data.orders.length > 0 && (
              <ListOrderTable protocol={data.protocol} data={data.orders} isLoading={isLoading} />
            )}
          </Box>
        </Box>
      )}
    </>
  )
}
