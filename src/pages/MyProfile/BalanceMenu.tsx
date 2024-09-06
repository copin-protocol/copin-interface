import { Eye, EyeClosed } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import Logo from 'components/@ui/Logo'
import ReferralStatus from 'components/@wallet/WalletReferralStatus'
import Num from 'entities/Num'
import { CopyWalletData } from 'entities/copyWallet'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { CEX_EXCHANGES } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { hideScrollbar, overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseExchangeImage, parseWalletName } from 'utils/helpers/transform'
import { getCopyTradePlatformProtocol } from 'utils/web3/dcp'

export default function BalanceMenu({
  copyWallets,
  activeWallet,
  onChangeKey,
  balance,
}: {
  copyWallets: CopyWalletData[] | undefined
  activeWallet: CopyWalletData | null
  onChangeKey: (key: CopyWalletData | null) => void
  balance: Num | null
}) {
  const currentOption = useMemo(() => {
    const foundItem = copyWallets?.find((e) => e.id === activeWallet?.id)
    return { title: foundItem ? parseWalletName(foundItem) : '', value: foundItem?.balance }
  }, [activeWallet, copyWallets])
  const { data: overview } = useQuery(
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

  if (!copyWallets) return <></>
  return (
    <Flex
      sx={{
        flexWrap: 'nowrap',
        gap: [0, 24],
        alignItems: ['start', 'start', 'center'],
        justifyContent: ['start', 'start', 'space-between'],
      }}
      py={[1, 12]}
    >
      <Flex
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ pl: 3, pr: 2, gap: 1, width: ['75%', 'max-content'], borderRight: 'small', borderRightColor: 'neutral4' }}
      >
        <Dropdown
          buttonVariant="ghost"
          buttonSx={{ height: '100%', border: 'none', p: 0 }}
          sx={{ height: '100%', pr: 2, flexShrink: 0 }}
          menuSx={{
            width: ['100%', 200],
            overflow: 'hidden auto',
            height: 'max-content',
            maxHeight: [400, 500],
            py: 2,
          }}
          menu={
            <>
              {copyWallets.map((wallet) => {
                return (
                  <DropdownItem key={wallet.id} onClick={() => onChangeKey(wallet)}>
                    <Flex key={wallet.id} sx={{ alignItems: 'center', gap: 2, width: '100%' }}>
                      <Image src={parseExchangeImage(wallet.exchange)} width={20} height={20} sx={{ flexShrink: 0 }} />
                      <Box
                        as="span"
                        sx={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          width: '100%',
                          maxWidth: 200,
                          ...overflowEllipsis(),
                        }}
                      >
                        {parseWalletName(wallet)}
                      </Box>
                    </Flex>
                  </DropdownItem>
                )
              })}
            </>
          }
        >
          <Type.CaptionBold>{currentOption.title}</Type.CaptionBold>
        </Dropdown>
        {activeWallet && CEX_EXCHANGES.includes(activeWallet.exchange) && (
          <ReferralStatus data={activeWallet} sx={{ minWidth: 80 }} />
        )}
        {activeWallet &&
          activeWallet.exchange === CopyTradePlatformEnum.GNS_V8 &&
          !!activeWallet.smartWalletAddress && (
            <IconBox
              as={'a'}
              href={generateTraderDetailsRoute(
                getCopyTradePlatformProtocol(activeWallet.exchange),
                activeWallet.smartWalletAddress
              )}
              target="_blank"
              icon={<Logo size={16} />}
            />
          )}
      </Flex>
      <Flex
        width={{ _: '100%', sm: 'auto' }}
        height="100%"
        sx={{
          px: [0, 0, 0, 0, 3],
          gap: [0, 24, 24, 24, 40],
          alignItems: 'center',
          overflow: 'auto',
          ...hideScrollbar(),
        }}
      >
        <ListItem title={'Balance'} value={balance ? balance.num : overview?.balance} prefix="$" withHideAction />
        <ListItem title={'Total Volume'} value={overview?.totalVolume} prefix="$" />
        <ListItem
          title={
            <LabelWithTooltip id={TOOLTIP_CONTENT.COPY_PNL.id} tooltip={TOOLTIP_CONTENT.COPY_PNL.content}>
              Total ePnL
            </LabelWithTooltip>
          }
          valueComponent={
            <Type.CaptionBold>
              <SignedText value={overview?.pnl ?? undefined} maxDigit={2} minDigit={2} fontInherit prefix="$" />
            </Type.CaptionBold>
          }
        />
        <ListItem title={'Copies'} valueComponent={<Type.CaptionBold>{overview?.copies ?? '-'}</Type.CaptionBold>} />
      </Flex>
    </Flex>
  )
}

function ListItem({
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
        px: 2,
        borderRight: 'small',
        borderRightColor: 'neutral4',
        '&:last-child': { borderRight: 'none' },
        '*': { lineHeight: '1.5em !important' },
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
          sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' }, lineHeight: 0 }}
          display={{ _: 'none', xl: 'block' }}
        >
          {show ? <EyeClosed onClick={() => setShow(true)} /> : <Eye />}
        </Box>
      ) : null}
    </Flex>
  )
}
