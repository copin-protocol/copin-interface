import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import NoDataFound from 'components/@ui/NoDataFound'
import { renderEntry, renderSizeOpening } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { formatLeverage, formatNumber } from 'utils/helpers/format'

type Props = {
  isLoading: boolean
  data?: PositionData[]
  scrollDep: any
  onClickItem?: (data: PositionData) => void
  hasAccountAddress?: boolean
  isOpening?: boolean
  sx?: any
  totalPositionValue?: number
}

export default function HLTraderPositionListView({
  data,
  isLoading,
  scrollDep,
  onClickItem,
  hasAccountAddress = true,
  isOpening = true,
  totalPositionValue,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [scrollDep])
  return (
    <Flex
      ref={wrapperRef}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', '&:last-child': { borderBottom: 'none' } },
      }}
    >
      {!isLoading && data?.length === 0 && <NoDataFound message={<Trans>No position was found</Trans>} />}
      {isLoading && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      {data?.map((position) => {
        const weightPercent = totalPositionValue ? (position.size / totalPositionValue) * 100 : 0

        return (
          <Box role="button" sx={{ p: 2 }} key={position.id} onClick={() => onClickItem?.(position)}>
            <Flex sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Box flex={['60%', '40%', '15%']} order={[0, 0, 0]}>
                {renderEntry(position)}
              </Box>
              <Flex
                flex={['40%', '30%', '10%']}
                minWidth="105px"
                sx={{ alignItems: 'center', gap: 1 }}
                order={[0, 1, 1]}
              >
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Weight:
                </Type.Caption>
                <Type.Caption>{!!weightPercent ? `${formatNumber(weightPercent, 2, 2)}%` : '--'}</Type.Caption>
              </Flex>

              <Box
                display={['none', 'flex', 'flex']}
                flex={['40%', '30%', '15%']}
                sx={{ alignItems: 'center', gap: 1 }}
                order={[5, 1, 1]}
              >
                <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                  Funding:
                </Type.Caption>
                <Type.Caption>
                  <SignedText
                    value={position.funding * -1}
                    minDigit={2}
                    maxDigit={2}
                    prefix="$"
                    fontInherit
                    isCompactNumber
                  />
                </Type.Caption>
              </Box>

              <Flex flex={['60%', '70%', '25%']} alignItems="center" my={12} order={[0, 1, 0]}>
                {isOpening ? (
                  <>
                    <Box sx={{ width: [200, 250, 200], flexShrink: 0 }}>{renderSizeOpening(position)}</Box>
                    {/* <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                      -
                    </Type.Caption> */}
                  </>
                ) : (
                  <Type.Caption color="neutral1">
                    <Box as="span" color="neutral3" mr="1ch">
                      Size:
                    </Box>
                    ${formatNumber(position.size, 0, 0)}
                    <Box as="span" color="neutral3" sx={{ mx: 1 }}>
                      |
                    </Box>
                    {formatLeverage(position.marginMode, position.leverage)}
                  </Type.Caption>
                )}
              </Flex>
              <Box flex={['40%', '30%', '20%']} order={[1, 1, 1]}>
                <Box display={['flex', 'none']} sx={{ alignItems: 'center', gap: 1 }} mb="4px">
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    Funding:
                  </Type.Caption>
                  <Type.Caption>
                    <SignedText
                      value={position.funding * -1}
                      minDigit={2}
                      maxDigit={2}
                      prefix="$"
                      fontInherit
                      isCompactNumber
                    />
                  </Type.Caption>
                </Box>
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
                    PnL:
                  </Type.Caption>
                  <Type.Caption>
                    <SignedText value={position.pnl} minDigit={1} maxDigit={1} prefix="$" fontInherit isCompactNumber />
                  </Type.Caption>
                  {!!position.roi && (
                    <Type.Small color={position.roi < 0 ? 'red2' : 'green1'}>
                      ({formatNumber(position.roi, 2, 2)}%)
                    </Type.Small>
                  )}
                </Flex>
              </Box>

              {isOpening && hasAccountAddress && <IconBox icon={<CaretRight size={16} />} color="neutral3" />}
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
