import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { DropdownProps } from 'rc-dropdown/lib/Dropdown'
import { useState } from 'react'

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
  const [visible, setVisible] = useState(false)
  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: [0, 3] }}>
      <Dropdown
        inline
        menu={<ProtocolSelection {...props} handleToggleDropdown={() => setVisible(!visible)} />}
        placement={xl ? undefined : placement}
        buttonVariant="ghost"
        menuSx={{
          width: menuSx.width ? menuSx.width : ['90vw', '95vw', '95vw'],
          maxWidth: menuSx.maxWidth ? menuSx.maxWidth : '900px',
          maxHeight: '70svh',
          py: 2,
          ...menuSx,
        }}
        sx={{ minWidth: 'fit-content' }}
        hasArrow={true}
        dismissible={false}
        visible={visible}
        setVisible={setVisible}
        menuDismissible
      >
        {props.selectedProtocols?.length === 0 ? (
          <Trans>0 selected</Trans>
        ) : (
          <ProtocolGroup protocols={props.selectedProtocols} size={20} sx={{ gap: 1 }} />
        )}
      </Dropdown>
    </Flex>
  )
}
