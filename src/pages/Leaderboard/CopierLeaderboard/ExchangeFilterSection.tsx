import { ReactNode } from 'react'

import { dcpExchangeOptions, exchangeOptions } from 'components/@copyTrade/configs'
import { getExchangeOption } from 'components/@copyTrade/helpers'
import Divider from 'components/@ui/Divider'
import Dropdown from 'theme/Dropdown'
import { Flex } from 'theme/base'
import { CopierLeaderBoardExchangeType } from 'utils/config/enums'

import useCopierLeaderboardContext from './useCopierLeaderboardProvider'

export default function ExchangeFilterSection() {
  const { currentExchange, currentExchangeType, changeExchange, changeExchangeType } = useCopierLeaderboardContext()
  const title = currentExchange
    ? getExchangeOption(currentExchange).label
    : currentExchangeType
    ? EXCHANGE_TYPE_OPTION_MAPPING[currentExchangeType].text
    : ''
  return (
    <Dropdown
      menuSx={{ p: 0, m: 0 }}
      buttonSx={{ py: '10px' }}
      buttonVariant="ghost"
      menu={
        <Flex sx={{ width: 176, flexDirection: 'column', gap: 1 }}>
          <MenuItemWrapper
            isActive={currentExchangeType === CopierLeaderBoardExchangeType.TOTAL}
            onClick={() => changeExchangeType(CopierLeaderBoardExchangeType.TOTAL)}
          >
            {EXCHANGE_TYPE_OPTION_MAPPING.TOTAL.text}
          </MenuItemWrapper>
          <MenuItemWrapper
            isActive={currentExchangeType === CopierLeaderBoardExchangeType.ALL_DEX}
            onClick={() => changeExchangeType(CopierLeaderBoardExchangeType.ALL_DEX)}
          >
            {EXCHANGE_TYPE_OPTION_MAPPING.ALL_DEX.text}
          </MenuItemWrapper>
          <MenuItemWrapper
            isActive={currentExchangeType === CopierLeaderBoardExchangeType.ALL_CEX}
            onClick={() => changeExchangeType(CopierLeaderBoardExchangeType.ALL_CEX)}
          >
            {EXCHANGE_TYPE_OPTION_MAPPING.ALL_CEX.text}
          </MenuItemWrapper>
          <Divider />
          {dcpExchangeOptions.map((option) => {
            return (
              <MenuItemWrapper
                isActive={option.value === currentExchange}
                key={option.value}
                onClick={() => changeExchange(option.value)}
                sx={{ px: 2 }}
              >
                {option.label}
              </MenuItemWrapper>
            )
          })}
          {exchangeOptions.map((option) => {
            return (
              <MenuItemWrapper
                key={option.value}
                isActive={option.value === currentExchange}
                onClick={() => changeExchange(option.value)}
                sx={{ px: 2 }}
              >
                {option.label}
              </MenuItemWrapper>
            )
          })}
        </Flex>
      }
    >
      {title}
    </Dropdown>
  )
}

const EXCHANGE_TYPE_OPTION_MAPPING: {
  [exchangeType in CopierLeaderBoardExchangeType]: {
    id: CopierLeaderBoardExchangeType
    text: ReactNode
  }
} = {
  [CopierLeaderBoardExchangeType.TOTAL]: {
    id: CopierLeaderBoardExchangeType.TOTAL,
    text: 'All Liquidity Source',
  },
  [CopierLeaderBoardExchangeType.ALL_CEX]: {
    id: CopierLeaderBoardExchangeType.ALL_CEX,
    text: 'All CEX Liquidity',
  },
  [CopierLeaderBoardExchangeType.ALL_DEX]: {
    id: CopierLeaderBoardExchangeType.ALL_DEX,
    text: 'All DEX Liquidity',
  },
}

function MenuItemWrapper({
  children,
  isActive,
  onClick,
  sx = {},
}: {
  children: ReactNode
  isActive: boolean
  onClick: () => void
  sx?: any
}) {
  return (
    <Flex
      role="button"
      onClick={onClick}
      sx={{
        px: 2,
        width: '100%',
        alignItems: 'center',
        height: 36,
        bg: 'neutral7',
        color: isActive ? 'primary1' : 'neutral1',
        '&:hover': { bg: 'neutral5' },
        ...sx,
      }}
    >
      {children}
    </Flex>
  )
}
