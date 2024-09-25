import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { DropdownProps } from 'rc-dropdown/lib/Dropdown'

import ProtocolGroup from 'components/@ui/ProtocolGroup'
import Dropdown from 'theme/Dropdown'
import { Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

import ProtocolSelection from './ProtocolSelection'

export interface ProtocolFilterProps {
  selectedProtocols: ProtocolEnum[]
  setSelectedProtocols: (options: ProtocolEnum[], isClearAll?: boolean) => void
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  handleToggleProtocol: (option: ProtocolEnum) => void
  allowList: ProtocolEnum[]
  menuSx?: any
  placement?: DropdownProps['placement']
}

export function ProtocolFilter({ menuSx = {}, placement = 'bottomRight', ...props }: ProtocolFilterProps) {
  const { xl } = useResponsive()
  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: 3 }}>
      <Dropdown
        menu={<ProtocolSelection {...props} />}
        placement={xl ? undefined : placement}
        buttonVariant="ghost"
        buttonSx={{ borderRadius: 0, border: 'none', p: 0, color: 'primary1' }}
        menuSx={{
          width: menuSx.width ? menuSx.width : ['90vw', '95vw', '95vw'],
          maxWidth: menuSx.maxWidth ? menuSx.maxWidth : '900px',
          maxHeight: '80svh',
          py: 2,
          ...menuSx,
        }}
        sx={{ minWidth: 'fit-content' }}
        hasArrow={true}
        dismissible={false}
        menuDismissible
      >
        {props.selectedProtocols.length === 0 ? (
          <Trans>0 selected</Trans>
        ) : (
          <ProtocolGroup protocols={props.selectedProtocols} size={20} sx={{ gap: 1 }} />
        )}
      </Dropdown>
    </Flex>
  )
}
