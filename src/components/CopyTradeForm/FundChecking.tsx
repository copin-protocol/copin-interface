import { Trans } from '@lingui/macro'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Box, Type } from 'theme/base'

const FundChecking = ({ amount, walletId }: { walletId: string; amount: number }) => {
  const {
    copyWallets,
    // smartWalletMargin: { reloadAvailableMargin },
  } = useCopyWalletContext()
  const wallet = copyWallets?.find((w) => w.id === walletId)
  // const [openingModal, setOpeningModal] = useState(false)
  if (!wallet) return <></>
  if (!amount || wallet.availableBalance > amount) return <></>
  return (
    <Box mt={1}>
      <Type.Caption color="orange2">
        <Trans>Your copy may failed due to insufficient available margin</Trans>
      </Type.Caption>
      {/* {!!wallet.smartWalletAddress && (
        <>
          <Button variant="ghostPrimary" sx={{ px: 0, py: 1 }} onClick={() => setOpeningModal(true)}>
            Deposit Fund
          </Button>
          {openingModal && (
            <FundModal
              initialTab={FundTab.Deposit}
              smartAccount={wallet.smartWalletAddress}
              onDismiss={() => {
                reloadAvailableMargin()
                setOpeningModal(false)
              }}
            />
          )}
        </>
      )} */}
    </Box>
  )
}

export default FundChecking
