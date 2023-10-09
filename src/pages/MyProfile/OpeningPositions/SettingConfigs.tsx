import { Trans } from '@lingui/macro'
import { PencilSimpleLine } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeBalancesApi } from 'apis/copyTradeApis'
import { getConfigDetailsByKeyApi } from 'apis/copyTradeConfigApis'
import { maxPositionsContent } from 'components/TooltipContents'
import { CopyTradeBalanceData } from 'entities/copyTrade'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradeConfigTypeEnum, CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

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
  const { data: config, refetch } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_CONFIGS_BY_KEY, activeKey],
    () => getConfigDetailsByKeyApi({ exchange: CopyTradePlatformEnum.BINGX, apiKey: activeKey ?? '' }),
    {
      retry: 0,
      enabled: !!activeKey,
    }
  )

  const handleClick = (data: SettingKey) => {
    setOpenSettingModal(true)
    setCurrentSettingKey(data)
  }

  if (!data) return <></>
  return (
    <Flex alignItems="center">
      <Box width={{ _: '100%', sm: 'auto' }} data-tooltip-id={'tt-max-positions'}>
        {activeKey === null ? (
          <Dropdown
            hasArrow={true}
            iconColor="primary1"
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
            <Type.Caption color="primary1">
              <Trans>Max Positions</Trans>
            </Type.Caption>
          </Dropdown>
        ) : (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <Type.Caption>Max Positions:</Type.Caption>
              <Type.CaptionBold>
                {config?.maxPositions && config.maxPositions > 0 ? formatNumber(config.maxPositions) : 'N/A'}
              </Type.CaptionBold>
            </Flex>
            <ButtonWithIcon
              icon={<PencilSimpleLine size={16} />}
              size={16}
              type="button"
              variant="ghostPrimary"
              sx={{ display: 'flex', alignItems: 'center', height: '100%', border: 'none', px: 0, py: 0 }}
              onClick={() =>
                handleClick({
                  exchange: CopyTradePlatformEnum.BINGX,
                  type: CopyTradeConfigTypeEnum.API_KEY,
                  apiKey: activeKey,
                })
              }
            />
          </Flex>
        )}
        {openSettingModal && currentSettingKey && (
          <SettingConfigsModal
            currentSettingKey={currentSettingKey}
            onDismiss={() => {
              setOpenSettingModal(false)
              setCurrentSettingKey(undefined)
            }}
            onSuccess={refetch}
          />
        )}
      </Box>
      <Tooltip id={'tt-max-positions'} place="top" type="dark" effect="solid">
        <Box maxWidth={300}>{maxPositionsContent}</Box>
      </Tooltip>
    </Flex>
  )
}

export default SettingConfigs
