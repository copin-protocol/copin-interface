import { useResponsive } from 'ahooks'

import AddressAvatar from 'components/@ui/AddressAvatar'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { TraderData } from 'entities/trader'
import useTraderCopying from 'hooks/store/useTraderCopying'
import CopyButton from 'theme/Buttons/CopyButton'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum, TraderStatusEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'

import ShareProfile from './ShareProfile'

const TraderInfo = ({
  address,
  protocol,
  timeOption,
  traderStats,
}: {
  address: string
  protocol: ProtocolEnum
  timeOption: TimeFilterProps
  traderStats: (TraderData | undefined)[] | undefined
}) => {
  const { isCopying } = useTraderCopying(address, protocol)
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl
  const shareStats = traderStats?.find((data) => data && data.type === (timeOption.id as unknown as TimeFrameEnum))
  const { sm } = useResponsive()

  return (
    <Box px={3} py={2}>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <AddressAvatar address={address} size={40} />
        <Box>
          <Flex mb={{ _: 1, sm: 0 }} alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
            <Type.LargeBold lineHeight="20px" textAlign="left" fontSize={['16px', '18px']}>
              {addressShorten(address, 3, 5)}
            </Type.LargeBold>
            <FavoriteButton address={address} protocol={protocol} size={16} />
            {isCopying && <Tag width={70} status={TraderStatusEnum.COPYING} />}
          </Flex>
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <CopyButton type="button" variant="ghost" value={address} size="sm" iconSize={16} sx={{ p: 0 }} />
            <ExplorerLogo protocol={protocol} explorerUrl={`${explorerUrl}/address/${address}`} size={16} />
            <ShareProfile
              address={address}
              protocol={protocol}
              type={timeOption.id as unknown as TimeFrameEnum}
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
