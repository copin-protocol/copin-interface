import { ComponentType, ReactNode } from 'react'

import { Flex, IconBox, Type } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'

const PageTitle = ({ icon: Icon, title }: { icon?: ComponentType<any>; title: ReactNode }) => {
  return (
    <Flex
      sx={{
        width: '100%',
        gap: 2,
        alignItems: 'center',
        color: 'neutral1',
        flex: 1,
        height: PAGE_TITLE_HEIGHT,
      }}
    >
      {!!Icon && <IconBox icon={<Icon size={24} weight="fill" />} />}
      <Type.Body sx={{ flex: 1, flexShrink: 0, textTransform: 'uppercase' }}>{title}</Type.Body>
    </Flex>
  )
}

export default PageTitle
