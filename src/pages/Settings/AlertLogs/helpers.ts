import { ChannelTypeEnum } from 'utils/config/enums'

export function getChannelByType(channelType: ChannelTypeEnum, chatId?: string) {
  switch (channelType) {
    case ChannelTypeEnum.TELEGRAM:
      return Number(chatId) > 0 ? `Telegram-Direct` : 'Telegram-Group'
    case ChannelTypeEnum.WEBHOOK:
      return 'Webhook'
  }
}
