import { useState } from 'react'

import { CopyPositionData } from 'entities/copyTrade'
import { Button, ButtonProps } from 'theme/Buttons'

import CloseCopyPositionModal from '../CloseCopyPositionModal'

const UnlinkPosition = ({
  copyPosition,
  onSuccess,
  ...props
}: {
  copyPosition: CopyPositionData
  onSuccess?: () => void
} & ButtonProps) => {
  const [opening, setOpening] = useState(false)

  return (
    <>
      <Button {...props} variant="outlineDanger" size="xs" onClick={() => setOpening(true)}>
        Unlink Position
      </Button>
      {opening && (
        <CloseCopyPositionModal copyId={copyPosition?.id} onDismiss={() => setOpening(false)} onSuccess={onSuccess} />
      )}
    </>
  )
}

export default UnlinkPosition
