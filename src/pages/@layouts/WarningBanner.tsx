import { Warning } from '@phosphor-icons/react'

import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { useParsedProtocol } from 'hooks/helpers/useProtocols'
import { Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { ELEMENT_IDS } from 'utils/config/keys'

const MAINTENANCE_PROTOCOLS: ProtocolEnum[] = []
export default function WarningBanner() {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const protocol = useParsedProtocol()
  const isWarning = MAINTENANCE_PROTOCOLS.includes(protocol)

  return isWarning ? (
    <Flex
      id={ELEMENT_IDS.WARNING_BANNER}
      sx={{
        position: 'relative',
        width: '100%',
        height: 'max-content',
        overflow: 'hidden',
        bg: `${themeColors.orange1}15`,
        p: '8px 16px',
        alignItems: 'center',
        transition: '0.3s',
        color: 'orange1',
      }}
    >
      <Flex
        sx={{
          flexDirection: ['column', 'column', 'column', 'row'],
          alignItems: ['start', 'start', 'start', 'center'],
          justifyContent: 'center',
          columnGap: 2,
          mx: ['unset', 'unset', 'unset', 'auto'],
          color: 'inherit',
        }}
      >
        <Type.Caption>
          <IconBox icon={<Warning size={16} />} pr={1} />
          {protocolOptionsMapping[protocol].text} exchange is undergoing maintenance to resolve the data issue, and we
          are working to restore full functionality as soon as possible. Thank you for your patience and understanding!
        </Type.Caption>
      </Flex>
    </Flex>
  ) : (
    <></>
  )
}
