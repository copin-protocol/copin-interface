import { Trans } from '@lingui/macro'
import { Robot } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { GradientText } from 'components/@ui/GradientText'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { linearGradient1 } from 'theme/colors'

import ModalContactAI from './ModalContactAI'

export default function AnalyzeAction({ forceDisabled }: { forceDisabled?: boolean }) {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <ButtonWithIcon
        variant="ghost"
        width={['100%', '100%', '100%', 'auto']}
        sx={{
          px: 3,
          borderRadius: 0,
          height: '100%',
          color: 'neutral2',
          '&:hover:not(:disabled)': { color: 'neutral1' },
        }}
        icon={<Robot size={20} />}
        onClick={() => setOpenModal(true)}
        disabled={forceDisabled}
      >
        <GradientText bg={linearGradient1}>
          <Trans>Analyze With AI</Trans>
        </GradientText>
      </ButtonWithIcon>
      {openModal && <ModalContactAI isOpen={openModal} onDismiss={() => setOpenModal(false)} />}
    </>
  )
}
