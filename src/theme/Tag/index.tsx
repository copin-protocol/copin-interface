import { Trans } from '@lingui/macro'
import React, { ReactNode, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import SkullIcon from 'theme/Icons/SkullIcon'
import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
import {
  CopyTradeStatusEnum,
  EpochStatusEnum,
  PositionSideEnum,
  PositionStatusEnum,
  TraderStatusEnum,
} from 'utils/config/enums'

type StatusProps = {
  id: PositionStatusEnum | PositionSideEnum | CopyTradeStatusEnum | TraderStatusEnum | EpochStatusEnum
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
  {
    id: EpochStatusEnum.NOT_HAPPEN,
    text: <Trans>Upcoming</Trans>,
    color: 'green1',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.ONGOING,
    text: <Trans>Ongoing</Trans>,
    color: 'primary1',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.ENDED,
    text: <Trans>Ended</Trans>,
    color: 'neutral3',
    backgroundColor: 'neutral5',
  },
  {
    id: EpochStatusEnum.AWARDED,
    text: <Trans>Ended</Trans>,
    color: 'neutral3',
    backgroundColor: 'neutral5',
  },
]

const Tag = ({
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
        ...(sx ?? {}),
      }}
      {...props}
    >
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
        <Tooltip id={tooltipId} place="bottom" type="dark" effect="solid" clickable={clickableTooltip}>
          {tooltipContent}
        </Tooltip>
      )}
    </Flex>
  )
}

export default Tag
