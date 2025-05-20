import { Trans } from '@lingui/macro'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolEnum } from 'utils/config/enums'

import { getDropdownProps } from './configs'

export default function ProtocolDropdown({
  protocol,
  onChangeProtocol,
}: {
  protocol: ProtocolEnum
  onChangeProtocol: (protocol: ProtocolEnum) => void
}) {
  const protocolOptions = useGetProtocolOptions()

  const { allowedCopyTradeProtocols } = useProtocolPermission()

  const protocolOption = protocolOptions.find((option) => option.id === protocol) ?? protocolOptions[0]
  return (
    <Dropdown
      {...getDropdownProps({})}
      menuSx={{ width: 'max-content', maxHeight: '75svh', py: 2, overflowY: 'auto' }}
      menu={
        <>
          {protocolOptions.map((option) => {
            const disabled = !allowedCopyTradeProtocols.includes(option.id)
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
                <ProtocolLogo protocol={option.id} isActive={isActive} size={20} hasText={false} />
                <Box as="span">{option.text}</Box>
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
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <ProtocolLogo protocol={protocolOption.id} isActive={true} size={24} hasText={false} />
        <Box as="span">{protocolOption.text}</Box>
      </Flex>
    </Dropdown>
  )
}
