import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'

import PositionStatus from 'components/@position/PositionStatus'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { renderEntry, renderSize, renderSizeOpeningWithPrices } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { FEE_WITH_FUNDING_PROTOCOLS } from 'utils/config/constants'
import { OrderTypeEnum, PositionStatusEnum } from 'utils/config/enums'
import { formatDuration } from 'utils/helpers/format'

import SharePosition from './SharePosition'

interface PositionStatsProps {
  data: PositionData
  prices: UsdPrices
  hasFundingFee: boolean
  hasLiquidate: boolean
  isOpening: boolean
  chartId: string
}

export default function PositionStats({ data, chartId }: { data: PositionData; chartId: string }) {
  const { md } = useResponsive()
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: data.protocol })
  const hasFundingFee = !!data?.funding
  const isOpening = data?.status === PositionStatusEnum.OPEN
  const hasLiquidate = (data?.orders?.filter((e) => e.type === OrderTypeEnum.LIQUIDATE) ?? []).length > 0

  return (
    <Box py={[2, 3]} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      {md ? (
        <DesktopLayout
          data={data}
          prices={prices}
          hasFundingFee={hasFundingFee}
          hasLiquidate={hasLiquidate}
          isOpening={isOpening}
          chartId={chartId}
        />
      ) : (
        <MobileLayout
          data={data}
          prices={prices}
          hasFundingFee={hasFundingFee}
          hasLiquidate={hasLiquidate}
          isOpening={isOpening}
          chartId={chartId}
        />
      )}
    </Box>
  )
}

const DesktopLayout = ({ data, prices, hasFundingFee, hasLiquidate, isOpening, chartId }: PositionStatsProps) => {
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 3 }}>
        <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
          <Type.Caption>
            <RelativeTimeText date={data.openBlockTime} />
          </Type.Caption>
          {renderEntry(data)}
          <Flex>
            {isOpening
              ? renderSizeOpeningWithPrices(data, prices, undefined, true)
              : renderSize(data, hasLiquidate, true)}
          </Flex>
        </Flex>
        <Flex alignItems="center" sx={{ gap: 3 }}>
          <PositionStatus
            status={hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status}
          />
          <SharePosition isOpening={isOpening} stats={data} chartId={chartId} />
        </Flex>
      </Flex>
      <Flex mt={3} alignItems="center" justifyContent="space-between" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
        <Flex alignItems="center" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
          <DesktopItemInfo label={<Trans>Duration:</Trans>} value={formatDuration(data.durationInSecond)} />
          <DesktopItemInfo
            label={<Trans>Total Collateral:</Trans>}
            value={
              <ValueOrToken
                protocol={data.protocol}
                indexToken={data.collateralToken}
                value={data.collateral}
                valueInToken={data.collateralInToken}
              />
            }
          />
          {FEE_WITH_FUNDING_PROTOCOLS.includes(data.protocol) ? (
            <DesktopItemInfo
              label={<Trans>Fees & Funding:</Trans>}
              value={
                <ValueOrToken
                  value={undefined}
                  component={
                    <SignedText
                      value={data.fee != null ? data.fee * -1 : undefined}
                      maxDigit={2}
                      minDigit={2}
                      prefix="$"
                    />
                  }
                />
              }
            />
          ) : (
            <>
              <DesktopItemInfo
                label={<Trans>Paid Fees:</Trans>}
                value={
                  <ValueOrToken
                    protocol={data.protocol}
                    indexToken={data.collateralToken}
                    value={data.fee != null ? data.fee * -1 : undefined}
                    valueInToken={data.feeInToken != null ? data.feeInToken * -1 : undefined}
                    component={
                      <SignedText
                        value={
                          data.fee == null && data.feeInToken == null ? undefined : (data.fee ?? data.feeInToken) * -1
                        }
                        maxDigit={2}
                        minDigit={2}
                        prefix="$"
                      />
                    }
                  />
                }
              />
              <DesktopItemInfo
                label={<Trans>Funding:</Trans>}
                value={
                  hasFundingFee ? (
                    <ValueOrToken
                      protocol={data.protocol}
                      indexToken={data.collateralToken}
                      value={data.funding}
                      valueInToken={data.fundingInToken}
                      component={
                        <SignedText value={data.funding ?? data.fundingInToken} maxDigit={2} minDigit={2} prefix="$" />
                      }
                    />
                  ) : (
                    '--'
                  )
                }
              />
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

const MobileLayout = ({ data, prices, hasFundingFee, hasLiquidate, isOpening, chartId }: PositionStatsProps) => {
  return (
    <Flex flexDirection="column" sx={{ gap: 2 }}>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 3 }}>
        <Flex alignItems="center" sx={{ gap: 12, flexWrap: 'wrap' }}>
          <Type.Caption>
            <RelativeTimeText date={data.openBlockTime} />
          </Type.Caption>
          {renderEntry(data)}
        </Flex>
        <SharePosition isOpening={isOpening} stats={data} chartId={chartId} />
      </Flex>
      <Flex width="100%" mb={1}>
        {isOpening ? renderSizeOpeningWithPrices(data, prices) : renderSize(data)}
      </Flex>
      <Flex width="100%" alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
        <MobileItemInfo
          label={<Trans>Total Collateral:</Trans>}
          value={
            <ValueOrToken
              protocol={data.protocol}
              indexToken={data.collateralToken}
              value={data.collateral}
              valueInToken={data.collateralInToken}
            />
          }
        />
        <MobileItemInfo label={<Trans>Duration:</Trans>} value={formatDuration(data.durationInSecond)} />
        <MobileItemInfo
          label={<Trans>Status:</Trans>}
          value={
            <PositionStatus
              status={hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status}
            />
          }
        />
      </Flex>
      <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
        <MobileItemInfo
          label={<Trans>Paid Fees:</Trans>}
          value={
            <ValueOrToken
              protocol={data.protocol}
              indexToken={data.collateralToken}
              value={data.fee != null ? data.fee * -1 : undefined}
              valueInToken={data.feeInToken != null ? data.feeInToken * -1 : undefined}
              component={
                <SignedText
                  value={data.fee == null && data.feeInToken == null ? undefined : (data.fee ?? data.feeInToken) * -1}
                  maxDigit={2}
                  minDigit={2}
                  prefix="$"
                />
              }
            />
          }
        />
        <MobileItemInfo
          label={<Trans>Funding:</Trans>}
          value={
            hasFundingFee ? (
              <ValueOrToken
                protocol={data.protocol}
                indexToken={data.collateralToken}
                value={data.funding}
                valueInToken={data.fundingInToken}
                component={
                  <SignedText value={data.funding ?? data.fundingInToken} maxDigit={2} minDigit={2} prefix="$" />
                }
              />
            ) : (
              '--'
            )
          }
        />
        <MobileItemInfo label={''} value={''} />
      </Flex>
    </Flex>
  )
}

const DesktopItemInfo = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
    <Type.Caption color="neutral3">{label}</Type.Caption>
    <Type.Caption textAlign="right">{value}</Type.Caption>
  </Flex>
)

const MobileItemInfo = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <Flex flex={1} flexDirection="column">
    <Type.Caption color="neutral3">{label}</Type.Caption>
    <Type.Caption>{value}</Type.Caption>
  </Flex>
)
