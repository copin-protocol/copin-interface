import { Trans } from '@lingui/macro'
import React, { ReactNode, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import SkullIcon from 'theme/Icons/SkullIcon'
import Tooltip from 'theme/Tooltip'
import { Type } from 'theme/base'
import {
  CopyTradeStatusEnum,
  EpochStatusEnum,
  PositionSideEnum,
  PositionStatusEnum,
  TraderStatusEnum,
} from 'utils/config/enums'

import Tag from '.'

type StatusProps = {
  id: PositionStatusEnum | PositionSideEnum | CopyTradeStatusEnum | TraderStatusEnum | EpochStatusEnum
  text: ReactNode
  color: string
  backgroundColor: string
}

const STATUSES: StatusProps[] = [
  {
    id: PositionStatusEnum.OPEN,
    text: <Trans>OPEN</Trans>,
    color: 'green3',
    backgroundColor: 'neutral7',
  },
  {
    id: PositionStatusEnum.CLOSE,
    text: <Trans>CLOSED</Trans>,
    color: 'neutral3',
    backgroundColor: 'neutral7',
  },
  {
    id: PositionStatusEnum.LIQUIDATE,
    text: <Trans>LIQUIDATED</Trans>,
    color: 'red2',
    backgroundColor: 'neutral7',
  },
  {
    id: PositionSideEnum.LONG,
    text: <Trans>LONG</Trans>,
    color: 'neutral7',
    backgroundColor: 'green1',
  },
  {
    id: PositionSideEnum.SHORT,
    text: <Trans>SHORT</Trans>,
    color: 'neutral7',
    backgroundColor: 'red2',
  },
  {
    id: CopyTradeStatusEnum.RUNNING,
    text: <Trans>RUNNING</Trans>,
    color: 'green1',
    backgroundColor: 'neutral7',
  },
  {
    id: CopyTradeStatusEnum.STOPPED,
    text: <Trans>STOPPED</Trans>,
    color: 'red2',
    backgroundColor: 'neutral7',
  },
  {
    id: TraderStatusEnum.COPYING,
    text: <Trans>COPYING</Trans>,
    color: 'orange1',
    backgroundColor: 'neutral5',
  },
  {
    id: TraderStatusEnum.VAULT_COPYING,
    text: <Trans>Vault Copying</Trans>,
    color: 'orange1',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.NOT_HAPPEN,
    text: <Trans>UPCOMING</Trans>,
    color: 'green1',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.ONGOING,
    text: <Trans>ONGOING</Trans>,
    color: 'primary1',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.ENDED,
    text: <Trans>ENDED</Trans>,
    color: 'neutral3',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.AWARDED,
    text: <Trans>ENDED</Trans>,
    color: 'neutral3',
    backgroundColor: 'neutral5',
  },
]

const StatusTag = ({
  bg,
  status,
  tooltipContent,
  clickableTooltip,
  sx,
  ...props
}: {
  status: PositionStatusEnum | PositionSideEnum | CopyTradeStatusEnum | TraderStatusEnum | EpochStatusEnum
  bg?: string
  tooltipContent?: ReactNode
  clickableTooltip?: boolean
} & any) => {
  const uuid = useRef(uuidv4()).current

  const finder = STATUSES.find((e) => e.id === status)
  if (!finder) return <></>

  const tooltipId = `tt-tag-${uuid}`
  const hasTooltip = !!tooltipContent

  return (
    <Tag bg={bg ?? finder?.backgroundColor} sx={sx} {...props}>
      {status === PositionStatusEnum.LIQUIDATE && <SkullIcon />}
      <Type.Caption
        width="100%"
        textAlign="center"
        color={finder?.color}
        flex={1}
        sx={
          hasTooltip
            ? {
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                textDecorationColor: 'rgba(119, 126, 144, 0.5)',
              }
            : undefined
        }
        data-tip="React-tooltip"
        data-tooltip-id={tooltipId}
        data-tooltip-delay-show={360}
      >
        {finder?.text}
      </Type.Caption>
      {!!tooltipContent && (
        <Tooltip id={tooltipId} place="bottom" clickable={clickableTooltip}>
          {tooltipContent}
        </Tooltip>
      )}
    </Tag>
  )
}

export default StatusTag
