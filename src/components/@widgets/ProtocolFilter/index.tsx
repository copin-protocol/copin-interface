import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { DropdownProps } from 'rc-dropdown/lib/Dropdown'
import { memo, useState } from 'react'

import ProtocolGroup from 'components/@ui/ProtocolGroup'
import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import Dropdown from 'theme/Dropdown'
import { Flex } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { compareTwoArrays } from 'utils/helpers/common'
import { convertProtocolToParams } from 'utils/helpers/protocol'

import ProtocolSelection from './ProtocolSelection'

export interface ProtocolFilterProps {
  selectedProtocols: ProtocolEnum[] | null
  setSelectedProtocols: (options: ProtocolEnum[], isClearAll?: boolean) => void
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  handleToggleProtocol: (option: ProtocolEnum) => void
  allowList: ProtocolEnum[]
  menuSx?: any
  placement?: DropdownProps['placement']
}

export type GlobalProtocolFilterProps = {
  menuSx?: any
  placement?: DropdownProps['placement']
}
export const GlobalProtocolFilter = memo(function GlobalProtocolFilterMemo(props: GlobalProtocolFilterProps) {
  const { setSearchParams } = useSearchParams()
  const { selectedProtocols, setProtocols, checkIsSelected, handleToggle } = useGlobalProtocolFilterStore()
  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS
  const setSelectedProtocols = (protocols: ProtocolEnum[], isClearAll?: boolean): void => {
    const resetParams: Record<string, string | null> = {}
    if (selectedProtocols == null || !compareTwoArrays(protocols, selectedProtocols)) {
      // Reset page to 1 when changing protocols
      resetParams[URL_PARAM_KEYS.PAGE] = null
    }
    const protocolParams = convertProtocolToParams(protocols)
    if (!isClearAll) {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: protocolParams, ...resetParams })
    } else {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: null, ...resetParams })
    }
    setProtocols(protocols)
  }
  if (selectedProtocols == null) return null
  return (
    <ProtocolFilter
      selectedProtocols={selectedProtocols}
      setSelectedProtocols={setSelectedProtocols}
      checkIsProtocolChecked={checkIsSelected}
      handleToggleProtocol={handleToggle}
      allowList={allowList}
      {...props}
    />
  )
})

export function ProtocolFilter({ menuSx = {}, placement = 'bottomRight', ...props }: ProtocolFilterProps) {
  const { xl } = useResponsive()
  const [visible, setVisible] = useState(false)
  if (props.selectedProtocols == null) return null
  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: [0, 3] }}>
      <Dropdown
        inline
        menu={
          <ProtocolSelection
            {...props}
            selectedProtocols={props.selectedProtocols} // treat type error
            handleToggleDropdown={() => setVisible(!visible)}
          />
        }
        placement={xl ? undefined : placement}
        buttonVariant="ghost"
        menuSx={{
          width: menuSx.width ? menuSx.width : ['90vw', '95vw', '95vw'],
          maxWidth: menuSx.maxWidth ? menuSx.maxWidth : '850px',
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
