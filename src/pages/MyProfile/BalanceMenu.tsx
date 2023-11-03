import { Eye, EyeClosed } from '@phosphor-icons/react'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { CopyWalletData } from 'entities/copyWallet'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'

const ListItem = ({
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
}) => {
  const [show, setShow] = useState(false)

  return (
    <Flex
      flexDirection={{ _: 'column', xl: 'row' }}
      sx={{
        gap: [1, 1, 1, 1, 2],
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexShrink: 0,
      }}
    >
      <Flex sx={{ gap: '1ch' }}>
        {titleComponent ? titleComponent : <Type.Caption color="neutral2">{title}</Type.Caption>}
        {withHideAction ? (
          <Box
            role="button"
            onClick={() => setShow((prev) => !prev)}
            sx={{ color: 'neutral3', '&:hover': { color: 'neutral2', lineHeight: 0 } }}
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
          <Type.CaptionBold>******</Type.CaptionBold>
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

const BalanceMenu = ({
  copyWallets,
  activeWallet,
  onChangeKey,
}: {
  copyWallets: CopyWalletData[] | undefined
  activeWallet: CopyWalletData | null
  onChangeKey: (key: CopyWalletData | null) => void
}) => {
  const currentOption = useMemo(() => {
    const foundItem = copyWallets?.find((e) => e.id === activeWallet?.id)
    return { title: foundItem ? parseWalletName(foundItem) : '', value: foundItem?.balance }
  }, [activeWallet, copyWallets])
  const { data: overview } = useQuery(
    ['copytrade-balances/overview', activeWallet],
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
      flexDirection={{ _: 'column', sm: 'row' }}
      alignItems={{ _: 'start', sm: 'center' }}
      justifyContent={{ _: 'space-between' }}
      sx={{ flexWrap: 'wrap', gap: 12 }}
      pr={2}
      py={12}
    >
      <Flex
        display={{ _: 'flex', sm: 'block' }}
        alignItems="center"
        width={{ _: '100%', sm: 'auto' }}
        px={3}
        sx={{ gap: 3 }}
      >
        <Dropdown
          buttonVariant="ghost"
          buttonSx={{ height: '100%', border: 'none', p: 0 }}
          sx={{ height: '100%' }}
          menuSx={{ width: ['100%', 200] }}
          menu={
            <>
              {copyWallets.map((wallet) => {
                return (
                  <DropdownItem key={wallet.id} onClick={() => onChangeKey(wallet)}>
                    {parseWalletName(wallet)}
                  </DropdownItem>
                )
              })}
            </>
          }
        >
          <Type.CaptionBold>{currentOption.title}</Type.CaptionBold>
        </Dropdown>
      </Flex>
      <Flex
        width={{ _: '100%', sm: 'auto' }}
        justifyContent={{ _: 'space-between' }}
        sx={{ px: 3, gap: [24, 24, 24, 24, 40], alignItems: 'center' }}
      >
        <ListItem title={'Balance'} value={overview?.balance} prefix="$" withHideAction />
        <ListItem title={'Total Volume'} value={overview?.totalVolume} prefix="$" />
        <ListItem
          title={'Total PnL'}
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

export default BalanceMenu
