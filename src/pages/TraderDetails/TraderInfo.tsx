import { HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router-dom'

import AddressAvatar from 'components/@ui/AddressAvatar'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { TraderData } from 'entities/trader'
import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import ListCopyingTag from './ListCopyingTag'
import ShareProfile from './ShareProfile'

const TraderInfo = ({
  address,
  protocol,
  timeOption,
  traderStats,
  target,
}: {
  address: string
  protocol: ProtocolEnum
  timeOption: TimeFilterProps
  traderStats: (TraderData | undefined)[] | undefined
  target?: HTMLAttributeAnchorTarget
}) => {
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl
  // const shareStats = traderStats?.find((data) => data && data.type === (timeOption.id as unknown as TimeFrameEnum))
  const shareStats = traderStats?.find((data) => data && data.type === TimeFrameEnum.ALL_TIME)

  return (
    <Box px={3} py={2}>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <Box
          as={Link}
          to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeOption.id } })}
          onClick={(e: any) => e.stopPropagation()}
          target={target}
        >
          <AddressAvatar address={address} size={40} />
        </Box>
        <Box>
          <Flex mb={1} alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
            <Box
              as={Link}
              to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeOption.id } })}
              target={target}
            >
              <Type.LargeBold color="neutral1" lineHeight="20px" textAlign="left" fontSize={['16px', '18px']}>
                {addressShorten(address, 3, 5)}
              </Type.LargeBold>
            </Box>
            <FavoriteButton address={address} protocol={protocol} size={16} sx={{ mb: 0 }} />
            <ListCopyingTag address={address} protocol={protocol} />
          </Flex>
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <CopyButton type="button" variant="ghost" value={address} size="sm" iconSize={16} sx={{ p: 0 }} />
            <ExplorerLogo protocol={protocol} explorerUrl={`${explorerUrl}/address/${address}`} size={16} />
            <ShareProfile
              address={address}
              protocol={protocol}
              // type={timeOption.id as unknown as TimeFrameEnum}
              type={TimeFrameEnum.ALL_TIME}
              stats={shareStats}
              iconSize={16}
            />
            {/* <ProtocolLogo protocol={protocol} />
            {!sm && isCopying && (
              <Tag
                width={70}
                status={TraderStatusEnum.COPYING}
                sx={{ p: 0, '& *': { lineHeight: '1em', pt: '2px', pb: '4px' } }}
              />
            )} */}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default TraderInfo
