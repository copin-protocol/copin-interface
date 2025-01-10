import { Trans } from '@lingui/macro'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { getConfigDetailsByKeyApi } from 'apis/copyTradeConfigApis'
import { CopyWalletData } from 'entities/copyWallet'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

import SettingConfigsModal from './SettingConfigsModal'

const SettingConfigs = ({
  activeWallet,
  copyWallets,
}: {
  activeWallet: CopyWalletData | null
  copyWallets: CopyWalletData[] | undefined
}) => {
  const [openSettingModal, setOpenSettingModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<CopyWalletData | null>()

  useEffect(() => {
    setSelectedWallet(activeWallet)
  }, [activeWallet])

  const { data: config, refetch } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_CONFIGS_BY_KEY, activeWallet?.id],
    () =>
      getConfigDetailsByKeyApi({
        exchange: activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX,
        copyWalletId: activeWallet?.id ?? '',
      }),
    {
      retry: 0,
      enabled: !!activeWallet,
    }
  )

  const handleClick = (data?: CopyWalletData) => {
    setOpenSettingModal(true)
    data && setSelectedWallet(data)
  }

  if (!copyWallets?.length) return <></>
  return (
    <Flex alignItems="center">
      <Box width={{ _: '100%', sm: 'auto' }} data-tooltip-id={'tt-max-positions'}>
        {activeWallet === null ? (
          <Dropdown
            hasArrow={true}
            iconColor="primary1"
            buttonVariant="ghost"
            inline
            sx={{ height: '100%' }}
            menuSx={{ width: ['100%', 100] }}
            menu={
              <>
                {copyWallets.map((data) => {
                  return (
                    <DropdownItem key={data.id} onClick={() => handleClick(data)}>
                      {data.name}
                    </DropdownItem>
                  )
                })}
              </>
            }
          >
            <Type.Caption color="primary1">
              <Trans>MAX POSITIONS</Trans>
            </Type.Caption>
          </Dropdown>
        ) : (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <Type.Caption>MAX POSITIONS:</Type.Caption>
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
              onClick={() => handleClick()}
            />
          </Flex>
        )}
        {openSettingModal && !!selectedWallet && (
          <SettingConfigsModal
            selectedWallet={selectedWallet}
            onDismiss={() => {
              setOpenSettingModal(false)
            }}
            onSuccess={refetch}
          />
        )}
      </Box>
      <Tooltip id={'tt-max-positions'} place="top" type="dark" effect="solid">
        <Box maxWidth={300}>
          <Type.Caption>The maximum number of positions that can be opened at the same time per API Key</Type.Caption>
        </Box>
      </Tooltip>
    </Flex>
  )
}

export default SettingConfigs
