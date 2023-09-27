import { Nut } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeBalancesApi } from 'apis/copyTradeApis'
import { CopyTradeBalanceData } from 'entities/copyTrade'
import { Button } from 'theme/Buttons'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradeConfigTypeEnum, CopyTradePlatformEnum } from 'utils/config/enums'

import SettingConfigsModal from './SettingConfigsModal'

const getName = (balance: CopyTradeBalanceData) => `BingX ${balance.uniqueKey.slice(0, 5)}`

export interface SettingKey {
  exchange: CopyTradePlatformEnum
  type: CopyTradeConfigTypeEnum
  apiKey: string
}

const SettingConfigs = ({ activeKey }: { activeKey: string | null }) => {
  const [openSettingModal, setOpenSettingModal] = useState(false)
  const [currentSettingKey, setCurrentSettingKey] = useState<SettingKey | undefined>()
  const { data } = useQuery('copytrade-balances', () => getCopyTradeBalancesApi())

  const handleClick = (data: SettingKey) => {
    setOpenSettingModal(true)
    setCurrentSettingKey(data)
  }

  if (!data) return <></>
  return (
    <Flex alignItems="center" pl={3} sx={{ borderLeft: 'small', borderColor: 'neutral4' }}>
      <Box width={{ _: '100%', sm: 'auto' }}>
        {activeKey === null ? (
          <Dropdown
            hasArrow={false}
            buttonVariant="ghost"
            buttonSx={{ height: '100%', border: 'none', px: 0, py: 0 }}
            sx={{ height: '100%' }}
            menuSx={{ width: ['100%', 100] }}
            menu={
              <>
                {data.balances.map((balanceData) => {
                  return (
                    <DropdownItem
                      key={balanceData.uniqueKey}
                      onClick={() =>
                        handleClick({
                          exchange: CopyTradePlatformEnum.BINGX,
                          type: CopyTradeConfigTypeEnum.API_KEY,
                          apiKey: balanceData.uniqueKey,
                        })
                      }
                    >
                      {getName(balanceData)}
                    </DropdownItem>
                  )
                })}
              </>
            }
          >
            <Item />
          </Dropdown>
        ) : (
          <Button
            type="button"
            variant="ghost"
            sx={{ display: 'flex', alignItems: 'center', height: '100%', border: 'none', px: 0, py: 0 }}
            onClick={() =>
              handleClick({
                exchange: CopyTradePlatformEnum.BINGX,
                type: CopyTradeConfigTypeEnum.API_KEY,
                apiKey: activeKey,
              })
            }
          >
            <Item />
          </Button>
        )}
        {openSettingModal && currentSettingKey && (
          <SettingConfigsModal
            currentSettingKey={currentSettingKey}
            onDismiss={() => {
              setOpenSettingModal(false)
              setCurrentSettingKey(undefined)
            }}
          />
        )}
      </Box>
    </Flex>
  )
}

export default SettingConfigs

const Item = () => {
  return (
    <Flex alignItems="center" sx={{ gap: 2 }}>
      <IconBox color="neutral3" icon={<Nut size={20} />} />
      <Type.Caption color="neutral2">Settings</Type.Caption>
    </Flex>
  )
}
