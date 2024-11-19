import { CopyWalletData } from 'entities/copyWallet'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Image, Type } from 'theme/base'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'

export default function SelectSingleWallet({
  currentWallet,
  wallets,
  onChangeWallet,
}: {
  wallets: CopyWalletData[] | undefined
  currentWallet: CopyWalletData | null
  onChangeWallet: (wallet: CopyWalletData) => void
}) {
  if (!currentWallet || !wallets) return null
  return (
    <Dropdown
      buttonVariant="ghost"
      buttonSx={{ height: '100%', border: 'none', p: 0 }}
      sx={{ height: '100%', pr: 2, flexShrink: 0 }}
      menuSx={{
        width: ['100%', 200],
        overflow: 'hidden auto',
        height: 'max-content',
        maxHeight: [400, 500],
        py: 2,
      }}
      menu={
        <>
          {wallets.map((wallet) => {
            return (
              <DropdownItem key={wallet.id} onClick={() => onChangeWallet(wallet)}>
                <Box key={wallet.id} sx={{ width: '100%', maxWidth: 300 }}>
                  <WalletItem data={wallet} />
                </Box>
              </DropdownItem>
            )
          })}
        </>
      }
    >
      <WalletItem data={currentWallet} />
    </Dropdown>
  )
}

function WalletItem({ data }: { data: CopyWalletData }) {
  return (
    <Type.Caption sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
      <Image src={parseExchangeImage(data.exchange)} width={20} height={20} sx={{ flexShrink: 0 }} />
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
        {parseWalletName(data)}
      </Box>
    </Type.Caption>
  )
}
