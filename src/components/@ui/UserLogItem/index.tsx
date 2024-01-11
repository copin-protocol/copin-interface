import { Trans } from '@lingui/macro'
import React from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import UserLogActivity from 'components/@ui/UserLogActivity'
import { UserLogData } from 'entities/userLog'
import { Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'

import UserLogChanges from '../UserLogChanges'

const UserLogItem = ({ data, ...props }: { data: UserLogData } & LayoutProps & SxProps & SpaceProps) => {
  return (
    <Flex
      key={data.id}
      py={[2, 2, 3, 3]}
      flexDirection={['column', 'column', 'row', 'row']}
      alignItems="flex-start"
      flexWrap="wrap"
      sx={{ gap: [2, 2, 3, 3], borderBottom: 'small', borderColor: 'neutral4' }}
      {...props}
    >
      <Type.Caption color="neutral3" width={110}>
        <RelativeTimeText date={data.createdAt} />
      </Type.Caption>
      <UserLogActivity username={data.username} label={data.label} action={data.action} type={data.dataType} />
      {!!data.changeFields?.length && <UserLogChanges data={data} />}
      {!!data.errorMsg && (
        <Type.Caption color="neutral3">
          <Trans>Failure for reasons: </Trans> {`"${data.errorMsg}"`}
        </Type.Caption>
      )}
    </Flex>
  )
}

export default UserLogItem
