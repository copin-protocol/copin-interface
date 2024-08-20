import { ArrowRight } from '@phosphor-icons/react'
import { LayoutProps, SpaceProps } from 'styled-system'

import { UserLogData } from 'entities/userLog'
import { Flex, Type } from 'theme/base'
import { SxProps } from 'theme/types'
import { ChangeFieldEnum } from 'utils/config/enums'
import { getTokenTradeSupport } from 'utils/config/trades'
import { CHANGE_FIELD_TRANS } from 'utils/config/translations'
import { convertCamelCaseToText, convertDataToText } from 'utils/helpers/transform'

const UserLogChanges = ({ data, ...props }: { data: UserLogData } & LayoutProps & SxProps & SpaceProps) => {
  return (
    <Flex flexDirection="column" sx={{ gap: [2, 2, 3, 3], maxWidth: ['100%', '100%', '50%', '50%'] }} {...props}>
      {data.changeFields?.map((fieldName) => {
        const oldData = data.oldData?.[fieldName]
        const newData = data.newData?.[fieldName]
        let parsedOldData = oldData
        let parsedNewData = newData
        switch (fieldName) {
          case ChangeFieldEnum.TOKEN_ADDRESSES:
            if (data.oldData?.protocol) {
              parsedOldData = data.oldData?.[fieldName]?.map(
                (e: string) => getTokenTradeSupport(data.oldData?.protocol)[e]?.symbol
              )
            }
            if (data.newData?.protocol) {
              parsedNewData = data.newData?.[fieldName]?.map(
                (e: string) => getTokenTradeSupport(data.oldData?.protocol)[e]?.symbol
              )
            }
            break
          case ChangeFieldEnum.MAX_VOL_MULTIPLIER:
            parsedOldData = data.oldData?.[fieldName] * data?.oldData?.[ChangeFieldEnum.VOLUME]
            parsedNewData = data.newData?.[fieldName] * data?.newData?.[ChangeFieldEnum.VOLUME]
            break
        }

        return (
          <Flex key={fieldName} alignItems="flex-start" sx={{ gap: 2 }}>
            <Type.Caption minWidth="fit-content">•</Type.Caption>
            <Type.Caption color="neutral2" minWidth="fit-content">
              {CHANGE_FIELD_TRANS[fieldName] ?? convertCamelCaseToText(fieldName)}:
            </Type.Caption>
            {(!!parsedOldData && typeof parsedOldData === 'object' && !Array.isArray(parsedOldData)) ||
            (!!parsedNewData && typeof parsedNewData === 'object' && !Array.isArray(parsedNewData)) ? (
              <ChangeObjectValue oldValue={parsedOldData} newValue={parsedNewData} />
            ) : (
              <Flex flexWrap="wrap" alignItems="center" sx={{ gap: 2 }}>
                <Type.CaptionBold color="neutral1">
                  {fieldName.endsWith('Id') ? parsedOldData : convertDataToText(parsedOldData)}
                </Type.CaptionBold>
                <ArrowRight size={16} />
                <Type.CaptionBold color="neutral1">
                  {fieldName.endsWith('Id') ? parsedNewData : convertDataToText(parsedNewData)}
                </Type.CaptionBold>
              </Flex>
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}

export default UserLogChanges

function ChangeObjectValue({ oldValue, newValue }: { oldValue: any; newValue: any }) {
  return (
    <Flex flexDirection="column" alignItems="flex-start">
      {Object.keys(oldValue ?? newValue)?.map((key: string) => (
        <Flex key={key} flexWrap="wrap" alignItems="flex-start" sx={{ gap: 1 }}>
          <Type.Caption color="neutral2" minWidth="fit-content">
            {CHANGE_FIELD_TRANS[key] ?? convertCamelCaseToText(key)}:
          </Type.Caption>
          <Flex flexWrap="wrap" alignItems="center" sx={{ gap: 2 }}>
            <Type.CaptionBold color="neutral1">
              {key.endsWith('Id') ? oldValue?.[key] : convertDataToText(oldValue?.[key])}
            </Type.CaptionBold>
            <ArrowRight size={16} />
            <Type.CaptionBold color="neutral1">
              {key.endsWith('Id') ? newValue?.[key] : convertDataToText(newValue?.[key])}
            </Type.CaptionBold>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
