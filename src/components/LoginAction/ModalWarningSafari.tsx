// eslint-disable-next-line no-restricted-imports
import React from 'react'

import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'

const ModalWarningSafari = ({ onDismiss }: { onDismiss: () => void }) => {
  return (
    <Modal isOpen onDismiss={onDismiss} maxWidth="450px" background="neutral7" hasClose>
      <Flex flexDirection="column" pb={[3, 24]} px={[3, 24]} textAlign="center" justifyContent="center">
        <Type.BodyBold mt={2}>Safari is not supported. Please download a browser that supports MetaMask.</Type.BodyBold>
      </Flex>
    </Modal>
  )
}

export default ModalWarningSafari
