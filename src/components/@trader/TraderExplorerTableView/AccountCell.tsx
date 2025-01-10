import { useResponsive } from 'ahooks'
import { ReactElement } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import FavoriteButton from 'components/@widgets/FavoriteButton'
import { MyCopyTraderData, TraderData } from 'entities/trader.d'
import { Box, Flex } from 'theme/base'

export function AccountCell({ data, additionalComponent }: { data: TraderData; additionalComponent?: ReactElement }) {
  const { sm } = useResponsive()
  return (
    <Flex alignItems="center" justifyContent="start" sx={{ gap: 0, position: 'relative' }}>
      <AccountInfo
        isOpenPosition={data.isOpenPosition}
        address={data.account}
        protocol={data.protocol}
        type={data.type}
        note={data.note}
        size={sm ? 32 : 28}
        wrapperSx={{ width: 'fit-content' }}
      />
      {additionalComponent ? additionalComponent : null}
    </Flex>
  )
}
export function AccountCellMobile({
  data,
  additionalComponent,
}: {
  data: TraderData
  additionalComponent?: ReactElement
}) {
  return (
    <Flex alignItems="center" justifyContent="start" sx={{ gap: 1, position: 'relative' }}>
      <AccountInfo
        isOpenPosition={data.isOpenPosition}
        address={data.account}
        protocol={data.protocol}
        type={data.type}
        note={data.note}
        size={40}
        wrapperSx={{ py: 0, gap: 2 }}
      />
      <Box>{additionalComponent ? additionalComponent : null}</Box>
    </Flex>
  )
}
export function MyCopyAccountCell({ data }: { data: MyCopyTraderData }) {
  // const lastTradeDuration = dayjs().diff(data.lastTradeAt, 'd')
  const { sm } = useResponsive()
  return (
    <Flex alignItems="center" justifyContent="start" sx={{ gap: [1, 2], position: 'relative' }}>
      <AccountInfo isOpenPosition={false} address={data.account} protocol={data.protocol} size={sm ? 40 : 28} />
      <FavoriteButton address={data.account} protocol={data.protocol} size={16} />
    </Flex>
  )
}
