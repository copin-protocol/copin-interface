import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import PositionStatus from 'components/@position/PositionStatus'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import ValueOrToken from 'components/@ui/ValueOrToken'
import { renderEntry, renderSizeOpeningWithPrices } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { PositionStatusEnum } from 'utils/config/enums'

export default function HLPositionStats({ data }: { data: PositionData }) {
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: data.protocol })
  const hasFundingFee = !!data?.funding

  return (
    <Box py={[2, 3]}>
      <Box>
        <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: [2, 24] }}>
          <Flex alignItems="center" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
            <Box sx={{ width: '150px', height: 'fit-content' }}>{renderEntry(data)}</Box>
            <Flex>{renderSizeOpeningWithPrices(data, prices, undefined, true)}</Flex>
          </Flex>
          <Flex alignItems="center" sx={{ gap: [2, 24] }}>
            <PositionStatus status={PositionStatusEnum.OPEN} />
          </Flex>
        </Flex>
        <Flex mt={3} alignItems="center" justifyContent="space-between" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
          <Flex alignItems="center" sx={{ gap: [2, 24], flexWrap: 'wrap' }}>
            <ItemInfo
              sx={{ width: '150px' }}
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
                        value={(data.funding ?? data.fundingInToken) * -1}
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
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

const ItemInfo = ({ label, value, sx }: { label: ReactNode; value: ReactNode } & SxProps) => (
  <Flex alignItems="center" sx={{ gap: 2, flexWrap: 'wrap', ...sx }}>
    <Type.Caption color="neutral3">{label}</Type.Caption>
    <Type.Caption textAlign="right">{value}</Type.Caption>
  </Flex>
)
