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
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum, TimeFrameEnum, TraderStatusEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { addressShorten } from 'utils/helpers/format'

import ShareProfile from './ShareProfile'

const TraderInfo = ({
  address,
  traderData,
  timeOption,
  traderStats,
}: {
  address: string
  traderData?: TraderData
  timeOption: TimeFilterProps
  traderStats: (TraderData | undefined)[] | undefined
}) => {
  const { isCopying } = useTraderCopying(traderData?.account)
  const explorerUrl =
    traderData && traderData.protocol ? PROTOCOL_PROVIDER[traderData.protocol].explorerUrl : LINKS.arbitrumExplorer
  const shareStats = traderStats?.find((data) => data && data.type === (timeOption.id as unknown as TimeFrameEnum))

  return (
    <Box px={3} py={2}>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <AddressAvatar address={address} size={42} />
        <Box>
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Box textAlign="left" alignItems="center">
              <Type.LargeBold lineHeight="20px" textAlign="left">
                {addressShorten(address, 3, 5)}
              </Type.LargeBold>
              {traderData && <ProtocolLogo protocol={traderData.protocol} />}
            </Box>
            <CopyButton type="button" variant="ghost" value={address} size="sm" iconSize={20} sx={{ p: 0 }} />
            {traderData && (
              <ExplorerLogo protocol={traderData.protocol} explorerUrl={`${explorerUrl}/address/${address}`} />
            )}
            <FavoriteButton address={address} size={20} />
            {isCopying && <Tag width={70} status={TraderStatusEnum.COPYING} />}
            {traderData && <ShareProfile address={address} protocol={traderData.protocol} stats={shareStats} />}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default TraderInfo
