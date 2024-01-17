import { useResponsive } from 'ahooks'
import { ComponentType, ReactNode } from 'react'

import { HomeSwitchProtocols, RouteSwitchProtocol } from 'components/SwitchProtocols'
import { Box, Flex, IconBox, Type } from 'theme/base'

import CustomPageTitle from './CustomPageTitle'

export default function PageHeader({
  pageTitle,
  headerText,
  showOnMobile = false,
  icon: Icon,
  routeSwitchProtocol = false,
  keepSearchOnSwitchProtocol = true,
}: {
  pageTitle: string
  headerText: ReactNode
  showOnMobile?: boolean
  icon: ComponentType<any>
  keepSearchOnSwitchProtocol?: boolean
  routeSwitchProtocol?: boolean
}) {
  const { md } = useResponsive()
  return (
    <>
      <CustomPageTitle title={pageTitle} />
      <Box
        display={showOnMobile ? 'flex' : ['none', 'none', 'flex']}
        sx={{
          width: '100%',
          pl: 3,
          pr: showOnMobile && !md ? 3 : 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          gap: 2,
          height: 48,
          flexShrink: 0,
        }}
      >
        <Flex
          sx={{
            width: '100%',
            gap: 2,
            alignItems: 'center',
            color: 'neutral1',
            flex: 1,
          }}
        >
          <IconBox icon={<Icon size={24} weight="fill" />} />
          <Type.Body sx={{ flex: 1, flexShrink: 0, fontWeight: 500 }}>{headerText}</Type.Body>
        </Flex>
        {routeSwitchProtocol ? (
          <RouteSwitchProtocol keepSearch={keepSearchOnSwitchProtocol} />
        ) : (
          <HomeSwitchProtocols buttonSx={{ border: 'none', borderLeft: 'small', borderLeftColor: 'neutral4' }} />
        )}
      </Box>
    </>
  )
}
