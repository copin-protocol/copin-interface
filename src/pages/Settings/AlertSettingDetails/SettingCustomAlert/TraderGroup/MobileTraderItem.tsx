import { Trash } from '@phosphor-icons/react'
import React, { memo, useCallback } from 'react'

import {
  MobileRowItem,
  Trader24hTrades,
  TraderAddress,
  TraderCreatedAt,
} from 'pages/Settings/AlertSettingDetails/config'
import IconButton from 'theme/Buttons/IconButton'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Flex } from 'theme/base'

import { MobileTraderItemProps } from './types'

/**
 * Mobile view component for rendering individual trader items
 */
const MobileTraderItem = memo(({ data, onUpdateWatchlist, onRemoveWatchlist }: MobileTraderItemProps) => {
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
        <TraderAddress data={data} />
        <Flex alignItems="center" sx={{ gap: 3 }}>
          <SwitchInput checked={data.enableAlert} onClick={handleUpdateWatchlist} />
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
        </Flex>
      </Flex>
      <MobileRowItem label="Latest Added" value={<TraderCreatedAt data={data} />} />
      <MobileRowItem label="24H Trades" value={<Trader24hTrades data={data} />} />
    </Flex>
  )
})

MobileTraderItem.displayName = 'MobileTraderItem'

export default MobileTraderItem
