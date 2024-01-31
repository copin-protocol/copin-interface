import React, { useState } from 'react'

import { CopyPositionData } from 'entities/copyTrade'
import ClosePositionModal from 'pages/MyProfile/PositionTable/ClosePositionModal'
import { Button, ButtonProps } from 'theme/Buttons'

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
        <ClosePositionModal copyId={copyPosition?.id} onDismiss={() => setOpening(false)} onSuccess={onSuccess} />
      )}
    </>
  )
}

export default UnlinkPosition
