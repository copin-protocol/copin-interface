import { Trans } from '@lingui/macro'
import { memo, useEffect, useRef, useState } from 'react'

import { getHlOrderFilled } from 'apis/hyperliquid'
import { getTraderLastOrder } from 'apis/traderApis'
import { Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { formatLocalDate } from 'utils/helpers/format'

const OutdatedDataHandler = memo(
  ({ account }: { account: string }) => {
    const accountRef = useRef<string | null>(null)
    const [outdatedDate, setOutdatedDate] = useState<Date | null>(null)

    useEffect(() => {
      const checkOutdatedData = async () => {
        if (accountRef.current === account) return
        accountRef.current = account
        const [fills, order] = await Promise.all([
          getHlOrderFilled({ user: account }),
          getTraderLastOrder({ account, protocol: ProtocolEnum.HYPERLIQUID }),
        ])
        if (!fills?.length) return
        if (!order) {
          setOutdatedDate(new Date())
          return
        }
        const orderTime = new Date(order.blockTime || order.createdAt)
        if (fills[0].time > orderTime.getTime() + 1000 * 60 * 15) {
          setOutdatedDate(orderTime)
        }
      }
      checkOutdatedData()
    }, [account])

    return outdatedDate ? (
      <Type.Caption color="orange1">
        <Trans>⚠ Last Updated: {formatLocalDate(outdatedDate.getTime(), DAYJS_FULL_DATE_FORMAT)}</Trans>
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
