import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { Fragment, ReactNode, useMemo, useRef } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'

import { requestCopyTradeApi } from 'apis/copyTradeApis'
import { getTraderTokensStatistic } from 'apis/traderApis'
import logo from 'assets/images/logo.png'
import roundedBox from 'assets/images/rounded_box.svg'
import CopyTraderForm from 'components/@copyTrade/CopyTradeForm'
import { defaultCopyTradeFormValues } from 'components/@copyTrade/configs'
import { getRequestDataFromForm } from 'components/@copyTrade/helpers'
import { CopyTradeFormValues } from 'components/@copyTrade/types'
import { AccountInfo } from 'components/@ui/AccountInfo'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ToastBody from 'components/@ui/ToastBody'
import Icon from 'components/@widgets/IconGroup/Icon'
import { RequestCopyTradeData } from 'entities/copyTrade'
import { ResponseTraderData, TraderTokenStatistic } from 'entities/trader'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import Modal from 'theme/Modal'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { CopyTradePlatformEnum, CopyTradeTypeEnum, TraderLabelEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import { TIME_TRANSLATION_FULL } from 'utils/config/translations'
import { Z_INDEX } from 'utils/config/zIndex'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'
import { getSymbolFromPair, parseMarketImage } from 'utils/helpers/transform'
import { logEventLite } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { LABEL_CONFIG_MAPPING } from './configs'

export default function CopyTraderModal({
  traderData,
  onDismiss,
  onCopySuccess,
}: {
  traderData: ResponseTraderData | null
  onDismiss: () => void
  onCopySuccess: () => void
}) {
  const { embeddedWallet } = useCopyWalletContext()
  const isOpen = !!traderData
  const { account = '', protocol = DEFAULT_PROTOCOL } = traderData ?? {}

  const { data: tokensStatistic, isLoading: loadingTokenStatistic } = useQuery(
    [QUERY_KEYS.GET_TRADER_TOKEN_STATISTIC, protocol, account],
    () => getTraderTokensStatistic({ protocol, account }),
    {
      enabled: !!account && !!protocol,
      retry: 0,
      keepPreviousData: true,
      select(data) {
        data.data.sort((a, b) => b.realisedPnl - a.realisedPnl)
        return data
      },
    }
  )

  const refetchQueries = useRefetchQueries()

  const { mutate: requestCopyTrade, isLoading: isSubmitting } = useMutation(requestCopyTradeApi, {
    onSuccess: async () => {
      refetchQueries([
        QUERY_KEYS.USE_GET_ALL_COPY_TRADES,
        QUERY_KEYS.GET_TRADER_VOLUME_COPY,
        QUERY_KEYS.GET_COPY_TRADE_SETTINGS,
        QUERY_KEYS.GET_EMBEDDED_COPY_TRADES,
      ])
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Make copy trade has been succeeded</Trans>} />
      )
      onCopySuccess()
      onDismiss()

      logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_COPY_TRADER_SUCCESS })
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)

      logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_COPY_TRADER_FAILED })
    },
  })

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: RequestCopyTradeData = {
      ...getRequestDataFromForm(formData),
      account,
      protocol,
      type: CopyTradeTypeEnum.COPY_TRADER,
    }
    requestCopyTrade({ data })
  }

  const protocolOptionsMapping = useGetProtocolOptionsMapping()

  const _defaultCopyTradeFormValues = useMemo(() => {
    const result: CopyTradeFormValues = {
      ...defaultCopyTradeFormValues,
      account,
      exchange: embeddedWallet?.exchange ?? CopyTradePlatformEnum.HYPERLIQUID,
      copyWalletId: embeddedWallet?.id ?? '',
    }
    return result
  }, [protocolOptionsMapping, embeddedWallet, traderData])
  if (!traderData) return null
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxWidth="900px" width="90svw" zIndex={Z_INDEX.THEME_MODAL + 10}>
      <Flex sx={{ width: '100%', height: '100%', overflow: 'hidden', alignItems: 'start' }}>
        <Box
          display={['none', 'none', 'none', 'block']}
          flex="1 0 0"
          bg="neutral6"
          sx={{ height: '100%', overflow: 'hidden auto', backgroundImage: `url(${roundedBox})`, position: 'relative' }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: -150,
              width: 480,
              height: 200,
              borderRadius: '50%',
              transformOrigin: '50%',
              // backgroundImage: 'radial-gradient(#3F4E89 0%, #101423 48.22%)',

              bg: '#3F4E89',
              filter: 'blur(150px)',
              transform: 'rotate(45deg)',
            }}
          ></Box>
          <TraderStats traderData={traderData} tokensStatistic={tokensStatistic?.data} />
        </Box>
        <Box flex="1 0 0" sx={{ height: '100%', overflow: 'hidden auto' }}>
          <Flex pt={3} px={3} sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            <Type.H5>
              <Trans>Copy Trader</Trans>
            </Type.H5>
            <IconBox
              role="button"
              icon={<XCircle size={24} />}
              sx={{ color: 'neutral1', '&:hover': { color: 'neutral2' } }}
              onClick={onDismiss}
            />
          </Flex>
          <CopyTraderForm
            formTypes={['onboarding', 'lite']}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            defaultFormValues={_defaultCopyTradeFormValues}
            submitButtonText={<Trans>Copy Now</Trans>}
          />
        </Box>
      </Flex>
    </Modal>
  )
}

