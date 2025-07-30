import { Trans } from '@lingui/macro'
import { memo, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getHlOrderFilled } from 'apis/hyperliquid'
import { getTraderDataStatus, getTraderLastOrder, refreshTraderData } from 'apis/traderApis'
import ToastBody from 'components/@ui/ToastBody'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatLocalDate } from 'utils/helpers/format'

const OutdatedDataHandler = memo(
  ({ account }: { account: string }) => {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const accountRef = useRef<string | null>(null)
    const [outdatedDate, setOutdatedDate] = useState<Date | boolean>(false)

    const { data, refetch } = useQuery(
      [QUERY_KEYS.GET_TRADER_DATA_STATUS, account],
      () => getTraderDataStatus({ account }),
      {
        enabled: !!account,
        onSuccess: () => {
          setIsRefreshing(false)
        },
      }
    )

    const refreshMutate = useMutation([QUERY_KEYS.REFRESH_TRADER_DATA, account], () => refreshTraderData({ account }))

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
        const orderTime = new Date(order.blockTime || order.createdAt)

        if (perpFills[0].time > orderTime.getTime() + 1000 * 60 * 15) {
          setOutdatedDate(orderTime)
        }
      }
      checkOutdatedData()
    }, [account])

    return outdatedDate ? (
      <Flex alignItems="center" sx={{ gap: 2 }}>
        <Type.Caption color="orange1">
          {outdatedDate === true ? (
            data?.reason === 'PROCESSING' ? (
              <Trans>⚠ This historical data is being re-synced</Trans>
            ) : (
              <Trans>⚠ This historical data is delayed</Trans>
            )
          ) : (
            <Trans>⚠ Sync delayed since {formatLocalDate(outdatedDate.getTime(), 'YY/MM/DD HH:mm:ss')}</Trans>
          )}
        </Type.Caption>
        {!!data && (
          <Button
            variant="ghostPrimary"
            size="sm"
            sx={{ px: 0 }}
            disabled={refreshMutate.isLoading || isRefreshing || !data.canRefresh}
            onClick={() => {
              setIsRefreshing(true)
              refreshMutate.mutate()
              setTimeout(() => {
                refetch()
              }, 300)
              toast.success(
                <ToastBody
                  title={<Trans>Added to refresh queue</Trans>}
                  message={<Trans>This trader data is being refreshed. Please check back later.</Trans>}
                />
              )
            }}
            data-tooltip-id={`refresh-trader-data-${account} `}
          >
            <Trans>Refresh</Trans>
          </Button>
        )}
        {!!data?.cooldown && (
          <Tooltip id={`refresh-trader-data-${account} `}>
            {!!data.cooldown.lastRefreshTime && (
              <Box>
                <Type.Caption color="neutral1" width={150}>
                  <Trans>Last refreshed:</Trans>
                </Type.Caption>
                <Type.Caption>{formatLocalDate(data.cooldown.lastRefreshTime, DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
              </Box>
            )}
            {!!data.cooldown.nextAvailableTime && (
              <Box>
                <Type.Caption color="neutral1" sx={{ mt: 1 }} width={150}>
                  <Trans>Refresh available at:</Trans>
                </Type.Caption>
                <Type.Caption>{formatLocalDate(data.cooldown.nextAvailableTime, DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
              </Box>
            )}
          </Tooltip>
        )}
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
