import { ChartBar } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { TraderData } from 'entities/trader'
import { VisualizeModal } from 'pages/Home/TradersVisualizer/VisualizeModal'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Type } from 'theme/base'

const TradersVisualizer = ({ traders, hasButtonTitle = true }: { traders: TraderData[]; hasButtonTitle?: boolean }) => {
  const [visualizing, setVisualizing] = useState(false)
  return (
    <div>
      <ButtonWithIcon
        sx={{
          px: 0,
          color: 'neutral2',
          svg: {
            color: 'neutral3',
          },
          '&:hover:not([disabled])': {
            color: 'neutral1',
            svg: {
              color: 'neutral1',
            },
          },
        }}
        iconSx={!hasButtonTitle ? { mr: 0 } : {}}
        icon={<ChartBar size={20} />}
        variant="ghost"
        onClick={() => setVisualizing(true)}
      >
        {hasButtonTitle ? <Type.Caption>Visualize Data</Type.Caption> : ''}
      </ButtonWithIcon>
      {visualizing && <VisualizeModal onDismiss={() => setVisualizing(false)} data={traders} />}
    </div>
  )
}

export default TradersVisualizer
