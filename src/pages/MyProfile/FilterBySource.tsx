import { Trans } from '@lingui/macro'

import Divider from 'components/@ui/Divider'
import ProtocolGroup from 'components/@ui/ProtocolGroup'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import Checkbox from 'theme/Checkbox'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ALLOWED_COPYTRADE_PROTOCOLS, DCP_SUPPORTED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

type FilterBySourceProps = {
  isDCP?: boolean
  selectedProtocols: ProtocolEnum[]
  isToggleAllProtocol: boolean
  toggleAllProtocol: (isToggledAll: boolean) => void
  checkIsProtocolChecked: (protocol: ProtocolEnum) => boolean
  handleToggleProtocol: (protocol: ProtocolEnum) => void
}

export default function FilterBySource({
  isDCP,
  isToggleAllProtocol,
  toggleAllProtocol,
  checkIsProtocolChecked,
  handleToggleProtocol,
}: FilterBySourceProps) {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const protocolFilters = isDCP ? DCP_SUPPORTED_PROTOCOLS : ALLOWED_COPYTRADE_PROTOCOLS

  return (
    <Flex alignItems="start" sx={{ gap: 3, flexDirection: 'column' }}>
      <Flex width="100%" sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
        <Type.Caption
          sx={{ flexShrink: 0, color: [`${themeColors.neutral1} !important`, `${themeColors.neutral2} !important`] }}
        >
          <Trans>SOURCE:</Trans>
        </Type.Caption>
        <Flex sx={{ gap: 1, alignItems: 'center' }}>
          <SwitchInput
            checked={isToggleAllProtocol}
            onChange={(event) => {
              const isSelectedAll = event.target.checked
              toggleAllProtocol(isSelectedAll)
            }}
          />
          <Type.Caption color="neutral2">
            <Trans>SELECT ALL</Trans>
          </Type.Caption>
        </Flex>
      </Flex>
      <Grid sx={{ pt: 1, gridTemplateColumns: '1fr', gap: 3, flexDirection: 'column' }}>
        {protocolFilters.map((protocol) => {
          return (
            <Checkbox
              wrapperSx={{ height: 'auto' }}
              key={protocol}
              checked={checkIsProtocolChecked(protocol)}
              onChange={() => handleToggleProtocol(protocol)}
            >
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <ProtocolLogo protocol={protocol} hasText={false} size={21} />
                <Type.Caption lineHeight="16px">{protocolOptionsMapping[protocol]?.text}</Type.Caption>
              </Flex>
            </Checkbox>
          )
        })}
      </Grid>
    </Flex>
  )
}

export function FilterBySourceDropdown({
  isDCP,
  selectedProtocols,
  isToggleAllProtocol,
  toggleAllProtocol,
  checkIsProtocolChecked,
  handleToggleProtocol,
}: FilterBySourceProps) {
  const protocolFilters = isDCP ? DCP_SUPPORTED_PROTOCOLS : ALLOWED_COPYTRADE_PROTOCOLS
  return (
    <Flex alignItems="center" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
        <Trans>SOURCE:</Trans>
      </Type.Caption>
      <Dropdown
        buttonVariant="ghost"
        inline
        // buttonSx={{ p: 0, border: 'none', '.icon_dropdown': { ml: 2 } }}
        dismissible={false}
        menuDismissible
        menuSx={{ width: 'max-content', maxHeight: 390 }}
        placement="bottomRight"
        menu={
          <Box px={3} py={3}>
            <Flex sx={{ gap: 2, alignItems: 'center' }}>
              <SwitchInput
                checked={isToggleAllProtocol}
                onChange={(event) => {
                  const isSelectedAll = event.target.checked
                  toggleAllProtocol(isSelectedAll)
                }}
              />
              <Type.Caption color="neutral1">
                <Trans>SELECT ALL</Trans>
              </Type.Caption>
            </Flex>
            <Divider my={2} />
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              {protocolFilters.map((protocol) => {
                return (
                  <Checkbox
                    key={protocol}
                    checked={checkIsProtocolChecked(protocol)}
                    onChange={() => handleToggleProtocol(protocol)}
                    wrapperSx={{ height: 'auto' }}
                  >
                    <ProtocolLogo protocol={protocol} size={21} />
                  </Checkbox>
                )
              })}
            </Flex>
          </Box>
        }
      >
        {selectedProtocols?.length ? (
          <ProtocolGroup protocols={selectedProtocols} size={21} sx={{ gap: 1 }} />
        ) : (
          'Not selected'
        )}
      </Dropdown>
    </Flex>
  )
}
