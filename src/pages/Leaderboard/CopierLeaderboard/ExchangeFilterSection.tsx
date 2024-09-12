import { ReactNode } from 'react'

import { dcpExchangeOptions, exchangeOptions } from 'components/@copyTrade/configs'
import { getExchangeOption } from 'components/@copyTrade/helpers'
import Divider from 'components/@ui/Divider'
import useCopierLeaderboardContext from 'hooks/features/useCopierLeaderboardProvider'
import Dropdown from 'theme/Dropdown'
import { Flex } from 'theme/base'
import { CopierLeaderBoardExchangeType } from 'utils/config/enums'

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
      buttonSx={{
        height: '100%',
        width: 160,
        p: '0 8px',
        m: 0,
        border: 'none',
        '& *': { fontWeight: 'normal !important' },
      }}
      sx={{ height: '100%' }}
      menu={
        <Flex sx={{ width: 160, flexDirection: 'column', gap: 1 }}>
          <MenuItemWrapper onClick={() => changeExchangeType(CopierLeaderBoardExchangeType.TOTAL)}>
            {EXCHANGE_TYPE_OPTION_MAPPING.TOTAL.text}
          </MenuItemWrapper>
          <MenuItemWrapper onClick={() => changeExchangeType(CopierLeaderBoardExchangeType.ALL_DEX)}>
            {EXCHANGE_TYPE_OPTION_MAPPING.ALL_DEX.text}
          </MenuItemWrapper>
          <MenuItemWrapper onClick={() => changeExchangeType(CopierLeaderBoardExchangeType.ALL_CEX)}>
            {EXCHANGE_TYPE_OPTION_MAPPING.ALL_CEX.text}
          </MenuItemWrapper>
          <Divider />
          {dcpExchangeOptions.map((option) => {
            return (
              <MenuItemWrapper key={option.value} onClick={() => changeExchange(option.value)} sx={{ pl: 3 }}>
                {option.label}
              </MenuItemWrapper>
            )
          })}
          {exchangeOptions.map((option) => {
            return (
              <MenuItemWrapper key={option.value} onClick={() => changeExchange(option.value)} sx={{ pl: 3 }}>
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

function MenuItemWrapper({ children, onClick, sx = {} }: { children: ReactNode; onClick: () => void; sx?: any }) {
  return (
    <Flex
      role="button"
      onClick={onClick}
      sx={{
        px: 2,
        width: '100%',
        alignItems: 'center',
        height: 32,
        bg: 'neutral7',
        color: 'neutral1',
        '&:hover': { bg: 'neutral5' },
        ...sx,
      }}
    >
      {children}
    </Flex>
  )
}
