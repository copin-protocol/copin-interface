import { Trans } from '@lingui/macro'
import { ArrowCircleUpRight, ClockCounterClockwise, DotsThreeOutlineVertical, UserCircle } from '@phosphor-icons/react'
import { useState } from 'react'

import Divider from 'components/@ui/Divider'
import ActionItem from 'components/@widgets/ActionItem'
import { CopyWalletData } from 'entities/copyWallet'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

import { FundTab } from '../SmartWalletFundModal'
import ClaimGainsRewardModal from './ClaimGainsRewardModal'
import CopyWalletHistoryDrawer from './WalletHistoryDrawer'

// import OnchainPositionsDrawer from './OnchainPositionsDrawer'

const SmartWalletActions = ({
  isOnlyAction = false,
  data,
  setFundingModal,
}: {
  isOnlyAction?: boolean
  data: CopyWalletData
  setFundingModal: (tab: FundTab) => void
}) => {
  const [openingHistoryDrawer, setOpeningHistoryDrawer] = useState(false)
  const [openingGainsRewardModal, setOpeningGainsRewardModal] = useState(false)
  // const [openingPositionDrawer, setOpeningPositionDrawer] = useState(false)

  return (
    <>
      <Dropdown
        hasArrow={false}
        menuSx={{
          bg: 'neutral7',
          width: 210,
        }}
        menu={
          <>
            {!isOnlyAction && (
              <ActionItem
                title={<Trans>Smart Wallet Management</Trans>}
                icon={<UserCircle size={18} />}
                onSelect={() => {
                  window.open(
                    `${ROUTES.USER_DCP_MANAGEMENT.path}?${URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID}=${data.id}`,
                    '_blank'
                  )
                }}
              />
            )}
            <ActionItem
              title={<Trans>History</Trans>}
              icon={<ClockCounterClockwise size={18} />}
              onSelect={() => setOpeningHistoryDrawer(true)}
            />
            <Divider />
            {/*{data.exchange === CopyTradePlatformEnum.GNS_V8 && (*/}
            {/*  <ActionItem*/}
            {/*    title={<Trans>Claim Rewards</Trans>}*/}
            {/*    icon={<Gift size={18} />}*/}
            {/*    onSelect={() => setOpeningGainsRewardModal(true)}*/}
            {/*  />*/}
            {/*)}*/}
            <ActionItem
              title={<Trans>Withdraw</Trans>}
              icon={<ArrowCircleUpRight size={18} />}
              onSelect={() => setFundingModal(FundTab.Withdraw)}
            />
            {/* <ActionItem
              title={<Trans>Open Positions</Trans>}
              icon={<Scroll size={18} />}
              onSelect={() => setOpeningPositionDrawer(true)}
            /> */}
          </>
        }
        sx={{}}
        buttonSx={{
          border: 'none',
          height: '100%',
          p: 0,
        }}
        placement="bottomRight"
      >
        <IconButton
          size={24}
          type="button"
          icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
          variant="ghost"
          sx={{
            color: 'neutral3',
          }}
        />
      </Dropdown>
      {openingHistoryDrawer && (
        <CopyWalletHistoryDrawer
          copyWallet={data}
          onDismiss={() => setOpeningHistoryDrawer(false)}
          isOpen={openingHistoryDrawer}
        />
      )}
      {openingGainsRewardModal && data.exchange === CopyTradePlatformEnum.GNS_V8 && !!data?.smartWalletAddress && (
        <ClaimGainsRewardModal
          smartWallet={data.smartWalletAddress}
          isOpen={openingGainsRewardModal}
          onDismiss={() => setOpeningGainsRewardModal(false)}
        />
      )}
      {/* {openingPositionDrawer && !!data.smartWalletAddress && (
        <OnchainPositionsDrawer
          smartWalletAddress={data.smartWalletAddress}
          onDismiss={() => setOpeningPositionDrawer(false)}
          isOpen={openingPositionDrawer}
        />
      )} */}
    </>
  )
}

export default SmartWalletActions
