import { ReactNode } from 'react'

import { CopyTradeData } from 'entities/copyTrade'
import { DropdownItem } from 'theme/Dropdown'
import { Flex, IconBox, Type } from 'theme/base'

const ActionItem = ({
  title,
  icon,
  onSelect,
}: {
  title: ReactNode
  icon: ReactNode
  onSelect: (data?: CopyTradeData) => void
}) => {
  return (
    <DropdownItem onClick={() => onSelect()}>
      <Flex alignItems="center" sx={{ gap: 2, py: 1 }}>
        <IconBox icon={icon} color="neutral3" />
        <Type.Caption>{title}</Type.Caption>
      </Flex>
    </DropdownItem>
  )
}

export default ActionItem
