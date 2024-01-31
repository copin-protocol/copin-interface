import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { DeltaText } from 'components/@ui/DecoratedText/DeltaText'
import { PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import { CopyOrderData } from 'entities/copyTrade'
import { Flex, Type } from 'theme/base'
import { OrderTypeEnum } from 'utils/config/enums'

import { ORDER_TYPES } from './ListCopyOrderTable'

export default function CopyOrderTooltip({ data }: { data: CopyOrderData }) {
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
        value={ORDER_TYPES[data.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE].text}
      />
      <ItemInfo
        label={<Trans>Collateral:</Trans>}
        value={
          <DeltaText type={data.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE} delta={data.collateral} />
        }
      />
      <ItemInfo
        label={<Trans>Size ($):</Trans>}
        value={
          data.sizeUsd ? (
            <DeltaText
              color="neutral1"
              type={data.isIncrease ? OrderTypeEnum.INCREASE : OrderTypeEnum.DECREASE}
              delta={data.sizeUsd}
              maxDigit={0}
            />
          ) : (
            '--'
          )
        }
      />
      <ItemInfo
        label={<Trans>Market Price:</Trans>}
        value={
          !data.price ? (
            '--'
          ) : (
            <>
              {PriceTokenText({
                value: data.price,
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
