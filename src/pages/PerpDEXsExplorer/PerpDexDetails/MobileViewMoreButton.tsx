import { CirclesThreePlus } from '@phosphor-icons/react'

import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { Box, Flex } from 'theme/base'

import { RENDER_COLUMN_DATA_MAPPING } from '../configs'
import TradersExplorerLink from './TradersExplorerLink'

export default function MobileViewMoreButton({
  protocolData,
  perpdexData,
}: {
  perpdexData: PerpDEXSourceResponse | undefined
  protocolData: any
}) {
  const data: any = protocolData || perpdexData

  return (
    <Dropdown
      hasArrow={false}
      menuSx={{
        bg: 'neutral7',
        width: 'max-content',
      }}
      menu={
        <Box px={'6px'}>
          <Flex height={32} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <TradersExplorerLink perpdexData={perpdexData} protocolData={protocolData} />
          </Flex>
          <Flex height={32} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {RENDER_COLUMN_DATA_MAPPING['tradeUrl']?.({ data })}
          </Flex>
        </Box>
      }
      sx={{}}
      buttonSx={{
        border: 'none',
        height: '100%',
        p: 0,
      }}
      placement={'topRight'}
    >
      <IconButton
        size={24}
        type="button"
        icon={<CirclesThreePlus size={24} weight="fill" />}
        variant="ghost"
        sx={{
          color: 'neutral1',
        }}
      />
    </Dropdown>
  )
}
