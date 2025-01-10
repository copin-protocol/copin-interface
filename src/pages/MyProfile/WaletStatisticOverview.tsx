import { Eye, EyeClosed } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useState } from 'react'
import { useQuery } from 'react-query'

import { getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { CopyWalletData } from 'entities/copyWallet'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { formatNumber } from 'utils/helpers/format'

export default function WalletStatisticOverview({ activeWallet }: { activeWallet: CopyWalletData | null }) {
  const { data } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_BALANCE_OVERVIEW, activeWallet],
    () =>
      getMyCopyTradeOverviewApi({
        exchange: activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX,
        copyWalletId: activeWallet?.id,
      }),
    {
      enabled: !!activeWallet,
    }
  )

  if (!data) return <></>
  return (
    <>
      <WalletStatisticOverviewItem title={'Total Volume'} value={data?.totalVolume} prefix="$" />
      <WalletStatisticOverviewItem
        title={
          <LabelWithTooltip id={TOOLTIP_CONTENT.COPY_PNL.id} tooltip={TOOLTIP_CONTENT.COPY_PNL.content}>
            Total ePnL
          </LabelWithTooltip>
        }
        valueComponent={
          <Type.CaptionBold>
            <SignedText value={data?.pnl ?? undefined} maxDigit={2} minDigit={2} fontInherit prefix="$" />
          </Type.CaptionBold>
        }
      />
      <WalletStatisticOverviewItem
        title={'Copies'}
        valueComponent={<Type.CaptionBold>{data?.copies ?? '-'}</Type.CaptionBold>}
      />
    </>
  )
}

export function WalletStatisticOverviewItem({
  title,
  titleComponent,
  value,
  valueComponent,
  withHideAction,
  prefix,
  suffix,
}: {
  title?: ReactNode
  value?: number
  titleComponent?: ReactNode
  valueComponent?: ReactNode
  withHideAction?: boolean
  prefix?: string
  suffix?: string
}) {
  const [show, setShow] = useState(false)
  const { sm } = useResponsive()

  return (
    <Flex
      sx={{
        gap: [1, 1, 1, 1, 2],
        alignItems: ['start', 'center'],
        justifyContent: 'center',
        height: '100%',
        flexShrink: 0,
        flexDirection: sm ? 'row' : 'column',
      }}
    >
      <Flex sx={{ gap: '1ch', alignItems: 'center' }}>
        {titleComponent ? titleComponent : <Type.Caption color="neutral2">{title}</Type.Caption>}
        {withHideAction ? (
          <Box
            role="button"
            onClick={() => setShow((prev) => !prev)}
            sx={{ color: 'neutral3', lineHeight: 0, '&:hover': { color: 'neutral2' } }}
            display={{ _: 'block', xl: 'none' }}
          >
            {show ? <EyeClosed onClick={() => setShow(true)} /> : <Eye />}
          </Box>
        ) : null}
      </Flex>
      {withHideAction ? (
        show ? (
          <>
            {valueComponent ? (
              valueComponent
            ) : (
              <Type.CaptionBold color="neutral1">
                {prefix}
                {formatNumber(value, 2, 2)}
                {suffix}
              </Type.CaptionBold>
            )}
          </>
        ) : (
          <Type.CaptionBold sx={{ lineHeight: '1em' }}>******</Type.CaptionBold>
        )
      ) : (
        <>
          {valueComponent ? (
            valueComponent
          ) : (
            <Type.CaptionBold color="neutral1">
              {prefix}
              {formatNumber(value, 2, 2)}
              {suffix}
            </Type.CaptionBold>
          )}
        </>
      )}
      {withHideAction ? (
        <Box
          role="button"
          onClick={() => setShow((prev) => !prev)}
          sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' }, height: 20 }}
          display={{ _: 'none', xl: 'block' }}
        >
          {show ? <EyeClosed onClick={() => setShow(true)} /> : <Eye />}
        </Box>
      ) : null}
    </Flex>
  )
}
