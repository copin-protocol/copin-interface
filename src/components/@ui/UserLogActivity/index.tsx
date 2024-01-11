import React from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { DataTypeEnum, UserActionEnum } from 'utils/config/enums'
import { DATA_TYPE_TRANS, USER_ACTION_TRANS } from 'utils/config/translations'
import { addressShorten } from 'utils/helpers/format'

const UserLogActivity = ({
  username,
  label,
  type,
  action,
  ...props
}: { username: string; label: string; type: DataTypeEnum; action: UserActionEnum } & LayoutProps &
  SxProps &
  SpaceProps) => {
  return (
    <Flex alignItems="center" minWidth="fit-content" sx={{ gap: 1 }} {...props}>
      <Type.Caption color="neutral1">{username ? addressShorten(username) : 'System'}</Type.Caption>
      <Type.Caption color="neutral2">{USER_ACTION_TRANS[action]}</Type.Caption>
      <Type.Caption color="neutral2">{DATA_TYPE_TRANS[type]}</Type.Caption>
      <Type.Caption color="neutral1">{label?.startsWith('0x') ? addressShorten(label) : label}</Type.Caption>
    </Flex>
  )
}

export default UserLogActivity
