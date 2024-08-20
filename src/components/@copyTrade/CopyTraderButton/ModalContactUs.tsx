import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

const ModalContactUs = ({ onDismiss }: { onDismiss: () => void }) => {
  return (
    <Modal isOpen onDismiss={onDismiss} maxWidth="650px" background="neutral7" hasClose>
      <Flex flexDirection="column" pb={[3, 24]} px={[3, 24]} textAlign="center" justifyContent="center">
        <Type.BodyBold mt={2}>Kwenta copy-trading is coming soon</Type.BodyBold>
        <Type.Caption mt={12} color="neutral2">
          Any ideas or support, reach us{' '}
          <a href={LINKS.telegram} target="_blank" rel="noreferrer">
            here
          </a>
        </Type.Caption>
      </Flex>
    </Modal>
  )
}

export default ModalContactUs
