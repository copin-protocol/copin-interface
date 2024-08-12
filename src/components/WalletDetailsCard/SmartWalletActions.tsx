import { Trans } from '@lingui/macro'
import { ArrowCircleUpRight, ClockCounterClockwise, DotsThreeOutlineVertical, UserCircle } from '@phosphor-icons/react'
import React, { useState } from 'react'

import Divider from 'components/@ui/Divider'
import CopyWalletHistoryDrawer from 'components/CopyWalletHistoryDrawer'
import { FundTab } from 'components/FundModal'
import { CopyWalletData } from 'entities/copyWallet'
import ActionItem from 'pages/MyProfile/MyCopies/ActionItem'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

// import OnchainPositionsDrawer from './OnchainPositionsDrawer'

const SmartWalletActions = ({
  data,
  setFundingModal,
}: {
  data: CopyWalletData
  setFundingModal: (tab: FundTab) => void
}) => {
  const [openingHistoryDrawer, setOpeningHistoryDrawer] = useState(false)
  // const [openingPositionDrawer, setOpeningPositionDrawer] = useState(false)

  return (
    <>
      <Dropdown
        hasArrow={false}
        menuSx={{
          bg: 'neutral7',
          width: 165,
        }}
        menu={
          <>
            <ActionItem
              title={<Trans>Copy Management</Trans>}
              icon={<UserCircle size={18} />}
              onSelect={() => {
                window.open(
                  `${ROUTES.MY_MANAGEMENT.path}?${URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID}=${data.id}`,
                  '_blank'
                )
              }}
            />
            <Divider />
            <ActionItem
              title={<Trans>History</Trans>}
              icon={<ClockCounterClockwise size={18} />}
              onSelect={() => setOpeningHistoryDrawer(true)}
            />
            <Divider />
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
