import AddressAvatar from 'components/@ui/AddressAvatar'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import FavoriteButton from 'components/FavoriteButton'
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
  traderData,
  timeOption,
  traderStats,
}: {
  address: string
  protocol: ProtocolEnum
  traderData?: TraderData
  timeOption: TimeFilterProps
  traderStats: (TraderData | undefined)[] | undefined
}) => {
  const { isCopying } = useTraderCopying(traderData?.account)
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl
  const shareStats = traderStats?.find((data) => data && data.type === (timeOption.id as unknown as TimeFrameEnum))

  return (
    <Box px={3} py={2}>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <AddressAvatar address={address} size={42} />
        <Box>
          <Flex alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
            <Box textAlign="left" alignItems="center">
              <Type.LargeBold lineHeight="20px" textAlign="left" fontSize={['16px', '18px']}>
                {addressShorten(address, 3, 5)}
              </Type.LargeBold>
              <ProtocolLogo protocol={protocol} />
            </Box>
            <CopyButton type="button" variant="ghost" value={address} size="sm" iconSize={20} sx={{ p: 0 }} />
            <ExplorerLogo protocol={protocol} explorerUrl={`${explorerUrl}/address/${address}`} />
            <FavoriteButton address={address} size={20} />
            <ShareProfile
              address={address}
              protocol={protocol}
              type={timeOption.id as unknown as TimeFrameEnum}
              stats={shareStats}
            />
            {isCopying && <Tag width={70} status={TraderStatusEnum.COPYING} />}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default TraderInfo
