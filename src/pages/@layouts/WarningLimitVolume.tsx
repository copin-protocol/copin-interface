import { Keyhole } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components/macro'

import useAllCopyTrades from 'hooks/features/useAllCopyTrades'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS, VOLUME_LIMIT } from 'utils/config/constants'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_IDS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { addressShorten } from 'utils/helpers/format'

export default function WarningLimitVolume() {
  const { listWarning } = useLimitVolume()
  const key = listWarning?.length
    ? listWarning
        .map((data) => {
          return `[${DATA_ATTRIBUTES.TRADER_COPY_VOLUME_WARNING}="${data.account}-${data.protocol}"]`
        })
        .join(',')
    : ''
  const GlobalStyle = createGlobalStyle`
    ${key ? `${key} { display: block }` : ''} 
  `
  if (!listWarning?.length) return null

  return (
    <>
      <GlobalStyle />
      <Flex
        id={ELEMENT_IDS.WARNING_LIMIT_VOLUME_WRAPPER}
        sx={{
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          minHeight: 40,
          height: 'max-content',
          overflow: 'hidden',
          bg: 'neutral5',
          p: '4px 16px',
        }}
      >
        <Type.Caption sx={{ textAlign: ['left', 'left', 'left', 'left', 'center'], width: '100%' }}>
          <IconBox as="span" icon={<Keyhole size={20} />} color="orange1" sx={{ mr: 1 }} />
          Trader{' '}
          <Box
            as={Link}
            to={{ pathname: ROUTES.MY_MANAGEMENT.path, state: { copyWalletId: listWarning[0].copyWalletId } }}
            fontWeight={600}
            sx={{ color: 'neutral1', '&:hover': { textDecoration: 'underline' } }}
          >
            {addressShorten(listWarning[0].account)}
          </Box>{' '}
          has the total copy volume over{' '}
          <Box as="span" fontWeight={600}>
            $200,000
          </Box>
          . You can&apos;t copy more than{' '}
          <Box as="span" fontWeight={600}>
            $20,000 (include leverage)
          </Box>{' '}
          after{' '}
          <Box as="span" fontWeight={600}>
            1st April 2024
          </Box>
          . Contact support{' '}
          <Box as="a" href={LINKS.support} target="_blank" sx={{ fontWeight: 600 }}>
            here
          </Box>{' '}
          to increase your copy volume.
        </Type.Caption>
      </Flex>
    </>
  )
}

function useLimitVolume() {
  const { allCopyTrades } = useAllCopyTrades()
  if (!allCopyTrades?.length) {
    const bingXInfoWrapper = document.getElementById(ELEMENT_IDS.BINGX_INFO_WRAPPER)
    if (!!bingXInfoWrapper) {
      bingXInfoWrapper.style.cssText = ''
    }
    return { listWarning: null }
  }
  const copyTradeVolumeMapping = allCopyTrades.reduce<
    Record<string, { key: string; totalVolume: number; account: string; copyWalletId: string; protocol: ProtocolEnum }>
  >((result, copyTrade) => {
    if (copyTrade.status !== CopyTradeStatusEnum.RUNNING) return result
    const key = copyTrade.account + copyTrade.protocol
    return {
      ...result,
      [key]: {
        key,
        totalVolume: (result?.[key]?.totalVolume ?? 0) + copyTrade.volume * copyTrade.leverage,
        account: copyTrade.account,
        copyWalletId: copyTrade.copyWalletId,
        protocol: copyTrade.protocol,
      },
    }
  }, {})
  const listWarning = Object.values(copyTradeVolumeMapping)
    .filter((data) => {
      return data.totalVolume > VOLUME_LIMIT
    })
    .sort((a, b) => a.totalVolume - b.totalVolume)

  if (!!listWarning?.[0]) {
    const bingXInfoWrapper = document.getElementById(ELEMENT_IDS.BINGX_INFO_WRAPPER)
    if (!!bingXInfoWrapper) {
      bingXInfoWrapper.style.cssText = 'max-height: 0px !important; min-height: 0px !important; padding: 0px !important'
    }
  }

  return { listWarning }
}
