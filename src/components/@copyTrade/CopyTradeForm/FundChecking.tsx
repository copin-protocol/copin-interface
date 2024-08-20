import { Trans } from '@lingui/macro'
import { useState } from 'react'

import fundImage from 'assets/images/fund-notice.png'
import FundModal, { FundTab } from 'components/@wallet/SmartWalletFundModal'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useWalletFund from 'hooks/features/useWalletFundSnxV2'
import { Button } from 'theme/Buttons'
import { Box, Flex, Image, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

export const SmartWalletFund = ({ walletId, platform }: { walletId: string; platform?: CopyTradePlatformEnum }) => {
  const { copyWallets } = useCopyWalletContext()
  const wallet = copyWallets?.find((w) => w.id === walletId)
  const { available } = useWalletFund({ address: wallet?.smartWalletAddress, platform })
  return (
    <Box>
      <Type.Small mr={1}>
        <Trans>Available Fund:</Trans>
      </Type.Small>
      <Type.Small color="neutral2">{available?.num ? `$${formatNumber(available.num, 2, 2)}` : '--'}</Type.Small>
    </Box>
  )
}

const WalletFundChecking = ({
  amount,
  address,
  platform,
}: {
  amount: number
  address: string
  platform: CopyTradePlatformEnum
}) => {
  const [openingModal, setOpeningModal] = useState(false)
  const { available, reloadFund } = useWalletFund({ address, platform })
  if (!amount || !available || available?.num > amount) return <></>
  return (
    <Flex mt={2} px={3} py={2} bg="rgba(78,174,253,0.25)" sx={{ borderRadius: '4px', gap: 2 }}>
      <Image src={fundImage} height={48} />
      <Box flex="1">
        <Type.CaptionBold>
          <Trans>Fund</Trans>
        </Type.CaptionBold>
        <Type.Caption color="neutral2" display="block">
          <Trans>Your copy may failed due to insufficient available fund</Trans>
        </Type.Caption>
      </Box>

      <Button variant="ghostPrimary" sx={{ px: 0, py: 1 }} onClick={() => setOpeningModal(true)}>
        Deposit
      </Button>
      {openingModal && (
        <FundModal
          initialTab={FundTab.Deposit}
          smartWallet={address}
          platform={platform}
          onDismiss={() => {
            reloadFund()
            setOpeningModal(false)
          }}
        />
      )}
    </Flex>
  )
}

const FundChecking = ({ amount, walletId }: { walletId: string; amount: number }) => {
  const { copyWallets } = useCopyWalletContext()
  const wallet = copyWallets?.find((w) => w.id === walletId)

  if (!wallet) return <></>
  if (wallet.smartWalletAddress)
    return <WalletFundChecking address={wallet.smartWalletAddress} amount={amount} platform={wallet.exchange} />
  return <></>
}

export default FundChecking
