import { memo, useState } from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useTraderCopying from 'hooks/store/useTraderCopying'
import useVaultCopying from 'hooks/store/useVaultCopying'
import { Button } from 'theme/Buttons'
import StatusTag from 'theme/Tag/StatusTag'
import { Flex, Image, Type } from 'theme/base'
import { ProtocolEnum, TraderStatusEnum } from 'utils/config/enums'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'

import CopyManagementDrawer from './CopyManagementDrawer'

const ListCopyingTag = memo(function ListCopyingTagMemo({
  address,
  protocol,
}: {
  address: string
  protocol: ProtocolEnum
}) {
  const { copyWallets, vaultWallets } = useCopyWalletContext()
  const { isCopying, traderCopying } = useTraderCopying(address, protocol)
  const { isVaultCopying, vaultCopying } = useVaultCopying(address, protocol)
  const copyingWallets = copyWallets?.filter((wallet) => traderCopying?.[address]?.[protocol]?.includes(wallet.id))
  const vaultCopyingWallets = vaultWallets?.filter((wallet) => vaultCopying?.[address]?.[protocol]?.includes(wallet.id))

  const [selectedWallet, setSelectedWallet] = useState<CopyWalletData | null>(null)
  const [isSelectedAll, setIsSelectedAll] = useState<boolean | null>(null) // because complex logic cannot use selectedWallets length to check select all
  const onChangeWallet = (wallet: CopyWalletData) => {
    setIsSelectedAll(false)
    setSelectedWallet(wallet)
  }
  const onSelectAllWallets = () => setIsSelectedAll(true)
  const handleDismiss = () => {
    setIsSelectedAll(null)
    setSelectedWallet(null)
  }
  const isOpen = isSelectedAll != null && selectedWallet != null

  return (
    <>
      {isCopying && (
        <CopyingTag
          copyType={TraderStatusEnum.COPYING}
          copyingWallets={copyingWallets}
          onClickWallet={onChangeWallet}
        />
      )}
      {isVaultCopying && vaultCopyingWallets && (
        <CopyingTag
          copyType={TraderStatusEnum.VAULT_COPYING}
          copyingWallets={vaultCopyingWallets}
          onClickWallet={onChangeWallet}
        />
      )}
      {isOpen && (
        <CopyManagementDrawer
          isSelectedAll={isSelectedAll}
          onClose={handleDismiss}
          isOpen={isOpen}
          address={address}
          protocol={protocol}
          copyWallet={selectedWallet}
          listWallets={[...(copyingWallets ?? []), ...(vaultCopyingWallets ?? [])]}
          onChangeWallet={onChangeWallet}
          onSelectAllWallets={onSelectAllWallets}
        />
      )}
    </>
  )
})
export default ListCopyingTag

function CopyingTag({
  copyingWallets,
  copyType,
  onClickWallet,
}: {
  copyingWallets: CopyWalletData[] | undefined
  copyType: TraderStatusEnum
  onClickWallet?: (walletData: CopyWalletData) => void
}) {
  return (
    <StatusTag
      width={70}
      status={copyType}
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
                  sx={{
                    alignItems: 'center',
                    gap: 2,
                    color: 'neutral3',
                    // '&:hover': { color: 'primary1' },
                  }}
                >
                  <Button
                    variant="text"
                    sx={{ gap: '6px', alignItems: 'center', flex: 1, display: 'flex', textAlign: 'left', p: 0 }}
                    onClick={() => onClickWallet?.(wallet)}
                  >
                    <Image src={parseExchangeImage(wallet.exchange)} width={20} height={20} sx={{ flexShrink: 0 }} />
                    <Type.Caption
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        width: '100%',
                        maxWidth: 200,
                        ...overflowEllipsis(),
                      }}
                    >
                      {parseWalletName(wallet)}
                    </Type.Caption>
                  </Button>
                  {/* <IconBox
                    icon={<ArrowSquareOut size={16} />}
                    as={Link}
                    to={`${
                      copyType === TraderStatusEnum.VAULT_COPYING
                        ? ROUTES.USER_VAULT_MANAGEMENT
                        : ROUTES.MY_MANAGEMENT.path
                    }?${URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID}=${wallet.id}`}
                    target="_blank"
                    sx={{ flexShrink: 0, '&:hover': { color: 'primary2' } }}
                  /> */}
                </Flex>
              )
            })}
        </Flex>
      }
    />
  )
}
