import { Trans } from '@lingui/macro'
import { Lock } from '@phosphor-icons/react'

import SafeDropdownIndex from 'components/@widgets/SafeDropdownIndex'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyTradePermission from 'hooks/features/subscription/useCopyTradePermission'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'

// TODO: make multiple
export default function SelectCopyWallet({
  currentWallet,
  wallets,
  onChangeWallet,
  isSelectedAll,
  hasSelectAll,
  onSelectAll,
  buttonSx = {},
  sx = {},
}: {
  wallets: CopyWalletData[] | undefined
  currentWallet: CopyWalletData | null | undefined
  onChangeWallet: (wallet: CopyWalletData) => void
  isSelectedAll?: boolean
  hasSelectAll?: boolean
  onSelectAll?: (wallets?: CopyWalletData[]) => void
  buttonSx?: any
  sx?: any
}) {
  const { userPermission } = useCopyTradePermission()
  if (!currentWallet || !wallets) return null
  return (
    <Dropdown
      buttonVariant="ghost"
      buttonSx={{ height: '100%', border: 'none', p: 0, textTransform: 'none', ...buttonSx }}
      sx={{ height: '100%', pr: 2, flexShrink: 0, ...sx }}
      menuSx={{
        width: 200,
        overflow: 'hidden auto',
        height: 'max-content',
        maxHeight: [400, 500],
        py: 2,
      }}
      menu={
        <>
          {hasSelectAll && onSelectAll && (
            <DropdownItem onClick={() => onSelectAll?.(wallets)}>
              <AllSelection isActive={!!isSelectedAll} />
            </DropdownItem>
          )}
          {wallets.map((wallet) => {
            return (
              <DropdownItem key={wallet.id} onClick={() => onChangeWallet(wallet)}>
                <WalletItem
                  key={wallet.id}
                  data={wallet}
                  disabled={!userPermission?.exchangeAllowed?.includes(wallet.exchange)}
                  isActive={!!isSelectedAll ? false : wallet.id === currentWallet.id}
                />
              </DropdownItem>
            )
          })}
        </>
      }
    >
      <SafeDropdownIndex />
      {isSelectedAll ? (
        <AllSelection isActive />
      ) : (
        <WalletItem
          data={currentWallet}
          isActive
          disabled={!userPermission?.exchangeAllowed?.includes(currentWallet.exchange)}
        />
      )}
    </Dropdown>
  )
}

function AllSelection({ isActive }: { isActive: boolean }) {
  return (
    <Type.Caption color={isActive ? 'primary1' : 'inherit'}>
      <Trans>All Wallets</Trans>
    </Type.Caption>
  )
}

function WalletItem({ data, isActive, disabled }: { data: CopyWalletData; isActive: boolean; disabled: boolean }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 300,
        color: isActive ? 'primary1' : 'inherit',
        textTransform: 'none',
      }}
    >
      <Flex sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        <Image src={parseExchangeImage(data.exchange)} width={20} height={20} sx={{ flexShrink: 0 }} />
        <Flex sx={{ alignItems: 'center' }}>
          <Type.Caption
            sx={{
              width: '100%',
              maxWidth: 200,
              ...overflowEllipsis(),
            }}
          >
            {parseWalletName(data)}
          </Type.Caption>
          {disabled && <IconBox color="neutral3" mr={2} icon={<Lock size={12} />} />}
        </Flex>
      </Flex>
    </Box>
  )
}
