import { Trans } from '@lingui/macro'

import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { Flex, TextProps, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { getSymbolFromPair } from 'utils/helpers/transform'

import { PriceTokenText } from '../DecoratedText/ValueText'
import Market from '../MarketGroup/Market'
import { VerticalDivider } from '../VerticalDivider'

const Entry = ({
  price,
  isLong,
  indexToken,
  pair,
  textSx,
  shouldShowMarketIcon = false,
  shouldShowPrice = true,
  shouldShowSymbol = true,
  sx = {},
}: {
  price?: number
  isLong: boolean
  symbol?: string
  indexToken?: string
  pair?: string
  textSx?: TextProps
  shouldShowMarketIcon?: boolean
  shouldShowPrice?: boolean
  shouldShowSymbol?: boolean
} & SxProps) => {
  const { getHlSzDecimalsByPair, getSymbolByIndexToken } = useSystemConfigStore((state) => state.marketConfigs)
  const symbolText = pair ? getSymbolFromPair(pair, true) : getSymbolByIndexToken?.({ indexToken }) ?? ''
  const symbol = getSymbolFromPair(pair)
  const hlDecimals = getHlSzDecimalsByPair?.(pair)
  return (
    <Flex
      sx={{
        gap: '6px',
        alignItems: 'center',
        color: 'neutral1',
        ...sx,
      }}
    >
      <Type.Caption {...textSx} width={8} color={isLong ? 'green1' : 'red2'}>
        {isLong ? <Trans>L</Trans> : <Trans>S</Trans>}
      </Type.Caption>
      {shouldShowSymbol && (
        <>
          <VerticalDivider />
          {shouldShowMarketIcon && <Market symbol={symbol} size={20} />}
          <Type.Caption {...textSx}>{symbolText}</Type.Caption>
        </>
      )}

      {shouldShowPrice && (
        <>
          <VerticalDivider />
          <Type.Caption {...textSx}>
            {price ? PriceTokenText({ value: price, maxDigit: 2, minDigit: 2, hlDecimals }) : '--'}
          </Type.Caption>
        </>
      )}
    </Flex>
  )
}

export default Entry
