import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS } from 'utils/config/protocols'

import { getDropdownProps } from './configs'

export default function ProtocolDropdown({
  protocol,
  onChangeProtocol,
}: {
  protocol: ProtocolEnum
  onChangeProtocol: (protocol: ProtocolEnum) => void
}) {
  const protocolOption = PROTOCOL_OPTIONS.find((option) => option.id === protocol) ?? PROTOCOL_OPTIONS[0]
  return (
    <Dropdown
      {...getDropdownProps({})}
      menuSx={{ width: 100 }}
      menu={
        <>
          {PROTOCOL_OPTIONS.map((option) => (
            <CheckableDropdownItem
              key={option.id}
              selected={option.id === protocol}
              text={option.text}
              onClick={() => onChangeProtocol(option.id)}
            />
          ))}
        </>
      }
    >
      {protocolOption.text}
    </Dropdown>
  )
}
