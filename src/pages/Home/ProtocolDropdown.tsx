import { Trans } from '@lingui/macro'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useInternalRole from 'hooks/features/useInternalRole'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'

import { ALLOWED_PROTOCOLS, INTERNAL_ALLOWED_PROTOCOLS, getDropdownProps } from './configs'

const PROTOCOL_OPTIONS = [
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GMX_V2],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.KWENTA],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.POLYNOMIAL],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.GNS],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.LEVEL_BNB],
  PROTOCOL_OPTIONS_MAPPING[ProtocolEnum.LEVEL_ARB],
] //todo: Check when add new protocol
export default function ProtocolDropdown({
  protocol,
  onChangeProtocol,
}: {
  protocol: ProtocolEnum
  onChangeProtocol: (protocol: ProtocolEnum) => void
}) {
  const isInternal = useInternalRole()
  const allowList = isInternal ? INTERNAL_ALLOWED_PROTOCOLS : ALLOWED_PROTOCOLS
  const protocolOption = PROTOCOL_OPTIONS.find((option) => option.id === protocol) ?? PROTOCOL_OPTIONS[0]
  return (
    <Dropdown
      {...getDropdownProps({})}
      menuSx={{ width: 190 }}
      menu={
        <>
          {PROTOCOL_OPTIONS.map((option) => {
            const disabled = !allowList.includes(option.id)
            const isActive = option.id === protocol
            return (
              <DropdownItem
                key={option.id}
                variant="ghost"
                onClick={() => {
                  if (disabled) return
                  onChangeProtocol(option.id)
                }}
                isActive={option.id === protocol}
                disabled={disabled}
                sx={{
                  '&[disabled]': { opacity: 1 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5ch',
                  '& *': {
                    color: isActive
                      ? `${themeColors.primary1} !important`
                      : disabled
                      ? `${themeColors.neutral3} !important`
                      : `${themeColors.neutral1} !important`,
                  },
                  // bg: isActive ? `${themeColors.neutral6} !important` : '',
                  '& img': { filter: disabled ? 'grayscale(100%)' : 'none' },
                }}
              >
                <ProtocolLogo protocol={option.id} size={20} />{' '}
                {disabled && (
                  <Box as="span">
                    <Trans>(Coming soon)</Trans>
                  </Box>
                )}
              </DropdownItem>
            )
          })}
        </>
      }
    >
      {/* {protocolOption.text} */}
      <ProtocolLogo protocol={protocolOption.id} sx={{ gap: 1 }} size={20} />
    </Dropdown>
  )
}