function TraderStats({
  traderData,
  tokensStatistic,
}: {
  traderData: ResponseTraderData
  tokensStatistic: TraderTokenStatistic[] | undefined
}) {
  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Image mb={48} height={40} src={logo} width="auto" />
      <Flex mb={3} justifyContent="center">
        <AccountInfo
          address={traderData.account}
          protocol={traderData.protocol}
          addressFormatter={Type.BodyBold}
          addressWidth="fit-content"
          hasQuickView={false}
        />
      </Flex>

      <Flex
        mb={24}
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {traderData.labels?.map((label) => {
          const config = LABEL_CONFIG_MAPPING[label as TraderLabelEnum]
          const tooltipId = 'tt_onboarding_trader_details_' + label
          return (
            <Fragment key={label}>
              <Type.Caption
                sx={{
                  px: 2,
                  borderRadius: '20px',
                  py: '1px',
                  bg: 'neutral4',
                }}
                data-tooltip-id={tooltipId}
              >
                {config.label}
              </Type.Caption>
              <Tooltip id={tooltipId}>
                <Type.Small maxWidth={300}>{config.tooltipContent}</Type.Small>
              </Tooltip>
            </Fragment>
          )
        })}
      </Flex>
      <Type.CaptionBold mb={1}>
        <Trans>{TIME_TRANSLATION_FULL[traderData.type]} Performance</Trans>
      </Type.CaptionBold>
      <Flex sx={{ width: '100%', height: '68px', alignItems: 'center', border: 'small', borderColor: 'neutral4' }}>
        {PROTOCOLS_CROSS_MARGIN.includes(traderData.protocol) ? (
          <PerformanceItem
            label={<Trans>Avg Return On Notation</Trans>}
            value={`${traderData.realisedAvgRoi > 0 ? '+' : ''}${formatNumber(traderData.realisedAvgRoi, 2, 2)}%`}
            tooltipContent={<Trans>Profit or loss as a percentage of the total trade value (notional)</Trans>}
          />
        ) : (
          <PerformanceItem
            label={<Trans>Avg ROI</Trans>}
            value={`${traderData.realisedAvgRoi > 0 ? '+' : ''}${formatNumber(traderData.realisedAvgRoi, 2, 2)}%`}
            // tooltipContent={<Trans>Return On Invest</Trans>}
          />
        )}
        <Box sx={{ width: '1px', height: '34px', bg: 'neutral4' }} />
        <PerformanceItem label={<Trans>Avg Leverage</Trans>} value={`x${formatNumber(traderData.avgLeverage, 1, 1)}`} />
        <Box sx={{ width: '1px', height: '34px', bg: 'neutral4' }} />
        <PerformanceItem
          label={<Trans>Max Drawdown</Trans>}
          value={`${traderData.realisedMaxDrawdown > 0 ? '+' : ''}${formatNumber(
            traderData.realisedMaxDrawdown,
            0,
            0
          )}%`}
        />
      </Flex>
      {!!tokensStatistic?.length && (
        <>
          <Type.CaptionBold mb={1} mt={3}>
            <Trans>Top Highest PNL Tokens</Trans>
          </Type.CaptionBold>
          <Flex sx={{ width: '100%', height: '68px', alignItems: 'center', border: 'small', borderColor: 'neutral4' }}>
            {tokensStatistic.slice(0, 3).map((stats, index) => {
              return (
                <>
                  {index !== 0 && <Box sx={{ width: '1px', height: '34px', bg: 'neutral4' }} />}
                  <TopMarketItem symbol={getSymbolFromPair(stats.pair)} value={stats.realisedPnl} />
                </>
              )
            })}
          </Flex>
        </>
      )}
    </Box>
  )
}

function TopMarketItem({ symbol, value }: { symbol: string; value: number }) {
  return (
    <Flex flex="1" sx={{ flexDirection: 'column', alignItems: 'center' }}>
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Icon iconUriFactory={parseMarketImage} iconName={symbol} size={18} />
        <Type.Small>{symbol}</Type.Small>
      </Flex>
      <Type.BodyBold mt={1}>
        <SignedText fontInherit value={value} minDigit={2} maxDigit={2} prefix="$" isCompactNumber />
      </Type.BodyBold>
    </Flex>
  )
}

function PerformanceItem({
  label,
  value,
  tooltipContent,
}: {
  label: ReactNode
  value: ReactNode
  tooltipContent?: ReactNode
}) {
  const tooltipId = useRef(uuid())
  return (
    <Flex flex="1" sx={{ flexDirection: 'column', alignItems: 'center' }}>
      {tooltipContent ? (
        <LabelWithTooltip id={tooltipId.current} tooltip={tooltipContent} sx={{ fontSize: '10px', lineHeight: '16px' }}>
          {label}
        </LabelWithTooltip>
      ) : (
        <Type.Small color="neutral2">{label}</Type.Small>
      )}
      <Type.Caption mt={1} color="neutral1">
        {value}
      </Type.Caption>
    </Flex>
  )
}
