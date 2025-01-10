import { Trans } from '@lingui/macro'
import { PlusCircle } from '@phosphor-icons/react'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi, getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useOnboardingStore from 'hooks/store/useOnboardingStore'
import Badge from 'theme/Badge'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

import LiteCopyTrades from './CopyTrades'

const CopyManagement = () => {
  const { embeddedWallet, loadingEmbeddedWallets } = useCopyWalletContext()
  const embbededWalletId = embeddedWallet?.id
  const queryParams = useMemo(
    () => ({
      copyWalletId: embbededWalletId,
      accounts: undefined,
      status: undefined,
    }),
    [embbededWalletId]
  )
  const {
    data: copyTrades,
    isFetching: isLoadingCopyTrades,
    refetch: reloadCopyTrades,
  } = useQuery(
    [QUERY_KEYS.GET_EMBEDDED_COPY_TRADES, queryParams],

    () => getCopyTradeSettingsListApi(queryParams),
    {
      enabled: !!embbededWalletId,
      retry: 0,
      keepPreviousData: true,
    }
  )

  const { data } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_BALANCE_OVERVIEW, embbededWalletId],
    () =>
      getMyCopyTradeOverviewApi({
        exchange: CopyTradePlatformEnum.HYPERLIQUID,
        copyWalletId: embbededWalletId,
      }),
    {
      enabled: !!embbededWalletId,
    }
  )

  const { forceOpenModal } = useOnboardingStore()
  const handleClickFindTrader = () => forceOpenModal()

  return (
    <Box flex="1 1 0" height="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <>
          <Flex
            flexDirection={['column', 'column', 'column', 'row']}
            sx={{
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              flex="1"
              sx={{
                height: 47,
              }}
            >
              <Flex py={2} px={16} sx={{ gap: 2 }} alignItems="center">
                <Type.BodyBold>
                  <Trans>Manage Copy</Trans>
                </Type.BodyBold>
                {!!data?.copies && <Badge count={data.copies} />}
              </Flex>
              <Box sx={{ display: ['block', 'block', 'flex'] }}>
                <Flex>
                  <Type.Caption color="neutral2" mr={1}>
                    Total Volume
                  </Type.Caption>
                  <Type.Caption mr={3}>
                    {data?.totalVolume != null ? `$${formatNumber(data?.totalVolume, 2, 2)}` : '--'}
                  </Type.Caption>
                </Flex>
                <Flex>
                  <Type.Caption color="neutral2" mr={1}>
                    Total ePnL
                  </Type.Caption>
                  <Type.Caption mr={3}>{data?.pnl != null ? `$${formatNumber(data?.pnl, 2, 2)}` : '--'}</Type.Caption>
                </Flex>
              </Box>
            </Flex>
            {!!copyTrades && (
              <ButtonWithIcon
                icon={<PlusCircle size={20} />}
                variant="ghostPrimary"
                sx={{
                  width: ['100%', '100%', '100%', 'fit-content'],
                  borderLeft: ['none', 'none', 'none', 'small'],
                  borderTop: ['small', 'small', 'small', 'none'],
                  borderRadius: 0,
                  borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
                }}
                onClick={handleClickFindTrader}
              >
                <Trans>Add More Trader</Trans>
              </ButtonWithIcon>
            )}
          </Flex>
          <Box height={['calc(100% - 77px)', 'calc(100% - 77px)', 'calc(100% - 77px)', 'calc(100% - 46px)']}>
            {!!embeddedWallet && (
              <LiteCopyTrades
                copyWallet={embeddedWallet}
                copyTrades={copyTrades}
                loading={isLoadingCopyTrades}
                reload={reloadCopyTrades}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default CopyManagement
