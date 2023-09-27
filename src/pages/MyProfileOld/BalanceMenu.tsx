import { CaretDown, CaretUp, Wallet } from '@phosphor-icons/react'
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeBalancesApi } from 'apis/copyTradeApis'
import SectionTitle from 'components/@ui/SectionTitle'
import { CopyTradeBalanceData } from 'entities/copyTrade'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

const MenuItem = ({
  title,
  value,
  bold,
  active,
  onClick,
}: {
  title: string
  value: number
  bold?: boolean
  active: boolean
  onClick: () => void
}) => (
  <Flex
    onClick={onClick}
    role="button"
    px={2}
    py={3}
    mb={2}
    justifyContent="space-between"
    sx={{
      borderRadius: 'xs',
      bg: active ? 'neutral4' : 'transparent',
      '&:hover': {
        bg: active ? 'neutral4' : 'neutral6',
      },
    }}
  >
    {bold ? <Type.CaptionBold>{title}</Type.CaptionBold> : <Type.Caption>{title}</Type.Caption>}
    {bold ? (
      <Type.BodyBold color="green1">${formatNumber(value, 2, 2)}</Type.BodyBold>
    ) : (
      <Type.Caption>${formatNumber(value, 2, 2)}</Type.Caption>
    )}
  </Flex>
)

const ALL_ACCOUNTS_STR = 'All Accounts'

const getName = (balance: CopyTradeBalanceData) => `BingX ${balance.uniqueKey.slice(0, 5)}`

const BalanceMenu = ({
  hasCollapse,
  activeKey,
  onChangeKey,
}: {
  hasCollapse?: boolean
  activeKey: string | null
  onChangeKey: (key: string | null) => void
}) => {
  const [collapsing, setCollapsing] = useState(hasCollapse ? true : false)
  const { data, isLoading } = useQuery('copytrade-balances', () => getCopyTradeBalancesApi())
  const currentOption = useMemo(() => {
    if (activeKey == null) return { title: ALL_ACCOUNTS_STR, value: data?.totalBalance }
    const foundItem = data?.balances.find((e) => e.uniqueKey === activeKey)
    return { title: foundItem ? getName(foundItem) : '', value: foundItem?.balance }
  }, [activeKey, data])
  return (
    <Box px={16} pt={16} onClick={() => hasCollapse && collapsing && setCollapsing(false)}>
      {!collapsing && (
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <SectionTitle icon={<Wallet size={24} />} title="Balance" />
          {hasCollapse && (
            <IconButton mt={-12} variant="ghost" icon={<CaretDown size={20} />} onClick={() => setCollapsing(true)} />
          )}
        </Flex>
      )}
      {isLoading && <Loading />}
      {!!data && (
        <>
          {collapsing ? (
            <Flex justifyContent="space-between" alignItems="center" width="100%" pb={2}>
              <Type.CaptionBold>{currentOption.title}</Type.CaptionBold>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Type.CaptionBold>
                  ${currentOption.value ? formatNumber(currentOption.value, 2, 2) : '--'}
                </Type.CaptionBold>
                <CaretUp size={20} />
              </Flex>
            </Flex>
          ) : (
            <Box>
              <MenuItem
                active={activeKey == null}
                title={ALL_ACCOUNTS_STR}
                value={data.totalBalance}
                bold
                onClick={() => onChangeKey(null)}
              />
              {data.balances.map((balance) => (
                <MenuItem
                  active={activeKey === balance.uniqueKey}
                  key={balance.uniqueKey}
                  title={getName(balance)}
                  value={balance.balance}
                  onClick={() => onChangeKey(balance.uniqueKey)}
                />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default BalanceMenu
