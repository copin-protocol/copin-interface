import { ArrowSquareOut } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

import AddressAvatar from 'components/@ui/AddressAvatar'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { TraderData } from 'entities/trader'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useTraderCopying from 'hooks/store/useTraderCopying'
import useVaultCopying from 'hooks/store/useVaultCopying'
import CopyButton from 'theme/Buttons/CopyButton'
import Tag from 'theme/Tag'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum, TimeFrameEnum, TraderStatusEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { PROTOCOL_PROVIDER } from 'utils/config/trades'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'

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
  const { copyWallets, vaultWallets } = useCopyWalletContext()
  const { isCopying, traderCopying } = useTraderCopying(address, protocol)
  const { isVaultCopying, vaultCopying } = useVaultCopying(address, protocol)
  const explorerUrl = PROTOCOL_PROVIDER[protocol]?.explorerUrl
  // const shareStats = traderStats?.find((data) => data && data.type === (timeOption.id as unknown as TimeFrameEnum))
  const shareStats = traderStats?.find((data) => data && data.type === TimeFrameEnum.ALL_TIME)
  const copyingWallets = copyWallets?.filter((wallet) => traderCopying?.[address]?.[protocol]?.includes(wallet.id))
  const vaultCopyingWallets = vaultWallets?.filter((wallet) => vaultCopying?.[address]?.[protocol]?.includes(wallet.id))

  return (
    <Box px={3} py={2}>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <Box
          as={Link}
          to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeOption.id } })}
          onClick={(e: any) => e.stopPropagation()}
        >
          <AddressAvatar address={address} size={40} />
        </Box>
        <Box>
          <Flex mb={{ _: 1, sm: 0 }} alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
            <Box
              as={Link}
              to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeOption.id } })}
            >
              <Type.LargeBold color="neutral1" lineHeight="20px" textAlign="left" fontSize={['16px', '18px']}>
                {addressShorten(address, 3, 5)}
              </Type.LargeBold>
            </Box>
            <FavoriteButton address={address} protocol={protocol} size={16} />
            {isCopying && (
              <Box>
                <Tag
                  width={70}
                  status={TraderStatusEnum.COPYING}
                  clickableTooltip
                  tooltipContent={
                    <Flex flexDirection="column" sx={{ gap: 1, maxHeight: '80svh', overflow: 'auto' }}>
                      <Type.Caption color="neutral3">Copy Wallet:</Type.Caption>
                      {copyingWallets &&
                        copyingWallets.length > 0 &&
                        copyingWallets.map((wallet) => {
                          return (
                            <Flex
                              key={wallet.id}
                              as={Link}
                              to={`${ROUTES.MY_MANAGEMENT.path}?${URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID}=${wallet.id}`}
                              target="_blank"
                              sx={{
                                alignItems: 'center',
                                gap: '6px',
                                color: 'neutral3',
                                '&:hover': { color: 'primary1' },
                              }}
                            >
                              <Image
                                src={parseExchangeImage(wallet.exchange)}
                                width={20}
                                height={20}
                                sx={{ flexShrink: 0 }}
                              />
                              <Box
                                as="span"
                                sx={{
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                  width: '100%',
                                  maxWidth: 200,
                                  ...overflowEllipsis(),
                                }}
                              >
                                {parseWalletName(wallet)}
                              </Box>
                              <ArrowSquareOut size={16} />
                            </Flex>
                          )
                        })}
                    </Flex>
                  }
                />
              </Box>
            )}
            {isVaultCopying && vaultCopyingWallets && (
              <Box>
                <Tag
                  width={100}
                  status={TraderStatusEnum.VAULT_COPYING}
                  clickableTooltip
                  tooltipContent={
                    <Flex flexDirection="column" sx={{ gap: 1, maxHeight: '80svh', overflow: 'auto' }}>
                      <Type.Caption color="neutral3">Vault Copy Wallet:</Type.Caption>
                      {vaultCopying &&
                        vaultCopyingWallets.length > 0 &&
                        vaultCopyingWallets.map((wallet) => {
                          return (
                            <Flex
                              key={wallet.id}
                              as={Link}
                              to={`${ROUTES.USER_VAULT_MANAGEMENT.path}?${URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID}=${wallet.id}`}
                              target="_blank"
                              sx={{
                                alignItems: 'center',
                                gap: '6px',
                                color: 'neutral3',
                                '&:hover': { color: 'primary1' },
                              }}
                            >
                              <Image
                                src={parseExchangeImage(wallet.exchange)}
                                width={20}
                                height={20}
                                sx={{ flexShrink: 0 }}
                              />
                              <Box
                                as="span"
                                sx={{
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                  width: '100%',
                                  maxWidth: 200,
                                  ...overflowEllipsis(),
                                }}
                              >
                                {parseWalletName(wallet)}
                              </Box>
                              <ArrowSquareOut size={16} />
                            </Flex>
                          )
                        })}
                    </Flex>
                  }
                />
              </Box>
            )}
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
