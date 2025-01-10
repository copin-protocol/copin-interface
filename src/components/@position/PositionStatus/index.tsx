import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import SkullIcon from 'theme/Icons/SkullIcon'
import { Flex, Type } from 'theme/base'
import { CopyTradeStatusEnum, PositionSideEnum, PositionStatusEnum, TraderStatusEnum } from 'utils/config/enums'

type StatusProps = {
  id: PositionStatusEnum | PositionSideEnum | CopyTradeStatusEnum | TraderStatusEnum
  text: ReactNode
  color: string
}

const STATUSES: StatusProps[] = [
  {
    id: PositionStatusEnum.OPEN,
    text: <Trans>OPEN</Trans>,
    color: 'green1',
  },
  {
    id: PositionStatusEnum.CLOSE,
    text: <Trans>CLOSED</Trans>,
    color: 'neutral3',
  },
  {
    id: PositionStatusEnum.LIQUIDATE,
    text: <Trans>LIQUIDATED</Trans>,
    color: 'red2',
  },
]

const PositionStatus = ({ color, status, ...props }: { status: PositionStatusEnum; color?: string } & any) => {
  const finder = STATUSES.find((e) => e.id === status)
  if (!finder) return <></>
  return (
    <Flex
      alignItems="center"
      color={color ?? finder?.color}
      sx={{
        gap: 1,
      }}
      {...props}
    >
      {status === PositionStatusEnum.LIQUIDATE ? <SkullIcon /> : status === PositionStatusEnum.CLOSE ? '■' : '•'}
      <Type.Caption width="100%" textAlign="left" color={finder?.color} flex={1}>
        {finder?.text}
      </Type.Caption>
    </Flex>
  )
}

export default PositionStatus
