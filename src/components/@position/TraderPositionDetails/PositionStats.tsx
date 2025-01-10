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
import { SxProps } from 'theme/types'
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
    <Box py={[2, 3]}>
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
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 24 }}>
        <Flex alignItems="center" sx={{ gap: 24, flexWrap: 'wrap' }}>
          <Flex sx={{ gap: 2, minWidth: '150px' }}>
            <Type.Caption color="neutral3">Opened:</Type.Caption>
            <Type.Caption>
              <RelativeTimeText date={data.openBlockTime} />
            </Type.Caption>
          </Flex>
          <Box sx={{ minWidth: '150px' }}>{renderEntry(data)}</Box>

          <Flex sx={{ minWidth: '220px', mr: 4 }}>
            {isOpening
              ? renderSizeOpeningWithPrices(data, prices, undefined, true)
              : renderSize(data, hasLiquidate, true)}
          </Flex>
        </Flex>
        <Flex sx={{ gap: 3, alignItems: 'center' }}>
          <PositionStatus
            status={hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status}
          />
          <SharePosition isOpening={isOpening} stats={data} chartId={chartId} />
        </Flex>
      </Flex>
      <Flex mt={3} alignItems="center" justifyContent="space-between" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
        <Flex alignItems="center" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
          <ItemInfo
            label={<Trans>Duration:</Trans>}
            value={formatDuration(data.durationInSecond)}
            sx={{ minWidth: '150px' }}
          />

          <ItemInfo
            sx={{ minWidth: '150px' }}
            label={<Trans>Collateral:</Trans>}
            value={
              <ValueOrToken
                protocol={data.protocol}
                indexToken={data.collateral == null ? data.collateralToken : undefined}
                value={data.collateral}
                valueInToken={data.collateralInToken}
              />
            }
          />
          <Flex sx={{ alignItems: 'center', gap: 3 }}>
            {FEE_WITH_FUNDING_PROTOCOLS.includes(data.protocol) ? (
              <ItemInfo
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
                <ItemInfo
                  label={<Trans>Paid Fees:</Trans>}
                  value={
                    <ValueOrToken
                      protocol={data.protocol}
                      indexToken={data.fee == null ? data.collateralToken : undefined}
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
                <ItemInfo
                  label={<Trans>Funding:</Trans>}
                  value={
                    hasFundingFee ? (
                      <ValueOrToken
                        protocol={data.protocol}
                        indexToken={data.funding == null ? data.collateralToken : undefined}
                        value={data.funding}
                        valueInToken={data.fundingInToken}
                        component={
                          <SignedText
                            value={data.funding ?? data.fundingInToken}
                            maxDigit={2}
                            minDigit={2}
                            prefix="$"
                          />
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
      </Flex>
    </Box>
  )
}

const MobileLayout = ({ data, prices, hasFundingFee, hasLiquidate, isOpening, chartId }: PositionStatsProps) => {
  return (
    <Flex flexDirection="column" sx={{ gap: 2 }}>
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 3 }}>
        <Flex alignItems="center" sx={{ gap: 3, flexWrap: 'wrap' }}>
          <Type.Caption sx={{ minWidth: '100px' }}>
            <RelativeTimeText date={data.openBlockTime} />
          </Type.Caption>
          {renderEntry(data)}
        </Flex>
        <Flex sx={{ gap: 3, alignItems: 'center' }}>
          <PositionStatus
            status={hasLiquidate ? PositionStatusEnum.LIQUIDATE : isOpening ? PositionStatusEnum.OPEN : data.status}
          />
          <SharePosition isOpening={isOpening} stats={data} chartId={chartId} />
        </Flex>
      </Flex>
      <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 3 }}>
        <ItemInfo
          sx={{ minWidth: '100px' }}
          label={<Trans>Duration:</Trans>}
          value={formatDuration(data.durationInSecond)}
        />
        <Flex sx={{ minWidth: '220px' }}>
          {isOpening ? renderSizeOpeningWithPrices(data, prices) : renderSize(data)}
        </Flex>
      </Flex>

      <Flex width="100%" alignItems="center" sx={{ gap: 3, flexWrap: 'wrap', mt: 2 }}>
        <ItemInfo
          label={<Trans>Collateral:</Trans>}
          value={
            <ValueOrToken
              protocol={data.protocol}
              indexToken={data.collateralToken}
              value={data.collateral}
              valueInToken={data.collateralInToken}
            />
          }
        />
        <ItemInfo
          label={<Trans>Paid Fees:</Trans>}
          value={
            <ValueOrToken
              protocol={data.protocol}
              indexToken={data.collateralToken}
              value={data.fee != null ? data.fee * -1 : undefined}
              valueInToken={data.feeInToken != null ? data.feeInToken * -1 : undefined}
              component={
                <SignedText
                  value={data.fee == null && data.feeInToken == null ? undefined : (data.feeInToken ?? data.fee) * -1}
                  maxDigit={2}
                  minDigit={2}
                  prefix="$"
                />
              }
            />
          }
        />
        {hasFundingFee && (
          <ItemInfo
            label={<Trans>Funding:</Trans>}
            value={
              <ValueOrToken
                protocol={data.protocol}
                indexToken={data.collateralToken}
                value={data.funding}
                valueInToken={data.fundingInToken}
                component={
                  <SignedText value={data.fundingInToken ?? data.funding} maxDigit={2} minDigit={2} prefix="$" />
                }
              />
            }
          />
        )}
      </Flex>
    </Flex>
  )
}

const ItemInfo = ({ label, value, sx }: { label: ReactNode; value: ReactNode } & SxProps) => (
  <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap', ...(sx ?? {}) }}>
    <Type.Caption color="neutral3">{label}</Type.Caption>
    <Type.Caption textAlign="right">{value}</Type.Caption>
  </Flex>
)
