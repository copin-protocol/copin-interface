import React, { useState } from 'react'

import LayoutCollapseButton from 'theme/Buttons/LayoutCollapseButton'
import { Flex } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'

import MyCopyPositionTable from './MyCopyPositionTable'

const Positions = ({ userId }: { userId: string }) => {
  const [openPosCollapsing, setOpenPosCollapsing] = useState(false)
  return (
    <>
      {!openPosCollapsing && (
        <Flex flexDirection="column" height={{ _: 'fit-content', lg: '260px' }} bg="neutral5">
          <MyCopyPositionTable userId={userId} status={PositionStatusEnum.OPEN} />
        </Flex>
      )}
      <Flex
        flexDirection="column"
        sx={{ position: 'relative', borderTop: 'small', borderColor: 'neutral4' }}
        height={openPosCollapsing ? '100%' : 'calc(100% - 260px)'}
      >
        <LayoutCollapseButton
          collapsing={openPosCollapsing}
          toggleCollapse={() => setOpenPosCollapsing((bool) => !bool)}
        />
        <MyCopyPositionTable userId={userId} status={PositionStatusEnum.CLOSE} />
      </Flex>
    </>
  )
}

export default Positions
