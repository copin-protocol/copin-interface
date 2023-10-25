import { TestInstanceData } from 'hooks/store/useSelectBacktestTraders'
import { Box, Flex, Type } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { formatLocalDate } from 'utils/helpers/format'

export default function SettingTags({
  protocol,
  settings,
  wrappedItems = false,
}: {
  protocol: ProtocolEnum
  settings: TestInstanceData['settings']
  wrappedItems?: boolean
}) {
  if (!settings) return <></>
  return (
    <Box sx={{ overflow: 'auto', pb: 1 }}>
      <Flex sx={{ gap: 2, rowGap: 1, flexWrap: wrappedItems ? 'wrap' : 'nowrap', '& > *': { flexShrink: 0 } }}>
        <SettingItem titleKey={'balance'} value={settings.balance} />
        <SettingItem titleKey={'orderVolume'} value={settings.orderVolume} />
        <SettingItem titleKey={'leverage'} value={settings.leverage} />
        <SettingItem
          titleKey={'volumeProtection'}
          value={settings.volumeProtection ? `ON(${settings.lookBackOrders})` : 'OFF'}
        />
        <SettingItem titleKey={'reverseCopy'} value={settings.reverseCopy ? 'ON' : 'OFF'} />
        <SettingItem
          titleKey={'enableStopLoss'}
          value={settings.enableStopLoss ? `ON(${settings.stopLossAmount})` : 'OFF'}
        />
        <SettingItem
          titleKey={'maxVolMultiplier'}
          value={settings.maxVolMultiplier ? `ON(${settings.maxVolMultiplier})` : 'OFF'}
        />
        <SettingItem
          title={'TIME:'}
          value={`${formatLocalDate(settings?.fromTime, DATE_FORMAT)} - ${formatLocalDate(
            settings?.toTime,
            DATE_FORMAT
          )}`}
        />
        <SettingItem
          titleKey={'tokenAddresses'}
          value={
            !!settings.tokenAddresses?.length
              ? settings.tokenAddresses.map((address) => TOKEN_TRADE_SUPPORT[protocol][address].name).join(', ')
              : ''
          }
        />
      </Flex>
    </Box>
  )
}

function SettingItem({
  titleKey,
  title,
  value,
}: {
  titleKey?: keyof NonNullable<TestInstanceData['settings']>
  title?: string
  value: string | number
}) {
  return (
    <Flex sx={{ gap: '1ch', px: '6px', borderRadius: '4px', bg: 'neutral4' }}>
      {titleKey ? (
        <Type.Caption>{getTitle({ key: titleKey })}</Type.Caption>
      ) : title ? (
        <Type.Caption>{title}</Type.Caption>
      ) : (
        ''
      )}
      <Type.Caption color="primary1">{value}</Type.Caption>
    </Flex>
  )
}
function getTitle({ key }: { key: keyof NonNullable<TestInstanceData['settings']> }) {
  let title = ''
  switch (key) {
    case 'balance':
      title = 'INVEST FUND:'
      break
    case 'leverage':
      title = 'LEVERAGE:'
      break
    case 'orderVolume':
      title = 'AMOUNT ORDER:'
      break
    case 'volumeProtection':
      title = 'VOLUME PROTECTION:'
      break
    case 'tokenAddresses':
      title = 'TOKENS:'
      break
    case 'reverseCopy':
      title = 'REVERSE:'
      break
    case 'enableStopLoss':
      title = 'STOPLOSS:'
      break
    case 'maxVolMultiplier':
      title = 'MAX VOL MULTIPLIER:'
      break
    default:
      break
  }
  return title
}
