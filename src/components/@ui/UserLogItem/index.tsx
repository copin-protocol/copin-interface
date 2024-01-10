import React from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import UserLogActivity from 'components/@ui/UserLogActivity'
import UserLogChanges from 'components/@ui/UserLogChanges'
import { UserLogData } from 'entities/userLog'
import { Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'

const UserLogItem = ({ data, ...props }: { data: UserLogData } & LayoutProps & SxProps & SpaceProps) => {
  return (
    <Flex
      key={data.id}
      py={[2, 3]}
      flexDirection={['column', 'column', 'row', 'row']}
      alignItems="flex-start"
      sx={{ gap: 3, borderBottom: 'small', borderColor: 'neutral4' }}
      {...props}
    >
      <Type.Caption color="neutral3" width={110}>
        <RelativeTimeText date={data.createdAt} />
      </Type.Caption>
      <UserLogActivity username={data.username} label={data.label} action={data.action} type={data.dataType} />
      {!!data.changeFields?.length && <UserLogChanges data={data} />}
    </Flex>
  )
}

export default UserLogItem
