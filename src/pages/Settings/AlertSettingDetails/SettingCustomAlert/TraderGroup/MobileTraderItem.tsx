import { Trash } from '@phosphor-icons/react'
import React, { memo, useCallback } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { MobileRowItem, Trader24hTrades, TraderCreatedAt } from 'pages/Settings/AlertSettingDetails/config'
import IconButton from 'theme/Buttons/IconButton'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Flex } from 'theme/base'
import { AlertCustomType } from 'utils/config/enums'

import { MobileTraderItemProps } from './types'

/**
 * Mobile view component for rendering individual trader items
 */
const MobileTraderItem = memo(({ data, onUpdateWatchlist, onRemoveWatchlist, customType }: MobileTraderItemProps) => {
  const handleUpdateWatchlist = useCallback(() => {
    onUpdateWatchlist(data)
  }, [data, onUpdateWatchlist])

  const handleRemoveWatchlist = useCallback(() => {
    onRemoveWatchlist(data)
  }, [data, onRemoveWatchlist])

  return (
    <Flex key={data.id} variant="card" flexDirection="column" bg="neutral6" width="100%" sx={{ pt: 2, gap: 2 }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 2, borderBottom: 'small', borderColor: 'neutral5' }}
      >
        <AccountInfo
          address={data.address}
          protocol={data.protocol}
          avatarSize={32}
          textSx={{ color: 'neutral1' }}
          label={data.label}
        />
        <Flex alignItems="center" sx={{ gap: 3 }}>
          <SwitchInput checked={data.enableAlert} onClick={handleUpdateWatchlist} />
          {customType !== AlertCustomType.TRADER_BOOKMARK && (
            <IconButton
              variant="ghost"
              icon={<Trash size={16} />}
              size={16}
              sx={{
                color: 'neutral3',
                '&:hover:not(:disabled),&:active:not(:disabled)': {
                  color: 'red1',
                },
              }}
              onClick={handleRemoveWatchlist}
            />
          )}
        </Flex>
      </Flex>
      <MobileRowItem label="Latest Added" value={<TraderCreatedAt data={data} />} />
      <MobileRowItem label="24H Trades" value={<Trader24hTrades data={data} />} />
    </Flex>
  )
})

MobileTraderItem.displayName = 'MobileTraderItem'

export default MobileTraderItem
