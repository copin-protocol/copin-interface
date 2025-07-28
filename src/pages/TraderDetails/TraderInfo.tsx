import { useResponsive } from 'ahooks'
import { HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router-dom'

import AddressAvatar from 'components/@ui/AddressAvatar'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TraderLabels from 'components/@ui/TraderLabels'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { TraderData } from 'entities/trader'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import useTraderFavorites from 'hooks/store/useTraderFavorites'
import { useEnsName } from 'hooks/useEnsName'
import CopyButton from 'theme/Buttons/CopyButton'
import ArkhamIcon from 'theme/Icons/ArkhamIcon'
import DebankIcon from 'theme/Icons/DebankIcon'
import DebankIconColor from 'theme/Icons/DebankIconColor'
import HyperformanceIconColor from 'theme/Icons/HyperformanceIcoColor'
import HyperformanceIcon from 'theme/Icons/HyperformanceIcon'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import ListCopyingTag from './ListCopyingTag'
import ShareProfile from './ShareProfile'
import TradeLabelsFrame from './TradeLabelsFrame'

const TraderInfo = ({
  address,
  protocol,
  timeOption,
  traderStats,
  isLink = true,
  target,
  hasLabels = true,
}: {
  address: string
  protocol: ProtocolEnum
  timeOption: TimeFilterProps
  traderStats: (TraderData | undefined)[] | undefined
  target?: HTMLAttributeAnchorTarget
  isLink?: boolean
  hasLabels?: boolean
}) => {
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl
  // const shareStats = traderStats?.find((data) => data && data.type === (timeOption.id as unknown as TimeFrameEnum))
  const shareStats = traderStats?.find((data) => data && data.type === TimeFrameEnum.ALL_TIME)
  const { trader, resetTrader } = useQuickViewTraderStore()
  const { bookmarks } = useTraderFavorites()
  const { ensName } = useEnsName(address)
  const { lg } = useResponsive()
  const ifLabels = traderStats?.find((data) => data && !!data.ifLabels)?.ifLabels

  const onViewTrader = (e: any) => {
    e.stopPropagation()
    if (!!trader) {
      resetTrader()
    }
  }
  const ignoreArkhamProtocols = [ProtocolEnum.DYDX]
  const ignoreDebankProtocols = [ProtocolEnum.JUPITER, ProtocolEnum.DYDX]

  return (
    <Box px={3} py={2}>
      <Box>
        <Flex sx={{ gap: 2, alignItems: 'center' }}>
          <Box
            as={isLink ? Link : undefined}
            to={isLink ? generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeOption.id } }) : ''}
            onClick={isLink ? onViewTrader : undefined}
            target={target}
          >
            <AddressAvatar address={address} size={40} />
          </Box>
          <Box>
            <Flex mb={1} alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
              <Box
                as={isLink ? Link : undefined}
                to={
                  isLink ? generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeOption.id } }) : ''
                }
                onClick={isLink ? onViewTrader : undefined}
                target={target}
                data-tip="React-tooltip"
                data-tooltip-id={`note-${address}-${protocol}`}
              >
                <Type.LargeBold color="neutral1" lineHeight="20px" textAlign="left" fontSize={['16px', '18px']}>
                  {ensName ? ensName : addressShorten(address, 3, 5)}
                </Type.LargeBold>
              </Box>
              <FavoriteButton address={address} protocol={protocol} size={16} sx={{ mb: 0 }} />

              <ListCopyingTag address={address} protocol={protocol} />
            </Flex>
            <Flex sx={{ gap: 2, alignItems: 'center' }}>
              <CopyButton type="button" variant="ghostInactive" value={address} size="sm" iconSize={16} sx={{ p: 0 }}>
                {ensName ? addressShorten(address, 3, 5) : ''}
              </CopyButton>
              <ExplorerLogo protocol={protocol} explorerUrl={`${explorerUrl}/address/${address}`} size={16} />
              {protocol === ProtocolEnum.HYPERLIQUID && (
                <Flex
                  as="a"
                  href={`${LINKS.hyperformance}/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    position: 'relative',
                    top: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover .icon-default': { display: 'none' },
                    '&:hover .icon-hover': { display: 'inline' },
                  }}
                >
                  <Box className="icon-default">
                    <HyperformanceIcon />
                  </Box>
                  <Box className="icon-hover" sx={{ display: 'none' }}>
                    <HyperformanceIconColor />
                  </Box>
                </Flex>
              )}
              {!ignoreDebankProtocols.includes(protocol) && (
                <Flex
                  as="a"
                  href={`${LINKS.debankAddress}/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    position: 'relative',
                    top: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover .icon-default': { display: 'none' },
                    '&:hover .icon-hover': { display: 'inline' },
                  }}
                >
                  <Box className="icon-default">
                    <DebankIcon />
                  </Box>
                  <Box className="icon-hover" sx={{ display: 'none' }}>
                    <DebankIconColor />
                  </Box>
                </Flex>
              )}
              {!ignoreArkhamProtocols.includes(protocol) && (
                <Flex
                  as={'a'}
                  href={`${LINKS.arkhamAddress}/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    '&:hover svg path': {
                      fill: '#fff',
                    },
                  }}
                >
                  <ArkhamIcon />
                </Flex>
              )}
              <ShareProfile
                address={address}
                protocol={protocol}
                // type={timeOption.id as unknown as TimeFrameEnum}
                type={TimeFrameEnum.ALL_TIME}
                stats={shareStats}
                iconSize={16}
              />
            </Flex>
          </Box>
          {!!traderStats && lg && hasLabels && (
            <Box sx={{ width: 'fit-content' }}>
              {!!ifLabels && (
                <Flex sx={{ flexWrap: 'wrap', gap: 2, mb: 1, px: 2 }}>
                  <TraderLabels
                    labels={
                      ifLabels?.map((label) => ({
                        key: label,
                        title: label,
                      })) ?? []
                    }
                    isIF
                    showedItems={3}
                    shouldShowTooltip={false}
                  />
                </Flex>
              )}
              <TradeLabelsFrame
                traderStats={traderStats as unknown as TraderData[]}
                showedItems={3}
                sx={{
                  width: ['max-content', 'max-content', '100%'],
                  px: 2,
                  py: [2, 2, 0],
                }}
              />
            </Box>
          )}
        </Flex>
      </Box>
      {!!bookmarks?.[`${address}-${protocol}`]?.note && (
        <Tooltip id={`note-${address}-${protocol}`} place="bottom">
          <Type.Caption
            maxWidth={300}
            textAlign="center"
            style={{
              textTransform: 'none',
            }}
          >
            {bookmarks[`${address}-${protocol}`]?.note}
          </Type.Caption>
        </Tooltip>
      )}
    </Box>
  )
}

export default TraderInfo
