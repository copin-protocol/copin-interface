import { Eye, EyeClosed } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeBalancesApi, getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { CopyTradeBalanceData } from 'entities/copyTrade'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

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

const ALL_ACCOUNTS_STR = 'All Accounts'

const getName = (balance: CopyTradeBalanceData) => `BingX ${balance.uniqueKey.slice(0, 5)}`

const BalanceMenu = ({
  activeKey,
  onChangeKey,
}: {
  activeKey: string | null
  onChangeKey: (key: string | null) => void
}) => {
  const { sm } = useResponsive()
  const { data } = useQuery('copytrade-balances', () => getCopyTradeBalancesApi())
  const currentOption = useMemo(() => {
    if (activeKey == null) return { title: ALL_ACCOUNTS_STR, value: data?.totalBalance }
    const foundItem = data?.balances.find((e) => e.uniqueKey === activeKey)
    return { title: foundItem ? getName(foundItem) : '', value: foundItem?.balance }
  }, [activeKey, data])
  const { data: overview } = useQuery(['copytrade-balances/overview', activeKey], () =>
    getMyCopyTradeOverviewApi({ exchange: CopyTradePlatformEnum.BINGX, uniqueKey: activeKey })
  )

  if (!data) return <></>
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
              <DropdownItem onClick={() => onChangeKey(null)}>All Accounts</DropdownItem>
              {data.balances.map((balanceData) => {
                return (
                  <DropdownItem key={balanceData.uniqueKey} onClick={() => onChangeKey(balanceData.uniqueKey)}>
                    {getName(balanceData)}
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
          title={'Total Net PnL'}
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
