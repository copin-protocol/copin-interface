import { Trans } from '@lingui/macro'
import { PlusCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi, getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useOnboardingStore from 'hooks/store/useOnboardingStore'
import Badge from 'theme/Badge'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import useMobileLayoutHandler from '../useMobileLayoutHandler'
import AlertNotice from './AlertNotice'
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
  const { data: copyTrades, isLoading: isLoadingCopyTrades } = useQuery(
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
  const { lg } = useResponsive()

  const { layoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_COPY_MANAGEMENT_LAYOUT,
    mobileBreakpoint: lg,
  })

  const { hasCopiedChannel: hasBotAlert } = useBotAlertContext()

  return (
    <Box flex="1 1 0" height="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <>
          <Flex
            flexDirection={lg ? 'row' : 'column'}
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
              <Box sx={{ display: ['block', 'block', 'flex'], gap: 24, pr: 3 }}>
                <Flex sx={{ flexDirection: ['row', 'row', 'row', 'column', 'row'], columnGap: 1 }}>
                  <Type.Caption color="neutral2">Total Volume</Type.Caption>
                  <Type.Caption>
                    {data?.totalVolume != null ? `$${formatNumber(data?.totalVolume, 2, 2)}` : '--'}
                  </Type.Caption>
                </Flex>
                <Flex sx={{ flexDirection: ['row', 'row', 'row', 'column', 'row'], columnGap: 1 }}>
                  <Type.Caption color="neutral2">Total ePnL</Type.Caption>
                  <Type.Caption>{data?.pnl != null ? `$${formatNumber(data?.pnl, 2, 2)}` : '--'}</Type.Caption>
                </Flex>
              </Box>
            </Flex>
            {!!copyTrades && (
              <Flex
                sx={{
                  alignItems: 'center',
                  borderLeft: lg ? 'small' : 'none',
                  borderTop: lg ? 'none' : 'small',
                  borderColor: 'neutral4',
                  width: lg ? 'fit-content' : '100%',
                  justifyContent: 'space-between',
                  pr: 2,
                }}
              >
                <Flex sx={{ alignItems: 'center', height: '100%' }}>
                  {lg && !hasBotAlert && (
                    <Flex
                      px={3}
                      sx={{ borderRight: 'small', height: '100%', alignItems: 'center', borderRightColor: 'neutral4' }}
                    >
                      <AlertNotice />
                    </Flex>
                  )}
                  <ButtonWithIcon
                    icon={<PlusCircle size={20} />}
                    variant="ghostPrimary"
                    sx={{
                      width: 'fit-content',
                      borderRadius: 0,
                    }}
                    onClick={handleClickFindTrader}
                  >
                    <Trans>Add More Trader</Trans>
                  </ButtonWithIcon>
                  {!lg && !hasBotAlert && (
                    <Box sx={{ borderLeft: 'small', height: '100%', pl: 3, borderColor: 'neutral4' }}>
                      <AlertNotice />
                    </Box>
                  )}
                </Flex>
                {!lg && <SwitchLayoutButtons layoutType={layoutType} onChangeType={handleChangeLayout} />}
              </Flex>
            )}
          </Flex>
          <Box height={lg ? 'calc(100% - 46px)' : 'calc(100% - 77px)'}>
            {!!embeddedWallet && (
              <LiteCopyTrades
                layoutType={layoutType}
                copyWallet={embeddedWallet}
                copyTrades={copyTrades}
                loading={isLoadingCopyTrades}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default CopyManagement
