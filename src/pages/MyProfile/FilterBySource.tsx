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
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

type FilterBySourceProps = {
  selectedProtocols: ProtocolEnum[]
  isToggleAllProtocol: boolean
  toggleAllProtocol: (isToggledAll: boolean) => void
  checkIsProtocolChecked: (protocol: ProtocolEnum) => boolean
  handleToggleProtocol: (protocol: ProtocolEnum) => void
}

export default function FilterBySource({
  isToggleAllProtocol,
  toggleAllProtocol,
  checkIsProtocolChecked,
  handleToggleProtocol,
}: FilterBySourceProps) {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()

  return (
    <Flex alignItems="start" sx={{ gap: 3, flexDirection: ['column', 'row'] }}>
      <Flex width="100%" sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
        <Type.Caption
          sx={{ flexShrink: 0, color: [`${themeColors.neutral1} !important`, `${themeColors.neutral3} !important`] }}
        >
          <Trans>Source:</Trans>
        </Type.Caption>
        <Flex sx={{ gap: 1, alignItems: 'center' }}>
          <SwitchInput
            checked={isToggleAllProtocol}
            onChange={(event) => {
              const isSelectedAll = event.target.checked
              toggleAllProtocol(isSelectedAll)
            }}
          />
          <Type.Caption color="neutral3">
            <Trans>Select all</Trans>
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
  selectedProtocols,
  isToggleAllProtocol,
  toggleAllProtocol,
  checkIsProtocolChecked,
  handleToggleProtocol,
}: FilterBySourceProps) {
  return (
    <Flex alignItems="start" sx={{ gap: 1 }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
        <Trans>Source:</Trans>
      </Type.Caption>
      <Dropdown
        buttonSx={{ p: 0, border: 'none', '.icon_dropdown': { ml: 2 } }}
        dismissible={false}
        menuDismissible
        menuSx={{ width: 'max-content', maxHeight: 390 }}
        placement="bottomRight"
        menu={
          <Box px={3} py={3}>
            <Flex sx={{ gap: 1, alignItems: 'center' }}>
              <SwitchInput
                checked={isToggleAllProtocol}
                onChange={(event) => {
                  const isSelectedAll = event.target.checked
                  toggleAllProtocol(isSelectedAll)
                }}
              />
              <Type.Caption color="neutral3">
                <Trans>Select all</Trans>
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

const protocolFilters = ALLOWED_COPYTRADE_PROTOCOLS
