import { XCircle } from '@phosphor-icons/react'
import { useState } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import { GradientText } from 'components/@ui/GradientText'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox } from 'theme/base'
import { parseCoverImage } from 'utils/helpers/transform'

import ReferralLinks from './ReferralLinks'
import ShareReferralLinks from './ShareReferralLinks'

export function InviteButton() {
  const { isAuthenticated, profile } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <Button block variant="primary" onClick={isAuthenticated ? () => setOpenModal(true) : handleClickLogin}>
        {isAuthenticated ? 'Invite Friends' : 'Connect Wallet'}
      </Button>
      {isAuthenticated && profile && (
        <ShareReferralModal
          referralCode={profile.referralCode ?? ''}
          isOpen={openModal}
          onDismiss={() => setOpenModal(false)}
        />
      )}
    </>
  )
}

export function ShareReferralModal({
  referralCode,
  isOpen,
  onDismiss,
}: {
  referralCode: string
  isOpen: boolean
  onDismiss: () => void
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} width="500px" maxWidth="500px" dismissable={false}>
      <Box sx={{ position: 'relative' }}>
        <IconBox
          role="button"
          icon={<XCircle size={20} />}
          sx={{ p: 0, color: 'neutral3', '&:hover': { color: 'neutral1' }, position: 'absolute', top: 16, right: 16 }}
          onClick={onDismiss}
        />
        <Flex
          width="100%"
          height={180}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: parseCoverImage('referral-share'),
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Box sx={{ fontSize: '20px', lineHeight: '24px', fontWeight: 'bold', textAlign: 'center', maxWidth: 350 }}>
            Refer Friends and get more benefit from{' '}
            <GradientText bg={`linear-gradient(90deg, #A9AFFF 0%, #FFAEFF 100%)`}>Copin Referral</GradientText> program
          </Box>
        </Flex>
        <Box p={3}>
          <ReferralLinks referralCode={referralCode} />
          <Box mb={4} />
          <ShareReferralLinks referralCode={referralCode} />
        </Box>
      </Box>
    </Modal>
  )
}
