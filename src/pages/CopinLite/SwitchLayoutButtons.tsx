import { GridFour, ListDashes } from '@phosphor-icons/react'

import { MobileLayoutType } from 'components/@position/types'
import IconButton from 'theme/Buttons/IconButton'
import { Flex } from 'theme/base'

export default function SwitchLayoutButtons({
  layoutType,
  onChangeType,
}: {
  layoutType: MobileLayoutType
  onChangeType: (type: MobileLayoutType) => void
}) {
  return (
    <Flex sx={{ gap: 2, alignItems: 'center', height: 32 }}>
      <IconButton
        variant={layoutType === 'LIST' ? 'ghostPrimary' : 'ghostInactive'}
        onClick={() => layoutType !== 'LIST' && onChangeType('LIST')}
        size={24}
        icon={<ListDashes size={20} />}
      />
      <IconButton
        variant={layoutType === 'GRID' ? 'ghostPrimary' : 'ghostInactive'}
        onClick={() => layoutType !== 'GRID' && onChangeType('GRID')}
        size={24}
        icon={<GridFour size={20} />}
      />
    </Flex>
  )
}
