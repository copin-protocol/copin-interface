import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import SkullIcon from 'theme/Icons/SkullIcon'
import { Flex, Type } from 'theme/base'
import { CopyTradeStatusEnum, PositionSideEnum, PositionStatusEnum, TraderStatusEnum } from 'utils/config/enums'

type StatusProps = {
  id: PositionStatusEnum | PositionSideEnum | CopyTradeStatusEnum | TraderStatusEnum
  text: ReactNode
  color: string
  backgroundColor: string
}

const STATUSES: StatusProps[] = [
  {
    id: PositionStatusEnum.OPEN,
    text: <Trans>Open</Trans>,
    color: 'green3',
    backgroundColor: 'neutral7',
  },
  {
    id: PositionStatusEnum.CLOSE,
    text: <Trans>Closed</Trans>,
    color: 'neutral3',
    backgroundColor: 'neutral7',
  },
  {
    id: PositionStatusEnum.LIQUIDATE,
    text: <Trans>Liquidated</Trans>,
    color: 'red2',
    backgroundColor: 'neutral7',
  },
  {
    id: PositionSideEnum.LONG,
    text: <Trans>Long</Trans>,
    color: 'neutral7',
    backgroundColor: 'green1',
  },
  {
    id: PositionSideEnum.SHORT,
    text: <Trans>Short</Trans>,
    color: 'neutral7',
    backgroundColor: 'red2',
  },
  {
    id: CopyTradeStatusEnum.RUNNING,
    text: <Trans>Running</Trans>,
    color: 'green1',
    backgroundColor: 'neutral7',
  },
  {
    id: CopyTradeStatusEnum.STOPPED,
    text: <Trans>Stopped</Trans>,
    color: 'red2',
    backgroundColor: 'neutral7',
  },
  {
    id: TraderStatusEnum.COPYING,
    text: <Trans>Copying</Trans>,
    color: 'orange1',
    backgroundColor: 'neutral5',
  },
]

const Tag = ({
  bg,
  status,
  ...props
}: { status: PositionStatusEnum | PositionSideEnum | CopyTradeStatusEnum | TraderStatusEnum; bg?: string } & any) => {
  const finder = STATUSES.find((e) => e.id === status)
  if (!finder) return <></>
  return (
    <Flex
      variant="card"
      justifyContent="center"
      alignItems="center"
      bg={bg ?? finder?.backgroundColor}
      px="6px"
      py="2px"
      sx={{
        borderRadius: '16px',
        gap: 1,
      }}
      {...props}
    >
      {status === PositionStatusEnum.LIQUIDATE && <SkullIcon />}
      <Type.Caption width="100%" textAlign="center" color={finder?.color} flex={1}>
        {finder?.text}
      </Type.Caption>
    </Flex>
  )
}

export default Tag
