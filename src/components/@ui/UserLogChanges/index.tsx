import { ArrowRight } from '@phosphor-icons/react'
import React from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { UserLogData } from 'entities/userLog'
import { Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { ChangeFieldEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { CHANGE_FIELD_TRANS } from 'utils/config/translations'
import { convertDataToText } from 'utils/helpers/transform'

const UserLogChanges = ({ data, ...props }: { data: UserLogData } & LayoutProps & SxProps & SpaceProps) => {
  return (
    <Flex flexDirection="column" sx={{ gap: [2, 3] }} {...props}>
      {data.changeFields?.map((fieldName) => {
        const oldData = data.oldData?.[fieldName]
        const newData = data.newData?.[fieldName]
        let parsedOldData = oldData
        let parsedNewData = newData
        switch (fieldName) {
          case ChangeFieldEnum.TOKEN_ADDRESSES:
            if (data.oldData?.protocol) {
              parsedOldData = data.oldData?.[fieldName]?.map(
                (e: string) => TOKEN_TRADE_SUPPORT[data.oldData?.protocol][e].symbol
              )
            }
            if (data.newData?.protocol) {
              parsedNewData = data.newData?.[fieldName]?.map(
                (e: string) => TOKEN_TRADE_SUPPORT[data.oldData?.protocol][e].symbol
              )
            }
            break
          case ChangeFieldEnum.MAX_VOL_MULTIPLIER:
            parsedOldData = data.oldData?.[fieldName] * data?.oldData?.[ChangeFieldEnum.VOLUME]
            parsedNewData = data.newData?.[fieldName] * data?.newData?.[ChangeFieldEnum.VOLUME]
            break
        }

        return (
          <Flex key={fieldName} alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption>•</Type.Caption>
            <Type.Caption color="neutral2">{CHANGE_FIELD_TRANS[fieldName]}:</Type.Caption>
            <Flex flexWrap="wrap" alignItems="center" sx={{ gap: 2 }}>
              {!!oldData && typeof oldData === 'object' && !Array.isArray(oldData) ? (
                <ChangeObjectValue object={oldData} />
              ) : (
                <Type.CaptionBold color="neutral1">{convertDataToText(parsedOldData)}</Type.CaptionBold>
              )}
              <ArrowRight size={16} />
              {!!newData && typeof newData === 'object' && !Array.isArray(newData) ? (
                <ChangeObjectValue object={newData} />
              ) : (
                <Type.CaptionBold color="neutral1">{convertDataToText(parsedNewData)}</Type.CaptionBold>
              )}
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}

export default UserLogChanges

function ChangeObjectValue(object: any) {
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      {Object.entries(object).map(([key, value]) => (
        <Flex key={key} alignItems="center" sx={{ gap: 1 }}>
          <Type.Caption color="neutral2">{CHANGE_FIELD_TRANS[key]}:</Type.Caption>
          <Type.CaptionBold color="neutral1">{convertDataToText(value)}</Type.CaptionBold>
        </Flex>
      ))}
    </Flex>
  )
}
