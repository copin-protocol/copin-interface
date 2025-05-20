import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'

import crowImage from 'assets/images/crow-big-blue.png'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Flex, Image, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

export default function UpgradeModal({
  isOpen,
  onDismiss,
  title,
  description,
  descriptionSx,
}: {
  isOpen: boolean
  onDismiss: () => void
  title: ReactNode
  description: ReactNode
  descriptionSx?: SystemStyleObject & GridProps
}) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} zIndex={999999}>
      <Flex sx={{ flexDirection: 'column', width: '100%', p: 3 }}>
        <Image src={crowImage} height={90} sx={{ objectFit: 'contain' }} />
        <Type.LargeBold mt={24} mb={12} display="block" textAlign="center">
          {title}
        </Type.LargeBold>
        <Type.Caption color="neutral2" sx={descriptionSx}>
          {description}
        </Type.Caption>
        <Flex mt={24} sx={{ width: '100%', alignItems: 'center', gap: 3, '& > *': { flex: 1 } }}>
          <Button onClick={onDismiss} variant="outline">
            <Trans>Maybe later</Trans>
          </Button>
          <Link to={ROUTES.SUBSCRIPTION.path} target="_blank">
            <Button variant="primary" block onClick={onDismiss}>
              <Trans>Upgrade</Trans>
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Modal>
  )
}
