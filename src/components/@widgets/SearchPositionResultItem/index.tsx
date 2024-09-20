import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { SystemStyleObject } from '@styled-system/css'
import React from 'react'
import { GridProps } from 'styled-system'

import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import ActiveDot from 'components/@ui/ActiveDot'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { renderEntry, renderOpeningPnL, renderSizeShorten } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { Button } from 'theme/Buttons'
import Tag from 'theme/Tag'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'

const SearchPositionResultItem = ({
  data,
  isShowPnl,
  hasArrow,
  handleClick,
  sx,
  ...props
}: {
  data: PositionData
  isShowPnl?: boolean
  hasArrow?: boolean
  handleClick?: (data: PositionData) => void
  sx?: SystemStyleObject & GridProps
}) => {
  const isOpening = data.status === PositionStatusEnum.OPEN
  const { isCopying } = useTraderCopying(data.account, data.protocol)

  return (
    <Box
      width="100%"
      {...props}
      px={3}
      py={2}
      sx={{
        borderTop: 'small',
        borderColor: 'neutral4',
        '&:hover': {
          backgroundColor: '#292d40',
        },
        ...sx,
      }}
    >
      <Button
        variant="ghost"
        type="button"
        onClick={() => (handleClick ? handleClick(data) : undefined)}
        sx={{ color: 'inherit', p: 0, mx: 0, display: 'flex', gap: 12 }}
        width="100%"
      >
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <AddressAvatar address={data.account} size={40} />
          <ProtocolLogo protocol={data.protocol} size={24} hasText={false} />
        </Flex>
        <Box flex={1} sx={{ textAlign: 'left' }}>
          <Type.CaptionBold
            mb="2px"
            lineHeight="24px"
            color={isCopying ? 'orange1' : 'inherit'}
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Box as="span">{data.account}</Box>
            {/* {isOpening && (
              <ActiveDot
                tooltipId={`tt_opening_${data.account}`}
                tooltipContent={<Trans>Having open positions</Trans>}
              />
            )} */}
          </Type.CaptionBold>

          <Flex width="100%" alignItems="center" flexWrap="wrap" sx={{ gap: 24 }}>
            <Type.Caption>
              <Tag minWidth={70} status={data.isLiquidate ? PositionStatusEnum.LIQUIDATE : data.status} bg="neutral4" />
            </Type.Caption>
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Type.Caption color="neutral3">Entry:</Type.Caption>
              {renderEntry(data)}
            </Flex>
            <Flex alignItems="center" sx={{ gap: 2 }}>
              <Type.Caption color="neutral3">Size:</Type.Caption>
              {renderSizeShorten(data)}
            </Flex>
            {isShowPnl && (
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption color="neutral3">PnL:</Type.Caption>
                {isOpening ? (
                  renderOpeningPnL(data, true, { width: 'fit-content' })
                ) : (
                  <SignedText value={data.pnl} maxDigit={0} />
                )}
              </Flex>
            )}
          </Flex>
          <Type.Caption color="neutral3">Position Hash: {data?.txHashes?.[0]}</Type.Caption>
        </Box>
        {/* <Flex width="100%" flexDirection="column" sx={{ gap: 2 }}>
          <Flex sx={{ gap: 2, alignItems: 'center', justifyContent: 'space-between' }} flexWrap="wrap">
            <AccountWithProtocol address={data.account} protocol={data.protocol} size={32} sx={{ gap: 2 }} />
            <Flex alignItems="center" sx={{ gap: 3 }}>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.Caption color="neutral3">
                  <RelativeTimeText date={isOpening ? data.openBlockTime : data.closeBlockTime} />
                </Type.Caption>
                <Type.Caption>
                  <Tag
                    minWidth={70}
                    status={data.isLiquidate ? PositionStatusEnum.LIQUIDATE : data.status}
                    bg="neutral4"
                  />
                </Type.Caption>
              </Flex>
              {hasArrow && <IconBox size={20} icon={<CaretRight size={20} />} color="neutral2" />}
            </Flex>
          </Flex>
        </Flex> */}
      </Button>
    </Box>
  )
}

export default SearchPositionResultItem
