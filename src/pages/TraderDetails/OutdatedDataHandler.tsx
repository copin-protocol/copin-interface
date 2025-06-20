import { Trans } from '@lingui/macro'
import { memo, useEffect, useRef, useState } from 'react'

import { getHlOrderFilled } from 'apis/hyperliquid'
import { getTraderLastOrder } from 'apis/traderApis'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
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
      <Flex
        sx={{
          position: 'relative',
          width: '100%',
          height: 'max-content',
          overflow: 'hidden',
          bg: `${themeColors.orange1}15`,
          p: '8px 16px',
          alignItems: 'center',
          transition: '0.3s',
          color: 'orange1',
          justifyContent: 'center',
        }}
      >
        <Type.Caption>
          <Trans>
            This trader data has been outdated (Last updated:{' '}
            {formatLocalDate(outdatedDate.getTime(), DAYJS_FULL_DATE_FORMAT)}). We&apos;re working to restore full
            functionality as soon as possible.
          </Trans>
        </Type.Caption>
      </Flex>
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
