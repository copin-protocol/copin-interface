import { CaretDown, CaretUp, Minus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { TopTraderData } from 'entities/trader'
import { useProtocolStore } from 'hooks/store/useProtocols'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import useTraderCopying from 'hooks/store/useTraderCopying'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

export default function AccountInfo({
  info,
  size = 40,
  isCurrentLeaderboard,
  hasHover = true,
}: {
  info: TopTraderData
  size?: number
  isCurrentLeaderboard?: boolean
  hasHover?: boolean
}) {
  const { setTrader } = useQuickViewTraderStore()
  const { protocol: defaultProtocol } = useProtocolStore()
  const { isCopying } = useTraderCopying(info.account, info.protocol)
  const protocol = info.protocol ?? defaultProtocol
  const deltaRanking = isCurrentLeaderboard ? (info?.lastRanking ?? 1001) - info.ranking : 0

  return (
    <Flex
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
      }}
      minWidth="200px"
    >
      <Box
        width={size}
        height={size}
        sx={{
          '&:hover': hasHover
            ? {
                cursor: 'pointer',
                backgroundImage: `url(${IconEye})`,
                backgroundSize: '24px',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }
            : {},
        }}
        onClick={(event) => {
          event.stopPropagation()
          setTrader({ address: info.account, protocol })
        }}
      >
        <AddressAvatar address={info.account} size={size} sx={{ '&:hover': hasHover ? { opacity: 0.25 } : {} }} />
      </Box>
      <Flex
        as={Link}
        to={generateTraderMultiExchangeRoute({ protocol, address: info.account })}
        onClick={(e: any) => e.stopPropagation()}
        flexDirection="column"
        sx={{
          textAlign: 'left',
        }}
      >
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.CaptionBold
            data-tip="React-tooltip"
            data-tooltip-id={`account-${info.account}-tt`}
            data-tooltip-delay-hide={0}
            data-tooltip-delay-show={360}
            data-tooltip-offset={-8}
            lineHeight="24px"
            color={isCopying ? 'orange1' : 'neutral1'}
            width={85}
            sx={{
              ':hover': {
                color: 'primary1',
                textDecoration: 'underline',
              },
            }}
          >
            {addressShorten(info.account, 3, 5)}
          </Type.CaptionBold>
          <Flex alignItems="center">
            <IconBox
              icon={
                deltaRanking === 0 ? (
                  <Minus />
                ) : deltaRanking > 0 ? (
                  <CaretUp weight="fill" />
                ) : (
                  <CaretDown weight="fill" />
                )
              }
              color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}
            />
            <Type.Small color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}>
              {deltaRanking !== 0 && formatNumber(Math.abs(deltaRanking))}
              {isCurrentLeaderboard && !info.lastRanking && '+'}
            </Type.Small>
          </Flex>
          <Tooltip
            id={`account-${info.account}-tt`}
            place="top"
            type="dark"
            effect="solid"
            noArrow={true}
            clickable={true}
            style={{
              padding: 0,
            }}
            delayShow={360}
            delayHide={0}
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <CopyButton
                variant="ghost"
                size="xs"
                value={info.account}
                iconSize={16}
                sx={{
                  transition: 'none',
                }}
              >
                Copy
              </CopyButton>
            </div>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  )
}
