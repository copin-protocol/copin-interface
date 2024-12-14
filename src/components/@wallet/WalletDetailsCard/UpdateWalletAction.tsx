import { Info } from '@phosphor-icons/react'
import { useState } from 'react'

import { CopyWalletData } from 'entities/copyWallet'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex } from 'theme/base'
import { themeColors } from 'theme/colors'

import UpdateHyperliquidWalletModal from '../UpdateWalletModals/UpdateHyperliquidWalletModal'

const UpdateWalletAction = ({ data }: { data: CopyWalletData }) => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <Flex alignItems="center">
      <ButtonWithIcon
        type="button"
        icon={<Info />}
        iconSx={{ color: 'orange1' }}
        sx={{
          p: 2,
          height: 'fit-content',
          bg: `${themeColors.orange1}15`,
          color: 'orange1',
          '&:hover': { bg: `${themeColors.orange1}20` },
        }}
        onClick={() => setOpenModal(true)}
      >
        Update
      </ButtonWithIcon>
      {openModal && (
        <UpdateHyperliquidWalletModal isOpen={openModal} copyWalletId={data.id} onDismiss={() => setOpenModal(false)} />
      )}
    </Flex>
  )
}

export default UpdateWalletAction
