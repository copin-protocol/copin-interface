import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import ValueOrToken from 'components/ValueOrToken'
import { OrderData } from 'entities/trader'
import { Flex, Type } from 'theme/base'
import { OrderTypeEnum } from 'utils/config/enums'

import { ORDER_TYPES } from './ListOrderTable'

export default function OrderTooltip({ data }: { data: OrderData }) {
  return (
    <Flex
      variant="cardBorder"
      flexDirection="column"
      sx={{
        p: 2,
        gap: 1,
        position: 'absolute',
        top: -58,
        right: 0,
        zIndex: '999',
        bg: 'neutral5',
        backdropFilter: 'blur(15px)!important',
      }}
    >
      <ItemInfo
        label={<Trans>Action:</Trans>}
        value={ORDER_TYPES[data.isClose ? OrderTypeEnum.CLOSE : data.type].text}
      />
      <ItemInfo
        label={<Trans>Collateral Delta:</Trans>}
        value={
          <ValueOrToken
            protocol={data.protocol}
            indexToken={data.collateralToken}
            value={data.collateralDeltaNumber}
            valueInToken={data.collateralDeltaInTokenNumber}
            component={
              <DeltaText
                color="neutral1"
                type={data.type}
                delta={data.collateralToken ? data.collateralDeltaInTokenNumber : data.collateralDeltaNumber}
                maxDigit={data.collateralToken ? 2 : undefined}
                minDigit={data.collateralToken ? 2 : undefined}
              />
            }
          />
        }
      />
      <ItemInfo
        label={<Trans>Size Delta:</Trans>}
        value={
          data.type === OrderTypeEnum.MARGIN_TRANSFERRED ? (
            '--'
          ) : (
            <DeltaText type={data.type} delta={Math.abs(data.sizeDeltaNumber)} />
          )
        }
      />
      <ItemInfo
        label={<Trans>Market Price:</Trans>}
        value={
          data.type === OrderTypeEnum.MARGIN_TRANSFERRED ? (
            '--'
          ) : (
            <>
              {PriceTokenText({
                value: data.priceNumber,
                maxDigit: 2,
                minDigit: 2,
              })}
            </>
          )
        }
      />
    </Flex>
  )
}

const ItemInfo = ({ label, value }: { label: ReactNode; value: ReactNode }) => (
  <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 4 }}>
    <Type.Small color="neutral3">{label}</Type.Small>
    <Type.Small textAlign="right">{value}</Type.Small>
  </Flex>
)
