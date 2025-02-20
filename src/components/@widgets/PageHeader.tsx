import { ComponentType, ReactNode } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { HomeSwitchProtocols, RouteSwitchProtocol } from 'components/@widgets/SwitchProtocols'
import PageTitle from 'theme/PageTitle'
import { Box } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'

import { GlobalProtocolFilter } from './ProtocolFilter'

export default function PageHeader({
  pageTitle,
  headerText,
  showOnMobile = false,
  icon: Icon,
  routeSwitchProtocol = false,
  keepSearchOnSwitchProtocol = true,
  showSelectProtocol = true,
  useNewCode = false,
}: {
  pageTitle: string
  headerText: ReactNode
  showOnMobile?: boolean
  icon: ComponentType<any>
  keepSearchOnSwitchProtocol?: boolean
  routeSwitchProtocol?: boolean
  showSelectProtocol?: boolean
  useNewCode?: boolean
}) {
  return (
    <>
      <CustomPageTitle title={pageTitle} />
      <Box
        display={showOnMobile ? 'flex' : ['none', 'none', 'flex']}
        sx={{
          width: '100%',
          pl: 3,
          pr: 0,
          alignItems: 'center',
          // justifyContent: 'space-between',
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
          gap: 2,
          height: PAGE_TITLE_HEIGHT,
          flexShrink: 0,
        }}
      >
        <PageTitle icon={Icon} title={headerText} />
        {showSelectProtocol &&
          (useNewCode ? (
            <GlobalProtocolFilter />
          ) : routeSwitchProtocol ? (
            <RouteSwitchProtocol keepSearch={keepSearchOnSwitchProtocol} />
          ) : (
            <HomeSwitchProtocols buttonSx={{ border: 'none', borderLeft: 'small', borderLeftColor: 'neutral4' }} />
          ))}
      </Box>
    </>
  )
}
