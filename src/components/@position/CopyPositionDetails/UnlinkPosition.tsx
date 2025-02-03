import { useState } from 'react'

import { CopyPositionData } from 'entities/copyTrade'
import { Button, ButtonProps } from 'theme/Buttons'

import UnlinkCopyPositionModal from '../UnlinkCopyPositionModal'

const UnlinkPosition = ({
  copyPosition,
  onSuccess,
  ...props
}: {
  copyPosition: CopyPositionData
  onSuccess?: () => void
} & ButtonProps) => {
  const [opening, setOpening] = useState(false)

  if (!copyPosition?.id) return null
  return (
    <>
      <Button {...props} variant="outlineDanger" size="xs" onClick={() => setOpening(true)}>
        Unlink Position
      </Button>
      {opening && (
        <UnlinkCopyPositionModal
          copyId={copyPosition?.id}
          exchange={copyPosition?.exchange}
          onDismiss={() => setOpening(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default UnlinkPosition
