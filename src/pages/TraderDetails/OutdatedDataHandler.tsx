import { Trans } from '@lingui/macro'
import { memo, useEffect, useRef, useState } from 'react'

import { getHlOrderFilled } from 'apis/hyperliquid'
import { getTraderLastOrder } from 'apis/traderApis'
import { Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatLocalDate } from 'utils/helpers/format'

const OutdatedDataHandler = memo(
  ({ account }: { account: string }) => {
    const accountRef = useRef<string | null>(null)
    const [outdatedDate, setOutdatedDate] = useState<Date | boolean>(false)

    useEffect(() => {
      const checkOutdatedData = async () => {
        if (accountRef.current === account) return
        accountRef.current = account
        const [fills, order] = await Promise.all([
          getHlOrderFilled({ user: account }),
          getTraderLastOrder({ account, protocol: ProtocolEnum.HYPERLIQUID }),
        ])

        const perpFills = fills?.filter((fill) => !fill.coin.startsWith('@'))

        if (!perpFills?.length) return
        if (!order) {
          setOutdatedDate(true)
          return
        }
        const orderTime = new Date(order.latestTransactionTime || order.blockTime || order.createdAt)

        if (perpFills[0].time > orderTime.getTime() + 1000 * 60 * 15) {
          setOutdatedDate(orderTime)
        }
      }
      checkOutdatedData()
    }, [account])

    return outdatedDate ? (
      <Type.Caption color="orange1">
        {outdatedDate === true ? (
          <Trans>⚠ This historical data is delayed</Trans>
        ) : (
          <Trans>⚠ Sync delayed since {formatLocalDate(outdatedDate.getTime(), 'YY/MM/DD HH:mm:ss')}</Trans>
        )}
      </Type.Caption>
    ) : (
      <></>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if account or protocol changes
    return prevProps.account === nextProps.account
  }
)

OutdatedDataHandler.displayName = 'OutdatedDataHandler'

export default OutdatedDataHandler
